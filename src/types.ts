export type StudentStatus = 'good' | 'stable' | 'attention';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AssignmentStatus = 'ongoing' | 'completed' | 'overdue';

export type PlanStatus = 'upcoming' | 'in_progress' | 'completed';

export interface TeacherProfile {
  teacherName: string;
  subject: string;
  school: string;
  greetingTitle: string;
  subTitle: string;
}

export interface ClassItem {
  id: string;
  name: string;
  gradeLevel: string;
  studentCount: number;
  subject: string;
  teacher: string;
  progress: number; // 0 - 100%
  activeAssignments: number;
  room?: string;
}

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  classId: string;
  className: string;
  gender: 'Nam' | 'Nữ';
  attendanceRate: number; // 0 - 100%
  regularScores: number[]; // Điểm thường xuyên (hệ số 1)
  midtermScore: number | null; // Giữa kỳ
  finalScore: number | null; // Cuối kỳ
  averageScore: number | null;
  assignmentsCompleted: number;
  totalAssignments: number;
  status: StudentStatus;
  notes?: string;
  phone?: string;
  attentionReason?: string;
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  entries: Record<string, AttendanceStatus>; // studentId -> AttendanceStatus
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  content: string;
  assignedDate: string;
  dueDate: string;
  completedCount: number;
  totalCount: number;
  status: AssignmentStatus;
  notes?: string;
}

export interface TeachingPlanItem {
  id: string;
  weekNumber: number;
  classId: string;
  className: string;
  topic: string;
  objectives: string;
  status: PlanStatus;
  dateRange?: string;
  notes?: string;
}

export interface GradeConfig {
  regularWeight: number; // e.g. 1
  midtermWeight: number; // e.g. 2
  finalWeight: number; // e.g. 3
  formulaDescription: string;
}

export interface AppState {
  profile: TeacherProfile;
  classes: ClassItem[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  teachingPlans: TeachingPlanItem[];
  gradeConfig: GradeConfig;
}

export type ActiveTab =
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'attendance'
  | 'grades'
  | 'assignments'
  | 'teaching-plan'
  | 'statistics';
