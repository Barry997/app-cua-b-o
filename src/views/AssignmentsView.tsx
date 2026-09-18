import React, { useState } from 'react';
import { Assignment, AssignmentStatus, ClassItem } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Calendar,
  Users,
  BookOpen,
  X,
  FileCheck2,
  Clock,
} from 'lucide-react';

interface AssignmentsViewProps {
  assignments: Assignment[];
  classes: ClassItem[];
  onAddAssignment: (assignment: Assignment) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  classes,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    className: classes[0]?.name || '10A1',
    content: '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    completedCount: 0,
    totalCount: 40,
    status: 'ongoing' as AssignmentStatus,
    notes: '',
  });

  const filtered = assignments.filter((a) => {
    const matchClass = selectedClass ? a.className === selectedClass : true;
    const matchStatus = selectedStatus ? a.status === selectedStatus : true;
    return matchClass && matchStatus;
  });

  const handleOpenCreate = () => {
    const defaultCls = classes[0];
    setFormData({
      title: '',
      className: defaultCls?.name || '10A1',
      content: '',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      completedCount: 0,
      totalCount: defaultCls?.studentCount || 40,
      status: 'ongoing',
      notes: '',
    });
    setEditingAssignment(null);
    setModalMode('create');
  };

  const handleOpenEdit = (a: Assignment) => {
    setEditingAssignment(a);
    setFormData({
      title: a.title,
      className: a.className,
      content: a.content,
      assignedDate: a.assignedDate,
      dueDate: a.dueDate,
      completedCount: a.completedCount,
      totalCount: a.totalCount,
      status: a.status,
      notes: a.notes || '',
    });
    setModalMode('edit');
  };

  const handleToggleComplete = (a: Assignment) => {
    const updated: Assignment = {
      ...a,
      status: a.status === 'completed' ? 'ongoing' : 'completed',
    };
    onUpdateAssignment(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (modalMode === 'create') {
      const cls = classes.find((c) => c.name === formData.className);
      const newAsn: Assignment = {
        id: `asn-${Date.now()}`,
        title: formData.title.trim(),
        classId: cls ? cls.id : `cls-${formData.className.toLowerCase()}`,
        className: formData.className,
        content: formData.content,
        assignedDate: formData.assignedDate,
        dueDate: formData.dueDate,
        completedCount: Number(formData.completedCount) || 0,
        totalCount: cls ? cls.studentCount : Number(formData.totalCount) || 40,
        status: formData.status,
        notes: formData.notes,
      };
      onAddAssignment(newAsn);
    } else if (modalMode === 'edit' && editingAssignment) {
      const updated: Assignment = {
        ...editingAssignment,
        title: formData.title.trim(),
        className: formData.className,
        content: formData.content,
        assignedDate: formData.assignedDate,
        dueDate: formData.dueDate,
        completedCount: Number(formData.completedCount) || 0,
        status: formData.status,
        notes: formData.notes,
      };
      onUpdateAssignment(updated);
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-5">
      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-medium"
          >
            <option value="">Tất cả các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                Lớp {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-medium"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ongoing">Đang giao / Chưa hết hạn</option>
            <option value="completed">Đã hoàn thành / Đã chấm</option>
            <option value="overdue">Đã quá hạn nộp</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          id="btn-create-assignment"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tạo bài tập</span>
        </button>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((asn) => {
          const completionPct = Math.round(
            (asn.completedCount / (asn.totalCount || 1)) * 100
          );

          return (
            <div
              key={asn.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs">
                        Lớp {asn.className}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${
                          asn.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : asn.status === 'overdue'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {asn.status === 'completed'
                          ? 'Đã xong'
                          : asn.status === 'overdue'
                          ? 'Quá hạn'
                          : 'Đang giao'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-2">
                      {asn.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(asn)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Sửa bài tập"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(asn.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa bài tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">
                  {asn.content}
                </p>

                {asn.notes && (
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-2xs text-slate-500 font-medium">
                    📌 Lưu ý: {asn.notes}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-2xs text-slate-500 mb-3">
                  <div>
                    <span className="block text-slate-400">Ngày giao:</span>
                    <strong className="text-slate-700">{asn.assignedDate}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Hạn nộp:</span>
                    <strong className="text-blue-700">{asn.dueDate}</strong>
                  </div>
                </div>

                {/* Progress bar of submitted students */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-600">Đã nộp bài:</span>
                    <span className="text-slate-900">
                      {asn.completedCount}/{asn.totalCount} học sinh ({completionPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        completionPct >= 80
                          ? 'bg-emerald-500'
                          : completionPct >= 50
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                {/* Status toggle action */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleComplete(asn)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                      asn.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>
                      {asn.status === 'completed' ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Assignment Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Tạo Bài Tập / Nhiệm Vụ Mới' : 'Chỉnh Sửa Bài Tập'}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tiêu đề bài tập:
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Unit 4: Grammar Practice - Relative Clauses"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lớp giao bài:</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Trạng thái:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as AssignmentStatus })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="ongoing">Đang giao</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="overdue">Quá hạn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nội dung / Yêu cầu bài tập:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả cụ thể bài tập, trang sách giáo khoa, phiếu bài tập..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ngày giao:</label>
                  <input
                    type="date"
                    required
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hạn nộp bài:</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số học sinh đã nộp:
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.completedCount}
                    onChange={(e) =>
                      setFormData({ ...formData, completedCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Ghi chú thêm:
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    placeholder="VD: Kiểm tra kỹ phần phát âm..."
                  />
                </div>
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
                  {modalMode === 'create' ? 'Tạo bài tập' : 'Lưu cập nhật'}
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
            <h4 className="text-base font-bold text-slate-900">Xác nhận xóa bài tập</h4>
            <p className="text-sm text-slate-600 mt-2">
              Bạn có chắc chắn muốn xóa bài tập này không? Hành động này không thể hoàn tác.
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
                  onDeleteAssignment(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Xóa bài tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
