import type {
  Department,
  Course,
  Subject,
  Student,
  Staff,
  StudentAttendanceRecord,
  StaffAttendanceRecord,
  StudentFeeRecord,
  AcademicResult,
  Exam,
  Certificate,
  NotificationItem
} from '../types';

export const initialDepartments: Department[] = [
  {
    id: 'dept-cse',
    name: 'Computer Science & Software Engineering',
    code: 'CSE',
    headOfDepartment: 'Dr. Alan Roberts, Ph.D.',
    description: 'Specialized computer classes in Full-Stack Java development, enterprise architecture, and distributed web applications.'
  },
  {
    id: 'dept-ece',
    name: 'DevOps & Cloud Infrastructure',
    code: 'DEVOPS',
    headOfDepartment: 'Dr. Maya Patel, Ph.D.',
    description: 'Advanced computer training in CI/CD pipelines, Docker containerization, Kubernetes orchestration, and cloud architecture.'
  },
  {
    id: 'dept-mech',
    name: 'Data Analytics & Business Intelligence',
    code: 'DATA',
    headOfDepartment: 'Dr. Sarah Jenkins, Ph.D.',
    description: 'Applied computing in statistical analysis, Python data processing, SQL warehousing, and interactive BI visual dashboards.'
  },
  {
    id: 'dept-mgmt',
    name: 'Artificial Intelligence & Machine Learning',
    code: 'AI-SYS',
    headOfDepartment: 'Prof. Richard Sterling, MBA, Ph.D.',
    description: 'Modern computing in machine learning algorithms, deep neural networks, generative AI, LLMs, and intelligent systems.'
  }
];

export const initialStaff: Staff[] = [
  {
    id: 'staff-101',
    staffName: 'Dr. Alan Roberts',
    staffId: 'STF-101',
    email: 'alan.roberts@apex.univ.edu',
    phone: '+1 (555) 234-5678',
    departmentId: 'dept-cse',
    designation: 'Professor & Lead Java Full Stack Instructor',
    assignedCourseIds: ['course-btech-cse'],
    assignedSubjectIds: ['sub-cs401', 'sub-cs404'],
    joiningDate: '2016-08-15',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'staff-102',
    staffName: 'Dr. Maya Patel',
    staffId: 'STF-102',
    email: 'maya.patel@apex.univ.edu',
    phone: '+1 (555) 345-6789',
    departmentId: 'dept-ece',
    designation: 'Associate Professor & Lead DevOps Architect',
    assignedCourseIds: ['course-btech-ece'],
    assignedSubjectIds: ['sub-ec401', 'sub-ec402'],
    joiningDate: '2018-01-10',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'staff-103',
    staffName: 'Prof. David Chen',
    staffId: 'STF-103',
    email: 'david.chen@apex.univ.edu',
    phone: '+1 (555) 456-7890',
    departmentId: 'dept-cse',
    designation: 'Assistant Professor (Spring Boot & Microservices)',
    assignedCourseIds: ['course-btech-cse'],
    assignedSubjectIds: ['sub-cs402'],
    joiningDate: '2020-07-01',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'staff-104',
    staffName: 'Dr. Elena Rostova',
    staffId: 'STF-104',
    email: 'elena.rostova@apex.univ.edu',
    phone: '+1 (555) 567-8901',
    departmentId: 'dept-cse',
    designation: 'Associate Professor (React & Frontend Architecture)',
    assignedCourseIds: ['course-btech-cse'],
    assignedSubjectIds: ['sub-cs403'],
    joiningDate: '2017-09-12',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'staff-105',
    staffName: 'Dr. Marcus Vance',
    staffId: 'STF-105',
    email: 'marcus.vance@apex.univ.edu',
    phone: '+1 (555) 678-9012',
    departmentId: 'dept-mech',
    designation: 'Professor & Lead Data Analytics Instructor',
    assignedCourseIds: ['course-btech-mech'],
    assignedSubjectIds: ['sub-me401', 'sub-me402'],
    joiningDate: '2015-03-20',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'staff-106',
    staffName: 'Prof. Ananya Rao',
    staffId: 'STF-106',
    email: 'ananya.rao@apex.univ.edu',
    phone: '+1 (555) 789-0123',
    departmentId: 'dept-mgmt',
    designation: 'Assistant Professor (AI & Machine Learning)',
    assignedCourseIds: ['course-mba-tech'],
    assignedSubjectIds: ['sub-mg401'],
    joiningDate: '2021-08-01',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'course-btech-cse',
    courseCode: 'CS-JAVA-2024',
    courseName: 'Java Full Stack Development',
    departmentId: 'dept-cse',
    duration: '1 Year (Comprehensive Industry Track)',
    semester: 6,
    credits: 120,
    assignedStaffId: 'staff-101',
    description: 'Professional computer classes mastering end-to-end software engineering: Core Java 21, Spring Boot 3 microservices architecture, React 18, TypeScript, Tailwind CSS, Hibernate/JPA, PostgreSQL, and RESTful APIs.',
    skillsCovered: ['Java 21 LTS', 'Spring Boot 3', 'Microservices', 'React 18', 'TypeScript', 'Hibernate / JPA', 'PostgreSQL', 'RESTful APIs', 'Docker Containerization'],
    careerRoles: ['Java Full Stack Developer', 'Backend Java Engineer', 'Full Stack Software Engineer', 'API & Microservices Specialist']
  },
  {
    id: 'course-btech-ece',
    courseCode: 'CS-DEVOPS-2024',
    courseName: 'DevOps & Cloud Engineering',
    departmentId: 'dept-ece',
    duration: '1 Year (Comprehensive Industry Track)',
    semester: 6,
    credits: 120,
    assignedStaffId: 'staff-102',
    description: 'Hands-on computer training mastering the full modern DevOps lifecycle: Docker containerization, Kubernetes cluster orchestration, automated CI/CD pipelines, Terraform Infrastructure as Code (IaC), AWS & GCP cloud platforms, and Site Reliability Engineering.',
    skillsCovered: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'GitHub Actions', 'Jenkins', 'Terraform IaC', 'AWS & GCP', 'Prometheus & Grafana', 'Linux Systems'],
    careerRoles: ['DevOps Engineer', 'Cloud Infrastructure Engineer', 'Site Reliability Engineer (SRE)', 'Platform Engineer']
  },
  {
    id: 'course-btech-mech',
    courseCode: 'CS-DATA-2024',
    courseName: 'Data Analytics & Business Intelligence',
    departmentId: 'dept-mech',
    duration: '1 Year (Comprehensive Industry Track)',
    semester: 4,
    credits: 120,
    assignedStaffId: 'staff-105',
    description: 'Industry-standard computer classes in modern data analytics: advanced SQL queries & enterprise data warehousing, Python data manipulation with Pandas & NumPy, interactive Power BI & Tableau visual dashboards, and predictive statistical modeling.',
    skillsCovered: ['Python Data Science', 'Pandas & NumPy', 'Advanced SQL', 'Data Warehousing', 'Power BI', 'Tableau', 'Statistical Modeling', 'ETL Data Pipelines'],
    careerRoles: ['Data Analyst', 'Business Intelligence Analyst', 'Data Operations Specialist', 'Analytics Consultant']
  },
  {
    id: 'course-mba-tech',
    courseCode: 'CS-AIML-2025',
    courseName: 'Artificial Intelligence & Machine Learning',
    departmentId: 'dept-mgmt',
    duration: '1 Year (Comprehensive Industry Track)',
    semester: 2,
    credits: 90,
    assignedStaffId: 'staff-106',
    description: 'Advanced computer training in applied machine learning algorithms, deep learning neural networks with PyTorch, Natural Language Processing (NLP), Large Language Models (LLMs), Prompt Engineering, and RAG architectures.',
    skillsCovered: ['Machine Learning', 'PyTorch', 'Scikit-Learn', 'Deep Learning', 'LLMs & Generative AI', 'Vector Databases', 'LangChain', 'Prompt Engineering'],
    careerRoles: ['AI/ML Engineer', 'Applied Machine Learning Specialist', 'Prompt & Generative AI Engineer', 'Data Scientist']
  }
];

export const initialSubjects: Subject[] = [
  // Java Full Stack Development Subjects
  {
    id: 'sub-cs401',
    subjectCode: 'JFS-601',
    subjectName: 'Core Java & Object-Oriented Architecture',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    credits: 4,
    staffId: 'staff-101',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Comprehensive mastery of OOP principles, class hierarchies, polymorphism, encapsulation, exception handling hierarchies, Java Collections Framework (Lists, Sets, Maps, Queues), concurrent programming with executors and locks, Lambdas, Stream API transformations, Java 17/21 modern pattern matching, and internal JVM memory allocation.',
    learningObjectives: [
      'Master OOP paradigms: abstraction, inheritance, polymorphism, encapsulation, and SOLID design patterns',
      'High-throughput data manipulation using Java 21 Streams and Functional Lambdas',
      'Thread safety, concurrent collections, ReentrantLocks, and Virtual Threads (Project Loom)',
      'JVM runtime execution model, Garbage Collection algorithms, and memory profiling'
    ],
    handsOnProjects: [
      'Multi-Threaded Banking & Transaction Processing Engine with strict ACID locks and transaction logs',
      'High-Performance In-Memory Cache Simulator using LRU eviction algorithms and thread-safe collections'
    ],
    toolsUsed: ['Java 21 LTS', 'IntelliJ IDEA', 'Apache Maven', 'JUnit 5', 'VisualVM Profiler']
  },
  {
    id: 'sub-cs402',
    subjectCode: 'JFS-602',
    subjectName: 'Spring Boot & Enterprise Microservices',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    credits: 4,
    staffId: 'staff-103',
    durationHours: '50 Hours (5 Weeks)',
    syllabus: 'Deep-dive into Spring Framework 6 fundamentals, Spring Boot 3 auto-configuration, dependency injection, RESTful API conventions, request validation, Spring Security with stateless JWT authorization, asynchronous event-driven messaging with Apache Kafka, service discovery with Eureka, and API gateway routing.',
    learningObjectives: [
      'Architect production-grade RESTful APIs following OpenAPI / Swagger standards and proper status code contracts',
      'Implement OAuth2 & stateless JWT bearer token authentication and role-based authorization filters',
      'Event-driven asynchronous messaging, topic partitioning, and consumer groups with Apache Kafka',
      'Distributed microservices resilience: Circuit Breakers (Resilience4j), Spring Cloud Gateway, and Config Server'
    ],
    handsOnProjects: [
      'Distributed E-Commerce Microservices Platform with payment, catalog, inventory & order processing services',
      'Real-Time Notification & Event Streaming Broker using Spring Boot, WebSockets, and Apache Kafka'
    ],
    toolsUsed: ['Spring Boot 3', 'Spring Security', 'Apache Kafka', 'Postman', 'Docker Compose']
  },
  {
    id: 'sub-cs403',
    subjectCode: 'JFS-603',
    subjectName: 'Frontend Engineering with React & TypeScript',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    credits: 3,
    staffId: 'staff-104',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Modern client-side single page application architecture using React 18, JSX/TSX syntax, custom lifecycle hooks (useState, useEffect, useMemo, useCallback), global state management with Redux Toolkit and Zustand, responsive component design with Tailwind CSS, TypeScript strict type inference, and resilient HTTP data fetching with Axios and React Query.',
    learningObjectives: [
      'Design modular, performant, and accessible user interface component systems with strict TypeScript interfaces',
      'Manage predictable global state flows using Redux Toolkit slices and Zustand lightweight stores',
      'Optimized client routing, code-splitting, lazy loading, and resilient asynchronous server-state caching',
      'Responsive design implementation with utility-first Tailwind CSS, dark/light themes, and fluid animations'
    ],
    handsOnProjects: [
      'Enterprise SaaS Analytics & Project Management Dashboard with interactive tables, charts, and filtering',
      'Interactive Learning Management Portal with dynamic assessments, grade tracking, and PDF certificate downloads'
    ],
    toolsUsed: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Redux Toolkit', 'Axios']
  },
  {
    id: 'sub-cs404',
    subjectCode: 'JFS-604',
    subjectName: 'Database Engineering with SQL & Hibernate/JPA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    credits: 4,
    staffId: 'staff-101',
    durationHours: '40 Hours (4 Weeks)',
    syllabus: 'Relational database architecture and query optimization using PostgreSQL and MySQL, schema normalization (1NF through 3NF), B-Tree indexing, execution plan analysis (EXPLAIN ANALYZE), complex analytical joins, Hibernate ORM entity mappings, entity lifecycle states, Spring Data JPA custom repository queries, and Redis caching layers.',
    learningObjectives: [
      'Design high-performance normalized and denormalized relational database schemas for enterprise applications',
      'Write complex SQL queries with CTEs, window functions, and transaction isolation levels',
      'Eliminate N+1 query performance bottlenecks using Hibernate fetch joins and JPA EntityGraphs',
      'Integrate Redis distributed caching to minimize database query latency and scale reads'
    ],
    handsOnProjects: [
      'Scalable Enterprise Inventory Database with optimistic/pessimistic concurrency locks and audit logging',
      'Distributed Cache-Aside Layer with Spring Data JPA and Redis Sentinel for high-throughput reads'
    ],
    toolsUsed: ['PostgreSQL 16', 'MySQL 8', 'Hibernate ORM / JPA', 'Redis', 'DBeaver Database IDE']
  },

  // DevOps & Cloud Engineering Subjects
  {
    id: 'sub-ec401',
    subjectCode: 'DEV-601',
    subjectName: 'Docker Containerization & Kubernetes Orchestration',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    credits: 4,
    staffId: 'staff-102',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Practical container engineering starting from scratch: Docker architecture, container runtimes, multi-stage Dockerfile build optimization, container networking, persistent storage volumes, and Docker Compose multi-container environments. Moving into Kubernetes: cluster architecture, Pods, Deployments, ReplicaSets, Services (ClusterIP, NodePort, LoadBalancer), Ingress NGINX controllers, ConfigMaps, Secrets, Helm package management, and Horizontal Pod Autoscaling (HPA).',
    learningObjectives: [
      'Package microservices into slim, secure, multi-stage production Docker container images',
      'Deploy, scale, and orchestrate fault-tolerant application clusters in Kubernetes',
      'Configure ingress traffic routing, SSL/TLS certificate automation, and service discovery',
      'Package and release complex multi-tier Kubernetes applications using Helm Charts'
    ],
    handsOnProjects: [
      'Production Kubernetes Cluster Deployment with NGINX Ingress, Secret management, and TLS auto-renewal',
      'Automated Zero-Downtime Blue/Green and Canary Deployment Orchestration on Kubernetes'
    ],
    toolsUsed: ['Docker Engine', 'Kubernetes (k8s)', 'Minikube / Kind', 'Helm', 'NGINX Ingress Controller']
  },
  {
    id: 'sub-ec402',
    subjectCode: 'DEV-602',
    subjectName: 'CI/CD Pipelines & Infrastructure as Code (Terraform)',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    credits: 4,
    staffId: 'staff-102',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Continuous Integration and Continuous Delivery automation using GitHub Actions and Jenkins pipelines. Writing reusable pipeline workflows, automated unit/integration test gates, container image vulnerability scanning, artifact management, and automated deployment triggers. Mastering Infrastructure as Code (IaC) with HashiCorp Terraform: declarative syntax (HCL), provider configurations, state file management, remote backends (S3/GCS), Terraform modules, and Ansible configuration playbooks.',
    learningObjectives: [
      'Design end-to-end automated CI/CD build, test, containerize, scan, and deploy pipelines',
      'Implement automated security scanning with Trivy and SonarQube in pipeline quality gates',
      'Provision repeatable, modular cloud infrastructure using Terraform HCL scripts',
      'Manage Terraform remote state locks with DynamoDB/GCS and implement automated drift detection'
    ],
    handsOnProjects: [
      'Full GitOps Pipeline deploying microservices to Kubernetes via GitHub Actions with PR previews',
      'Multi-Region Cloud Infrastructure Provisioning with Terraform Modules & Remote State Locking'
    ],
    toolsUsed: ['GitHub Actions', 'Jenkins', 'Terraform (HCL)', 'Ansible', 'Trivy Security Scanner']
  },
  {
    id: 'sub-ec403',
    subjectCode: 'DEV-603',
    subjectName: 'Cloud Architecture (AWS & GCP) & Cloud Security',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    credits: 4,
    staffId: 'staff-102',
    durationHours: '40 Hours (4 Weeks)',
    syllabus: 'Cloud platform architecture spanning Amazon Web Services (AWS) and Google Cloud Platform (GCP). Virtual Private Clouds (VPC), public/private subnets, Internet Gateways, NAT Gateways, Security Groups, IAM least-privilege role policies, compute instances (EC2, Cloud Compute), serverless execution (AWS Lambda, Cloud Run), managed cloud relational databases (AWS RDS, Cloud SQL), Cloud Storage (S3, GCS), KMS encryption keys, and secrets managers.',
    learningObjectives: [
      'Architect highly available, fault-tolerant cloud networks with redundant multi-AZ subnets',
      'Configure strict IAM role policies, multi-factor authentication, and KMS encryption key rotation',
      'Deploy scalable serverless microservices with AWS Lambda and Google Cloud Run',
      'Execute cloud cost optimization, cloud budgeting, and audit logging with CloudTrail and Cloud Audit'
    ],
    handsOnProjects: [
      'Secure High-Availability Dual-Zone Cloud Network with VPC Peering and Bastion Host Architecture',
      'Serverless Event-Driven Microservices Platform using Cloud Run and Managed Cloud SQL'
    ],
    toolsUsed: ['AWS Console & CLI', 'Google Cloud Platform', 'AWS IAM', 'Cloud Run', 'AWS RDS / Cloud SQL']
  },
  {
    id: 'sub-ec404',
    subjectCode: 'DEV-604',
    subjectName: 'Observability, Monitoring & SRE Practices',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    credits: 3,
    staffId: 'staff-102',
    durationHours: '40 Hours (4 Weeks)',
    syllabus: 'Site Reliability Engineering (SRE) principles: defining Service Level Objectives (SLOs), Service Level Indicators (SLIs), and error budgets. Implementing full-stack observability with Prometheus metric collection, time-series PromQL queries, dynamic Grafana visualization dashboards, centralized log aggregation using Grafana Loki and Elasticsearch, distributed request tracing with OpenTelemetry and Jaeger, and automated alert escalation chains.',
    learningObjectives: [
      'Define and measure SLIs and SLOs for production web and cloud microservices',
      'Instrument applications with Prometheus metrics and design executive Grafana monitoring dashboards',
      'Centralize application and container logs with structured JSON search in Loki and Elasticsearch',
      'Implement distributed tracing to pinpoint latency bottlenecks across microservices'
    ],
    handsOnProjects: [
      'Production Observability Stack with Prometheus, Alertmanager, and Custom Grafana Dashboards',
      'Distributed Tracing & Centralized Log Investigation Suite using OpenTelemetry and Jaeger'
    ],
    toolsUsed: ['Prometheus', 'Grafana', 'Loki', 'OpenTelemetry', 'Jaeger', 'Alertmanager']
  },

  // Data Analytics & Business Intelligence Subjects
  {
    id: 'sub-me401',
    subjectCode: 'DAN-401',
    subjectName: 'Python for Data Analysis & Exploratory Analytics',
    courseId: 'course-btech-mech',
    departmentId: 'dept-mech',
    semester: 4,
    credits: 4,
    staffId: 'staff-105',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Comprehensive Python data science programming: core syntax, data structures, NumPy multidimensional vector operations and broadcasting, Pandas Series and DataFrame manipulations, data cleaning and wrangling, missing value imputation, outlier detection, data reshaping and merging, Exploratory Data Analysis (EDA), and data visualization with Matplotlib, Seaborn, and Plotly interactive charts.',
    learningObjectives: [
      'Perform high-speed vectorized calculations and numerical data processing with NumPy',
      'Filter, aggregate, transform, and clean complex real-world datasets with Pandas',
      'Conduct in-depth Exploratory Data Analysis (EDA) to discover actionable patterns and correlations',
      'Create publication-grade statistical and interactive visual charts with Seaborn and Plotly'
    ],
    handsOnProjects: [
      'End-to-End E-Commerce Customer Behavior & Churn Exploratory Analysis Notebook',
      'Automated Financial Market Data Ingestion and Technical Indicator Visualizer'
    ],
    toolsUsed: ['Python 3.11', 'Pandas', 'NumPy', 'Jupyter Lab', 'Matplotlib & Seaborn', 'Plotly']
  },
  {
    id: 'sub-me402',
    subjectCode: 'DAN-402',
    subjectName: 'Advanced SQL & Enterprise Data Warehousing',
    courseId: 'course-btech-mech',
    departmentId: 'dept-mech',
    semester: 4,
    credits: 4,
    staffId: 'staff-105',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Advanced SQL query engineering and modern cloud data warehousing: complex aggregation, Common Table Expressions (CTEs), recursive queries, window functions (ROW_NUMBER, DENSE_RANK, NTILE, LAG, LEAD), pivot tables, indexing and query execution planning. Enterprise data warehousing concepts: OLTP vs OLAP architectures, Star and Snowflake dimensional schemas, slowly changing dimensions (SCD Types 1, 2, 3), and writing cloud SQL queries on Google BigQuery and Snowflake.',
    learningObjectives: [
      'Write advanced analytical SQL queries utilizing analytical window functions and CTEs',
      'Architect Star and Snowflake dimensional schemas for enterprise business domains',
      'Build and execute cloud analytical queries on petabyte-scale data in Google BigQuery',
      'Optimize slow queries through execution plan diagnosis, partitioning, and clustering strategies'
    ],
    handsOnProjects: [
      'Enterprise Retail Analytics Data Warehouse with Fact and Dimension Tables',
      'Cloud BigQuery Sales Revenue & Customer Retention Analytics Query Engine'
    ],
    toolsUsed: ['PostgreSQL', 'Google BigQuery', 'Snowflake', 'DBeaver', 'SQL Dialects']
  },
  {
    id: 'sub-me403',
    subjectCode: 'DAN-403',
    subjectName: 'Business Intelligence & Power BI / Tableau Dashboards',
    courseId: 'course-btech-mech',
    departmentId: 'dept-mech',
    semester: 4,
    credits: 4,
    staffId: 'staff-105',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Executive business intelligence, visual storytelling, and dashboard engineering using Microsoft Power BI and Tableau. Connecting to diverse data sources, data modeling, establishing relationships (1-to-many, many-to-many), creating calculated columns and measures using DAX (Data Analysis Expressions: CALCULATE, FILTER, ALL, Time Intelligence functions), designing interactive reports with slicers, drill-through actions, tooltip pages, and publishing reports to Power BI Service.',
    learningObjectives: [
      'Model multi-table business data with star schema relationships in Power BI Desktop',
      'Author robust DAX calculated measures and time intelligence comparisons (YoY, MoM, YTD)',
      'Design interactive C-level executive dashboards following cognitive visual storytelling principles',
      'Automate report scheduling, data gateway refreshes, and role-based data security (RLS)'
    ],
    handsOnProjects: [
      'C-Suite Executive Sales & Operations Performance Interactive Dashboard in Power BI',
      'Global Supply Chain & Logistics Dynamic KPI Tracker in Tableau Desktop'
    ],
    toolsUsed: ['Microsoft Power BI Desktop', 'DAX Studio', 'Tableau Desktop', 'Power BI Service']
  },
  {
    id: 'sub-me404',
    subjectCode: 'DAN-404',
    subjectName: 'Statistical Methods & Predictive Analytics',
    courseId: 'course-btech-mech',
    departmentId: 'dept-mech',
    semester: 4,
    credits: 3,
    staffId: 'staff-105',
    durationHours: '40 Hours (4 Weeks)',
    syllabus: 'Applied statistics and predictive modeling for decision-making: probability theory, discrete and continuous distributions, Central Limit Theorem, hypothesis testing (Z-tests, t-tests, Chi-Square, ANOVA), confidence intervals, correlation vs causation, simple and multiple linear regression, logistic regression for classification, residual diagnostics, and time-series forecasting fundamentals (ARIMA).',
    learningObjectives: [
      'Conduct rigorous hypothesis tests (t-tests, ANOVA) to validate business hypotheses with statistical significance',
      'Build and evaluate linear and logistic regression models for prediction and classification',
      'Interpret statistical model metrics: R-Squared, p-values, F-statistic, and confusion matrix',
      'Forecast business demand and trends using seasonal time-series regression models'
    ],
    handsOnProjects: [
      'A/B Testing Statistical Evaluation for Digital Marketing Conversion Rates',
      'Predictive Customer Loan Default Classification Model using Logistic Regression'
    ],
    toolsUsed: ['Python (SciPy & Statsmodels)', 'Scikit-Learn', 'Jupyter Lab', 'Excel Analytics ToolPak']
  },

  // Artificial Intelligence & Machine Learning Subjects
  {
    id: 'sub-mg401',
    subjectCode: 'AIML-201',
    subjectName: 'Machine Learning Algorithms & Scikit-Learn',
    courseId: 'course-mba-tech',
    departmentId: 'dept-mgmt',
    semester: 2,
    credits: 4,
    staffId: 'staff-106',
    durationHours: '45 Hours (4 Weeks)',
    syllabus: 'Foundational and advanced applied machine learning with Python and Scikit-Learn. Supervised learning algorithms: Linear Regression, Ridge/Lasso regularization, Logistic Regression, Decision Trees, Random Forests, and Gradient Boosting (XGBoost, LightGBM). Unsupervised learning: K-Means clustering, Hierarchical clustering, and Principal Component Analysis (PCA). Feature engineering, categorical encoding, feature scaling, train/test splitting, and hyperparameter tuning with GridSearchCV.',
    learningObjectives: [
      'Implement and compare supervised and unsupervised machine learning models on real datasets',
      'Prevent overfitting using cross-validation, regularization, and ensemble techniques',
      'Evaluate models using Precision, Recall, F1-Score, ROC-AUC curves, and RMSE metrics',
      'Deploy trained models as REST inference endpoints with FastAPI and Docker'
    ],
    handsOnProjects: [
      'End-to-End Real Estate Valuation & Price Prediction Engine with Gradient Boosting',
      'Customer Segmentation & Clustering Engine using K-Means and Principal Component Analysis'
    ],
    toolsUsed: ['Python', 'Scikit-Learn', 'XGBoost', 'FastAPI', 'Pandas']
  },
  {
    id: 'sub-mg402',
    subjectCode: 'AIML-202',
    subjectName: 'Deep Learning, LLMs & Generative AI Systems',
    courseId: 'course-mba-tech',
    departmentId: 'dept-mgmt',
    semester: 2,
    credits: 4,
    staffId: 'staff-106',
    durationHours: '50 Hours (5 Weeks)',
    syllabus: 'Modern deep neural network architectures and Generative AI systems. Deep learning with PyTorch: tensors, automatic differentiation, Multi-Layer Perceptrons, Convolutional Neural Networks (CNNs) for vision, Recurrent Neural Networks and LSTMs. Advancing to the Transformer architecture: self-attention mechanisms, encoder-decoder models, BERT, and GPT architectures. Practical Generative AI engineering: Large Language Models (LLMs), prompt engineering strategies, Retrieval-Augmented Generation (RAG) with vector databases (Pinecone, ChromaDB), embeddings, and LangChain orchestration.',
    learningObjectives: [
      'Build, train, and optimize deep neural networks from scratch using PyTorch and GPU acceleration',
      'Understand Transformer self-attention mechanisms and pre-trained LLM architectures',
      'Engineer Production Retrieval-Augmented Generation (RAG) knowledge search systems',
      'Integrate embeddings and vector search databases to ground LLM reasoning and question answering'
    ],
    handsOnProjects: [
      'Enterprise Knowledge Base RAG Assistant with LangChain, ChromaDB, and Gemini API',
      'Custom PyTorch Neural Classifier with Transfer Learning and GPU Acceleration'
    ],
    toolsUsed: ['PyTorch', 'HuggingFace Transformers', 'LangChain', 'ChromaDB', 'Gemini API']
  }
];

// 22 realistic students across courses
export const initialStudents: Student[] = [
  {
    id: 'stu-101',
    fullName: 'Alexander Wright',
    rollNumber: 'CS2024-001',
    studentId: 'STU-2024-001',
    email: 'alexander.wright@student.apex.univ.edu',
    phone: '+1 (555) 111-2233',
    dateOfBirth: '2003-04-14',
    gender: 'Male',
    address: '42 University Boulevard, Apt 4B, Cambridge, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-102',
    fullName: 'Sophia Ramirez',
    rollNumber: 'CS2024-002',
    studentId: 'STU-2024-002',
    email: 'sophia.ramirez@student.apex.univ.edu',
    phone: '+1 (555) 222-3344',
    dateOfBirth: '2003-08-22',
    gender: 'Female',
    address: '118 Elm St, Boston, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-103',
    fullName: 'Ethan Zhang',
    rollNumber: 'CS2024-003',
    studentId: 'STU-2024-003',
    email: 'ethan.zhang@student.apex.univ.edu',
    phone: '+1 (555) 333-4455',
    dateOfBirth: '2004-01-19',
    gender: 'Male',
    address: '74 Harvard Way, Somerville, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-104',
    fullName: 'Aria Sharma',
    rollNumber: 'CS2024-004',
    studentId: 'STU-2024-004',
    email: 'aria.sharma@student.apex.univ.edu',
    phone: '+1 (555) 444-5566',
    dateOfBirth: '2003-11-05',
    gender: 'Female',
    address: '90 Commonwealth Ave, Boston, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-105',
    fullName: 'Lucas Bennett',
    rollNumber: 'CS2024-005',
    studentId: 'STU-2024-005',
    email: 'lucas.bennett@student.apex.univ.edu',
    phone: '+1 (555) 555-6677',
    dateOfBirth: '2003-06-30',
    gender: 'Male',
    address: '15 Beacon Street, Boston, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-106',
    fullName: 'Emma Kowalska',
    rollNumber: 'CS2024-006',
    studentId: 'STU-2024-006',
    email: 'emma.kowalska@student.apex.univ.edu',
    phone: '+1 (555) 666-7788',
    dateOfBirth: '2004-02-14',
    gender: 'Female',
    address: '33 Charles River Park, Cambridge, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-107',
    fullName: 'Marcus Aurelius Brooks',
    rollNumber: 'CS2024-007',
    studentId: 'STU-2024-007',
    email: 'marcus.brooks@student.apex.univ.edu',
    phone: '+1 (555) 777-8899',
    dateOfBirth: '2003-09-17',
    gender: 'Male',
    address: '201 Kendall Square, Cambridge, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-108',
    fullName: 'Olivia Taylor',
    rollNumber: 'CS2024-008',
    studentId: 'STU-2024-008',
    email: 'olivia.taylor@student.apex.univ.edu',
    phone: '+1 (555) 888-9900',
    dateOfBirth: '2003-12-03',
    gender: 'Female',
    address: '55 Massachusetts Ave, Boston, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-109',
    fullName: 'Daniel Kim',
    rollNumber: 'CS2024-009',
    studentId: 'STU-2024-009',
    email: 'daniel.kim@student.apex.univ.edu',
    phone: '+1 (555) 999-0011',
    dateOfBirth: '2004-03-25',
    gender: 'Male',
    address: '88 Prospect St, Cambridge, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-110',
    fullName: 'Chloe Dupont',
    rollNumber: 'CS2024-010',
    studentId: 'STU-2024-010',
    email: 'chloe.dupont@student.apex.univ.edu',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '2003-05-18',
    gender: 'Female',
    address: '14 Newbury St, Boston, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  // ECE students
  {
    id: 'stu-111',
    fullName: 'Rohan Verma',
    rollNumber: 'EC2024-001',
    studentId: 'STU-2024-011',
    email: 'rohan.verma@student.apex.univ.edu',
    phone: '+1 (555) 234-5671',
    dateOfBirth: '2003-07-12',
    gender: 'Male',
    address: '102 River Rd, Boston, MA',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-112',
    fullName: 'Ananya Deshmukh',
    rollNumber: 'EC2024-002',
    studentId: 'STU-2024-012',
    email: 'ananya.deshmukh@student.apex.univ.edu',
    phone: '+1 (555) 345-6782',
    dateOfBirth: '2003-10-29',
    gender: 'Female',
    address: '45 Tremont St, Boston, MA',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-113',
    fullName: 'Samuel O’Connor',
    rollNumber: 'EC2024-003',
    studentId: 'STU-2024-013',
    email: 'samuel.oconnor@student.apex.univ.edu',
    phone: '+1 (555) 456-7893',
    dateOfBirth: '2004-04-02',
    gender: 'Male',
    address: '89 Boylston St, Brookline, MA',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-114',
    fullName: 'Zoe Nakamura',
    rollNumber: 'EC2024-004',
    studentId: 'STU-2024-014',
    email: 'zoe.nakamura@student.apex.univ.edu',
    phone: '+1 (555) 567-8904',
    dateOfBirth: '2003-09-08',
    gender: 'Female',
    address: '61 Main St, Waltham, MA',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  // MECH students
  {
    id: 'stu-115',
    fullName: 'Liam Thorne',
    rollNumber: 'ME2024-001',
    studentId: 'STU-2024-015',
    email: 'liam.thorne@student.apex.univ.edu',
    phone: '+1 (555) 678-9015',
    dateOfBirth: '2004-05-20',
    gender: 'Male',
    address: '12 Harbor Point, Dorchester, MA',
    courseId: 'course-btech-mech',
    departmentId: 'dept-mech',
    semester: 4,
    academicYear: '2024-2028',
    admissionDate: '2024-08-12',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-116',
    fullName: 'Harper Lee Morales',
    rollNumber: 'ME2024-002',
    studentId: 'STU-2024-016',
    email: 'harper.morales@student.apex.univ.edu',
    phone: '+1 (555) 789-0126',
    dateOfBirth: '2004-08-11',
    gender: 'Female',
    address: '77 South St, Boston, MA',
    courseId: 'course-btech-mech',
    departmentId: 'dept-mech',
    semester: 4,
    academicYear: '2024-2028',
    admissionDate: '2024-08-12',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-117',
    fullName: 'Noah Al-Mansoor',
    rollNumber: 'ME2024-003',
    studentId: 'STU-2024-017',
    email: 'noah.almansoor@student.apex.univ.edu',
    phone: '+1 (555) 890-1237',
    dateOfBirth: '2004-01-09',
    gender: 'Male',
    address: '190 Huntington Ave, Boston, MA',
    courseId: 'course-btech-mech',
    departmentId: 'dept-mech',
    semester: 4,
    academicYear: '2024-2028',
    admissionDate: '2024-08-12',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  // MBA students
  {
    id: 'stu-118',
    fullName: 'Victoria Sterling',
    rollNumber: 'MB2025-001',
    studentId: 'STU-2025-018',
    email: 'victoria.sterling@student.apex.univ.edu',
    phone: '+1 (555) 901-2348',
    dateOfBirth: '2000-03-15',
    gender: 'Female',
    address: '300 Boylston St, Back Bay, Boston, MA',
    courseId: 'course-mba-tech',
    departmentId: 'dept-mgmt',
    semester: 2,
    academicYear: '2025-2027',
    admissionDate: '2025-01-15',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-119',
    fullName: 'Julian Alvarez',
    rollNumber: 'MB2025-002',
    studentId: 'STU-2025-019',
    email: 'julian.alvarez@student.apex.univ.edu',
    phone: '+1 (555) 012-3459',
    dateOfBirth: '1999-11-20',
    gender: 'Male',
    address: '88 Seaport Blvd, Boston, MA',
    courseId: 'course-mba-tech',
    departmentId: 'dept-mgmt',
    semester: 2,
    academicYear: '2025-2027',
    admissionDate: '2025-01-15',
    profilePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-120',
    fullName: 'Priya Sundaram',
    rollNumber: 'CS2024-011',
    studentId: 'STU-2024-020',
    email: 'priya.sundaram@student.apex.univ.edu',
    phone: '+1 (555) 321-6540',
    dateOfBirth: '2003-12-28',
    gender: 'Female',
    address: '15 Centre St, Cambridge, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-121',
    fullName: 'Jackson Miller',
    rollNumber: 'CS2024-012',
    studentId: 'STU-2024-021',
    email: 'jackson.miller@student.apex.univ.edu',
    phone: '+1 (555) 432-7651',
    dateOfBirth: '2004-03-01',
    gender: 'Male',
    address: '22 Dartmouth St, Boston, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  },
  {
    id: 'stu-122',
    fullName: 'Grace Hopper Vance',
    rollNumber: 'CS2024-013',
    studentId: 'STU-2024-022',
    email: 'grace.vance@student.apex.univ.edu',
    phone: '+1 (555) 543-8762',
    dateOfBirth: '2003-10-10',
    gender: 'Female',
    address: '17 Quincy St, Cambridge, MA',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    academicYear: '2023-2027',
    admissionDate: '2023-08-10',
    profilePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'Active'
  }
];

// Fee records for students with partial, full, and unpaid states
export const initialFees: StudentFeeRecord[] = [
  {
    id: 'fee-101',
    studentId: 'stu-101', // Alexander Wright
    academicYear: '2025-2026',
    semester: 6,
    totalFees: 80000,
    feesPaid: 60000,
    feesRemaining: 20000,
    paymentStatus: 'Partially Paid',
    dueDate: '2026-09-30',
    paymentHistory: [
      {
        id: 'pay-1',
        transactionRef: 'TXN-948102914',
        amount: 40000,
        paymentDate: '2026-01-15',
        paymentMethod: 'Net Banking',
        receiptNumber: 'RCP-2026-0041',
        academicYear: '2025-2026',
        semester: 6
      },
      {
        id: 'pay-2',
        transactionRef: 'TXN-950291845',
        amount: 20000,
        paymentDate: '2026-02-20',
        paymentMethod: 'UPI',
        receiptNumber: 'RCP-2026-0182',
        academicYear: '2025-2026',
        semester: 6
      }
    ]
  },
  {
    id: 'fee-102',
    studentId: 'stu-102', // Sophia Ramirez
    academicYear: '2025-2026',
    semester: 6,
    totalFees: 80000,
    feesPaid: 80000,
    feesRemaining: 0,
    paymentStatus: 'Fully Paid',
    dueDate: '2026-09-30',
    paymentHistory: [
      {
        id: 'pay-3',
        transactionRef: 'TXN-938201948',
        amount: 80000,
        paymentDate: '2026-01-10',
        paymentMethod: 'Credit Card',
        receiptNumber: 'RCP-2026-0012',
        academicYear: '2025-2026',
        semester: 6
      }
    ]
  },
  {
    id: 'fee-103',
    studentId: 'stu-103', // Ethan Zhang
    academicYear: '2025-2026',
    semester: 6,
    totalFees: 80000,
    feesPaid: 35000,
    feesRemaining: 45000,
    paymentStatus: 'Partially Paid',
    dueDate: '2026-09-30',
    paymentHistory: [
      {
        id: 'pay-4',
        transactionRef: 'TXN-928174629',
        amount: 35000,
        paymentDate: '2026-02-05',
        paymentMethod: 'Net Banking',
        receiptNumber: 'RCP-2026-0099',
        academicYear: '2025-2026',
        semester: 6
      }
    ]
  },
  {
    id: 'fee-104',
    studentId: 'stu-104', // Aria Sharma
    academicYear: '2025-2026',
    semester: 6,
    totalFees: 80000,
    feesPaid: 80000,
    feesRemaining: 0,
    paymentStatus: 'Fully Paid',
    dueDate: '2026-09-30',
    paymentHistory: [
      {
        id: 'pay-5',
        transactionRef: 'TXN-911827463',
        amount: 80000,
        paymentDate: '2026-01-12',
        paymentMethod: 'UPI',
        receiptNumber: 'RCP-2026-0023',
        academicYear: '2025-2026',
        semester: 6
      }
    ]
  },
  {
    id: 'fee-111',
    studentId: 'stu-111',
    academicYear: '2025-2026',
    semester: 6,
    totalFees: 75000,
    feesPaid: 50000,
    feesRemaining: 25000,
    paymentStatus: 'Partially Paid',
    dueDate: '2026-09-30',
    paymentHistory: [
      {
        id: 'pay-6',
        transactionRef: 'TXN-902817456',
        amount: 50000,
        paymentDate: '2026-01-18',
        paymentMethod: 'Net Banking',
        receiptNumber: 'RCP-2026-0067',
        academicYear: '2025-2026',
        semester: 6
      }
    ]
  },
  {
    id: 'fee-118',
    studentId: 'stu-118',
    academicYear: '2025-2026',
    semester: 2,
    totalFees: 120000,
    feesPaid: 120000,
    feesRemaining: 0,
    paymentStatus: 'Fully Paid',
    dueDate: '2026-09-30',
    paymentHistory: [
      {
        id: 'pay-7',
        transactionRef: 'TXN-893019284',
        amount: 120000,
        paymentDate: '2026-01-08',
        paymentMethod: 'Demand Draft',
        receiptNumber: 'RCP-2026-0005',
        academicYear: '2025-2026',
        semester: 2
      }
    ]
  }
];

// Pre-fill default fee records for remaining students if not found
for (const student of initialStudents) {
  if (!initialFees.some((f) => f.studentId === student.id)) {
    initialFees.push({
      id: `fee-${student.id}`,
      studentId: student.id,
      academicYear: '2025-2026',
      semester: student.semester,
      totalFees: 80000,
      feesPaid: 65000,
      feesRemaining: 15000,
      paymentStatus: 'Partially Paid',
      dueDate: '2026-09-30',
      paymentHistory: [
        {
          id: `pay-${student.id}-1`,
          transactionRef: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
          amount: 65000,
          paymentDate: '2026-01-20',
          paymentMethod: 'UPI',
          receiptNumber: `RCP-2026-${student.rollNumber}`,
          academicYear: '2025-2026',
          semester: student.semester
        }
      ]
    });
  }
}

// Student attendance records
export const initialAttendanceRecords: StudentAttendanceRecord[] = [
  // Alexander Wright attendance (CS401: 22 attended out of 24 = 91.7%, CS402: 18/21 = 85.7%, CS403: 15/20 = 75%, CS404: 21/23 = 91.3%)
  { id: 'att-1', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-25', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-25T10:00:00Z' },
  { id: 'att-2', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-26', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-26T10:00:00Z' },
  { id: 'att-3', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-27', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-27T10:00:00Z' },
  { id: 'att-4', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-28', status: 'Absent', markedByStaffId: 'staff-101', createdAt: '2026-08-28T10:00:00Z' },
  { id: 'att-5', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-09-01', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-09-01T10:00:00Z' },
  
  { id: 'att-6', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs402', date: '2026-08-25', status: 'Present', markedByStaffId: 'staff-103', createdAt: '2026-08-25T11:00:00Z' },
  { id: 'att-7', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs402', date: '2026-08-27', status: 'Late', markedByStaffId: 'staff-103', createdAt: '2026-08-27T11:00:00Z' },
  { id: 'att-8', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs402', date: '2026-08-29', status: 'Present', markedByStaffId: 'staff-103', createdAt: '2026-08-29T11:00:00Z' },
  
  { id: 'att-9', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs403', date: '2026-08-26', status: 'Absent', markedByStaffId: 'staff-104', createdAt: '2026-08-26T14:00:00Z' },
  { id: 'att-10', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs403', date: '2026-08-28', status: 'Present', markedByStaffId: 'staff-104', createdAt: '2026-08-28T14:00:00Z' },
  
  { id: 'att-11', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs404', date: '2026-08-25', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-25T15:00:00Z' },
  { id: 'att-12', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs404', date: '2026-08-27', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-27T15:00:00Z' },
  { id: 'att-13', studentId: 'stu-101', courseId: 'course-btech-cse', subjectId: 'sub-cs404', date: '2026-09-01', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-09-01T15:00:00Z' },

  // Sophia Ramirez attendance
  { id: 'att-14', studentId: 'stu-102', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-25', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-25T10:00:00Z' },
  { id: 'att-15', studentId: 'stu-102', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-26', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-26T10:00:00Z' },
  { id: 'att-16', studentId: 'stu-102', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-27', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-27T10:00:00Z' },
  { id: 'att-17', studentId: 'stu-102', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-28', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-28T10:00:00Z' },
  { id: 'att-18', studentId: 'stu-102', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-09-01', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-09-01T10:00:00Z' },

  // Ethan Zhang attendance
  { id: 'att-19', studentId: 'stu-103', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-25', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-08-25T10:00:00Z' },
  { id: 'att-20', studentId: 'stu-103', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-26', status: 'Absent', markedByStaffId: 'staff-101', createdAt: '2026-08-26T10:00:00Z' },
  { id: 'att-21', studentId: 'stu-103', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-27', status: 'Absent', markedByStaffId: 'staff-101', createdAt: '2026-08-27T10:00:00Z' },
  { id: 'att-22', studentId: 'stu-103', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-08-28', status: 'Late', markedByStaffId: 'staff-101', createdAt: '2026-08-28T10:00:00Z' },
  { id: 'att-23', studentId: 'stu-103', courseId: 'course-btech-cse', subjectId: 'sub-cs401', date: '2026-09-01', status: 'Present', markedByStaffId: 'staff-101', createdAt: '2026-09-01T10:00:00Z' }
];

// Seed subject baseline stats map for rich attendance calculations
export interface SubjectAttendanceStat {
  subjectId: string;
  totalClasses: number;
  attended: number;
  missed: number;
}

export const studentBaseAttendanceMap: Record<string, SubjectAttendanceStat[]> = {
  'stu-101': [
    { subjectId: 'sub-cs401', totalClasses: 32, attended: 29, missed: 3 }, // 90.6% -> Green
    { subjectId: 'sub-cs402', totalClasses: 30, attended: 26, missed: 4 }, // 86.6% -> Green
    { subjectId: 'sub-cs403', totalClasses: 28, attended: 22, missed: 6 }, // 78.5% -> Yellow
    { subjectId: 'sub-cs404', totalClasses: 32, attended: 30, missed: 2 }  // 93.7% -> Green
  ],
  'stu-102': [
    { subjectId: 'sub-cs401', totalClasses: 32, attended: 31, missed: 1 }, // 96.8%
    { subjectId: 'sub-cs402', totalClasses: 30, attended: 29, missed: 1 }, // 96.6%
    { subjectId: 'sub-cs403', totalClasses: 28, attended: 27, missed: 1 }, // 96.4%
    { subjectId: 'sub-cs404', totalClasses: 32, attended: 30, missed: 2 }  // 93.7%
  ],
  'stu-103': [
    { subjectId: 'sub-cs401', totalClasses: 32, attended: 21, missed: 11 }, // 65.6% -> Red (Warning)
    { subjectId: 'sub-cs402', totalClasses: 30, attended: 23, missed: 7 },  // 76.6% -> Yellow
    { subjectId: 'sub-cs403', totalClasses: 28, attended: 19, missed: 9 },  // 67.8% -> Red
    { subjectId: 'sub-cs404', totalClasses: 32, attended: 22, missed: 10 }  // 68.7% -> Red
  ]
};

// Staff own attendance records with Pending, Approved, and Rejected
export const initialStaffAttendance: StaffAttendanceRecord[] = [
  {
    id: 'stf-att-1',
    staffId: 'staff-101', // Dr. Alan Roberts
    date: '2026-09-02',
    checkInTime: '08:35 AM',
    checkOutTime: '05:15 PM',
    status: 'Present',
    submissionDate: '2026-09-02',
    approvalStatus: 'Pending',
    remarks: 'Regular academic lectures and thesis committee meeting.'
  },
  {
    id: 'stf-att-2',
    staffId: 'staff-101',
    date: '2026-09-01',
    checkInTime: '08:40 AM',
    checkOutTime: '05:00 PM',
    status: 'Present',
    submissionDate: '2026-09-01',
    approvalStatus: 'Approved',
    reviewedByAdminId: 'admin-1',
    remarks: 'Approved by Vice Dean of Academic Affairs.'
  },
  {
    id: 'stf-att-3',
    staffId: 'staff-102', // Dr. Maya Patel
    date: '2026-09-02',
    checkInTime: '08:50 AM',
    checkOutTime: '05:10 PM',
    status: 'Present',
    submissionDate: '2026-09-02',
    approvalStatus: 'Pending',
    remarks: 'VLSI lab supervision and student mentoring.'
  },
  {
    id: 'stf-att-4',
    staffId: 'staff-103', // Prof. David Chen
    date: '2026-09-02',
    checkInTime: '09:25 AM',
    checkOutTime: '05:00 PM',
    status: 'Late',
    submissionDate: '2026-09-02',
    approvalStatus: 'Pending',
    remarks: 'Transit delay on Red Line metro.'
  },
  {
    id: 'stf-att-5',
    staffId: 'staff-104', // Dr. Elena Rostova
    date: '2026-09-01',
    checkInTime: '11:15 AM',
    checkOutTime: '03:30 PM',
    status: 'Half-Day',
    submissionDate: '2026-09-01',
    approvalStatus: 'Approved',
    reviewedByAdminId: 'admin-1',
    remarks: 'Medical appointment excused.'
  },
  {
    id: 'stf-att-6',
    staffId: 'staff-105', // Dr. Marcus Vance
    date: '2026-08-31',
    checkInTime: '08:30 AM',
    checkOutTime: '04:30 PM',
    status: 'Present',
    submissionDate: '2026-08-31',
    approvalStatus: 'Rejected',
    reviewedByAdminId: 'admin-1',
    remarks: 'Missing laboratory log sheet documentation for the shift.'
  }
];

// Academic Results for students
export const initialResults: AcademicResult[] = [
  // Alexander Wright - Semester 5 Results
  {
    id: 'res-1',
    studentId: 'stu-101',
    subjectId: 'sub-cs401',
    semester: 5,
    academicYear: '2025-2026',
    internalMarks: 28, // /30
    externalMarks: 46, // /50
    practicalMarks: 19, // /20
    totalMarks: 93,
    grade: 'A+',
    gradePoints: 10,
    resultStatus: 'Pass',
    evaluatedByStaffId: 'staff-101',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'res-2',
    studentId: 'stu-101',
    subjectId: 'sub-cs402',
    semester: 5,
    academicYear: '2025-2026',
    internalMarks: 26,
    externalMarks: 44,
    practicalMarks: 18,
    totalMarks: 88,
    grade: 'A',
    gradePoints: 9,
    resultStatus: 'Pass',
    evaluatedByStaffId: 'staff-103',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'res-3',
    studentId: 'stu-101',
    subjectId: 'sub-cs403',
    semester: 5,
    academicYear: '2025-2026',
    internalMarks: 24,
    externalMarks: 40,
    practicalMarks: 17,
    totalMarks: 81,
    grade: 'B+',
    gradePoints: 8,
    resultStatus: 'Pass',
    evaluatedByStaffId: 'staff-104',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'res-4',
    studentId: 'stu-101',
    subjectId: 'sub-cs404',
    semester: 5,
    academicYear: '2025-2026',
    internalMarks: 29,
    externalMarks: 47,
    practicalMarks: 19,
    totalMarks: 95,
    grade: 'A+',
    gradePoints: 10,
    resultStatus: 'Pass',
    evaluatedByStaffId: 'staff-101',
    createdAt: '2026-01-20T10:00:00Z'
  },
  // Sophia Ramirez Results
  {
    id: 'res-5',
    studentId: 'stu-102',
    subjectId: 'sub-cs401',
    semester: 5,
    academicYear: '2025-2026',
    internalMarks: 29,
    externalMarks: 48,
    practicalMarks: 20,
    totalMarks: 97,
    grade: 'A+',
    gradePoints: 10,
    resultStatus: 'Pass',
    evaluatedByStaffId: 'staff-101',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'res-6',
    studentId: 'stu-102',
    subjectId: 'sub-cs402',
    semester: 5,
    academicYear: '2025-2026',
    internalMarks: 28,
    externalMarks: 46,
    practicalMarks: 19,
    totalMarks: 93,
    grade: 'A+',
    gradePoints: 10,
    resultStatus: 'Pass',
    evaluatedByStaffId: 'staff-103',
    createdAt: '2026-01-20T10:00:00Z'
  },
  // Ethan Zhang Results
  {
    id: 'res-7',
    studentId: 'stu-103',
    subjectId: 'sub-cs401',
    semester: 5,
    academicYear: '2025-2026',
    internalMarks: 20,
    externalMarks: 32,
    practicalMarks: 14,
    totalMarks: 66,
    grade: 'B',
    gradePoints: 7,
    resultStatus: 'Pass',
    evaluatedByStaffId: 'staff-101',
    createdAt: '2026-01-20T10:00:00Z'
  }
];

// Exams: Upcoming & Previous
export const initialExams: Exam[] = [
  {
    id: 'exam-1',
    examName: 'Java OOPs Concepts & Architecture Midterm Assessment',
    subjectId: 'sub-cs401',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    examDate: '2026-09-22',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    roomHall: 'Turing Lab 1',
    examType: 'Midterm',
    instructions: 'Comprehensive exam covering OOPs paradigms: classes, inheritance, encapsulation, abstraction, and polymorphism.',
    isPublished: true,
    createdByStaffId: 'staff-101'
  },
  {
    id: 'exam-2',
    examName: 'Java Multi-threading & Collections Practical Lab Examination',
    subjectId: 'sub-cs402',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    examDate: '2026-09-25',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    roomHall: 'Software Lab 3',
    examType: 'Practical',
    instructions: 'Hands-on practical coding test on Java concurrency, thread pools, and stream pipelines.',
    isPublished: true,
    createdByStaffId: 'staff-103'
  },
  {
    id: 'exam-3',
    examName: 'Spring Boot, Hibernate & JPA Module Review Test',
    subjectId: 'sub-cs404',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 6,
    examDate: '2026-09-28',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    roomHall: 'Main Lab Rm 204',
    examType: 'Theory',
    instructions: 'Comprehensive exam covering Spring IoC, RESTful controllers, and relational database persistence.',
    isPublished: true,
    createdByStaffId: 'staff-101'
  },
  {
    id: 'exam-4',
    examName: 'Digital Signal Processing Theory Exam',
    subjectId: 'sub-ec401',
    courseId: 'course-btech-ece',
    departmentId: 'dept-ece',
    semester: 6,
    examDate: '2026-09-20',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    roomHall: 'Maxwell Hall 101',
    examType: 'Theory',
    instructions: 'Fourier transform tables and standard mathematical formulae will be provided in booklet.',
    isPublished: true,
    createdByStaffId: 'staff-102'
  },
  // Past Exam
  {
    id: 'exam-prev-1',
    examName: 'Java OOPs & Core Architecture Comprehensive Evaluation',
    subjectId: 'sub-cs401',
    courseId: 'course-btech-cse',
    departmentId: 'dept-cse',
    semester: 5,
    examDate: '2025-12-18',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    roomHall: 'Auditorium Hall 1',
    examType: 'Final',
    instructions: 'Comprehensive module evaluation for Java OOPs and design patterns.',
    isPublished: true,
    createdByStaffId: 'staff-101'
  }
];

// Certificates
export const initialCertificates: Certificate[] = [
  {
    id: 'cert-1',
    certificateId: 'CERT-CSE-2025-089',
    studentId: 'stu-101', // Alexander Wright
    certificateTitle: 'Academic Excellence in Artificial Intelligence Algorithms',
    certificateType: 'Merit',
    issueDate: '2026-02-15',
    issuedByStaffId: 'staff-101',
    issuedByAdminName: 'Dean of Academic Affairs',
    description: 'Awarded for securing the highest score in the Advanced Artificial Intelligence and Neural Networks project presentation.',
    downloadUrl: '#'
  },
  {
    id: 'cert-2',
    certificateId: 'CERT-CSE-2025-042',
    studentId: 'stu-101', // Alexander Wright
    certificateTitle: 'Undergraduate Research Fellowship Completion',
    certificateType: 'Course Completion',
    issueDate: '2025-11-20',
    issuedByStaffId: 'staff-103',
    issuedByAdminName: 'Office of University Research',
    description: 'Successfully completed the 6-month specialized fellowship on Distributed Consensus Protocols.',
    downloadUrl: '#'
  },
  {
    id: 'cert-3',
    certificateId: 'CERT-CSE-2025-091',
    studentId: 'stu-102', // Sophia Ramirez
    certificateTitle: 'Dean’s Honor List — Semester V',
    certificateType: 'Merit',
    issueDate: '2026-02-15',
    issuedByStaffId: 'staff-101',
    issuedByAdminName: 'Dean of Academic Affairs',
    description: 'Achieved a perfect semester GPA of 10.0 in Computer Science & Engineering.',
    downloadUrl: '#'
  },
  {
    id: 'cert-4',
    certificateId: 'CERT-ECE-2025-033',
    studentId: 'stu-111', // Rohan Verma
    certificateTitle: 'Hardware Innovation & Embedded Robotics Certificate',
    certificateType: 'Appreciation',
    issueDate: '2026-01-18',
    issuedByStaffId: 'staff-102',
    issuedByAdminName: 'Director of Technology Transfer',
    description: 'Demonstrated outstanding ingenuity in microcontroller sensor integration during the Annual Tech Symposium.',
    downloadUrl: '#'
  }
];

// Notifications
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Midterm Exam Schedule Released',
    message: 'The schedule for Midterm Examinations starting September 18, 2026 has been published. Please check room allocations and seat matrices.',
    targetRole: 'student',
    type: 'exam',
    priority: 'important',
    status: 'active',
    createdAt: '2026-09-01T09:30:00Z',
    isRead: false,
    senderName: 'Apex Classes Administration',
    sender: 'Apex Classes Administration',
    senderRole: 'admin'
  },
  {
    id: 'notif-2',
    title: 'Tuition Fee Payment Reminder',
    message: 'Second installment for Academic Year 2025-2026 is due on September 30, 2026. Avoid late processing charges by completing clearance online.',
    targetRole: 'student',
    type: 'fee',
    priority: 'normal',
    status: 'active',
    createdAt: '2026-08-30T14:15:00Z',
    isRead: false,
    senderName: 'Apex Classes Accounts Office',
    sender: 'Apex Classes Accounts Office',
    senderRole: 'admin'
  },
  {
    id: 'notif-3',
    title: 'Staff Daily Attendance Pending Verification',
    message: '3 faculty attendance submissions require Administrative review and confirmation in the Staff Attendance Approval portal.',
    targetRole: 'admin',
    type: 'approval',
    priority: 'important',
    status: 'active',
    createdAt: '2026-09-02T09:00:00Z',
    isRead: false,
    senderName: 'Automated HR Engine',
    sender: 'Automated HR Engine',
    senderRole: 'admin'
  },
  {
    id: 'notif-4',
    title: 'Submission of Internal Marks for Semester VI',
    message: 'All faculty members are requested to upload continuous internal assessment marks before September 25.',
    targetRole: 'staff',
    type: 'announcement',
    priority: 'important',
    status: 'active',
    createdAt: '2026-08-31T11:00:00Z',
    isRead: false,
    senderName: 'Apex Academic Director',
    sender: 'Apex Academic Director',
    senderRole: 'admin'
  },
  {
    id: 'notif-5',
    title: 'Campus Network Maintenance Notice',
    message: 'Central campus fiber gateway will undergo scheduled maintenance on Saturday between 02:00 AM and 05:00 AM.',
    targetRole: 'all',
    type: 'announcement',
    priority: 'normal',
    status: 'active',
    createdAt: '2026-09-02T08:00:00Z',
    isRead: true,
    senderName: 'Apex Portal IT Support',
    sender: 'Apex Portal IT Support',
    senderRole: 'admin'
  },
  {
    id: 'notif-6',
    title: 'CS401 Advanced Algorithms Lab Session Rescheduled',
    message: 'The laboratory practical for CS401 will now be conducted in Turing Hall Lab 3 on Thursday at 2:00 PM instead of Wednesday.',
    targetRole: 'student',
    type: 'announcement',
    priority: 'important',
    status: 'active',
    createdAt: '2026-09-02T10:15:00Z',
    isRead: false,
    senderName: 'Dr. Alan Roberts',
    sender: 'Dr. Alan Roberts (Dept. of Computer Science & Engineering)',
    senderId: 'staff-101',
    senderRole: 'staff'
  },
  {
    id: 'notif-7',
    title: 'Guest Lecture on Quantum Cryptography',
    message: 'Guest seminar scheduled for Friday afternoon has been called off due to international flight delays. Make-up schedule will be announced.',
    targetRole: 'student',
    type: 'announcement',
    priority: 'normal',
    status: 'cancelled',
    cancelledAt: '2026-09-02T11:30:00Z',
    cancelledBy: 'Dr. Alan Roberts',
    cancellationReason: 'Guest speaker itinerary conflict / flight delay',
    createdAt: '2026-08-29T16:00:00Z',
    isRead: false,
    senderName: 'Dr. Alan Roberts',
    sender: 'Dr. Alan Roberts',
    senderId: 'staff-101',
    senderRole: 'staff'
  }
];
