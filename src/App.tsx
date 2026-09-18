import React, { useState, useCallback } from 'react';
import {
  ActiveTab,
  AppState,
  Assignment,
  AttendanceRecord,
  ClassItem,
  GradeConfig,
  Student,
  TeacherProfile,
  TeachingPlanItem,
} from './types';
import {
  loadAppState,
  saveAppState,
  resetToDefault,
  isSoundEnabled,
  toggleSound,
  playNotificationSound,
} from './services/storageService';
import { exportToStandaloneHTML } from './services/htmlExporter';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';

import { DashboardView } from './views/DashboardView';
import { ClassesView } from './views/ClassesView';
import { StudentsView } from './views/StudentsView';
import { AttendanceView } from './views/AttendanceView';
import { GradesView } from './views/GradesView';
import { AssignmentsView } from './views/AssignmentsView';
import { TeachingPlanView } from './views/TeachingPlanView';
import { StatisticsView } from './views/StatisticsView';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [studentClassFilter, setStudentClassFilter] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals & UI States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled());
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  // Sync state to LocalStorage
  const updateState = useCallback(
    (updater: (prev: AppState) => AppState, toastMessage?: string) => {
      setAppState((prev: AppState) => {
        const next = updater(prev);
        saveAppState(next);
        return next;
      });

      if (toastMessage) {
        setToast({ message: toastMessage, type: 'success' });
        playNotificationSound();
      }
    },
    []
  );

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundActive(next);
    setToast({
      message: next ? 'Đã bật hiệu ứng âm thanh nhẹ' : 'Đã tắt hiệu ứng âm thanh',
      type: 'info',
    });
  };

  // Profile update handler
  const handleSaveProfile = (newProfile: TeacherProfile) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        profile: newProfile,
      }),
      'Đã lưu thông tin giáo viên và trường học thành công!'
    );
  };

  // Export to single file HTML handler
  const handleExportHTML = () => {
    exportToStandaloneHTML(appState);
    setToast({
      message: 'Đã xuất file "QUAN_TRI_HOC_TAP_ANH_VAN_THPT.html" độc lập hoàn tất!',
      type: 'success',
    });
    playNotificationSound();
  };

  // Reset to default data
  const handleResetData = () => {
    const fresh = resetToDefault();
    setAppState(fresh);
    setIsResetConfirmOpen(false);
    setToast({
      message: 'Đã khôi phục toàn bộ dữ liệu mẫu ban đầu!',
      type: 'info',
    });
  };

  // Navigation helpers
  const handleNavigateToStudents = (className?: string) => {
    if (className) {
      setStudentClassFilter(className);
    }
    setActiveTab('students');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Class CRUD
  const handleAddClass = (newCls: ClassItem) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        classes: [...prev.classes, newCls],
      }),
      `Đã thêm lớp ${newCls.name} vào danh sách!`
    );
  };

  const handleUpdateClass = (updated: ClassItem) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        classes: prev.classes.map((c: ClassItem) => (c.id === updated.id ? updated : c)),
      }),
      `Đã cập nhật thông tin lớp ${updated.name}!`
    );
  };

  const handleDeleteClass = (id: string) => {
    const cls = appState.classes.find((c: ClassItem) => c.id === id);
    updateState(
      (prev: AppState) => ({
        ...prev,
        classes: prev.classes.filter((c: ClassItem) => c.id !== id),
      }),
      `Đã xóa lớp ${cls?.name || ''}!`
    );
  };

  // Student CRUD
  const handleAddStudent = (newStudent: Student) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        students: [newStudent, ...prev.students],
      }),
      `Đã thêm học sinh ${newStudent.name} (Lớp ${newStudent.className})!`
    );
  };

  const handleUpdateStudent = (updated: Student) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        students: prev.students.map((s: Student) => (s.id === updated.id ? updated : s)),
      }),
      `Đã cập nhật hồ sơ học sinh ${updated.name}!`
    );
  };

  const handleDeleteStudent = (id: string) => {
    const std = appState.students.find((s: Student) => s.id === id);
    updateState(
      (prev: AppState) => ({
        ...prev,
        students: prev.students.filter((s: Student) => s.id !== id),
      }),
      `Đã xóa học sinh ${std?.name || ''}!`
    );
  };

  // Attendance CRUD
  const handleSaveAttendance = (record: AttendanceRecord) => {
    updateState(
      (prev: AppState) => {
        const filtered = prev.attendanceRecords.filter(
          (r: AttendanceRecord) => !(r.classId === record.classId && r.date === record.date)
        );
        return {
          ...prev,
          attendanceRecords: [...filtered, record],
        };
      },
      'Đã lưu kết quả điểm danh vào bộ nhớ!'
    );
  };

  // Grade Config
  const handleUpdateGradeConfig = (config: GradeConfig) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        gradeConfig: config,
      }),
      'Đã cập nhật công thức tính điểm trung bình!'
    );
  };

  // Assignment CRUD
  const handleAddAssignment = (newAsn: Assignment) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        assignments: [newAsn, ...prev.assignments],
      }),
      `Đã tạo bài tập: ${newAsn.title}!`
    );
  };

  const handleUpdateAssignment = (updated: Assignment) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        assignments: prev.assignments.map((a: Assignment) => (a.id === updated.id ? updated : a)),
      }),
      `Đã lưu cập nhật bài tập: ${updated.title}!`
    );
  };

  const handleDeleteAssignment = (id: string) => {
    const asn = appState.assignments.find((a: Assignment) => a.id === id);
    updateState(
      (prev: AppState) => ({
        ...prev,
        assignments: prev.assignments.filter((a: Assignment) => a.id !== id),
      }),
      `Đã xóa bài tập ${asn?.title || ''}!`
    );
  };

  // Teaching Plan CRUD
  const handleAddPlan = (newPlan: TeachingPlanItem) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        teachingPlans: [...prev.teachingPlans, newPlan],
      }),
      `Đã thêm kế hoạch Tuần ${newPlan.weekNumber}!`
    );
  };

  const handleUpdatePlan = (updated: TeachingPlanItem) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        teachingPlans: prev.teachingPlans.map((p: TeachingPlanItem) => (p.id === updated.id ? updated : p)),
      }),
      `Đã cập nhật kế hoạch Tuần ${updated.weekNumber}!`
    );
  };

  const handleDeletePlan = (id: string) => {
    updateState(
      (prev: AppState) => ({
        ...prev,
        teachingPlans: prev.teachingPlans.filter((p: TeachingPlanItem) => p.id !== id),
      }),
      'Đã xóa mục kế hoạch bài dạy!'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab: ActiveTab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        profile={appState.profile}
        onEditProfile={() => setIsProfileModalOpen(true)}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          profile={appState.profile}
          soundEnabled={soundActive}
          onToggleSound={handleToggleSound}
          onResetDemo={() => setIsResetConfirmOpen(true)}
          onExportHtml={handleExportHTML}
          onOpenSettings={() => setIsProfileModalOpen(true)}
          onOpenMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={appState.profile}
              classes={appState.classes}
              students={appState.students}
              assignments={appState.assignments}
              plans={appState.teachingPlans}
              onNavigate={(tab: ActiveTab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'classes' && (
            <ClassesView
              classes={appState.classes}
              profile={appState.profile}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onViewClassStudents={(className) => handleNavigateToStudents(className)}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={appState.students}
              classes={appState.classes}
              defaultClassFilter={studentClassFilter}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              classes={appState.classes}
              students={appState.students}
              attendanceRecords={appState.attendanceRecords}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === 'grades' && (
            <GradesView
              students={appState.students}
              classes={appState.classes}
              gradeConfig={appState.gradeConfig}
              onUpdateStudent={handleUpdateStudent}
              onUpdateGradeConfig={handleUpdateGradeConfig}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsView
              assignments={appState.assignments}
              classes={appState.classes}
              onAddAssignment={handleAddAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          )}

          {activeTab === 'teaching-plan' && (
            <TeachingPlanView
              plans={appState.teachingPlans}
              classes={appState.classes}
              onAddPlan={handleAddPlan}
              onUpdatePlan={handleUpdatePlan}
              onDeletePlan={handleDeletePlan}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsView
              students={appState.students}
              classes={appState.classes}
              assignments={appState.assignments}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white/70">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Hệ thống Quản Trị Học Tập – {appState.profile.subject} ({appState.profile.school})
            </span>
            <span>
              Giáo viên: {appState.profile.teacherName} • Lưu trữ trình duyệt tự động
            </span>
          </div>
        </footer>
      </div>

      {/* Profile / School Edit Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={appState.profile}
        onSave={handleSaveProfile}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Khôi phục dữ liệu mẫu ban đầu?"
        message="Hành động này sẽ xóa dữ liệu hiện tại trong trình duyệt và tải lại danh sách lớp học, học sinh, điểm và kế hoạch bài dạy mẫu của thầy Minh Bảo."
        confirmText="Đồng ý khôi phục"
        cancelText="Hủy bỏ"
        onConfirm={handleResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
