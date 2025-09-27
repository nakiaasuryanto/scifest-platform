// Valid user credentials for the exam platform
export const validCredentials = [
  {
    email: "admin@exam.com",
    password: "admin123",
    name: "Administrator",
    role: "admin"
  },
  {
    email: "student@exam.com",
    password: "student123",
    name: "Student User",
    role: "student"
  },
  {
    email: "student2@exam.com",
    password: "student123",
    name: "John Doe",
    role: "student"
  },
  {
    email: "student3@exam.com",
    password: "student123",
    name: "Jane Smith",
    role: "student"
  }
]

export const validateCredentials = (email: string, password: string) => {
  return validCredentials.find(
    cred => cred.email === email && cred.password === password
  )
}

// Student data for admin dashboard
export const studentData = [
  {
    id: 1,
    name: "Student User",
    email: "student@exam.com",
    examStatus: "Not Started",
    lastLogin: "2024-01-15 10:30",
    score: null
  },
  {
    id: 2,
    name: "John Doe",
    email: "student2@exam.com",
    examStatus: "In Progress",
    lastLogin: "2024-01-15 09:15",
    score: null
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "student3@exam.com",
    examStatus: "Completed",
    lastLogin: "2024-01-14 14:20",
    score: 85
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "student4@exam.com",
    examStatus: "Completed",
    lastLogin: "2024-01-14 11:45",
    score: 92
  },
  {
    id: 5,
    name: "Sarah Wilson",
    email: "student5@exam.com",
    examStatus: "Not Started",
    lastLogin: "2024-01-13 16:30",
    score: null
  }
]