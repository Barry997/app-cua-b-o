import React, { useState } from 'react';
import { TeacherProfile } from '../types';
import { X, UserCheck } from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  profile: TeacherProfile;
  onSave: (updated: TeacherProfile) => void;
  onClose: () => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  profile,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Thông Tin Giáo Viên & Trường Học</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh thông tin hiển thị trên hệ thống</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Họ và tên Giáo viên:
            </label>
            <input
              type="text"
              required
              value={formData.teacherName}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  teacherName: name,
                  greetingTitle: `Xin chào, thầy ${name.toUpperCase()}`,
                });
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: Minh Bảo"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Môn giảng dạy:
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => {
                const sub = e.target.value;
                setFormData({
                  ...formData,
                  subject: sub,
                  subTitle: `Tổng quan hoạt động giảng dạy môn ${sub}`,
                });
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: Anh Văn hoặc Ngữ văn"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trường học:
            </label>
            <input
              type="text"
              required
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: THPT HÙNG VƯƠNG hoặc THCS Phan Bội Châu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lời chào hiển thị Dashboard:
            </label>
            <input
              type="text"
              required
              value={formData.greetingTitle}
              onChange={(e) => setFormData({ ...formData, greetingTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: Xin chào, thầy MINH BẢO"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
