import React, { useState, useEffect } from 'react';
import {
  AttendanceRecord,
  AttendanceStatus,
  ClassItem,
  Student,
} from '../types';
import {
  Calendar,
  Check,
  Clock,
  UserX,
  FileText,
  Save,
  CheckCheck,
  AlertCircle,
} from 'lucide-react';

interface AttendanceViewProps {
  classes: ClassItem[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  classes,
  students,
  attendanceRecords,
  onSaveAttendance,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currentEntries, setCurrentEntries] = useState<Record<string, AttendanceStatus>>({});

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter(
    (s) => s.className === currentClass?.name
  );

  // Load existing attendance record for this class and date
  useEffect(() => {
    if (!currentClass) return;
    const existing = attendanceRecords.find(
      (r) => r.classId === currentClass.id && r.date === selectedDate
    );

    if (existing) {
      setCurrentEntries(existing.entries);
    } else {
      // Default all to 'present'
      const initial: Record<string, AttendanceStatus> = {};
      classStudents.forEach((s) => {
        initial[s.id] = 'present';
      });
      setCurrentEntries(initial);
    }
  }, [selectedClassId, selectedDate, attendanceRecords, currentClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setCurrentEntries((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => {
      updated[s.id] = 'present';
    });
    setCurrentEntries(updated);
  };

  const handleSave = () => {
    if (!currentClass) return;
    const record: AttendanceRecord = {
      id: `att-${selectedDate}-${currentClass.id}`,
      date: selectedDate,
      classId: currentClass.id,
      entries: currentEntries,
    };
    onSaveAttendance(record);
  };

  // Stats calculation
  const total = classStudents.length;
  const presentCount = classStudents.filter(
    (s) => (currentEntries[s.id] || 'present') === 'present'
  ).length;
  const absentCount = classStudents.filter(
    (s) => currentEntries[s.id] === 'absent'
  ).length;
  const lateCount = classStudents.filter(
    (s) => currentEntries[s.id] === 'late'
  ).length;
  const excusedCount = classStudents.filter(
    (s) => currentEntries[s.id] === 'excused'
  ).length;

  return (
    <div className="space-y-6">
      {/* Control Bar: Class selector, Date picker, Quick Action, Save button */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Chọn lớp */}
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Lớp điểm danh
              </label>
              <select
                id="attendance-class-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-800"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.studentCount} HS)
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn ngày */}
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Ngày học
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="attendance-date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Tất cả có mặt</span>
            </button>

            <button
              onClick={handleSave}
              id="btn-save-attendance"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu điểm danh</span>
            </button>
          </div>
        </div>

        {/* Attendance Summary Stat Badges */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-2xs text-slate-500 font-medium block">Tổng số học sinh</span>
            <span className="text-lg font-bold text-slate-800">{total}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
            <span className="text-2xs text-emerald-700 font-medium block">Có mặt</span>
            <span className="text-lg font-bold text-emerald-600">{presentCount}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100">
            <span className="text-2xs text-rose-700 font-medium block">Vắng không phép</span>
            <span className="text-lg font-bold text-rose-600">{absentCount}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
            <span className="text-2xs text-amber-700 font-medium block">Đi muộn</span>
            <span className="text-lg font-bold text-amber-600">{lateCount}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
            <span className="text-2xs text-blue-700 font-medium block">Có phép</span>
            <span className="text-lg font-bold text-blue-600">{excusedCount}</span>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="font-semibold text-slate-800 text-sm">
            Danh sách điểm danh lớp {currentClass?.name} – Ngày {selectedDate}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Chạm hoặc nhấp để chọn nhanh trạng thái
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[200px]">Họ và tên học sinh</th>
                <th className="py-3 px-4 w-28 text-center">Tỷ lệ chuyên cần</th>
                <th className="py-3 px-4 min-w-[340px]">Điểm danh hôm nay</th>
                <th className="py-3 px-4 min-w-[140px]">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Chưa có học sinh nào thuộc lớp {currentClass?.name}. Hãy vào tab Học sinh để thêm mới.
                  </td>
                </tr>
              ) : (
                classStudents.map((std, idx) => {
                  const currentStatus = currentEntries[std.id] || 'present';
                  return (
                    <tr
                      key={std.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        currentStatus === 'absent'
                          ? 'bg-rose-50/20'
                          : currentStatus === 'late'
                          ? 'bg-amber-50/20'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{std.name}</div>
                        <div className="text-2xs text-slate-400">{std.studentCode}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-semibold text-slate-700">
                          {std.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {/* 4 Touch-friendly status buttons */}
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'present')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Có mặt</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'absent')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/80'
                            }`}
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Vắng</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'late')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/80'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Đi muộn</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'excused')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                              currentStatus === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Có phép</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {std.status === 'attention' && (
                          <span className="text-rose-600 font-medium">⚠️ {std.attentionReason || 'Cần chú ý'}</span>
                        )}
                        {std.status !== 'attention' && (std.notes || 'Bình thường')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
