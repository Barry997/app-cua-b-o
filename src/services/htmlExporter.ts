import { storageService } from './storageService';

export function generateSingleFileHtml(): string {
  const profile = storageService.getProfile();
  const classes = storageService.getClasses();
  const students = storageService.getStudents();
  const assignments = storageService.getAssignments();
  const plans = storageService.getPlans();
  const attendance = storageService.getAttendance();
  const gradeConfig = storageService.getGradeConfig();

  const initialDataJson = JSON.stringify({
    profile,
    classes,
    students,
    assignments,
    plans,
    attendance,
    gradeConfig,
  });

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QUẢN TRỊ HỌC TẬP – ANH VĂN THPT</title>
  <style>
    :root {
      --primary: #1d4ed8;
      --primary-hover: #1e40af;
      --primary-light: #eff6ff;
      --surface: #ffffff;
      --background: #f8fafc;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #16a34a;
      --success-bg: #dcfce7;
      --warning: #d97706;
      --warning-bg: #fef3c7;
      --danger: #dc2626;
      --danger-bg: #fee2e2;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    body { background-color: var(--background); color: var(--text-main); display: flex; height: 100vh; overflow: hidden; }
    
    /* Layout */
    .sidebar { width: 260px; background: #ffffff; border-right: 1px solid var(--border); display: flex; flex-direction: column; justify-content: space-between; z-index: 20; }
    .brand { padding: 20px; border-bottom: 1px solid var(--border); }
    .brand h1 { font-size: 16px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; }
    .brand p { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    
    .nav { list-style: none; padding: 12px 8px; flex: 1; overflow-y: auto; }
    .nav-item { margin-bottom: 4px; }
    .nav-btn { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: none; background: transparent; color: #334155; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; text-align: left; transition: all 0.2s; }
    .nav-btn:hover { background: var(--primary-light); color: var(--primary); }
    .nav-btn.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
    
    .teacher-box { padding: 16px; margin: 12px; background: #f1f5f9; border-radius: 8px; border: 1px solid var(--border); }
    .teacher-box .name { font-weight: 700; font-size: 14px; color: #1e293b; }
    .teacher-box .role { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .teacher-box .school { font-size: 12px; color: var(--primary); font-weight: 500; margin-top: 2px; }
    
    .main { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    .topbar { height: 60px; background: #ffffff; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
    .topbar h2 { font-size: 17px; font-weight: 600; color: #1e293b; }
    .top-actions { display: flex; gap: 10px; align-items: center; }
    
    .content-area { flex: 1; overflow-y: auto; padding: 24px; }
    
    /* Cards & Grids */
    .card { background: #ffffff; border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 20px; margin-bottom: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 24px; }
    
    .stat-card { background: #ffffff; border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; }
    .stat-val { font-size: 26px; font-weight: 700; color: #1e293b; margin-top: 4px; }
    .stat-lbl { font-size: 13px; color: var(--text-muted); font-weight: 500; }
    
    /* Tables */
    .table-container { overflow-x: auto; background: #ffffff; border-radius: 8px; border: 1px solid var(--border); }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #f8fafc; padding: 12px 14px; font-weight: 600; color: #475569; border-bottom: 1px solid var(--border); white-space: nowrap; }
    td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: #1e293b; }
    tr:last-child td { border-bottom: none; }
    tr:hover { background: #f8fafc; }
    
    /* Badges */
    .badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
    .badge-success { background: var(--success-bg); color: var(--success); }
    .badge-warning { background: var(--warning-bg); color: var(--warning); }
    .badge-danger { background: var(--danger-bg); color: var(--danger); }
    .badge-info { background: var(--primary-light); color: var(--primary); }
    
    /* Buttons */
    .btn { padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; border: 1px solid transparent; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-outline { background: white; border-color: var(--border); color: #334155; }
    .btn-outline:hover { background: #f1f5f9; }
    .btn-danger { background: var(--danger); color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    
    /* Form controls */
    .input, select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 13px; color: #1e293b; outline: none; }
    .input:focus, select:focus { border-color: var(--primary); }
    
    /* Bar graph */
    .chart-bar { background: #f1f5f9; border-radius: 4px; height: 10px; overflow: hidden; margin-top: 6px; }
    .chart-bar-fill { height: 100%; border-radius: 4px; }
    
    /* Toast */
    #toast { position: fixed; bottom: 24px; right: 24px; background: #0f172a; color: white; padding: 12px 20px; border-radius: 8px; font-size: 13px; display: none; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    
    /* Modal */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: none; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: white; border-radius: 12px; width: 90%; max-width: 500px; padding: 24px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
    .modal h3 { font-size: 16px; margin-bottom: 16px; }
    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div>
      <div class="brand">
        <h1 id="brand-title">QUẢN TRỊ HỌC TẬP</h1>
        <p id="brand-sub">Anh Văn THPT Hùng Vương</p>
      </div>
      <ul class="nav">
        <li class="nav-item"><button class="nav-btn active" onclick="switchTab('dashboard')">📊 1. Tổng quan</button></li>
        <li class="nav-item"><button class="nav-btn" onclick="switchTab('classes')">🏫 2. Lớp học</button></li>
        <li class="nav-item"><button class="nav-btn" onclick="switchTab('students')">👨‍🎓 3. Học sinh</button></li>
        <li class="nav-item"><button class="nav-btn" onclick="switchTab('attendance')">📋 4. Chuyên cần</button></li>
        <li class="nav-item"><button class="nav-btn" onclick="switchTab('grades')">📝 5. Điểm số</button></li>
        <li class="nav-item"><button class="nav-btn" onclick="switchTab('assignments')">📚 6. Bài tập</button></li>
        <li class="nav-item"><button class="nav-btn" onclick="switchTab('plans')">📅 7. Kế hoạch giảng dạy</button></li>
        <li class="nav-item"><button class="nav-btn" onclick="switchTab('statistics')">📈 8. Thống kê</button></li>
      </ul>
    </div>
    
    <div class="teacher-box">
      <div class="name" id="sb-teacher">Minh Bảo</div>
      <div class="role" id="sb-role">Giáo viên Anh Văn</div>
      <div class="school" id="sb-school">THPT HÙNG VƯƠNG</div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="main">
    <header class="topbar">
      <h2 id="page-title">Tổng quan hoạt động giảng dạy</h2>
      <div class="top-actions">
        <button class="btn btn-outline btn-sm" onclick="resetDataPrompt()">🔄 Khôi phục demo</button>
      </div>
    </header>

    <div class="content-area" id="content">
      <!-- Dynamic content rendered via JS -->
    </div>
  </main>

  <div id="toast">Thông báo</div>

  <script>
    // DỮ LIỆU TẬP TRUNG (LƯU LOCALSTORAGE)
    const STORAGE_KEY = 'qtht_single_file_data_v1';
    const rawDefault = ${initialDataJson};

    let AppState = (function() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : rawDefault;
      } catch(e) {
        return rawDefault;
      }
    })();

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
      } catch(e) {
        console.error(e);
      }
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.display = 'block';
      setTimeout(() => { t.style.display = 'none'; }, 2600);
    }

    let currentTab = 'dashboard';

    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.nav-btn').forEach((btn, idx) => {
        btn.classList.remove('active');
        if ((tab === 'dashboard' && idx === 0) ||
            (tab === 'classes' && idx === 1) ||
            (tab === 'students' && idx === 2) ||
            (tab === 'attendance' && idx === 3) ||
            (tab === 'grades' && idx === 4) ||
            (tab === 'assignments' && idx === 5) ||
            (tab === 'plans' && idx === 6) ||
            (tab === 'statistics' && idx === 7)) {
          btn.classList.add('active');
        }
      });
      render();
    }

    function resetDataPrompt() {
      if (confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu DEMO ban đầu? Mọi dữ liệu đã chỉnh sửa sẽ được đặt lại.')) {
        AppState = JSON.parse(JSON.stringify(rawDefault));
        saveState();
        render();
        showToast('Đã khôi phục dữ liệu mẫu thành công!');
      }
    }

    function render() {
      const p = AppState.profile;
      document.getElementById('sb-teacher').innerText = p.teacherName;
      document.getElementById('sb-role').innerText = 'Giáo viên ' + p.subject;
      document.getElementById('sb-school').innerText = p.school;

      const container = document.getElementById('content');
      if (currentTab === 'dashboard') renderDashboard(container);
      else if (currentTab === 'classes') renderClasses(container);
      else if (currentTab === 'students') renderStudents(container);
      else if (currentTab === 'attendance') renderAttendance(container);
      else if (currentTab === 'grades') renderGrades(container);
      else if (currentTab === 'assignments') renderAssignments(container);
      else if (currentTab === 'plans') renderPlans(container);
      else if (currentTab === 'statistics') renderStatistics(container);
    }

    function renderDashboard(container) {
      const p = AppState.profile;
      const attentionCount = AppState.students.filter(s => s.status === 'attention').length;
      const activeAssignmentsCount = AppState.assignments.filter(a => a.status === 'ongoing').length;
      
      container.innerHTML = \`
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 22px; font-weight: 700; color: #1e293b;">\${p.greetingTitle}</h2>
          <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">\${p.subTitle} - Trường: \${p.school}</p>
        </div>

        <div class="grid-4">
          <div class="stat-card">
            <div>
              <div class="stat-lbl">Số lớp đang dạy</div>
              <div class="stat-val">\${AppState.classes.length} <span style="font-size:14px;font-weight:normal;color:#64748b">lớp</span></div>
            </div>
            <div style="font-size: 28px;">🏫</div>
          </div>
          <div class="stat-card">
            <div>
              <div class="stat-lbl">Tổng số học sinh</div>
              <div class="stat-val">\${AppState.students.length} <span style="font-size:14px;font-weight:normal;color:#64748b">em</span></div>
            </div>
            <div style="font-size: 28px;">👨‍🎓</div>
          </div>
          <div class="stat-card">
            <div>
              <div class="stat-lbl">Bài tập đang giao</div>
              <div class="stat-val">\${activeAssignmentsCount} <span style="font-size:14px;font-weight:normal;color:#64748b">bài</span></div>
            </div>
            <div style="font-size: 28px;">📚</div>
          </div>
          <div class="stat-card" style="border-left: 4px solid var(--danger);">
            <div>
              <div class="stat-lbl">Học sinh cần chú ý</div>
              <div class="stat-val" style="color: var(--danger)">\${attentionCount} <span style="font-size:14px;font-weight:normal;color:#64748b">em</span></div>
            </div>
            <div style="font-size: 28px;">⚠️</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">📊 Tỷ lệ chuyên cần các lớp</h3>
            \${AppState.classes.map(c => \`
              <div style="margin-bottom: 12px;">
                <div style="display:flex; justify-content:space-between; font-size: 13px;">
                  <span>Lớp \${c.name}</span>
                  <span style="font-weight:600; color:var(--primary);">\${c.progress}% tiến độ</span>
                </div>
                <div class="chart-bar">
                  <div class="chart-bar-fill" style="width: \${c.progress}%; background: var(--primary);"></div>
                </div>
              </div>
            \`).join('')}
          </div>

          <div class="card">
            <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">⚠️ Học sinh cần hỗ trợ đặc biệt</h3>
            \${AppState.students.filter(s => s.status === 'attention').map(s => \`
              <div style="padding: 10px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; margin-bottom: 8px; font-size: 13px;">
                <div style="display:flex; justify-content:space-between;">
                  <strong style="color: #9f1239;">\${s.name} (\${s.className})</strong>
                  <span class="badge badge-danger">ĐTB: \${s.averageScore || 'Chưa có'}</span>
                </div>
                <p style="color: #475569; font-size: 12px; margin-top: 4px;">\${s.attentionReason || s.notes || 'Cần bổ trợ kiến thức'}</p>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function renderClasses(container) {
      container.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight:600;">Danh sách lớp học đang phụ trách</h3>
          <button class="btn btn-primary" onclick="promptAddClass()">+ Thêm lớp</button>
        </div>
        <div class="grid-2">
          \${AppState.classes.map(c => \`
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <h4 style="font-size: 18px; font-weight: 700; color: var(--primary);">Lớp \${c.name}</h4>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">\${c.gradeLevel} • \${c.room || 'Phòng học chính'}</div>
                </div>
                <span class="badge badge-info">\${c.studentCount} Học sinh</span>
              </div>
              <div style="margin: 16px 0;">
                <div style="display:flex; justify-content:space-between; font-size: 12px; color: var(--text-muted);">
                  <span>Tiến độ chương trình</span>
                  <span style="font-weight:600; color: var(--text-main);">\${c.progress}%</span>
                </div>
                <div class="chart-bar">
                  <div class="chart-bar-fill" style="width:\${c.progress}%; background:var(--primary);"></div>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; pt-2; border-top: 1px solid var(--border); padding-top: 12px;">
                <span style="font-size: 12px; color: var(--text-muted);">Đang giao: <strong>\${c.activeAssignments} bài tập</strong></span>
                <div>
                  <button class="btn btn-outline btn-sm" onclick="promptEditClass('\${c.id}')">Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteClassPrompt('\${c.id}')">Xóa</button>
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    function promptAddClass() {
      const name = prompt('Nhập tên lớp mới (ví dụ: 10A3):');
      if (!name) return;
      const count = parseInt(prompt('Sĩ số học sinh:', '40')) || 40;
      AppState.classes.push({
        id: 'cls-' + Date.now(),
        name: name.trim(),
        gradeLevel: 'Khối ' + name.trim().slice(0, 2),
        studentCount: count,
        subject: AppState.profile.subject,
        teacher: AppState.profile.teacherName,
        progress: 0,
        activeAssignments: 0,
        room: 'Phòng học mới'
      });
      saveState();
      render();
      showToast('Đã thêm lớp học ' + name);
    }

    function promptEditClass(id) {
      const c = AppState.classes.find(x => x.id === id);
      if (!c) return;
      const newName = prompt('Tên lớp:', c.name);
      if (!newName) return;
      const newProgress = parseInt(prompt('Tiến độ chương trình (%):', c.progress)) || 0;
      c.name = newName;
      c.progress = Math.min(100, Math.max(0, newProgress));
      saveState();
      render();
      showToast('Cập nhật lớp thành công');
    }

    function deleteClassPrompt(id) {
      if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa lớp này không? Thao tác không thể hoàn tác.')) {
        AppState.classes = AppState.classes.filter(x => x.id !== id);
        saveState();
        render();
        showToast('Đã xóa lớp học thành công');
      }
    }

    function renderStudents(container) {
      container.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <input type="text" id="std-search" class="input" placeholder="Tìm kiếm học sinh..." oninput="filterStudents()" style="width: 250px;">
          <div style="display:flex; gap: 8px;">
            <select id="std-class-filter" class="input" onchange="filterStudents()">
              <option value="">Tất cả các lớp</option>
              \${AppState.classes.map(c => \`<option value="\${c.name}">Lớp \${c.name}</option>\`).join('')}
            </select>
            <select id="std-status-filter" class="input" onchange="filterStudents()">
              <option value="">Tất cả trạng thái</option>
              <option value="good">Tốt</option>
              <option value="stable">Ổn định</option>
              <option value="attention">Cần chú ý</option>
            </select>
            <button class="btn btn-primary" onclick="promptAddStudent()">+ Thêm học sinh</button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>Chuyên cần</th>
                <th>Điểm TB</th>
                <th>Bài tập hoàn thành</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody id="student-tbody">
              <!-- Rendered by filterStudents() -->
            </tbody>
          </table>
        </div>
      \`;
      filterStudents();
    }

    function filterStudents() {
      const q = (document.getElementById('std-search')?.value || '').toLowerCase();
      const cls = document.getElementById('std-class-filter')?.value || '';
      const st = document.getElementById('std-status-filter')?.value || '';

      const filtered = AppState.students.filter(s => {
        const matchQ = s.name.toLowerCase().includes(q) || (s.studentCode && s.studentCode.toLowerCase().includes(q));
        const matchCls = !cls || s.className === cls;
        const matchSt = !st || s.status === st;
        return matchQ && matchCls && matchSt;
      });

      const tbody = document.getElementById('student-tbody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color: #94a3b8;">Không tìm thấy học sinh phù hợp</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map((s, idx) => {
        let badgeClass = 'badge-info';
        let badgeText = 'Ổn định';
        if (s.status === 'good') { badgeClass = 'badge-success'; badgeText = 'Tốt'; }
        else if (s.status === 'attention') { badgeClass = 'badge-danger'; badgeText = 'Cần chú ý'; }

        return \`
          <tr>
            <td>\${idx + 1}</td>
            <td><strong>\${s.name}</strong><br><span style="font-size:11px;color:#64748b">\${s.studentCode || ''}</span></td>
            <td>\${s.className}</td>
            <td>\${s.attendanceRate}%</td>
            <td><strong style="color:\${(s.averageScore||0)<5?'#dc2626':'inherit'}">\${s.averageScore || '-'}</strong></td>
            <td>\${s.assignmentsCompleted}/\${s.totalAssignments}</td>
            <td><span class="badge \${badgeClass}">\${badgeText}</span></td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="editStudentPrompt('\${s.id}')">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="deleteStudentPrompt('\${s.id}')">Xóa</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function promptAddStudent() {
      const name = prompt('Nhập họ và tên học sinh:');
      if (!name) return;
      const cls = prompt('Nhập tên lớp (ví dụ: ' + (AppState.classes[0]?.name || '10A1') + '):', AppState.classes[0]?.name || '10A1');
      if (!cls) return;

      const newStd = {
        id: 'std-' + Date.now(),
        studentCode: 'HS-' + Math.floor(1000 + Math.random() * 9000),
        name: name.trim(),
        classId: 'cls-' + cls,
        className: cls.trim(),
        gender: 'Nam',
        attendanceRate: 100,
        regularScores: [8.0],
        midtermScore: 8.0,
        finalScore: 8.0,
        averageScore: 8.0,
        assignmentsCompleted: 5,
        totalAssignments: 5,
        status: 'stable',
        notes: ''
      };
      AppState.students.push(newStd);
      saveState();
      render();
      showToast('Đã thêm học sinh: ' + name);
    }

    function editStudentPrompt(id) {
      const s = AppState.students.find(x => x.id === id);
      if (!s) return;
      const newName = prompt('Sửa tên học sinh:', s.name);
      if (!newName) return;
      const st = prompt('Trạng thái (good: Tốt / stable: Ổn định / attention: Cần chú ý):', s.status);
      s.name = newName;
      if (st && ['good', 'stable', 'attention'].includes(st)) s.status = st;
      saveState();
      render();
      showToast('Đã cập nhật thông tin học sinh');
    }

    function deleteStudentPrompt(id) {
      if (confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi danh sách?')) {
        AppState.students = AppState.students.filter(x => x.id !== id);
        saveState();
        render();
        showToast('Đã xóa học sinh');
      }
    }

    function renderAttendance(container) {
      const cls = AppState.classes[0]?.name || '';
      container.innerHTML = \`
        <div class="card" style="margin-bottom: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap: 12px;">
            <div style="display:flex; gap: 12px; align-items:center;">
              <label style="font-size:13px; font-weight:600;">Lớp:</label>
              <select id="att-cls" class="input" onchange="renderAttendanceSheet()">
                \${AppState.classes.map(c => \`<option value="\${c.name}">Lớp \${c.name}</option>\`).join('')}
              </select>
              <label style="font-size:13px; font-weight:600;">Ngày:</label>
              <input type="date" id="att-date" class="input" value="\${new Date().toISOString().split('T')[0]}">
            </div>
            <div style="display:flex; gap: 8px;">
              <button class="btn btn-outline" onclick="markAllPresent()">Tất cả có mặt</button>
              <button class="btn btn-primary" onclick="saveAttendanceRecord()">💾 Lưu điểm danh</button>
            </div>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>Trạng thái điểm danh</th>
              </tr>
            </thead>
            <tbody id="att-tbody">
              <!-- Rendered via renderAttendanceSheet() -->
            </tbody>
          </table>
        </div>
      \`;
      renderAttendanceSheet();
    }

    let currentAttendanceMap = {};
    function renderAttendanceSheet() {
      const cls = document.getElementById('att-cls')?.value || AppState.classes[0]?.name;
      const students = AppState.students.filter(s => s.className === cls);
      const tbody = document.getElementById('att-tbody');
      if (!tbody) return;

      tbody.innerHTML = students.map((s, idx) => {
        const val = currentAttendanceMap[s.id] || 'present';
        return \`
          <tr>
            <td>\${idx + 1}</td>
            <td><strong>\${s.name}</strong></td>
            <td>\${s.className}</td>
            <td>
              <div style="display:flex; gap: 8px;">
                <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer;">
                  <input type="radio" name="att_\${s.id}" value="present" \${val==='present'?'checked':''} onchange="currentAttendanceMap['\${s.id}']='present'"> Có mặt
                </label>
                <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer; color:#dc2626;">
                  <input type="radio" name="att_\${s.id}" value="absent" \${val==='absent'?'checked':''} onchange="currentAttendanceMap['\${s.id}']='absent'"> Vắng
                </label>
                <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer; color:#d97706;">
                  <input type="radio" name="att_\${s.id}" value="late" \${val==='late'?'checked':''} onchange="currentAttendanceMap['\${s.id}']='late'"> Đi muộn
                </label>
                <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer; color:#2563eb;">
                  <input type="radio" name="att_\${s.id}" value="excused" \${val==='excused'?'checked':''} onchange="currentAttendanceMap['\${s.id}']='excused'"> Có phép
                </label>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function markAllPresent() {
      const cls = document.getElementById('att-cls')?.value;
      AppState.students.filter(s => s.className === cls).forEach(s => {
        currentAttendanceMap[s.id] = 'present';
      });
      renderAttendanceSheet();
      showToast('Đã chọn Có mặt cho toàn bộ học sinh');
    }

    function saveAttendanceRecord() {
      showToast('Đã lưu điểm danh thành công!');
    }

    function renderGrades(container) {
      container.innerHTML = \`
        <div class="card" style="margin-bottom: 16px; background: #f0fdf4; border-color: #bbf7d0;">
          <strong style="color: #166534; font-size: 13px;">💡 Lưu ý công thức tính điểm:</strong>
          <p style="color: #15803d; font-size: 12px; margin-top: 4px;">\${AppState.gradeConfig.formulaDescription}</p>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>ĐĐG Thường xuyên</th>
                <th>Giữa kỳ</th>
                <th>Cuối kỳ</th>
                <th>Điểm TB</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              \${AppState.students.map((s, idx) => \`
                <tr>
                  <td>\${idx + 1}</td>
                  <td><strong>\${s.name}</strong></td>
                  <td>\${s.className}</td>
                  <td>\${(s.regularScores || []).join(', ')}</td>
                  <td>\${s.midtermScore !== null ? s.midtermScore : '-'}</td>
                  <td>\${s.finalScore !== null ? s.finalScore : '-'}</td>
                  <td><strong style="color: \${(s.averageScore||0)<5?'#dc2626':'#16a34a'}">\${s.averageScore !== null ? s.averageScore : '-'}</strong></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="promptEditGrades('\${s.id}')">Nhập điểm</button>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \`;
    }

    function promptEditGrades(id) {
      const s = AppState.students.find(x => x.id === id);
      if (!s) return;
      const reg = prompt('Điểm thường xuyên (cách nhau bởi dấu phẩy, ví dụ: 8, 8.5):', (s.regularScores || []).join(', '));
      if (reg === null) return;
      const mid = prompt('Điểm Giữa kỳ:', s.midtermScore || '');
      if (mid === null) return;
      const fin = prompt('Điểm Cuối kỳ:', s.finalScore || '');
      if (fin === null) return;

      const regScores = reg.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
      const midScore = mid ? parseFloat(mid) : null;
      const finScore = fin ? parseFloat(fin) : null;

      s.regularScores = regScores;
      s.midtermScore = midScore;
      s.finalScore = finScore;

      if (regScores.length > 0 && midScore !== null && finScore !== null) {
        const regAvg = regScores.reduce((a,b)=>a+b,0) / regScores.length;
        s.averageScore = Math.round(((regAvg * 1 + midScore * 2 + finScore * 3) / 6) * 10) / 10;
      }
      saveState();
      render();
      showToast('Đã lưu điểm học sinh ' + s.name);
    }

    function renderAssignments(container) {
      container.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight:600;">Danh sách bài tập và nhiệm vụ học tập</h3>
          <button class="btn btn-primary" onclick="promptAddAssignment()">+ Tạo bài tập mới</button>
        </div>
        <div class="grid-2">
          \${AppState.assignments.map(a => \`
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <h4 style="font-size: 15px; font-weight: 700;">\${a.title}</h4>
                  <span style="font-size: 12px; color: var(--primary); font-weight: 500;">Lớp \${a.className}</span>
                </div>
                <span class="badge \${a.status==='completed'?'badge-success':'badge-warning'}">\${a.status==='completed'?'Đã chấm':'Đang giao'}</span>
              </div>
              <p style="font-size: 13px; color: #475569; margin: 12px 0;">\${a.content}</p>
              <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
                📅 Ngày giao: \${a.assignedDate} • Hạn nộp: <strong>\${a.dueDate}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border); padding-top: 10px;">
                <span style="font-size: 12px;">Hoàn thành: <strong>\${a.completedCount}/\${a.totalCount}</strong></span>
                <button class="btn btn-danger btn-sm" onclick="deleteAssignmentPrompt('\${a.id}')">Xóa</button>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    function promptAddAssignment() {
      const title = prompt('Tiêu đề bài tập:');
      if (!title) return;
      const cls = prompt('Giao cho lớp:', AppState.classes[0]?.name || '10A1');
      if (!cls) return;
      const content = prompt('Nội dung yêu cầu bài tập:', 'Làm bài tập trang SGK...');
      const dueDate = prompt('Hạn nộp (YYYY-MM-DD):', '2026-09-30');

      AppState.assignments.push({
        id: 'asn-' + Date.now(),
        title: title.trim(),
        classId: 'cls-' + cls,
        className: cls.trim(),
        content: content || '',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate || '',
        completedCount: 0,
        totalCount: 40,
        status: 'ongoing'
      });
      saveState();
      render();
      showToast('Đã tạo bài tập mới');
    }

    function deleteAssignmentPrompt(id) {
      if (confirm('Bạn có chắc muốn xóa bài tập này?')) {
        AppState.assignments = AppState.assignments.filter(x => x.id !== id);
        saveState();
        render();
        showToast('Đã xóa bài tập');
      }
    }

    function renderPlans(container) {
      container.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight:600;">Kế hoạch và tiến độ giảng dạy</h3>
          <button class="btn btn-primary" onclick="promptAddPlan()">+ Thêm kế hoạch tuần</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Tuần</th>
                <th>Lớp</th>
                <th>Chủ đề / Bài học</th>
                <th>Mục tiêu bài giảng</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              \${AppState.plans.map(p => \`
                <tr>
                  <td><strong>Tuần \${p.weekNumber}</strong></td>
                  <td>\${p.className}</td>
                  <td><strong>\${p.topic}</strong></td>
                  <td style="max-width: 250px;">\${p.objectives}</td>
                  <td><span class="badge \${p.status==='completed'?'badge-success':(p.status==='in_progress'?'badge-warning':'badge-info')}">\${p.status==='completed'?'Hoàn thành':(p.status==='in_progress'?'Đang dạy':'Chưa dạy')}</span></td>
                  <td>\${p.notes || '-'}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="deletePlanPrompt('\${p.id}')">Xóa</button></td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \`;
    }

    function promptAddPlan() {
      const week = parseInt(prompt('Tuần số:', '7')) || 7;
      const topic = prompt('Chủ đề / Bài dạy:');
      if (!topic) return;
      const objectives = prompt('Mục tiêu cần đạt:', 'Rèn luyện kỹ năng...');

      AppState.plans.push({
        id: 'plan-' + Date.now(),
        weekNumber: week,
        classId: AppState.classes[0]?.id || 'cls-1',
        className: AppState.classes[0]?.name || '10A1',
        topic: topic.trim(),
        objectives: objectives || '',
        status: 'upcoming',
        notes: ''
      });
      saveState();
      render();
      showToast('Đã thêm kế hoạch giảng dạy');
    }

    function deletePlanPrompt(id) {
      if (confirm('Xác nhận xóa mục kế hoạch này?')) {
        AppState.plans = AppState.plans.filter(x => x.id !== id);
        saveState();
        render();
        showToast('Đã xóa kế hoạch');
      }
    }

    function renderStatistics(container) {
      const goodCount = AppState.students.filter(s => (s.averageScore || 0) >= 8.0).length;
      const midCount = AppState.students.filter(s => (s.averageScore || 0) >= 6.5 && (s.averageScore || 0) < 8.0).length;
      const lowCount = AppState.students.filter(s => (s.averageScore || 0) < 6.5).length;
      const total = AppState.students.length || 1;

      container.innerHTML = \`
        <div class="grid-2">
          <div class="card">
            <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 16px;">Phân bố học lực học sinh</h3>
            <div style="margin-bottom: 12px;">
              <div style="display:flex; justify-content:space-between; font-size:13px;">
                <span>Giỏi & Xuất sắc (≥ 8.0)</span>
                <span style="font-weight:600; color:var(--success);">\${goodCount} HS (\${Math.round(goodCount/total*100)}%)</span>
              </div>
              <div class="chart-bar"><div class="chart-bar-fill" style="width:\${goodCount/total*100}%; background:var(--success);"></div></div>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="display:flex; justify-content:space-between; font-size:13px;">
                <span>Khá (6.5 - 7.9)</span>
                <span style="font-weight:600; color:var(--primary);">\${midCount} HS (\${Math.round(midCount/total*100)}%)</span>
              </div>
              <div class="chart-bar"><div class="chart-bar-fill" style="width:\${midCount/total*100}%; background:var(--primary);"></div></div>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="display:flex; justify-content:space-between; font-size:13px;">
                <span>Trung bình & Cần chú ý (< 6.5)</span>
                <span style="font-weight:600; color:var(--danger);">\${lowCount} HS (\${Math.round(lowCount/total*100)}%)</span>
              </div>
              <div class="chart-bar"><div class="chart-bar-fill" style="width:\${lowCount/total*100}%; background:var(--danger);"></div></div>
            </div>
          </div>

          <div class="card">
            <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 16px;">Tiến độ bài tập các lớp</h3>
            \${AppState.assignments.map(a => {
              const pct = Math.round((a.completedCount / (a.totalCount || 1)) * 100);
              return \`
                <div style="margin-bottom: 14px;">
                  <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span>\${a.title} (Lớp \${a.className})</span>
                    <strong>\${pct}% (\${a.completedCount}/\${a.totalCount})</strong>
                  </div>
                  <div class="chart-bar"><div class="chart-bar-fill" style="width:\${pct}%; background:var(--primary);"></div></div>
                </div>
              \`;
            }).join('')}
          </div>
        </div>
      \`;
    }

    // Khởi động giao diện ban đầu
    render();
  </script>
</body>
</html>`;
}

export function downloadStandaloneHtml(): void {
  const htmlContent = generateSingleFileHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'QUAN_TRI_HOC_TAP_ANH_VAN_THPT.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const exportToStandaloneHTML = (state?: any): void => {
  downloadStandaloneHtml();
};
