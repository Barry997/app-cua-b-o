import React from 'react';
import { ActiveTab, TeacherProfile } from '../types';
import {
  Menu,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Settings,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  profile: TeacherProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetDemo: () => void;
  onExportHtml: () => void;
  onOpenSettings: () => void;
  onOpenMobileSidebar: () => void;
}

const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Tổng quan giảng dạy',
    subtitle: 'Theo dõi chỉ số trọng tâm và tình hình các lớp',
  },
  classes: {
    title: 'Quản lý lớp học',
    subtitle: 'Danh sách các lớp đang phụ trách và tiến độ chương trình',
  },
  students: {
    title: 'Quản lý học sinh',
    subtitle: 'Theo dõi hồ sơ, điểm trung bình và trạng thái học tập',
  },
  attendance: {
    title: 'Điểm danh chuyên cần',
    subtitle: 'Điểm danh nhanh theo lớp và lưu trữ vào sổ theo dõi',
  },
  grades: {
    title: 'Quản lý điểm số',
    subtitle: 'Sổ điểm thường xuyên, giữa kỳ, cuối kỳ và điểm trung bình',
  },
  assignments: {
    title: 'Quản lý bài tập',
    subtitle: 'Giao bài tập, theo dõi hạn nộp và tỷ lệ hoàn thành',
  },
  'teaching-plan': {
    title: 'Kế hoạch giảng dạy',
    subtitle: 'Phân phối chương trình theo tuần và tiến độ giáo án',
  },
  statistics: {
    title: 'Báo cáo & Thống kê',
    subtitle: 'Phân tích phổ điểm, chuyên cần và học sinh cần lưu ý',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  soundEnabled,
  onToggleSound,
  onResetDemo,
  onExportHtml,
  onOpenSettings,
  onOpenMobileSidebar,
}) => {
  const current = tabTitles[activeTab];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {current.title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 font-normal">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Tắt âm thanh thông báo' : 'Bật âm thanh thông báo'}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          aria-label="Bật tắt âm thanh"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Reset Demo button */}
        <button
          onClick={onResetDemo}
          title="Khôi phục dữ liệu mẫu ban đầu"
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Khôi phục demo</span>
        </button>

        {/* Export Single HTML file button */}
        <button
          onClick={onExportHtml}
          title="Tải toàn bộ web app dạng 1 file HTML duy nhất để mở ngoại tuyến không cần mạng"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Xuất file HTML đơn</span>
          <span className="sm:hidden">Xuất HTML</span>
        </button>

        {/* Profile / Settings button */}
        <button
          onClick={onOpenSettings}
          title="Cài đặt thông tin giáo viên & trường"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Hồ sơ</span>
        </button>
      </div>
    </header>
  );
};
