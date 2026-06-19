export const jobs = [
  {
    id: 1,
    title: "Java Backend Developer",
    company: "TechCorp Pune",
    location: "Pune, Maharashtra",
    salary: "3-5 LPA",
    experience: "0-1 years",
    skills: ["Java", "MySQL", "Servlets", "JDBC"],
    description: "Looking for a fresher Java developer with strong OOP concepts and knowledge of MySQL.",
    postedDate: "2025-04-20",
    recruiterId: 2
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Infosys",
    location: "Bangalore",
    salary: "4-6 LPA",
    experience: "0-2 years",
    skills: ["React", "Java", "Spring Boot", "MySQL"],
    description: "Join our dynamic team building enterprise applications.",
    postedDate: "2025-04-18",
    recruiterId: 3
  },
  {
    id: 3,
    title: "React Frontend Developer",
    company: "Wipro",
    location: "Hyderabad",
    salary: "3-4 LPA",
    experience: "0-1 years",
    skills: ["React", "JavaScript", "CSS", "HTML"],
    description: "Build modern UI components for our enterprise clients.",
    postedDate: "2025-04-15",
    recruiterId: 4
  },
  {
    id: 4,
    title: "SQL Database Developer",
    company: "TCS",
    location: "Mumbai",
    salary: "3-5 LPA",
    experience: "0-2 years",
    skills: ["SQL", "PL/SQL", "MySQL", "Oracle"],
    description: "Work on database design and optimization for large-scale systems.",
    postedDate: "2025-04-10",
    recruiterId: 5
  },
  {
    id: 5,
    title: "Spring Boot Developer",
    company: "HCL Technologies",
    location: "Pune, Maharashtra",
    salary: "5-7 LPA",
    experience: "1-2 years",
    skills: ["Spring Boot", "Java", "REST API", "MySQL"],
    description: "Develop and maintain REST APIs for our banking clients.",
    postedDate: "2025-04-08",
    recruiterId: 6
  }
]

export const users = [
  {
    id: 1,
    name: "Satyajit Redekar",
    email: "satyajit@gmail.com",
    password: "1234",
    role: "JOBSEEKER"
  },
  {
    id: 2,
    name: "HR Manager",
    email: "hr@techcorp.com",
    password: "1234",
    role: "RECRUITER"
  }
]

export const applications = [
  {
    id: 1,
    userId: 1,
    jobId: 1,
    status: "APPLIED",
    appliedDate: "2025-04-21"
  }
]