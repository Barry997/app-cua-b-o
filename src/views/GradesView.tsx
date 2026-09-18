import React, { useState } from 'react';
import { ClassItem, GradeConfig, Student } from '../types';
import { calculateAverageScore } from '../data/initialData';
import {
  Award,
  Filter,
  Info,
  Settings2,
  Check,
  Save,
  AlertTriangle,
  Edit2,
  X,
} from 'lucide-react';

interface GradesViewProps {
  students: Student[];
  classes: ClassItem[];
  gradeConfig: GradeConfig;
  onUpdateStudent: (updated: Student) => void;
  onUpdateGradeConfig: (config: GradeConfig) => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  classes,
  gradeConfig,
  onUpdateStudent,
  onUpdateGradeConfig,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Quick edit modal form values
  const [editRegularStr, setEditRegularStr] = useState('');
  const [editMidtermStr, setEditMidtermStr] = useState('');
  const [editFinalStr, setEditFinalStr] = useState('');

  // Config modal state
  const [configForm, setConfigForm] = useState<GradeConfig>({ ...gradeConfig });

  const filtered = selectedClass
    ? students.filter((s) => s.className === selectedClass)
    : students;

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setEditRegularStr((s.regularScores || []).join(', '));
    setEditMidtermStr(s.midtermScore !== null ? String(s.midtermScore) : '');
    setEditFinalStr(s.finalScore !== null ? String(s.finalScore) : '');
  };

  const handleSaveStudentGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    // Parse regular scores
    const regularScores = editRegularStr
      .split(',')
      .map((x) => parseFloat(x.trim()))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 10);

    const midtermScore =
      editMidtermStr.trim() !== '' ? parseFloat(editMidtermStr) : null;
    const finalScore =
      editFinalStr.trim() !== '' ? parseFloat(editFinalStr) : null;

    const avg = calculateAverageScore(
      regularScores,
      midtermScore,
      finalScore,
      gradeConfig
    );

    const updated: Student = {
      ...editingStudent,
      regularScores,
      midtermScore: midtermScore !== null && !isNaN(midtermScore) ? midtermScore : null,
      finalScore: finalScore !== null && !isNaN(finalScore) ? finalScore : null,
      averageScore: avg,
      status: avg !== null && avg < 5.0 ? 'attention' : editingStudent.status,
      attentionReason:
        avg !== null && avg < 5.0
          ? `Điểm trung bình ${avg.toFixed(1)} dưới 5.0 cần kèm cặp thêm`
          : editingStudent.attentionReason,
    };

    onUpdateStudent(updated);
    setEditingStudent(null);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: GradeConfig = {
      ...configForm,
      formulaDescription: `ĐTB = (Điểm TX × ${configForm.regularWeight} + Giữa kỳ × ${configForm.midtermWeight} + Cuối kỳ × ${configForm.finalWeight}) / ${
        configForm.regularWeight + configForm.midtermWeight + configForm.finalWeight
      } (Công thức minh họa)`,
    };
    onUpdateGradeConfig(updatedConfig);
    setShowConfigModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Formula Transparency Notice Card (Required by user: "không tự áp đặt công thức, ghi rõ đây là công thức minh họa") */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-950">
              Công thức tính Điểm trung bình (ĐTB) minh họa:
            </div>
            <p className="text-blue-800 mt-0.5">
              {gradeConfig.formulaDescription}. Thầy cô có thể điều chỉnh hệ số điểm
              tùy theo Thông tư / Quy chế đánh giá học sinh của nhà trường.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setConfigForm({ ...gradeConfig });
            setShowConfigModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-100/50 text-blue-700 font-semibold rounded-lg shrink-0 transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Sửa trọng số công thức</span>
        </button>
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Lọc theo lớp:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
          >
            <option value="">Tất cả các lớp ({students.length} HS)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                Lớp {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>≥ 8.0: Giỏi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>6.5 - 7.9: Khá</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>&lt; 5.0: Cần chú ý</span>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 min-w-[180px]">Họ và tên</th>
                <th className="py-3.5 px-4 w-20">Lớp</th>
                <th className="py-3.5 px-4 min-w-[160px]">
                  Điểm Thường xuyên (TX)
                </th>
                <th className="py-3.5 px-4 w-24 text-center">Giữa kỳ</th>
                <th className="py-3.5 px-4 w-24 text-center">Cuối kỳ</th>
                <th className="py-3.5 px-4 w-28 text-center bg-slate-100/60 font-bold">
                  Điểm TB
                </th>
                <th className="py-3.5 px-4 min-w-[150px]">Đánh giá</th>
                <th className="py-3.5 px-4 w-24 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((std, idx) => {
                const isAttention =
                  std.averageScore !== null && std.averageScore < 5.0;

                return (
                  <tr
                    key={std.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isAttention ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{std.name}</div>
                      <div className="text-2xs text-slate-400">{std.studentCode}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {std.className}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {std.regularScores && std.regularScores.length > 0 ? (
                          std.regularScores.map((score, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-xs"
                            >
                              {score.toFixed(1)}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium">
                      {std.midtermScore !== null ? (
                        <span
                          className={
                            std.midtermScore < 5.0
                              ? 'text-rose-600 font-bold'
                              : 'text-slate-800'
                          }
                        >
                          {std.midtermScore.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium">
                      {std.finalScore !== null ? (
                        <span
                          className={
                            std.finalScore < 5.0
                              ? 'text-rose-600 font-bold'
                              : 'text-slate-800'
                          }
                        >
                          {std.finalScore.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-slate-50/50">
                      {std.averageScore !== null ? (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                            std.averageScore >= 8.0
                              ? 'bg-emerald-100 text-emerald-800'
                              : std.averageScore >= 6.5
                              ? 'bg-blue-100 text-blue-800'
                              : std.averageScore >= 5.0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800 font-extrabold ring-1 ring-rose-300'
                          }`}
                        >
                          {std.averageScore.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">Chưa tính</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {isAttention ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Cần phụ đạo
                        </span>
                      ) : (std.averageScore || 0) >= 8.5 ? (
                        <span className="text-emerald-600 font-semibold">
                          Xuất sắc
                        </span>
                      ) : (std.averageScore || 0) >= 7.0 ? (
                        <span className="text-blue-600 font-medium">Khá tốt</span>
                      ) : (
                        <span className="text-slate-500">Đạt yêu cầu</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(std)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Sửa điểm</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Grade Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Nhập & Sửa Điểm: {editingStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500">Lớp {editingStudent.className} • Môn Anh Văn</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentGrade} className="p-5 space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Điểm ĐĐG Thường xuyên (cách nhau bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  value={editRegularStr}
                  onChange={(e) => setEditRegularStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 8, 8.5, 9.0"
                />
                <span className="text-2xs text-slate-400 mt-1 block">
                  Nhập các cột điểm TX1, TX2, TX3...
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Điểm Giữa kỳ (hệ số 2):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editMidtermStr}
                    onChange={(e) => setEditMidtermStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 7.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Điểm Cuối kỳ (hệ số 3):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editFinalStr}
                    onChange={(e) => setEditFinalStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 8.0"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Lưu điểm & Tính lại ĐTB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Formula Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-600" />
                Cấu Hình Trọng Số Tính Điểm Trung Bình
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-5 space-y-4 text-xs">
              <p className="text-slate-500">
                Thầy cô có thể điều chỉnh hệ số tính điểm cho phù hợp với quy chế thực tế của nhà trường:
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Hệ số Điểm Thường xuyên (TX):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={configForm.regularWeight}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        regularWeight: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Hệ số Điểm Giữa kỳ (GK):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={configForm.midtermWeight}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        midtermWeight: Number(e.target.value) || 2,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Hệ số Điểm Cuối kỳ (CK):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={configForm.finalWeight}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        finalWeight: Number(e.target.value) || 3,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 font-medium">
                Tổng hệ số chia: {configForm.regularWeight + configForm.midtermWeight + configForm.finalWeight}
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Cập nhật công thức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
