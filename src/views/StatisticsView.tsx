import React, { useState } from 'react';
import { Assignment, ClassItem, Student } from '../types';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';

interface StatisticsViewProps {
  students: Student[];
  classes: ClassItem[];
  assignments: Assignment[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  students,
  classes,
  assignments,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('');

  const filteredStudents = selectedClass
    ? students.filter((s) => s.className === selectedClass)
    : students;

  const filteredAssignments = selectedClass
    ? assignments.filter((a) => a.className === selectedClass)
    : assignments;

  // Grade distributions
  const validScores = filteredStudents
    .map((s) => s.averageScore)
    .filter((s): s is number => s !== null);

  const totalValid = validScores.length || 1;

  const dist = {
    excellent: validScores.filter((s) => s >= 8.5),
    good: validScores.filter((s) => s >= 7.0 && s < 8.5),
    average: validScores.filter((s) => s >= 5.0 && s < 7.0),
    attention: validScores.filter((s) => s < 5.0),
  };

  // Average class GPA
  const overallAvg = validScores.length
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2)
    : '0.00';

  // Overall attendance rate
  const overallAttendance = filteredStudents.length
    ? Math.round(
        filteredStudents.reduce((sum, s) => sum + s.attendanceRate, 0) /
          filteredStudents.length
      )
    : 100;

  // Overall assignment completion
  const totalSubmissions = filteredAssignments.reduce(
    (sum, a) => sum + a.completedCount,
    0
  );
  const totalAssigned = filteredAssignments.reduce(
    (sum, a) => sum + (a.totalCount || 40),
    0
  );
  const assignmentRate = totalAssigned
    ? Math.round((totalSubmissions / totalAssigned) * 100)
    : 0;

  // Attention students list
  const attentionList = filteredStudents.filter((s) => s.status === 'attention');

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Phạm vi báo cáo thống kê:
          </h3>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-blue-900"
          >
            <option value="">Toàn bộ các lớp phụ trách</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                Lớp {c.name} ({c.studentCount} HS)
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Dữ liệu: {filteredStudents.length} học sinh • {filteredAssignments.length} bài tập
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Điểm TB chung
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{overallAvg}</div>
          <p className="text-2xs text-slate-400 mt-1">Dựa trên {validScores.length} bài có điểm</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Tỷ lệ chuyên cần
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{overallAttendance}%</div>
          <p className="text-2xs text-slate-400 mt-1">Mức độ tham gia học tập</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Hoàn thành bài tập
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600">{assignmentRate}%</div>
          <p className="text-2xs text-slate-400 mt-1">
            {totalSubmissions}/{totalAssigned} lượt nộp
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase">
              HS cần theo dõi
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{attentionList.length} em</div>
          <p className="text-2xs text-rose-600 mt-1">Cần phụ đạo / nhắc nhở</p>
        </div>
      </div>

      {/* Visual Charts: Phổ điểm & Tiến độ nộp bài */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Phân bố kết quả học tập chi tiết */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              Phân bố kết quả học tập (Phổ điểm)
            </h4>
            <span className="text-xs text-slate-400">Tỷ lệ %</span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-700">Xuất sắc & Giỏi (≥ 8.5)</span>
                <span className="text-slate-800">
                  {dist.excellent.length} HS ({Math.round((dist.excellent.length / totalValid) * 100)}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(dist.excellent.length / totalValid) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-blue-700">Khá (7.0 - 8.4)</span>
                <span className="text-slate-800">
                  {dist.good.length} HS ({Math.round((dist.good.length / totalValid) * 100)}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(dist.good.length / totalValid) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-amber-700">Trung bình (5.0 - 6.9)</span>
                <span className="text-slate-800">
                  {dist.average.length} HS ({Math.round((dist.average.length / totalValid) * 100)}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(dist.average.length / totalValid) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-rose-700">Cần chú ý (&lt; 5.0)</span>
                <span className="text-rose-600 font-bold">
                  {dist.attention.length} HS ({Math.round((dist.attention.length / totalValid) * 100)}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(dist.attention.length / totalValid) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tỷ lệ hoàn thành theo từng bài tập */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Tiến độ làm bài tập học sinh
            </h4>
            <span className="text-xs text-slate-400">Từng nhiệm vụ</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {filteredAssignments.map((a) => {
              const pct = Math.round((a.completedCount / a.totalCount) * 100);
              return (
                <div key={a.id}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-800 font-semibold truncate max-w-[240px]">
                      {a.title} ({a.className})
                    </span>
                    <span className="text-slate-600 font-bold">
                      {a.completedCount}/{a.totalCount} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 85 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danh sách học sinh cần chú ý chi tiết */}
      <div className="bg-white rounded-xl border border-rose-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-rose-50/40 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h4 className="text-sm font-bold text-rose-900">
              Danh Sách Học Sinh Cần Chú Ý Đặc Biệt ({attentionList.length} học sinh)
            </h4>
          </div>
          <span className="text-xs text-rose-700 font-medium">
            Kế hoạch kèm cặp & phụ đạo môn Anh Văn
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[160px]">Họ và tên</th>
                <th className="py-3 px-4 w-20">Lớp</th>
                <th className="py-3 px-4 w-28 text-center">Chuyên cần</th>
                <th className="py-3 px-4 w-24 text-center">Điểm TB</th>
                <th className="py-3 px-4 min-w-[240px]">Nguyên nhân cần chú ý</th>
                <th className="py-3 px-4 min-w-[200px]">Giải pháp đề xuất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attentionList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-emerald-600 font-medium">
                    Không có học sinh nào ở mức cần chú ý trong phạm vi lọc đã chọn.
                  </td>
                </tr>
              ) : (
                attentionList.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {s.name}
                      <span className="block text-2xs text-slate-400 font-normal">
                        {s.studentCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {s.className}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-semibold ${
                          s.attendanceRate < 85 ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {s.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-rose-600">
                        {s.averageScore !== null ? s.averageScore.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-rose-800 font-medium text-xs">
                      ⚠️ {s.attentionReason || 'Điểm kiểm tra chưa đạt yêu cầu'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {s.notes || 'Hẹn phụ đạo 15 phút sau giờ học; phân công học nhóm.'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
