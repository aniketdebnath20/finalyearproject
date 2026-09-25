import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Clock,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Layers,
  Code2,
  Briefcase,
  Terminal,
  Laptop,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { StudentCoursesSkeleton } from '../common/Skeleton';

interface StudentCoursesViewProps {
  isLoading?: boolean;
}

export const StudentCoursesView: React.FC<StudentCoursesViewProps> = ({ isLoading }) => {
  const { courses, subjects, departments, staffList, isDataLoading } = useUniversity();

  // State to track if a single course is selected for full detail view
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  if (isLoading || isDataLoading) {
    return <StudentCoursesSkeleton />;
  }

  // Selected course object
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedDepartment = departments.find(d => d.id === selectedCourse?.departmentId);
  const selectedStaff = staffList.find(s => s.id === selectedCourse?.assignedStaffId);
  const selectedTopics = subjects.filter(s => s.courseId === selectedCourse?.id);

  // ==========================================
  // 1. SINGLE COURSE DETAIL VIEW
  // ==========================================
  if (selectedCourse) {
    return (
      <div id="single-course-detail-view" className="w-full py-2 space-y-6 pb-20 animate-in fade-in duration-200">
        {/* Top Left Corner: Preview to See All Courses */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-zinc-200/80">
          <button
            type="button"
            id="back-to-all-courses-btn"
            onClick={() => setSelectedCourseId(null)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100/80 border border-zinc-200 text-zinc-700 hover:text-zinc-900 text-xs font-semibold transition cursor-pointer shadow-2xs group"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to All Courses</span>
          </button>

          <span className="text-xs font-mono text-zinc-500">
            {selectedTopics.length} Specialized Modules Cataloged
          </span>
        </div>

        {/* Course Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden"
        >
          <div className="p-6 sm:p-8 bg-zinc-50/70 border-b border-zinc-100 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md bg-zinc-900 text-white">
                {selectedCourse.courseCode}
              </span>
              {selectedDepartment && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white text-zinc-700 border border-zinc-200">
                  {selectedDepartment.name}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight leading-snug">
                {selectedCourse.courseName}
              </h1>
              {selectedCourse.description && (
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans mt-2 max-w-3xl">
                  {selectedCourse.description}
                </p>
              )}
            </div>
          </div>

          {/* Key Parameters Grid (No credits, no semester, no course taken) */}
          <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" /> Duration
              </span>
              <p className="font-semibold text-zinc-900">{selectedCourse.duration}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-zinc-500" /> Curriculum
              </span>
              <p className="font-semibold text-zinc-900">{selectedTopics.length} Detailed Modules</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1">
                <Laptop className="w-3 h-3 text-zinc-500" /> Learning Mode
              </span>
              <p className="font-semibold text-zinc-900">Live Lectures & Coding Labs</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-zinc-500" /> Career Outcome
              </span>
              <p className="font-semibold text-zinc-900">Industry Job-Ready</p>
            </div>
          </div>

          {/* Skills & Technologies Covered */}
          {selectedCourse.skillsCovered && selectedCourse.skillsCovered.length > 0 && (
            <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4 text-zinc-700" />
                <h3 className="text-xs font-mono font-semibold text-zinc-900 uppercase tracking-wider">
                  Technologies & Skills Covered
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.skillsCovered.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-200/80 text-zinc-800 text-xs font-mono font-medium"
                  >
                    <Terminal className="w-3 h-3 text-zinc-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Career Roles & Outcomes */}
          {selectedCourse.careerRoles && selectedCourse.careerRoles.length > 0 && (
            <div className="px-6 sm:px-8 pb-6 pt-3 border-t border-zinc-100 bg-zinc-50/40">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-zinc-700" />
                <h3 className="text-xs font-mono font-semibold text-zinc-900 uppercase tracking-wider">
                  Target Career Roles & Job Profiles
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.careerRoles.map((role, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 text-xs font-medium shadow-2xs"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Lead Instructor Details */}
        {selectedStaff && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center font-serif font-bold text-base shrink-0">
                {selectedStaff.staffName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Lead Course Instructor</span>
                <h3 className="font-serif font-bold text-sm text-zinc-900">{selectedStaff.staffName}</h3>
                <p className="text-xs text-zinc-500">{selectedStaff.designation}</p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-zinc-500">
              <p>Email: {selectedStaff.email}</p>
              <p>Contact: {selectedStaff.phone}</p>
            </div>
          </div>
        )}

        {/* Course Topics & Curriculum Breakdown with Proper Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-800" />
              <h2 className="text-base font-serif font-bold text-zinc-900">
                Course Topics & Syllabus Units ({selectedTopics.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Detailed Practical Syllabus
            </span>
          </div>

          {selectedTopics.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-zinc-500 bg-white rounded-xl border border-zinc-200">
              No syllabus modules currently cataloged for this course.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {selectedTopics.map((topic, idx) => (
                <div
                  key={topic.id || idx}
                  className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-2xs hover:border-zinc-300 transition-colors space-y-4"
                >
                  {/* Module Header: Code, Title, Duration */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-zinc-900 text-white font-semibold">
                        {topic.subjectCode || `MODULE-${idx + 1}`}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-900">
                        {topic.subjectName}
                      </h3>
                    </div>

                    {topic.durationHours && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-200/80 text-zinc-800 text-xs font-mono font-medium">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{topic.durationHours}</span>
                      </div>
                    )}
                  </div>

                  {/* Syllabus Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
                    {topic.syllabus || 'Comprehensive lectures, practical exercises, and problem solving modules.'}
                  </p>

                  {/* Key Learning Objectives & Competencies */}
                  {topic.learningObjectives && topic.learningObjectives.length > 0 && (
                    <div className="pt-2 border-t border-zinc-100/80 space-y-2">
                      <h4 className="text-xs font-mono font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Key Learning Objectives & Competencies
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topic.learningObjectives.map((obj, oIdx) => (
                          <div
                            key={oIdx}
                            className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200/70 text-xs text-zinc-700 font-sans"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hands-on Practical Labs & Capstone Projects */}
                  {topic.handsOnProjects && topic.handsOnProjects.length > 0 && (
                    <div className="pt-2 border-t border-zinc-100/80 space-y-2">
                      <h4 className="text-xs font-mono font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        Hands-on Practical Labs & Guided Projects
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topic.handsOnProjects.map((proj, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs text-zinc-800 font-sans flex items-start gap-2.5"
                          >
                            <span className="font-mono font-bold text-amber-700 shrink-0 text-[11px] bg-amber-100/80 px-1.5 py-0.5 rounded">
                              Lab #{pIdx + 1}
                            </span>
                            <span className="leading-relaxed">{proj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools, Frameworks & Stack Used */}
                  {topic.toolsUsed && topic.toolsUsed.length > 0 && (
                    <div className="pt-2 border-t border-zinc-100/80 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-500 font-semibold uppercase flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-zinc-400" />
                        Tools & Libraries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.toolsUsed.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-mono border border-zinc-200/70"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to All Courses Footer Button */}
        <div className="pt-4 flex justify-start">
          <button
            type="button"
            onClick={() => setSelectedCourseId(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Courses</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. ALL COURSES LIST VIEW (NO SEARCH, NO ENROLLED TABS, NO CREDITS, NO COURSE TAKEN)
  // ==========================================
  return (
    <div id="student-courses-container" className="w-full py-2 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-zinc-900 tracking-tight">
            Courses
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Specialized computer classes, technical programs, and practical curriculum
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-mono font-medium self-start sm:self-auto">
          {courses.length} Specialized Programs
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {courses.map(course => {
          const courseTopics = subjects.filter(s => s.courseId === course.id);
          const dept = departments.find(d => d.id === course.departmentId);

          return (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-all duration-200 shadow-xs flex flex-col justify-between"
            >
              {/* Card Header & Details */}
              <div className="p-6 sm:p-7 space-y-4 flex-1">
                {/* Code & Duration Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md bg-zinc-900 text-white">
                    {course.courseCode}
                  </span>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Duration: <strong className="text-zinc-900 font-semibold">{course.duration}</strong></span>
                  </div>
                </div>

                {/* Course Name & Department */}
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-zinc-900 tracking-tight leading-snug">
                    {course.courseName}
                  </h2>
                  {dept && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                      <Building2 className="w-3 h-3 text-zinc-400" />
                      <span>{dept.name}</span>
                    </div>
                  )}
                </div>

                {/* Course Description */}
                {course.description && (
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans line-clamp-3">
                    {course.description}
                  </p>
                )}

                {/* Skills Preview Chips */}
                {course.skillsCovered && course.skillsCovered.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {course.skillsCovered.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-mono border border-zinc-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skillsCovered.length > 4 && (
                      <span className="text-[11px] font-mono text-zinc-400 self-center">
                        +{course.skillsCovered.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Quick Meta Information (Credits removed) */}
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-zinc-400" />
                    {courseTopics.length} Syllabus Modules
                  </span>
                  <span>•</span>
                  <span>Interactive Coding Labs</span>
                </div>
              </div>

              {/* Card Footer with "See more" Button to Open Single Course Detail */}
              <div className="px-6 sm:px-7 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between rounded-b-2xl">
                <span className="text-[11px] font-mono text-zinc-400">
                  {courseTopics.length} module{courseTopics.length === 1 ? '' : 's'} cataloged
                </span>

                <button
                  type="button"
                  id={`see-more-btn-${course.id}`}
                  onClick={() => setSelectedCourseId(course.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition cursor-pointer py-1 group"
                >
                  <span>See more</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

