import React from 'react';
import {
  ActiveTab,
  Assignment,
  ClassItem,
  Student,
  TeacherProfile,
  TeachingPlanItem,
} from '../types';
import {
  GraduationCap,
  Users,
  BookOpen,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface DashboardViewProps {
  profile: TeacherProfile;
  classes: ClassItem[];
  students: Student[];
  assignments: Assignment[];
  plans: TeachingPlanItem[];
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  classes,
  students,
  assignments,
  plans,
  onNavigate,
}) => {
  const activeAssignments = assignments.filter((a) => a.status === 'ongoing');
  const attentionStudents = students.filter((s) => s.status === 'attention');
  const totalStudentCount = classes.reduce((sum, c) => sum + c.studentCount, 0);

  // Score distribution calculation
  const validScores = students
    .map((s) => s.averageScore)
    .filter((s): s is number => s !== null);

  const scoreDist = {
    excellent: validScores.filter((s) => s >= 8.5).length,
    good: validScores.filter((s) => s >= 7.0 && s < 8.5).length,
    average: validScores.filter((s) => s >= 5.0 && s < 7.0).length,
    attention: validScores.filter((s) => s < 5.0).length,
  };

  const totalValid = validScores.length || 1;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-2 backdrop-blur-xs">
            <span>Niên khóa 2025 - 2026</span>
            <span>•</span>
            <span>Học kỳ I</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {profile.greetingTitle}
          </h2>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl font-normal">
            {profile.subTitle} – {profile.school}. Hôm nay có{' '}
            <strong className="text-white font-semibold">{classes.length} lớp học</strong> cần theo dõi chuyên cần và chấm bài tập.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-4 py-2.5 bg-white text-blue-700 font-semibold text-xs sm:text-sm rounded-xl hover:bg-blue-50 transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Điểm danh ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Số lớp đang dạy */}
        <div
          onClick={() => onNavigate('classes')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Số lớp đang dạy
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {classes.length}
            </span>
            <span className="text-xs font-medium text-slate-500">lớp ({classes.map(c => c.name).join(', ')})</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-blue-600 font-medium gap-1">
            <span>Xem danh sách lớp</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tổng số học sinh */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số học sinh
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {totalStudentCount}
            </span>
            <span className="text-xs font-medium text-slate-500">học sinh ({students.length} hồ sơ mẫu)</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-indigo-600 font-medium gap-1">
            <span>Tra cứu học sinh</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Bài tập đang giao */}
        <div
          onClick={() => onNavigate('assignments')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bài tập đang giao
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {activeAssignments.length}
            </span>
            <span className="text-xs font-medium text-slate-500">nhiệm vụ học tập</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-600 font-medium gap-1">
            <span>Quản lý bài tập</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Học sinh cần chú ý */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Học sinh cần chú ý
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600">
              {attentionStudents.length}
            </span>
            <span className="text-xs font-medium text-rose-500">em cần hỗ trợ thêm</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-rose-600 font-medium gap-1">
            <span>Xem danh sách cần chú ý</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3 Simple, Beautiful Visual Charts (As requested: Phân bố kết quả học tập, Tỷ lệ hoàn thành bài tập, Chuyên cần theo lớp) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Biểu đồ 1: Phân bố kết quả học tập */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Phân bố kết quả học tập
              </h3>
              <span className="text-xs text-slate-400">ĐTB cả đợt</span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-emerald-700 font-semibold">Giỏi & Xuất sắc (≥ 8.5)</span>
                  <span className="text-slate-600">
                    {scoreDist.excellent} HS ({Math.round((scoreDist.excellent / totalValid) * 100)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(scoreDist.excellent / totalValid) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-blue-700 font-semibold">Khá (7.0 - 8.4)</span>
                  <span className="text-slate-600">
                    {scoreDist.good} HS ({Math.round((scoreDist.good / totalValid) * 100)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(scoreDist.good / totalValid) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-amber-700 font-semibold">Trung bình (5.0 - 6.9)</span>
                  <span className="text-slate-600">
                    {scoreDist.average} HS ({Math.round((scoreDist.average / totalValid) * 100)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(scoreDist.average / totalValid) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-rose-700 font-semibold">Cần chú ý (&lt; 5.0)</span>
                  <span className="text-rose-600 font-semibold">
                    {scoreDist.attention} HS ({Math.round((scoreDist.attention / totalValid) * 100)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${(scoreDist.attention / totalValid) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigate('grades')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Mở sổ điểm chi tiết →
            </button>
          </div>
        </div>

        {/* Biểu đồ 2: Tỷ lệ hoàn thành bài tập */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tỷ lệ hoàn thành bài tập
              </h3>
              <span className="text-xs text-slate-400">Theo bài</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {assignments.slice(0, 4).map((a) => {
                const pct = Math.round((a.completedCount / a.totalCount) * 100);
                return (
                  <div key={a.id}>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700 truncate max-w-[180px]" title={a.title}>
                        {a.title} ({a.className})
                      </span>
                      <span className="text-slate-600 font-semibold">
                        {a.completedCount}/{a.totalCount} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Quản lý tất cả bài tập →
            </button>
          </div>
        </div>

        {/* Biểu đồ 3: Chuyên cần theo lớp */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Chuyên cần theo lớp
              </h3>
              <span className="text-xs text-slate-400">Tháng này</span>
            </div>

            <div className="mt-4 space-y-3">
              {classes.map((cls) => {
                // calculate average attendance of students in this class
                const classStudents = students.filter((s) => s.className === cls.name);
                const avgRate = classStudents.length
                  ? Math.round(
                      classStudents.reduce((acc, s) => acc + s.attendanceRate, 0) /
                        classStudents.length
                    )
                  : 95;

                return (
                  <div key={cls.id}>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-800 font-semibold">Lớp {cls.name}</span>
                      <span
                        className={`font-semibold ${
                          avgRate >= 95
                            ? 'text-emerald-600'
                            : avgRate >= 85
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {avgRate}% chuyên cần
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          avgRate >= 95 ? 'bg-emerald-500' : avgRate >= 85 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${avgRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Xem sổ điểm danh hôm nay →
            </button>
          </div>
        </div>
      </div>

      {/* 4 Bottom Sections: Lịch dạy / Bài tập sắp đến hạn / Hoạt động gần đây / Học sinh cần chú ý */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Lịch dạy & Kế hoạch tuần */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Lịch dạy & Kế hoạch gần đây
            </h3>
            <button
              onClick={() => onNavigate('teaching-plan')}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              Xem toàn bộ kế hoạch
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {plans.slice(0, 3).map((item) => (
              <div key={item.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      Tuần {item.weekNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      Lớp {item.className}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                    {item.topic}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{item.objectives}</p>
                </div>
                <span
                  className={`text-2xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    item.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status === 'completed'
                    ? 'Đã xong'
                    : item.status === 'in_progress'
                    ? 'Đang thực hiện'
                    : 'Chưa dạy'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Bài tập sắp đến hạn */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Bài tập sắp đến hạn nộp
            </h3>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs text-amber-600 font-medium hover:underline"
            >
              Giao bài tập mới
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {activeAssignments.slice(0, 3).map((asn) => (
              <div key={asn.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {asn.title}
                    </span>
                    <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      Lớp {asn.className}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Hạn chót: <strong className="text-slate-700">{asn.dueDate}</strong> • Đã nộp:{' '}
                    {asn.completedCount}/{asn.totalCount} học sinh
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-600 shrink-0">
                  {Math.round((asn.completedCount / asn.totalCount) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Danh sách học sinh cần chú ý */}
        <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/10 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Học sinh cần chú ý theo dõi
            </h3>
            <span className="text-xs font-semibold text-rose-600">
              {attentionStudents.length} học sinh
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {attentionStudents.map((s) => (
              <div
                key={s.id}
                className="p-3 bg-white border border-rose-200 rounded-lg text-xs flex items-start justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      Lớp {s.className}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                      ĐTB: {s.averageScore || 'Chưa có'}
                    </span>
                  </div>
                  <p className="text-rose-700 font-medium mt-1">
                    ⚠️ {s.attentionReason || s.notes || 'Cần bổ trợ kiến thức'}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('students')}
                  className="px-2.5 py-1 text-2xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md shrink-0 transition-colors"
                >
                  Hồ sơ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Hoạt động & Nhật ký gần đây */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Hoạt động giảng dạy gần đây
            </h3>
            <span className="text-xs text-slate-400">Ghi nhận tự động</span>
          </div>

          <ul className="mt-3 space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Đã hoàn thành chấm bài tập Unit 3 môn {profile.subject} cho lớp 10A1
                </p>
                <p className="text-slate-400 text-2xs mt-0.5">Hôm nay lúc 08:30</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Đã cập nhật sổ điểm danh và ghi chú học sinh nghỉ tiết môn Anh Văn
                </p>
                <p className="text-slate-400 text-2xs mt-0.5">Hôm nay lúc 07:15</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Giao bài tập video thuyết trình Speaking cho lớp 10A2 hạn nộp 19/09
                </p>
                <p className="text-slate-400 text-2xs mt-0.5">Hôm qua lúc 16:45</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Phân phối chương trình Tuần 3 hoàn thành 100% đúng tiến độ
                </p>
                <p className="text-slate-400 text-2xs mt-0.5">17/09/2026</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
