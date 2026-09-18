import {
  Assignment,
  AttendanceRecord,
  ClassItem,
  GradeConfig,
  Student,
  TeacherProfile,
  TeachingPlanItem,
} from '../types';
import {
  DEFAULT_ASSIGNMENTS,
  DEFAULT_ATTENDANCE,
  DEFAULT_CLASSES,
  DEFAULT_GRADE_CONFIG,
  DEFAULT_STUDENTS,
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_TEACHING_PLAN,
} from '../data/initialData';

const KEYS = {
  PROFILE: 'qtht_teacher_profile_v1',
  CLASSES: 'qtht_classes_v1',
  STUDENTS: 'qtht_students_v1',
  ATTENDANCE: 'qtht_attendance_v1',
  ASSIGNMENTS: 'qtht_assignments_v1',
  PLANS: 'qtht_plans_v1',
  GRADE_CONFIG: 'qtht_grade_config_v1',
  SOUND_ENABLED: 'qtht_sound_enabled_v1',
};

export const storageService = {
  getProfile(): TeacherProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_TEACHER_PROFILE;
    } catch {
      return DEFAULT_TEACHER_PROFILE;
    }
  },

  saveProfile(profile: TeacherProfile): void {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  getClasses(): ClassItem[] {
    try {
      const data = localStorage.getItem(KEYS.CLASSES);
      return data ? JSON.parse(data) : DEFAULT_CLASSES;
    } catch {
      return DEFAULT_CLASSES;
    }
  },

  saveClasses(classes: ClassItem[]): void {
    try {
      localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
    } catch (e) {
      console.error('Failed to save classes', e);
    }
  },

  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      return data ? JSON.parse(data) : DEFAULT_STUDENTS;
    } catch {
      return DEFAULT_STUDENTS;
    }
  },

  saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students', e);
    }
  },

  getAttendance(): AttendanceRecord[] {
    try {
      const data = localStorage.getItem(KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : DEFAULT_ATTENDANCE;
    } catch {
      return DEFAULT_ATTENDANCE;
    }
  },

  saveAttendance(attendance: AttendanceRecord[]): void {
    try {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
    } catch (e) {
      console.error('Failed to save attendance', e);
    }
  },

  getAssignments(): Assignment[] {
    try {
      const data = localStorage.getItem(KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : DEFAULT_ASSIGNMENTS;
    } catch {
      return DEFAULT_ASSIGNMENTS;
    }
  },

  saveAssignments(assignments: Assignment[]): void {
    try {
      localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (e) {
      console.error('Failed to save assignments', e);
    }
  },

  getPlans(): TeachingPlanItem[] {
    try {
      const data = localStorage.getItem(KEYS.PLANS);
      return data ? JSON.parse(data) : DEFAULT_TEACHING_PLAN;
    } catch {
      return DEFAULT_TEACHING_PLAN;
    }
  },

  savePlans(plans: TeachingPlanItem[]): void {
    try {
      localStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
    } catch (e) {
      console.error('Failed to save plans', e);
    }
  },

  getGradeConfig(): GradeConfig {
    try {
      const data = localStorage.getItem(KEYS.GRADE_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_GRADE_CONFIG;
    } catch {
      return DEFAULT_GRADE_CONFIG;
    }
  },

  saveGradeConfig(config: GradeConfig): void {
    try {
      localStorage.setItem(KEYS.GRADE_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save grade config', e);
    }
  },

  getSoundEnabled(): boolean {
    try {
      const val = localStorage.getItem(KEYS.SOUND_ENABLED);
      return val !== null ? JSON.parse(val) : false; // default off as instructed
    } catch {
      return false;
    }
  },

  setSoundEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(KEYS.SOUND_ENABLED, JSON.stringify(enabled));
    } catch (e) {
      console.error('Failed to save sound preference', e);
    }
  },

  resetAllToDefault(): {
    profile: TeacherProfile;
    classes: ClassItem[];
    students: Student[];
    attendance: AttendanceRecord[];
    assignments: Assignment[];
    plans: TeachingPlanItem[];
    gradeConfig: GradeConfig;
  } {
    try {
      localStorage.removeItem(KEYS.PROFILE);
      localStorage.removeItem(KEYS.CLASSES);
      localStorage.removeItem(KEYS.STUDENTS);
      localStorage.removeItem(KEYS.ATTENDANCE);
      localStorage.removeItem(KEYS.ASSIGNMENTS);
      localStorage.removeItem(KEYS.PLANS);
      localStorage.removeItem(KEYS.GRADE_CONFIG);
    } catch (e) {
      console.error('Failed to clear storage', e);
    }

    return {
      profile: DEFAULT_TEACHER_PROFILE,
      classes: DEFAULT_CLASSES,
      students: DEFAULT_STUDENTS,
      attendance: DEFAULT_ATTENDANCE,
      assignments: DEFAULT_ASSIGNMENTS,
      plans: DEFAULT_TEACHING_PLAN,
      gradeConfig: DEFAULT_GRADE_CONFIG,
    };
  },
};

export function loadAppState(): {
  profile: TeacherProfile;
  classes: ClassItem[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  teachingPlans: TeachingPlanItem[];
  gradeConfig: GradeConfig;
} {
  return {
    profile: storageService.getProfile(),
    classes: storageService.getClasses(),
    students: storageService.getStudents(),
    attendanceRecords: storageService.getAttendance(),
    assignments: storageService.getAssignments(),
    teachingPlans: storageService.getPlans(),
    gradeConfig: storageService.getGradeConfig(),
  };
}

export function saveAppState(state: {
  profile: TeacherProfile;
  classes: ClassItem[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  teachingPlans: TeachingPlanItem[];
  gradeConfig: GradeConfig;
}): void {
  storageService.saveProfile(state.profile);
  storageService.saveClasses(state.classes);
  storageService.saveStudents(state.students);
  storageService.saveAttendance(state.attendanceRecords);
  storageService.saveAssignments(state.assignments);
  storageService.savePlans(state.teachingPlans);
  storageService.saveGradeConfig(state.gradeConfig);
}

export function resetToDefault() {
  const data = storageService.resetAllToDefault();
  return {
    profile: data.profile,
    classes: data.classes,
    students: data.students,
    attendanceRecords: data.attendance,
    assignments: data.assignments,
    teachingPlans: data.plans,
    gradeConfig: data.gradeConfig,
  };
}

export function isSoundEnabled(): boolean {
  return storageService.getSoundEnabled();
}

export function toggleSound(): boolean {
  const current = storageService.getSoundEnabled();
  const next = !current;
  storageService.setSoundEnabled(next);
  return next;
}

// Web Audio API gentle notification chime
let audioCtx: AudioContext | null = null;

export function playNotificationSound(): void {
  if (!storageService.getSoundEnabled()) return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      // @ts-expect-error webkitAudioContext fallback
      window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Gentle dual-tone ascending notification
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Graceful fallback without breaking anything
  }
}
