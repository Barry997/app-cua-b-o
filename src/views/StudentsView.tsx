import React, { useState, useMemo } from 'react';
import { ClassItem, Student, StudentStatus } from '../types';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  UserPlus,
  Info,
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  classes: ClassItem[];
  defaultClassFilter?: string;
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updated: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  defaultClassFilter = '',
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(defaultClassFilter);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    studentCode: string;
    className: string;
    gender: 'Nam' | 'Nữ';
    attendanceRate: number;
    status: StudentStatus;
    notes: string;
    attentionReason: string;
  }>({
    name: '',
    studentCode: '',
    className: classes[0]?.name || '10A1',
    gender: 'Nam',
    attendanceRate: 95,
    status: 'stable',
    notes: '',
    attentionReason: '',
  });

  // Filtered List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.studentCode && s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchClass = selectedClass ? s.className === selectedClass : true;
      const matchStatus = selectedStatus ? s.status === selectedStatus : true;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchQuery, selectedClass, selectedStatus]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      studentCode: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
      className: selectedClass || classes[0]?.name || '10A1',
      gender: 'Nam',
      attendanceRate: 98,
      status: 'stable',
      notes: '',
      attentionReason: '',
    });
    setEditingStudent(null);
    setModalMode('create');
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({
      name: s.name,
      studentCode: s.studentCode || '',
      className: s.className,
      gender: s.gender,
      attendanceRate: s.attendanceRate,
      status: s.status,
      notes: s.notes || '',
      attentionReason: s.attentionReason || '',
    });
    setModalMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (modalMode === 'create') {
      const newStd: Student = {
        id: `std-${Date.now()}`,
        studentCode: formData.studentCode || `HS-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name.trim(),
        classId: `cls-${formData.className.toLowerCase()}`,
        className: formData.className,
        gender: formData.gender,
        attendanceRate: Number(formData.attendanceRate) || 95,
        regularScores: [8.0],
        midtermScore: 8.0,
        finalScore: 8.0,
        averageScore: 8.0,
        assignmentsCompleted: 4,
        totalAssignments: 5,
        status: formData.status,
        notes: formData.notes,
        attentionReason: formData.status === 'attention' ? formData.attentionReason : '',
      };
      onAddStudent(newStd);
    } else if (modalMode === 'edit' && editingStudent) {
      const updated: Student = {
        ...editingStudent,
        name: formData.name.trim(),
        studentCode: formData.studentCode,
        className: formData.className,
        gender: formData.gender,
        attendanceRate: Number(formData.attendanceRate) || editingStudent.attendanceRate,
        status: formData.status,
        notes: formData.notes,
        attentionReason: formData.status === 'attention' ? formData.attentionReason : '',
      };
      onUpdateStudent(updated);
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="student-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm học sinh theo tên hoặc mã HS..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Class filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-class-select"
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
            </div>

            {/* Status filter */}
            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="good">Học tốt</option>
              <option value="stable">Ổn định</option>
              <option value="attention">Cần chú ý</option>
            </select>

            {/* Add Student Button */}
            <button
              onClick={handleOpenCreate}
              id="btn-add-student"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm học sinh</span>
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Hiển thị <strong>{filteredStudents.length}</strong> / {students.length} học sinh
            {selectedClass && ` • Lớp ${selectedClass}`}
            {selectedStatus && ` • Trạng thái: ${selectedStatus === 'good' ? 'Tốt' : selectedStatus === 'stable' ? 'Ổn định' : 'Cần chú ý'}`}
          </span>
          {(searchQuery || selectedClass || selectedStatus) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('');
                setSelectedStatus('');
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 min-w-[180px]">Họ và tên</th>
                <th className="py-3.5 px-4 w-20">Lớp</th>
                <th className="py-3.5 px-4 w-28 text-center">Chuyên cần</th>
                <th className="py-3.5 px-4 w-24 text-center">Điểm TB</th>
                <th className="py-3.5 px-4 w-32 text-center">Bài tập hoàn thành</th>
                <th className="py-3.5 px-4 w-28 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 min-w-[160px]">Ghi chú</th>
                <th className="py-3.5 px-4 w-24 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => (
                  <tr
                    key={std.id}
                    id={`student-row-${std.id}`}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      std.status === 'attention' ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{std.name}</div>
                      <div className="text-2xs text-slate-400">
                        {std.studentCode} • {std.gender}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {std.className}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          std.attendanceRate >= 95
                            ? 'bg-emerald-50 text-emerald-700'
                            : std.attendanceRate >= 85
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {std.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-bold ${
                          (std.averageScore || 0) >= 8.0
                            ? 'text-emerald-600'
                            : (std.averageScore || 0) >= 6.5
                            ? 'text-blue-600'
                            : (std.averageScore || 0) >= 5.0
                            ? 'text-amber-600'
                            : 'text-rose-600 font-extrabold'
                        }`}
                      >
                        {std.averageScore !== null ? std.averageScore.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <span>{std.assignmentsCompleted}</span>
                        <span className="text-slate-400">/</span>
                        <span>{std.totalAssignments}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {std.status === 'good' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Tốt
                        </span>
                      )}
                      {std.status === 'stable' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Ổn định
                        </span>
                      )}
                      {std.status === 'attention' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Cần chú ý
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate">
                      {std.attentionReason ? (
                        <span className="text-rose-600 font-medium">⚠️ {std.attentionReason}</span>
                      ) : (
                        std.notes || '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(std)}
                          title="Sửa thông tin học sinh"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(std.id)}
                          title="Xóa học sinh"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Student */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'create' ? 'Thêm Học Sinh Mới' : `Sửa Thông Tin ${editingStudent?.name}`}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Họ và tên học sinh:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Nguyễn Văn An"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mã học sinh:</label>
                  <input
                    type="text"
                    value={formData.studentCode}
                    onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: HS-1001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lớp:</label>
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
                  <label className="block text-slate-700 font-semibold mb-1">Giới tính:</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Chuyên cần (%):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.attendanceRate}
                    onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Trạng thái học tập:</label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer font-medium ${
                      formData.status === 'good'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="good"
                      checked={formData.status === 'good'}
                      onChange={() => setFormData({ ...formData, status: 'good' })}
                      className="sr-only"
                    />
                    <span>Tốt</span>
                  </label>
                  <label
                    className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer font-medium ${
                      formData.status === 'stable'
                        ? 'bg-blue-50 border-blue-500 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="stable"
                      checked={formData.status === 'stable'}
                      onChange={() => setFormData({ ...formData, status: 'stable' })}
                      className="sr-only"
                    />
                    <span>Ổn định</span>
                  </label>
                  <label
                    className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer font-medium ${
                      formData.status === 'attention'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="attention"
                      checked={formData.status === 'attention'}
                      onChange={() => setFormData({ ...formData, status: 'attention' })}
                      className="sr-only"
                    />
                    <span>Cần chú ý</span>
                  </label>
                </div>
              </div>

              {formData.status === 'attention' && (
                <div>
                  <label className="block text-rose-700 font-semibold mb-1">
                    Lý do cần chú ý (để hiển thị ở Dashboard & Báo cáo):
                  </label>
                  <input
                    type="text"
                    value={formData.attentionReason}
                    onChange={(e) => setFormData({ ...formData, attentionReason: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-rose-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-rose-50/20 text-rose-900"
                    placeholder="VD: Điểm thi giữa kỳ dưới 5.0, vắng nhiều tiết..."
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ghi chú sư phạm:</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú điểm mạnh, điểm yếu cần kèm cặp..."
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
                  {modalMode === 'create' ? 'Lưu học sinh' : 'Lưu cập nhật'}
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
            <h4 className="text-base font-bold text-slate-900">Xác nhận xóa học sinh</h4>
            <p className="text-sm text-slate-600 mt-2">
              Bạn có chắc chắn muốn xóa học sinh này khỏi danh sách? Thao tác này sẽ xóa hồ sơ và điểm số liên quan.
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
                  onDeleteStudent(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Xóa học sinh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
