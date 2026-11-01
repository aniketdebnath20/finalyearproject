import "dotenv/config";
import { randomUUID } from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { models } from "./models.js";

const app = express();

const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET;

const resources = Object.keys(models).filter(
  (name) => name !== "admins"
);

async function resolveMongoSrvUri(uri) {
  const srvUrl = new URL(uri.replace(/^mongodb\+srv:/, "https:"));
  const lookup = async (name, type) => {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`,
      { headers: { accept: "application/dns-json" } }
    );
    if (!response.ok) {
      throw new Error(`DNS-over-HTTPS lookup failed (${response.status}).`);
    }
    const result = await response.json();
    if (result.Status !== 0 || !Array.isArray(result.Answer)) {
      throw new Error(`No ${type} records found for the MongoDB host.`);
    }
    return result.Answer.map((answer) => answer.data);
  };

  const [srvAnswers, txtAnswers] = await Promise.all([
    lookup(`_mongodb._tcp.${srvUrl.hostname}`, "SRV"),
    lookup(srvUrl.hostname, "TXT"),
  ]);
  const hosts = srvAnswers
    .map((answer) => {
      const [, , port, host] = answer.trim().split(/\s+/);
      return `${host.replace(/\.$/, "")}:${port}`;
    })
    .join(",");

  if (!hosts) {
    throw new Error("No MongoDB shard hosts were returned by DNS.");
  }

  const options = new URLSearchParams(srvUrl.search);
  for (const [key, value] of new URLSearchParams(
    txtAnswers[0]?.replace(/^"|"$/g, "") || ""
  )) {
    if (!options.has(key)) options.set(key, value);
  }
  if (!options.has("tls") && !options.has("ssl")) options.set("tls", "true");

  const credentials = srvUrl.username
    ? `${srvUrl.username}${srvUrl.password ? `:${srvUrl.password}` : ""}@`
    : "";
  return `mongodb://${credentials}${hosts}${srvUrl.pathname}?${options}`;
}

/* =========================================================
   ENVIRONMENT VARIABLES
========================================================= */

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error(
    "JWT_SECRET must exist and contain at least 32 characters"
  );
}

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",").map((origin) =>
          origin.trim()
        )
      : ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/* =========================================================
   PUBLIC RECORD
========================================================= */

const publicRecord = (document) => {
  const record = document?.toObject
    ? document.toObject()
    : { ...document };

  delete record.passwordHash;
  delete record._id;
  delete record.readByUserIds;

  return record;
};

/* =========================================================
   JWT
========================================================= */

const issueToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      departmentId: user.departmentId,
      courseId: user.courseId,
      rollNumber: user.rollNumber,
      staffId: user.staffId,
    },
    jwtSecret,
    {
      expiresIn: "8h",
    }
  );
};

/* =========================================================
   AUTHENTICATION MIDDLEWARE
========================================================= */

function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace(
    /^Bearer\s+/i,
    ""
  );

  if (!token) {
    return res.status(401).json({
      message: "Sign in to access this resource.",
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({
      message:
        "Your session has expired. Please sign in again.",
    });
  }
}

/* =========================================================
   READ QUERY
========================================================= */

async function readQuery(resource, user) {
  // ADMIN
  if (user.role === "admin") {
    return {};
  }

  // STUDENT
  if (user.role === "student") {
    if (resource === "students") {
      return {
        id: user.id,
      };
    }

    if (
      [
        "studentAttendance",
        "fees",
        "results",
        "certificates",
      ].includes(resource)
    ) {
      return {
        studentId: user.id,
      };
    }

    if (resource === "exams") {
      return {
        courseId: user.courseId,
      };
    }

    if (resource === "notifications") {
      return {
        $or: [
          {
            targetRole: "all",
          },
          {
            targetRole: "student",
            targetUserId: user.id,
          },
        ],
      };
    }

    if (
      ["departments", "courses", "subjects"].includes(
        resource
      )
    ) {
      return {};
    }

    return {
      id: "__no_access__",
    };
  }

  // STAFF
  if (user.role === "staff") {
    if (resource === "staff") {
      return {
        id: user.id,
      };
    }

    if (resource === "departments") {
      return {};
    }

    if (
      [
        "students",
        "courses",
        "subjects",
        "exams",
      ].includes(resource)
    ) {
      return {
        departmentId: user.departmentId,
      };
    }

    if (resource === "staffAttendance") {
      return {
        staffId: user.id,
      };
    }

    if (resource === "notifications") {
      return {
        $or: [
          {
            targetRole: "all",
          },
          {
            targetRole: "staff",
            targetUserId: user.id,
          },
          {
            targetRole: "staff",
            departmentId: user.departmentId,
          },
        ],
      };
    }

    if (
      [
        "studentAttendance",
        "results",
        "certificates",
      ].includes(resource)
    ) {
      const studentIds =
        await models.students
          .find({
            departmentId: user.departmentId,
          })
          .distinct("id");

      return {
        studentId: {
          $in: studentIds,
        },
      };
    }
  }

  return {
    id: "__no_access__",
  };
}

/* =========================================================
   WRITE PERMISSION
========================================================= */

function canWrite(resource, user) {
  if (user.role === "admin") {
    return true;
  }

  if (user.role === "staff") {
    return [
      "studentAttendance",
      "staffAttendance",
      "exams",
      "results",
      "certificates",
      "notifications",
    ].includes(resource);
  }

  return false;
}

/* =========================================================
   VALIDATE WRITE SCOPE
========================================================= */

async function validateWriteScope(
  resource,
  record,
  user
) {
  if (user.role === "admin") {
    return true;
  }

  if (!canWrite(resource, user)) {
    return false;
  }

  if (user.role === "staff") {
    if (resource === "staffAttendance") {
      return record.staffId === user.id;
    }

    if (resource === "notifications") {
      return (
        record.senderId === user.id &&
        (!record.departmentId ||
          record.departmentId === user.departmentId)
      );
    }

    if (resource === "exams") {
      return (
        record.departmentId === user.departmentId
      );
    }

    if (
      [
        "studentAttendance",
        "results",
        "certificates",
      ].includes(resource)
    ) {
      return Boolean(
        await models.students.exists({
          id: record.studentId,
          departmentId: user.departmentId,
        })
      );
    }
  }

  return false;
}

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

/* =========================================================
   LOGIN
========================================================= */

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const {
      role,
      name,
      rollNumber,
      identifier,
      password,
    } = req.body || {};

    let user;

    /* ---------------- STUDENT LOGIN ---------------- */

    if (role === "student") {
      const account =
        await models.students
          .findOne({
            rollNumber: String(rollNumber || "")
              .trim()
              .toUpperCase(),

            accountStatus: "Active",
          });

      if (
        account &&
        account.fullName
          .trim()
          .toLocaleLowerCase() ===
          String(name || "")
            .trim()
            .toLocaleLowerCase()
      ) {
        user = {
          id: account.id,
          role,
          name: account.fullName,
          email: account.email,
          departmentId: account.departmentId,
          courseId: account.courseId,
          rollNumber: account.rollNumber,
        };
      }
    }

    /* ---------------- STAFF LOGIN ---------------- */

    else if (role === "staff") {
      const query = String(identifier || "").trim();

      const account = await models.staff.findOne({
        staffId: query.toUpperCase(),
        accountStatus: "Active",
      });

      if (
        account &&
        account.staffName.trim().toLocaleLowerCase() ===
          String(name || "").trim().toLocaleLowerCase()
      ) {
        user = {
          id: account.id,
          role,
          name: account.staffName,
          email: account.email,
          departmentId: account.departmentId,
          staffId: account.staffId,
        };
      }
    }

    /* ---------------- ADMIN LOGIN ---------------- */

    else if (role === "admin") {
      const account =
        await models.admins
          .findOne({
            email: String(identifier || "")
              .trim()
              .toLowerCase(),
          })
          .select("+passwordHash");

      if (
        account &&
        account.passwordHash &&
        (await bcrypt.compare(
          String(password || ""),
          account.passwordHash
        ))
      ) {
        user = {
          id: account.id,
          role,
          name: account.name,
          email: account.email,
        };
      }
    }

    if (!user) {
      return res.status(401).json({
        message:
          "The supplied credentials are not valid.",
      });
    }

    return res.json({
      user,
      token: issueToken(user),
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   AUTHENTICATED API
========================================================= */

app.use("/api", authenticate);

/* =========================================================
   GET ALL DATA
========================================================= */

app.get("/api/data", async (req, res, next) => {
  try {
    const entries = await Promise.all(
      resources.map(async (resource) => {
        const documents =
          await models[resource]
            .find(
              await readQuery(
                resource,
                req.user
              )
            )
            .sort({
              createdAt: -1,
              _id: -1,
            })
            .lean();

        const records =
          documents.map(publicRecord);

        if (
          resource === "notifications" &&
          req.user.role !== "admin"
        ) {
          records.forEach((record, index) => {
            record.isRead =
              documents[index].readByUserIds?.includes(
                req.user.id
              ) || false;
          });
        }

        return [resource, records];
      })
    );

    res.json(Object.fromEntries(entries));
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   STUDENT FULL RECORD
========================================================= */

app.get(
  "/api/students/:id/record",
  async (req, res, next) => {
    try {
      let query;

      if (req.user.role === "admin") {
        query = {
          id: req.params.id,
        };
      } else if (req.user.role === "staff") {
        query = {
          id: req.params.id,
          departmentId: req.user.departmentId,
        };
      } else {
        query = {
          id: req.user.id,
        };
      }

      const student =
        await models.students.findOne(query);

      if (!student) {
        return res.status(404).json({
          message:
            "Student record not found or access denied.",
        });
      }

      const [
        attendance,
        exams,
        results,
        certificates,
        fees,
      ] = await Promise.all([
        models.studentAttendance
          .find({
            studentId: student.id,
          })
          .lean(),

        models.exams
          .find({
            courseId: student.courseId,
            semester: student.semester,
          })
          .lean(),

        models.results
          .find({
            studentId: student.id,
          })
          .lean(),

        models.certificates
          .find({
            studentId: student.id,
          })
          .lean(),

        models.fees
          .find({
            studentId: student.id,
          })
          .lean(),
      ]);

      res.json({
        student: publicRecord(student),
        attendance:
          attendance.map(publicRecord),
        exams: exams.map(publicRecord),
        results: results.map(publicRecord),
        certificates:
          certificates.map(publicRecord),
        fees: fees.map(publicRecord),
      });
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================================
   RESOURCE PARAMETER
========================================================= */

app.param(
  "resource",
  (req, res, next, value) => {
    if (!resources.includes(value)) {
      return res.status(404).json({
        message: "Unknown data resource.",
      });
    }

    req.model = models[value];
    req.resource = value;

    next();
  }
);

/* =========================================================
   GET RESOURCE
========================================================= */

app.get(
  "/api/:resource",
  async (req, res, next) => {
    try {
      const documents =
        await req.model
          .find(
            await readQuery(
              req.resource,
              req.user
            )
          )
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .lean();

      const records =
        documents.map(publicRecord);

      if (
        req.resource === "notifications" &&
        req.user.role !== "admin"
      ) {
        records.forEach((record, index) => {
          record.isRead =
            documents[index].readByUserIds?.includes(
              req.user.id
            ) || false;
        });
      }

      res.json(records);
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================================
   BULK CREATE / UPDATE
========================================================= */

app.post(
  "/api/:resource/bulk",
  async (req, res, next) => {
    try {
      if (
        !Array.isArray(req.body) ||
        req.body.length > 500
      ) {
        return res.status(400).json({
          message:
            "Send an array containing at most 500 records.",
        });
      }

      const saved = await Promise.all(
        req.body.map(async (item) => {
          const record = {
            ...item,
            id: item.id || randomUUID(),
          };

          /* NOTIFICATION READ STATUS */

          if (
            req.resource === "notifications" &&
            req.user.role !== "admin"
          ) {
            const visibleQuery =
              await readQuery(
                "notifications",
                req.user
              );

            const existing =
              await models.notifications.findOne({
                id: record.id,
                ...visibleQuery,
              });

            if (!existing) {
              throw Object.assign(
                new Error(
                  "Notification not found or not visible to this account."
                ),
                { status: 404 }
              );
            }

            const update = record.isRead
              ? {
                  $addToSet: {
                    readByUserIds:
                      req.user.id,
                  },
                }
              : {
                  $pull: {
                    readByUserIds:
                      req.user.id,
                  },
                };

            const savedNotification =
              await models.notifications.findOneAndUpdate(
                {
                  id: record.id,
                },
                update,
                {
                  new: true,
                }
              );

            const publicNotification =
              publicRecord(
                savedNotification
              );

            publicNotification.isRead =
              Boolean(record.isRead);

            return publicNotification;
          }

          /* PERMISSION */

          if (
            !(await validateWriteScope(
              req.resource,
              record,
              req.user
            ))
          ) {
            throw Object.assign(
              new Error(
                "This role cannot modify this record."
              ),
              { status: 403 }
            );
          }

          /* PASSWORD */

          const password = record.password;

          delete record.password;

          if (
            password &&
            ["staff", "students"].includes(
              req.resource
            )
          ) {
            record.passwordHash =
              await bcrypt.hash(
                password,
                12
              );
          }

          /* UPSERT */

          const document =
            await req.model.findOneAndUpdate(
              {
                id: record.id,
              },
              {
                $set: record,
              },
              {
                upsert: true,
                new: true,
                runValidators: true,
              }
            );

          return publicRecord(document);
        })
      );

      res.json(saved);
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================================
   CREATE RESOURCE
========================================================= */

app.post(
  "/api/:resource",
  async (req, res, next) => {
    try {
      const record = {
        ...req.body,
        id: req.body.id || randomUUID(),
      };

      if (
        !(await validateWriteScope(
          req.resource,
          record,
          req.user
        ))
      ) {
        return res.status(403).json({
          message:
            "This role cannot modify this resource.",
        });
      }

      const password = record.password;

      delete record.password;

      if (
        password &&
        ["staff", "students"].includes(
          req.resource
        )
      ) {
        record.passwordHash =
          await bcrypt.hash(
            password,
            12
          );
      }

      const document =
        await req.model.create(record);

      res.status(201).json(
        publicRecord(document)
      );
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================================
   UPDATE RESOURCE
========================================================= */

app.patch(
  "/api/:resource/:id",
  async (req, res, next) => {
    try {
      const updates = {
        ...req.body,
      };

      delete updates._id;
      delete updates.passwordHash;

      const existing =
        await req.model.findOne({
          id: req.params.id,
        });

      if (!existing) {
        return res.status(404).json({
          message: "Record not found.",
        });
      }

      if (
        !(await validateWriteScope(
          req.resource,
          {
            ...publicRecord(existing),
            ...updates,
          },
          req.user
        ))
      ) {
        return res.status(403).json({
          message:
            "This role cannot modify this resource.",
        });
      }

      if (
        updates.password &&
        ["staff", "students"].includes(
          req.resource
        )
      ) {
        updates.passwordHash =
          await bcrypt.hash(
            updates.password,
            12
          );
      }

      delete updates.password;

      const document =
        await req.model.findOneAndUpdate(
          {
            id: req.params.id,
          },
          {
            $set: updates,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!document) {
        return res.status(404).json({
          message: "Record not found.",
        });
      }

      res.json(
        publicRecord(document)
      );
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================================
   DELETE RESOURCE
========================================================= */

app.delete(
  "/api/:resource/:id",
  async (req, res, next) => {
    try {
      if (
        !canWrite(
          req.resource,
          req.user
        )
      ) {
        return res.status(403).json({
          message:
            "This role cannot modify this resource.",
        });
      }

      const existing =
        await req.model.findOne({
          id: req.params.id,
        });

      if (
        !existing ||
        !(await validateWriteScope(
          req.resource,
          publicRecord(existing),
          req.user
        ))
      ) {
        return res.status(404).json({
          message:
            "Record not found or access denied.",
        });
      }

      const document =
        await req.model.findOneAndDelete({
          id: req.params.id,
        });

      /* DELETE RELATED STUDENT DATA */

      if (req.resource === "students") {
        await Promise.all([
          models.studentAttendance.deleteMany({
            studentId: req.params.id,
          }),

          models.fees.deleteMany({
            studentId: req.params.id,
          }),

          models.results.deleteMany({
            studentId: req.params.id,
          }),

          models.certificates.deleteMany({
            studentId: req.params.id,
          }),

          models.notifications.deleteMany({
            targetUserId: req.params.id,
          }),
        ]);
      }

      if (!document) {
        return res.status(404).json({
          message: "Record not found.",
        });
      }

      res.json({
        deleted: true,
        id: req.params.id,
      });
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
  (error, req, res, next) => {
    console.error(error);

    const status = error.status || (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.code === 11000
        ? 400
        : 500
    );

    res.status(status).json({
      message:
        status === 500 && process.env.NODE_ENV === "production"
          ? "The server could not complete the request."
          : error.message,
    });
  }
);

/* =========================================================
   START SERVER
========================================================= */

async function start() {
  try {
    console.log("Connecting to MongoDB...");

    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
      if (
        !process.env.MONGODB_URI.startsWith("mongodb+srv://") ||
        !String(error.message).includes("querySrv")
      ) {
        throw error;
      }

      console.warn(
        "MongoDB SRV lookup failed; retrying through DNS-over-HTTPS."
      );
      await mongoose.disconnect().catch(() => {});
      await mongoose.connect(
        await resolveMongoSrvUri(process.env.MONGODB_URI)
      );
    }

    console.log(
      `MongoDB connected: ${mongoose.connection.host}`
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    throw new Error(
      `MongoDB connection failed: ${message}`
    );
  }

  /* =======================================================
     CREATE FIRST ADMIN
  ======================================================= */

  if (
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD
  ) {
    const email =
      process.env.ADMIN_EMAIL
        .trim()
        .toLowerCase();

    const existingAdmin =
      await models.admins.exists({
        email,
      });

    if (!existingAdmin) {
      await models.admins.create({
        id: randomUUID(),
        name:
          process.env.ADMIN_NAME ||
          "University Administrator",
        email,
        passwordHash:
          await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
          ),
      });

      console.info(
        `Created first administrator account for ${email}.`
      );
    }
  } else {
    console.warn(
      "No administrator bootstrap credentials configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env."
    );
  }

  /* =======================================================
     START EXPRESS
  ======================================================= */

  app.listen(port, () => {
    console.info(
      `Classes Portal API listening on http://localhost:${port}`
    );
  });
}

/* =========================================================
   START APPLICATION
========================================================= */

start().catch((error) => {
  console.error(
    "Could not start the API.",
    error.message
  );

  process.exitCode = 1;
});