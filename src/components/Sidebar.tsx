import React from 'react';
import { ActiveTab, TeacherProfile } from '../types';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardCheck,
  Award,
  BookOpen,
  CalendarRange,
  BarChart3,
  Edit3,
  X,
  BookMarked,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  profile: TeacherProfile;
  onEditProfile: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: '1. Tổng quan', icon: LayoutDashboard },
  { id: 'classes', label: '2. Lớp học', icon: GraduationCap },
  { id: 'students', label: '3. Học sinh', icon: Users },
  { id: 'attendance', label: '4. Chuyên cần', icon: ClipboardCheck },
  { id: 'grades', label: '5. Điểm số', icon: Award },
  { id: 'assignments', label: '6. Bài tập', icon: BookOpen },
  { id: 'teaching-plan', label: '7. Kế hoạch giảng dạy', icon: CalendarRange },
  { id: 'statistics', label: '8. Thống kê', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  profile,
  onEditProfile,
  mobileOpen,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-blue-900 tracking-tight leading-tight uppercase">
              QUẢN TRỊ HỌC TẬP
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {profile.subject} • {profile.school}
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          aria-label="Đóng thanh điều hướng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => {
                onTabChange(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Teacher Profile Card (As requested: "Phía dưới Sidebar hiển thị: Tên GV, Giáo viên môn, Trường") */}
      <div className="p-3 m-3 bg-slate-50 border border-slate-200/80 rounded-xl">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900 truncate">
              {profile.teacherName}
            </div>
            <div className="text-xs text-slate-500 truncate mt-0.5">
              Giáo viên {profile.subject}
            </div>
            <div className="text-xs font-semibold text-blue-600 truncate mt-0.5">
              {profile.school}
            </div>
          </div>
          <button
            onClick={onEditProfile}
            title="Chỉnh sửa thông tin giáo viên"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md transition-colors shrink-0 shadow-2xs border border-transparent hover:border-slate-200"
            aria-label="Chỉnh sửa hồ sơ giáo viên"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
