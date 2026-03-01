export interface Center {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  plan: string;
  planExpiry: string;
  totalStudents: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'moderator' | 'teacher';
  centerId: string;
  avatar: string;
  subject?: string;
  email?: string;
  studentsManaged?: number;
  lastActive?: string;
  studentCount?: number;
  courseCount?: number;
  assignedTeachers?: string[]; // for moderators: teacher IDs they manage
}

export interface Student {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  parentPhone: string;
  centerId: string;
  joinedDate: string;
  enrolledTeachers: string[];
  subjects: string[];
  avatar: string;
  educationLevel: string;
  avgScore: number;
  missingDays: number;
}

export interface Subject {
  id: string;
  title: string;
  teacherId: string;
  centerId: string;
  academicLevel: 'Primary' | 'Preparatory' | 'Secondary';
  academicYear: string;
  lessonCount: number;
  studentCount: number;
}

export interface Course {
  id: string;
  title: string;
  teacherId: string;
  centerId: string;
  year: number;
  lessonCount: number;
  studentCount: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  avgProgress: number;
  avgViews: number;
  homeworkSubmitted: string;
  entryTest: 'N/A' | 'Configured';
  maxViews: number;
  availabilityDays: number;
}

export interface LessonStudentStat {
  studentId: string;
  studentName: string;
  viewsUsed: number;
  maxViews: number;
  progress: number;
  lastWatched: string;
  entryTest: string;
  entryTestScore?: number;
  homework: string;
  homeworkGrade?: number;
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  icon: string;
}

export interface ViewExtensionRequest {
  id: string;
  studentName: string;
  lesson: string;
  viewsUsed: string;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

export interface TestUnlockRequest {
  id: string;
  studentName: string;
  lesson: string;
  attempts: string;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

// Centers
export const centers: Center[] = [
  { id: 'alnour', name: 'Al-Nour Educational Center', address: '15 Tahrir Street, Cairo', email: 'info@alnour.edu', phone: '+20 2 1234 5678', plan: 'Professional', planExpiry: '2026-12-31', totalStudents: 248 },
  { id: 'brightminds', name: 'Bright Minds Academy', address: '42 Dokki Road, Giza', email: 'info@brightminds.edu', phone: '+20 2 9876 5432', plan: 'Standard', planExpiry: '2026-06-30', totalStudents: 134 },
  { id: 'cairouniv', name: 'Cairo University Training Hub', address: 'Cairo University Campus', email: 'training@cu.edu.eg', phone: '+20 2 5555 1234', plan: 'Enterprise', planExpiry: '2027-01-15', totalStudents: 312 },
  { id: 'futurestars', name: 'Future Stars Nursery', address: '8 Garden City, Cairo', email: 'hello@futurestars.edu', phone: '+20 2 3333 4444', plan: 'Basic', planExpiry: '2026-09-01', totalStudents: 67 },
];

// Users
export const users: User[] = [
  // Al-Nour
  { id: 'u1', name: 'Ahmed Fouad', username: 'admin@alnour', password: 'admin123', role: 'admin', centerId: 'alnour', avatar: 'AF' },
  { id: 'u2', name: 'Nadia Mostafa', username: 'nadia.moderator', password: 'mod123', role: 'moderator', centerId: 'alnour', avatar: 'NM', studentsManaged: 87, lastActive: 'Today', assignedTeachers: ['u6', 'u7', 'u8'] },
  { id: 'u3', name: 'Hany Fawzy', username: 'hany.mod', password: 'mod123', role: 'moderator', centerId: 'alnour', avatar: 'HF', studentsManaged: 61, lastActive: 'Yesterday', assignedTeachers: ['u6', 'u9'] },
  { id: 'u4', name: 'Rania Adel', username: 'rania.mod', password: 'mod123', role: 'moderator', centerId: 'alnour', avatar: 'RA', studentsManaged: 54, lastActive: '3 days ago', assignedTeachers: ['u7', 'u10'] },
  { id: 'u5', name: 'Sherif Nabil', username: 'sherif.mod', password: 'mod123', role: 'moderator', centerId: 'alnour', avatar: 'SN', studentsManaged: 46, lastActive: '1 week ago', assignedTeachers: ['u8'] },
  { id: 'u6', name: 'Dr. Ahmed Hassan', username: 'dr.ahmed', password: 'teach123', role: 'teacher', centerId: 'alnour', avatar: 'AH', subject: 'Mathematics', studentCount: 18, courseCount: 3, email: 'ahmed.hassan@alnour.edu' },
  { id: 'u7', name: 'Ms. Sara Khaled', username: 'ms.sara', password: 'teach123', role: 'teacher', centerId: 'alnour', avatar: 'SK', subject: 'Physics', studentCount: 12, courseCount: 2, email: 'sara.khaled@alnour.edu' },
  { id: 'u8', name: 'Mr. Omar Youssef', username: 'mr.omar', password: 'teach123', role: 'teacher', centerId: 'alnour', avatar: 'OY', subject: 'Chemistry', studentCount: 9, courseCount: 2, email: 'omar.youssef@alnour.edu' },
  { id: 'u9', name: 'Ms. Layla Mahmoud', username: 'ms.layla', password: 'teach123', role: 'teacher', centerId: 'alnour', avatar: 'LM', subject: 'English', studentCount: 7, courseCount: 1, email: 'layla.mahmoud@alnour.edu' },
  { id: 'u10', name: 'Dr. Karim Saleh', username: 'dr.karim', password: 'teach123', role: 'teacher', centerId: 'alnour', avatar: 'KS', subject: 'Biology', studentCount: 6, courseCount: 1, email: 'karim.saleh@alnour.edu' },
  // Bright Minds
  { id: 'u11', name: 'Mariam Tawfik', username: 'admin@brightminds', password: 'admin123', role: 'admin', centerId: 'brightminds', avatar: 'MT' },
  { id: 'u12', name: 'Sara Nour', username: 'sara.mod', password: 'mod123', role: 'moderator', centerId: 'brightminds', avatar: 'SN', studentsManaged: 72, lastActive: 'Today', assignedTeachers: ['u14', 'u15'] },
  { id: 'u13', name: 'Tarek Adel', username: 'tarek.mod', password: 'mod123', role: 'moderator', centerId: 'brightminds', avatar: 'TA', studentsManaged: 62, lastActive: 'Yesterday', assignedTeachers: ['u14'] },
  { id: 'u14', name: 'Ms. Layla Farouk', username: 'ms.layla', password: 'teach123', role: 'teacher', centerId: 'brightminds', avatar: 'LF', subject: 'Mathematics', studentCount: 45, courseCount: 3 },
  { id: 'u15', name: 'Mr. Bassem Samir', username: 'mr.bassem', password: 'teach123', role: 'teacher', centerId: 'brightminds', avatar: 'BS', subject: 'Science', studentCount: 38, courseCount: 2 },
  // Cairo Univ
  { id: 'u16', name: 'Prof. Khaled Mansour', username: 'admin@cairouniv', password: 'admin123', role: 'admin', centerId: 'cairouniv', avatar: 'KM' },
  { id: 'u17', name: 'Dr. Rania Mostafa', username: 'dr.rania', password: 'teach123', role: 'teacher', centerId: 'cairouniv', avatar: 'RM', subject: 'Engineering', studentCount: 156, courseCount: 5 },
  { id: 'u18', name: 'Dr. Wael Saeed', username: 'dr.wael', password: 'teach123', role: 'teacher', centerId: 'cairouniv', avatar: 'WS', subject: 'IT', studentCount: 134, courseCount: 4 },
  // Future Stars
  { id: 'u19', name: 'Heba Gamal', username: 'admin@futurestars', password: 'admin123', role: 'admin', centerId: 'futurestars', avatar: 'HG' },
  { id: 'u20', name: 'Dina Ramzy', username: 'dina.mod', password: 'mod123', role: 'moderator', centerId: 'futurestars', avatar: 'DR', studentsManaged: 67, lastActive: 'Today', assignedTeachers: ['u21'] },
  { id: 'u21', name: 'Ms. Aya Sherif', username: 'ms.aya', password: 'teach123', role: 'teacher', centerId: 'futurestars', avatar: 'AS', subject: 'Early Learning', studentCount: 67, courseCount: 2 },
];

// Students (Al-Nour primarily)
export const students: Student[] = [
  { id: 's1', name: 'Ali Mohamed', username: 'ali.mohamed.2026', email: 'ali@student.edu', phone: '+20 10 1111 1111', parentPhone: '+20 12 1111 0000', centerId: 'alnour', joinedDate: 'Jan 15, 2026', enrolledTeachers: ['u6', 'u7'], subjects: ['Mathematics', 'Physics'], avatar: 'AM', educationLevel: 'Secondary', avgScore: 82, missingDays: 3 },
  { id: 's2', name: 'Fatma Ibrahim', username: 'fatma.ibrahim.2026', email: 'fatma@student.edu', phone: '+20 10 2222 2222', parentPhone: '+20 12 2222 0000', centerId: 'alnour', joinedDate: 'Jan 18, 2026', enrolledTeachers: ['u6'], subjects: ['Mathematics'], avatar: 'FI', educationLevel: 'Secondary', avgScore: 88, missingDays: 1 },
  { id: 's3', name: 'Youssef Samir', username: 'youssef.samir.2026', email: 'youssef@student.edu', phone: '+20 10 3333 3333', parentPhone: '+20 12 3333 0000', centerId: 'alnour', joinedDate: 'Jan 20, 2026', enrolledTeachers: ['u7', 'u8'], subjects: ['Physics', 'Chemistry'], avatar: 'YS', educationLevel: 'Preparatory', avgScore: 71, missingDays: 5 },
  { id: 's4', name: 'Nour Ahmed', username: 'nour.ahmed.2026', email: 'nour@student.edu', phone: '+20 10 4444 4444', parentPhone: '+20 12 4444 0000', centerId: 'alnour', joinedDate: 'Feb 1, 2026', enrolledTeachers: ['u6'], subjects: ['Mathematics'], avatar: 'NA', educationLevel: 'Primary', avgScore: 75, missingDays: 2 },
  { id: 's5', name: 'Mona Hassan', username: 'mona.hassan.2026', email: 'mona@student.edu', phone: '+20 10 5555 5555', parentPhone: '+20 12 5555 0000', centerId: 'alnour', joinedDate: 'Feb 3, 2026', enrolledTeachers: ['u8'], subjects: ['Chemistry'], avatar: 'MH', educationLevel: 'Secondary', avgScore: 79, missingDays: 0 },
  { id: 's6', name: 'Khaled Omar', username: 'khaled.omar.2026', email: 'khaled@student.edu', phone: '+20 10 6666 6666', parentPhone: '+20 12 6666 0000', centerId: 'alnour', joinedDate: 'Feb 5, 2026', enrolledTeachers: ['u6', 'u7', 'u8'], subjects: ['Mathematics', 'Physics', 'Chemistry'], avatar: 'KO', educationLevel: 'Preparatory', avgScore: 85, missingDays: 4 },
  { id: 's7', name: 'Dina Saad', username: 'dina.saad.2026', email: 'dina@student.edu', phone: '+20 10 7777 7777', parentPhone: '+20 12 7777 0000', centerId: 'alnour', joinedDate: 'Feb 8, 2026', enrolledTeachers: ['u7'], subjects: ['Physics'], avatar: 'DS', educationLevel: 'Primary', avgScore: 67, missingDays: 6 },
  { id: 's8', name: 'Tarek Hosny', username: 'tarek.hosny.2026', email: 'tarek@student.edu', phone: '+20 10 8888 8888', parentPhone: '+20 12 8888 0000', centerId: 'alnour', joinedDate: 'Feb 10, 2026', enrolledTeachers: ['u6'], subjects: ['Mathematics'], avatar: 'TH', educationLevel: 'Secondary', avgScore: 55, missingDays: 8 },
  { id: 's9', name: 'Salma Adel', username: 'salma.adel.2026', email: 'salma@student.edu', phone: '+20 10 9999 0000', parentPhone: '+20 12 9999 0000', centerId: 'alnour', joinedDate: 'Feb 12, 2026', enrolledTeachers: ['u9'], subjects: ['English'], avatar: 'SA', educationLevel: 'Preparatory', avgScore: 90, missingDays: 1 },
  { id: 's10', name: 'Hassan Magdy', username: 'hassan.magdy.2026', email: 'hassan@student.edu', phone: '+20 10 0000 1111', parentPhone: '+20 12 0000 1111', centerId: 'alnour', joinedDate: 'Feb 15, 2026', enrolledTeachers: ['u6', 'u10'], subjects: ['Mathematics', 'Biology'], avatar: 'HM', educationLevel: 'Primary', avgScore: 68, missingDays: 3 },
];

// Subjects (new - grouped by academic level)
export const subjects: Subject[] = [
  { id: 'sub1', title: 'Mathematics', teacherId: 'u6', centerId: 'alnour', academicLevel: 'Primary', academicYear: '4', lessonCount: 6, studentCount: 12 },
  { id: 'sub2', title: 'Mathematics', teacherId: 'u6', centerId: 'alnour', academicLevel: 'Preparatory', academicYear: '1st', lessonCount: 4, studentCount: 22 },
  { id: 'sub3', title: 'Mathematics', teacherId: 'u6', centerId: 'alnour', academicLevel: 'Secondary', academicYear: '1st', lessonCount: 5, studentCount: 34 },
  { id: 'sub4', title: 'Physics', teacherId: 'u7', centerId: 'alnour', academicLevel: 'Preparatory', academicYear: '2nd', lessonCount: 4, studentCount: 28 },
  { id: 'sub5', title: 'Physics', teacherId: 'u7', centerId: 'alnour', academicLevel: 'Secondary', academicYear: '1st', lessonCount: 3, studentCount: 20 },
  { id: 'sub6', title: 'Chemistry', teacherId: 'u8', centerId: 'alnour', academicLevel: 'Secondary', academicYear: '2nd', lessonCount: 4, studentCount: 25 },
  { id: 'sub7', title: 'Chemistry', teacherId: 'u8', centerId: 'alnour', academicLevel: 'Preparatory', academicYear: '3rd', lessonCount: 3, studentCount: 18 },
  { id: 'sub8', title: 'English', teacherId: 'u9', centerId: 'alnour', academicLevel: 'Primary', academicYear: '5', lessonCount: 6, studentCount: 30 },
  { id: 'sub9', title: 'Biology', teacherId: 'u10', centerId: 'alnour', academicLevel: 'Secondary', academicYear: '3rd', lessonCount: 4, studentCount: 15 },
];

// Courses (kept for backward compatibility / course detail)
export const courses: Course[] = [
  { id: 'c1', title: 'Mathematics — Year 1', teacherId: 'u6', centerId: 'alnour', year: 1, lessonCount: 4, studentCount: 34 },
  { id: 'c2', title: 'Mathematics — Year 2', teacherId: 'u6', centerId: 'alnour', year: 2, lessonCount: 5, studentCount: 22 },
  { id: 'c3', title: 'Mathematics — Year 3', teacherId: 'u6', centerId: 'alnour', year: 3, lessonCount: 3, studentCount: 18 },
  { id: 'c4', title: 'Physics — Year 1', teacherId: 'u7', centerId: 'alnour', year: 1, lessonCount: 4, studentCount: 28 },
  { id: 'c5', title: 'Physics — Year 2', teacherId: 'u7', centerId: 'alnour', year: 2, lessonCount: 3, studentCount: 20 },
  { id: 'c6', title: 'Chemistry — Year 1', teacherId: 'u8', centerId: 'alnour', year: 1, lessonCount: 4, studentCount: 25 },
  { id: 'c7', title: 'Chemistry — Year 2', teacherId: 'u8', centerId: 'alnour', year: 2, lessonCount: 3, studentCount: 18 },
  { id: 'c8', title: 'English — Year 1', teacherId: 'u9', centerId: 'alnour', year: 1, lessonCount: 6, studentCount: 30 },
  { id: 'c9', title: 'Biology — Year 1', teacherId: 'u10', centerId: 'alnour', year: 1, lessonCount: 4, studentCount: 15 },
];

// Lessons for Math Year 1 (c1) / sub3
export const lessons: Lesson[] = [
  { id: 'l1', courseId: 'c1', order: 1, title: 'Introduction to Algebra', avgProgress: 91, avgViews: 3.2, homeworkSubmitted: '28/34', entryTest: 'N/A', maxViews: 5, availabilityDays: 14 },
  { id: 'l2', courseId: 'c1', order: 2, title: 'Linear Equations', avgProgress: 78, avgViews: 2.8, homeworkSubmitted: '21/34', entryTest: 'Configured', maxViews: 5, availabilityDays: 14 },
  { id: 'l3', courseId: 'c1', order: 3, title: 'Quadratic Equations', avgProgress: 45, avgViews: 1.9, homeworkSubmitted: '12/34', entryTest: 'Configured', maxViews: 5, availabilityDays: 14 },
  { id: 'l4', courseId: 'c1', order: 4, title: 'Functions & Graphs', avgProgress: 12, avgViews: 1.1, homeworkSubmitted: '3/34', entryTest: 'Configured', maxViews: 5, availabilityDays: 14 },
];

// Also map lessons to subjects
export const subjectLessons: Record<string, Lesson[]> = {
  'sub3': lessons, // Secondary Math 1st year uses same lessons
};

// Lesson student stats for Lesson 3
export const lessonStats: LessonStudentStat[] = [
  { studentId: 's1', studentName: 'Ali Mohamed', viewsUsed: 4, maxViews: 5, progress: 87, lastWatched: 'Today', entryTest: 'Passed', entryTestScore: 82, homework: 'Submitted' },
  { studentId: 's2', studentName: 'Fatma Ibrahim', viewsUsed: 5, maxViews: 5, progress: 100, lastWatched: 'Yesterday', entryTest: 'Passed', entryTestScore: 91, homework: 'Graded', homeworkGrade: 88 },
  { studentId: 's3', studentName: 'Youssef Samir', viewsUsed: 2, maxViews: 5, progress: 45, lastWatched: '3 days ago', entryTest: 'Failed', entryTestScore: 48, homework: 'Not submitted' },
  { studentId: 's4', studentName: 'Nour Ahmed', viewsUsed: 3, maxViews: 5, progress: 67, lastWatched: '2 days ago', entryTest: 'Pending', homework: 'Submitted' },
  { studentId: 's6', studentName: 'Khaled Omar', viewsUsed: 5, maxViews: 5, progress: 100, lastWatched: 'Today', entryTest: 'Passed', entryTestScore: 76, homework: 'Graded', homeworkGrade: 92 },
];

// Activity feed
export const adminActivities: ActivityItem[] = [
  { id: 'a1', text: 'Moderator Nadia registered student Ali Mohamed', time: '2 hours ago', icon: 'user-plus' },
  { id: 'a2', text: 'Teacher Dr. Ahmed uploaded new lesson: Quadratic Equations', time: '5 hours ago', icon: 'book-open' },
  { id: 'a3', text: 'Student Youssef Samir passed entry test for Lesson 3', time: 'Yesterday', icon: 'check-circle' },
  { id: 'a4', text: 'New teacher Ms. Sara Khaled added', time: '2 days ago', icon: 'user-plus' },
  { id: 'a5', text: 'Student Fatma Ibrahim requested view extension', time: '2 days ago', icon: 'eye' },
  { id: 'a6', text: 'Moderator Sara created 3 new student accounts', time: '3 days ago', icon: 'users' },
];

export const moderatorActivities: ActivityItem[] = [
  { id: 'ma1', text: 'Registered student Ali Mohamed', time: '2 hours ago', icon: 'user-plus' },
  { id: 'ma2', text: 'Assigned Dr. Ahmed Hassan to Fatma Ibrahim', time: '4 hours ago', icon: 'link' },
  { id: 'ma3', text: 'Updated student Youssef Samir profile', time: 'Yesterday', icon: 'edit' },
  { id: 'ma4', text: 'Created 3 new student accounts', time: '2 days ago', icon: 'users' },
  { id: 'ma5', text: 'Deactivated student Tarek Hosny', time: '3 days ago', icon: 'user-x' },
  { id: 'ma6', text: 'Enrolled Nour Ahmed with Dr. Ahmed', time: '4 days ago', icon: 'user-plus' },
];

// View Extension Requests
export const viewExtensionRequests: ViewExtensionRequest[] = [
  { id: 'ver1', studentName: 'Fatma Ibrahim', lesson: 'Quadratic Equations', viewsUsed: '5/5', reason: 'Need to review before exam', date: 'Today', status: 'Pending' },
  { id: 'ver2', studentName: 'Khaled Omar', lesson: 'Quadratic Equations', viewsUsed: '5/5', reason: "Didn't fully understand topic", date: 'Today', status: 'Pending' },
  { id: 'ver3', studentName: 'Ali Mohamed', lesson: 'Linear Equations', viewsUsed: '5/5', reason: 'Preparing for test', date: 'Yesterday', status: 'Pending' },
  { id: 'ver4', studentName: 'Nour Ahmed', lesson: 'Introduction to Algebra', viewsUsed: '5/5', reason: 'Want to take better notes', date: 'Yesterday', status: 'Pending' },
  { id: 'ver5', studentName: 'Mona Hassan', lesson: 'Linear Equations', viewsUsed: '5/5', reason: 'Missed some parts', date: '2 days ago', status: 'Pending' },
];

export const testUnlockRequests: TestUnlockRequest[] = [
  { id: 'tur1', studentName: 'Youssef Samir', lesson: 'Quadratic Equations', attempts: '3/3', reason: 'Failed all attempts, studied more', date: 'Today', status: 'Pending' },
  { id: 'tur2', studentName: 'Dina Saad', lesson: 'Linear Equations', attempts: '3/3', reason: 'Technical issue during last attempt', date: 'Yesterday', status: 'Pending' },
];

// Chart data
export const enrollmentBySubject = [
  { subject: 'Math', students: 68 },
  { subject: 'Physics', students: 48 },
  { subject: 'Chemistry', students: 43 },
  { subject: 'Biology', students: 21 },
  { subject: 'English', students: 37 },
];

export const monthlyEnrollments = [
  { month: 'Mar', count: 12 }, { month: 'Apr', count: 18 }, { month: 'May', count: 24 },
  { month: 'Jun', count: 15 }, { month: 'Jul', count: 8 }, { month: 'Aug', count: 5 },
  { month: 'Sep', count: 32 }, { month: 'Oct', count: 28 }, { month: 'Nov', count: 22 },
  { month: 'Dec', count: 16 }, { month: 'Jan', count: 38 }, { month: 'Feb', count: 30 },
];

export const studentsPerTeacher = [
  { name: 'Dr. Ahmed', value: 18 },
  { name: 'Ms. Sara', value: 12 },
  { name: 'Mr. Omar', value: 9 },
  { name: 'Ms. Layla', value: 7 },
  { name: 'Dr. Karim', value: 6 },
];

export const subjectPassRates = [
  { subject: 'Mathematics', teachers: [
    { name: 'Dr. Ahmed Hassan', enrolled: 68, passed: 52, rate: 76 },
  ]},
  { subject: 'Physics', teachers: [
    { name: 'Ms. Sara Khaled', enrolled: 48, passed: 38, rate: 79 },
  ]},
  { subject: 'Chemistry', teachers: [
    { name: 'Mr. Omar Youssef', enrolled: 43, passed: 35, rate: 81 },
  ]},
  { subject: 'English', teachers: [
    { name: 'Ms. Layla Mahmoud', enrolled: 37, passed: 31, rate: 84 },
  ]},
  { subject: 'Biology', teachers: [
    { name: 'Dr. Karim Saleh', enrolled: 21, passed: 14, rate: 67 },
  ]},
];

export const studentActivityData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  lessons: Math.floor(Math.random() * 40) + 10,
}));

export const homeworkSubmissions = [
  { studentName: 'Ali Mohamed', lesson: 'Quadratic Equations', time: '2 hours ago', status: 'Submitted' as const },
  { studentName: 'Nour Ahmed', lesson: 'Linear Equations', time: '4 hours ago', status: 'Submitted' as const },
  { studentName: 'Fatma Ibrahim', lesson: 'Functions & Graphs', time: 'Yesterday', status: 'Submitted' as const },
  { studentName: 'Khaled Omar', lesson: 'Quadratic Equations', time: 'Yesterday', status: 'Submitted' as const },
  { studentName: 'Mona Hassan', lesson: 'Introduction to Algebra', time: '2 days ago', status: 'Submitted' as const },
];

// Student progress for teacher view
export const studentLessonProgress = [
  { lessonId: 'l1', lessonTitle: '1 - Intro to Algebra', watchPercent: 100, viewsUsed: 3, maxViews: 5, entryTestScore: null, result: 'Completed', homeworkGrade: 88 },
  { lessonId: 'l2', lessonTitle: '2 - Linear Equations', watchPercent: 100, viewsUsed: 2, maxViews: 5, entryTestScore: 82, result: 'Passed', homeworkGrade: 75 },
  { lessonId: 'l3', lessonTitle: '3 - Quadratic Equations', watchPercent: 87, viewsUsed: 4, maxViews: 5, entryTestScore: null, result: 'Pending', homeworkGrade: null },
  { lessonId: 'l4', lessonTitle: '4 - Functions & Graphs', watchPercent: 0, viewsUsed: 0, maxViews: 5, entryTestScore: null, result: 'Locked', homeworkGrade: null },
];

// Helper functions
export function getUsersForCenter(centerId: string, role?: string) {
  return users.filter(u => u.centerId === centerId && (!role || u.role === role));
}

export function getCredentials(centerId: string, role: string): { username: string; password: string } {
  const user = users.find(u => u.centerId === centerId && u.role === role);
  return user ? { username: user.username, password: user.password } : { username: '', password: '' };
}

export function getTeachersForCenter(centerId: string) {
  return users.filter(u => u.centerId === centerId && u.role === 'teacher');
}

export function getModeratorsForCenter(centerId: string) {
  return users.filter(u => u.centerId === centerId && u.role === 'moderator');
}

export function getStudentsForCenter(centerId: string) {
  return students.filter(s => s.centerId === centerId);
}

export function getTeacherName(teacherId: string) {
  return users.find(u => u.id === teacherId)?.name || 'Unknown';
}

export function getSubjectsForTeacher(teacherId: string) {
  return subjects.filter(s => s.teacherId === teacherId);
}
