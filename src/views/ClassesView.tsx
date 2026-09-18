import React, { useState } from 'react';
import { ClassItem, TeacherProfile } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  CheckCircle,
  X,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

interface ClassesViewProps {
  classes: ClassItem[];
  profile: TeacherProfile;
  onAddClass: (newClass: ClassItem) => void;
  onUpdateClass: (updated: ClassItem) => void;
  onDeleteClass: (id: string) => void;
  onViewClassStudents: (className: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  classes,
  profile,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onViewClassStudents,
}) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gradeLevel: 'Khối 10',
    studentCount: 40,
    progress: 50,
    activeAssignments: 1,
    room: 'Phòng B204',
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      gradeLevel: 'Khối 10',
      studentCount: 40,
      progress: 50,
      activeAssignments: 1,
      room: 'Phòng học chính',
    });
    setEditingClass(null);
    setModalMode('create');
  };

  const handleOpenEdit = (c: ClassItem) => {
    setEditingClass(c);
    setFormData({
      name: c.name,
      gradeLevel: c.gradeLevel,
      studentCount: c.studentCount,
      progress: c.progress,
      activeAssignments: c.activeAssignments,
      room: c.room || 'Phòng học',
    });
    setModalMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (modalMode === 'create') {
      const newCls: ClassItem = {
        id: `cls-${Date.now()}`,
        name: formData.name.trim(),
        gradeLevel: formData.gradeLevel,
        studentCount: Number(formData.studentCount) || 40,
        subject: profile.subject,
        teacher: `Thầy ${profile.teacherName}`,
        progress: Math.min(100, Math.max(0, Number(formData.progress) || 0)),
        activeAssignments: Number(formData.activeAssignments) || 0,
        room: formData.room,
      };
      onAddClass(newCls);
    } else if (modalMode === 'edit' && editingClass) {
      const updated: ClassItem = {
        ...editingClass,
        name: formData.name.trim(),
        gradeLevel: formData.gradeLevel,
        studentCount: Number(formData.studentCount) || editingClass.studentCount,
        progress: Math.min(100, Math.max(0, Number(formData.progress) || 0)),
        activeAssignments: Number(formData.activeAssignments) || 0,
        room: formData.room,
      };
      onUpdateClass(updated);
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Danh sách lớp học phụ trách ({classes.length} lớp)
          </h3>
          <p className="text-xs text-slate-500">
            Quản lý sĩ số, tiến độ chương trình và bài tập của từng lớp
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm lớp</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {classes.map((cls) => (
          <div
            key={cls.id}
            id={`class-card-${cls.id}`}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                    {cls.name}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Lớp {cls.name}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {cls.gradeLevel} • {cls.room || 'Phòng học chính'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    title="Chỉnh sửa thông tin lớp"
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(cls.id)}
                    title="Xóa lớp học này"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Class Info Rows */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium block">Giáo viên phụ trách</span>
                  <span className="font-semibold text-slate-800 truncate block mt-0.5">
                    {cls.teacher || profile.teacherName}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium block">Môn giảng dạy</span>
                  <span className="font-semibold text-blue-700 truncate block mt-0.5">
                    {cls.subject || profile.subject}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium block">Sĩ số lớp</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {cls.studentCount} học sinh
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium block">Bài tập đang giao</span>
                  <span className="font-semibold text-amber-700 flex items-center gap-1 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                    {cls.activeAssignments} nhiệm vụ
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Tiến độ chương trình năm học</span>
                  <span className="text-blue-700">{cls.progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Cập nhật lần cuối: Kỳ I
              </span>
              <button
                onClick={() => onViewClassStudents(cls.name)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>Xem danh sách học sinh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Class */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Thêm Lớp Học Mới' : `Sửa Thông Tin Lớp ${editingClass?.name}`}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tên lớp học (VD: 10A3, 11A2, 6A1):
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên lớp..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Khối lớp:</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Khối 10">Khối 10</option>
                    <option value="Khối 11">Khối 11</option>
                    <option value="Khối 12">Khối 12</option>
                    <option value="Khối 6">Khối 6</option>
                    <option value="Khối 7">Khối 7</option>
                    <option value="Khối 8">Khối 8</option>
                    <option value="Khối 9">Khối 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sĩ số học sinh:</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tiến độ chương trình (%):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số bài tập đang giao:</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.activeAssignments}
                    onChange={(e) => setFormData({ ...formData, activeAssignments: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phòng học:</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Phòng B204"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  {modalMode === 'create' ? 'Tạo lớp' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-5">
            <h4 className="text-base font-bold text-slate-900">Xác nhận xóa lớp học</h4>
            <p className="text-sm text-slate-600 mt-2">
              Bạn có chắc chắn muốn xóa lớp học này không? Hành động này sẽ xóa dữ liệu lớp học khỏi danh sách.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onDeleteClass(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
