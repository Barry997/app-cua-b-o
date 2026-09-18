import React, { useState } from 'react';
import { ClassItem, PlanStatus, TeachingPlanItem } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  ListOrdered,
  X,
  BookOpen,
} from 'lucide-react';

interface TeachingPlanViewProps {
  plans: TeachingPlanItem[];
  classes: ClassItem[];
  onAddPlan: (plan: TeachingPlanItem) => void;
  onUpdatePlan: (plan: TeachingPlanItem) => void;
  onDeletePlan: (id: string) => void;
}

export const TeachingPlanView: React.FC<TeachingPlanViewProps> = ({
  plans,
  classes,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingPlan, setEditingPlan] = useState<TeachingPlanItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    weekNumber: 1,
    className: classes[0]?.name || '10A1',
    topic: '',
    objectives: '',
    status: 'upcoming' as PlanStatus,
    dateRange: '',
    notes: '',
  });

  const filtered = plans
    .filter((p) => {
      const matchClass = selectedClass ? p.className === selectedClass : true;
      const matchStatus = selectedStatus ? p.status === selectedStatus : true;
      return matchClass && matchStatus;
    })
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const handleOpenCreate = () => {
    const nextWeek = plans.length > 0 ? Math.max(...plans.map((p) => p.weekNumber)) + 1 : 1;
    setFormData({
      weekNumber: nextWeek,
      className: classes[0]?.name || '10A1',
      topic: '',
      objectives: '',
      status: 'upcoming',
      dateRange: '',
      notes: '',
    });
    setEditingPlan(null);
    setModalMode('create');
  };

  const handleOpenEdit = (p: TeachingPlanItem) => {
    setEditingPlan(p);
    setFormData({
      weekNumber: p.weekNumber,
      className: p.className,
      topic: p.topic,
      objectives: p.objectives,
      status: p.status,
      dateRange: p.dateRange || '',
      notes: p.notes || '',
    });
    setModalMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    if (modalMode === 'create') {
      const cls = classes.find((c) => c.name === formData.className);
      const newPlan: TeachingPlanItem = {
        id: `plan-${Date.now()}`,
        weekNumber: Number(formData.weekNumber) || 1,
        classId: cls ? cls.id : `cls-${formData.className.toLowerCase()}`,
        className: formData.className,
        topic: formData.topic.trim(),
        objectives: formData.objectives,
        status: formData.status,
        dateRange: formData.dateRange,
        notes: formData.notes,
      };
      onAddPlan(newPlan);
    } else if (modalMode === 'edit' && editingPlan) {
      const updated: TeachingPlanItem = {
        ...editingPlan,
        weekNumber: Number(formData.weekNumber) || 1,
        className: formData.className,
        topic: formData.topic.trim(),
        objectives: formData.objectives,
        status: formData.status,
        dateRange: formData.dateRange,
        notes: formData.notes,
      };
      onUpdatePlan(updated);
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Filter and Add Action */}
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
            <option value="completed">Đã hoàn thành</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="upcoming">Chưa dạy</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          id="btn-add-plan"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm kế hoạch tuần</span>
        </button>
      </div>

      {/* Plan Table View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3.5 px-4 w-20 text-center">Tuần</th>
                <th className="py-3.5 px-4 w-20">Lớp</th>
                <th className="py-3.5 px-4 min-w-[220px]">Chủ đề / Bài học</th>
                <th className="py-3.5 px-4 min-w-[280px]">Mục tiêu cần đạt</th>
                <th className="py-3.5 px-4 w-28 text-center">Thời gian</th>
                <th className="py-3.5 px-4 w-32 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 min-w-[140px]">Ghi chú</th>
                <th className="py-3.5 px-4 w-24 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
                      T{item.weekNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {item.className}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.topic}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-xs">
                    {item.objectives}
                  </td>
                  <td className="py-3.5 px-4 text-center text-2xs font-medium text-slate-500">
                    {item.dateRange || 'Theo PPCT'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Hoàn thành
                      </span>
                    )}
                    {item.status === 'in_progress' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Đang thực hiện
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold bg-slate-100 text-slate-600">
                        Chưa dạy
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {item.notes || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Sửa kế hoạch"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        title="Xóa mục kế hoạch"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Teaching Plan Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Thêm Kế Hoạch Bài Dạy' : 'Chỉnh Sửa Kế Hoạch'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tuần thứ:</label>
                  <input
                    type="number"
                    min={1}
                    max={35}
                    required
                    value={formData.weekNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, weekNumber: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lớp giảng dạy:</label>
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
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Chủ đề / Tên bài học:
                </label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Unit 4: For a Better Community - Language Focus"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mục tiêu kiến thức, kỹ năng cần đạt:
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Học sinh nắm vững từ vựng, rèn kỹ năng nghe hiểu..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Thời gian thực hiện:</label>
                  <input
                    type="text"
                    value={formData.dateRange}
                    onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 20/09 - 25/09"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Trạng thái:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as PlanStatus })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="upcoming">Chưa dạy</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ghi chú đồ dùng / thiết bị:</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  placeholder="VD: Máy chiếu, phiếu học tập số 2..."
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
                  {modalMode === 'create' ? 'Lưu kế hoạch' : 'Cập nhật kế hoạch'}
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
            <h4 className="text-base font-bold text-slate-900">Xác nhận xóa kế hoạch tuần</h4>
            <p className="text-sm text-slate-600 mt-2">
              Bạn có chắc muốn xóa mục kế hoạch này khỏi phân phối chương trình không?
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
                  onDeletePlan(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Xóa kế hoạch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
