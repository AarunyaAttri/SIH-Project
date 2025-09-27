// Admin Dashboard JS – Attendance Monitoring System
// Modular, well-commented, uses sample/mock data

// 1. Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const sidebarCollapse = document.getElementById('sidebarCollapse');
if (sidebarCollapse) {
  sidebarCollapse.onclick = () => {
    sidebar.classList.toggle('collapsed');
    document.getElementById('mainContent').classList.toggle('sidebar-collapsed');
  };
}

// 2. Dark Mode Toggle
const darkModeBtn = document.createElement('button');
darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
darkModeBtn.title = 'Toggle Dark Mode';
darkModeBtn.className = 'profile-btn';
const headerActions = document.querySelector('.header-actions');
if (headerActions) headerActions.appendChild(darkModeBtn);

darkModeBtn.onclick = function() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dashboard-dark-mode', document.body.classList.contains('dark-mode'));
};
// On load, set dark mode from localStorage
if (localStorage.getItem('dashboard-dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
}

// 3. Table Search, Filter, Pagination, Export, Highlight
function filterTable(tableId, searchValue, classValue, dateValue) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const name = row.children[1]?.textContent.toLowerCase() || '';
    const className = row.children[2]?.textContent || '';
    const date = row.children[3]?.textContent || '';
    let show = true;
    if (searchValue && !name.includes(searchValue.toLowerCase())) show = false;
    if (classValue && classValue !== 'All Classes' && className !== classValue) show = false;
    if (dateValue && date !== dateValue) show = false;
    row.style.display = show ? '' : 'none';
  });
}
// Example usage: filterTable('attendanceTable', 'aarav', '10-A', '2025-09-26');

// Pagination (simple, for demo)
function paginateTable(tableId, pageSize = 10) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  let page = 1;
  function showPage(p) {
    page = p;
    rows.forEach((row, i) => {
      row.style.display = (i >= (page-1)*pageSize && i < page*pageSize) ? '' : 'none';
    });
    // Update pagination UI (not implemented here)
  }
  showPage(1);
  // Return function to change page
  return showPage;
}

// Export to CSV
function exportTableToCSV(tableId, filename = 'data.csv') {
  const table = document.getElementById(tableId);
  if (!table) return;
  let csv = '';
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cols = Array.from(row.querySelectorAll('th,td')).map(td => '"'+td.innerText.replace(/"/g,'""')+'"');
    csv += cols.join(',') + '\n';
  });
  const blob = new Blob([csv], {type: 'text/csv'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
// Export to PDF (simple, using window.print for demo)
function exportTableToPDF(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const win = window.open('', '', 'width=900,height=700');
  win.document.write('<html><head><title>Export PDF</title></head><body>' + table.outerHTML + '</body></html>');
  win.document.close();
  win.print();
}
// Highlight low attendance (<75%)
function highlightLowAttendance(tableId, percentColIdx) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.querySelectorAll('tbody tr').forEach(row => {
    const percent = parseInt(row.children[percentColIdx]?.textContent);
    if (!isNaN(percent) && percent < 75) {
      row.classList.add('low-attendance');
    } else {
      row.classList.remove('low-attendance');
    }
  });
}

// 4. Charts (Chart.js)
// Pie Chart: Present vs Absent
function renderPieChart(ctxId, present, absent) {
  if (!window.Chart) return;
  new Chart(document.getElementById(ctxId), {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Absent'],
      datasets: [{ data: [present, absent], backgroundColor: ['#2563eb', '#ef4444'], borderWidth: 0 }]
    },
    options: { cutout: '70%', plugins: { legend: { display: true, position: 'bottom' } }, responsive: true }
  });
}
// Bar/Line Chart: Weekly/Monthly Trends
function renderBarChart(ctxId, labels, data) {
  if (!window.Chart) return;
  new Chart(document.getElementById(ctxId), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Attendance %', data, backgroundColor: '#2563eb', borderRadius: 8, maxBarThickness: 40 }] },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, grid: { color: '#e0e7ef', drawBorder: false }, ticks: { color: '#23263b', font: { weight: '600' }, callback: v=>v+'%' } },
        x: { grid: { color: '#f4f7fb', drawBorder: false }, ticks: { color: '#23263b', font: { weight: '600' } } }
      }
    }
  });
}

// 5. Reports: Date Range Filter
function filterReportByDate(tableId, startDate, endDate, dateColIdx) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.querySelectorAll('tbody tr').forEach(row => {
    const date = row.children[dateColIdx]?.textContent;
    if (!date) return;
    if ((startDate && date < startDate) || (endDate && date > endDate)) {
      row.style.display = 'none';
    } else {
      row.style.display = '';
    }
  });
}

// 6. Notifications
const notifBell = document.getElementById('notifBell');
const notifBadge = document.getElementById('notifBadge');
const notifications = [
  'New student registered',
  'Attendance below 75% in 10-B',
  'Teacher S. Kumar marked attendance',
  'System update available',
  'Holiday on Oct 2'
];
notifBell && notifBell.addEventListener('click', function(e) {
  e.stopPropagation();
  let dropdown = document.getElementById('notifDropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'notifDropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '120%';
    dropdown.style.right = '0';
    dropdown.style.background = '#fff';
    dropdown.style.boxShadow = '0 2px 12px #e0e7ef';
    dropdown.style.borderRadius = '1.2rem';
    dropdown.style.minWidth = '220px';
    dropdown.style.zIndex = '100';
    dropdown.innerHTML = notifications.slice(0,5).map(n => `<div style='padding:0.7rem 1.2rem;border-bottom:1px solid #e0e7ef;'>${n}</div>`).join('');
    notifBell.appendChild(dropdown);
  } else {
    dropdown.remove();
  }
});
document.body.addEventListener('click', function() {
  const dropdown = document.getElementById('notifDropdown');
  if (dropdown) dropdown.remove();
});
if (notifBadge) notifBadge.textContent = notifications.length;

// 7. Profile Dropdown
const profileBtn = document.getElementById('profileBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
if (profileBtn && dropdownMenu) {
  profileBtn.onclick = function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  };
  document.body.onclick = function() {
    dropdownMenu.classList.remove('show');
  };
  dropdownMenu.onclick = function(e) { e.stopPropagation(); };
}

// 8. Announcements Widget Auto-scroll
const announcements = document.querySelector('.announcements-section ul');
if (announcements) {
  let scrollPos = 0;
  setInterval(() => {
    scrollPos += 1;
    if (scrollPos > announcements.scrollHeight - announcements.clientHeight) scrollPos = 0;
    announcements.scrollTop = scrollPos;
  }, 100);
}

// 9. Calendar Heatmap Placeholder
function renderAttendanceHeatmap(containerId, data) {
  // Placeholder: Render a simple grid for demo
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const day = document.createElement('div');
    day.style.display = 'inline-block';
    day.style.width = '18px';
    day.style.height = '18px';
    day.style.margin = '2px';
    day.style.borderRadius = '4px';
    day.style.background = data[i] > 90 ? '#22c55e' : data[i] > 75 ? '#f59e42' : '#ef4444';
    day.title = `Day ${i+1}: ${data[i]}%`;
    container.appendChild(day);
  }
}
// Example: renderAttendanceHeatmap('heatmapContainer', [95,92,88,70,100,80,60,90,85,95,92,88,70,100,80,60,90,85,95,92,88,70,100,80,60,90,85,95,92,88]);

// 10. Modular Exports (for future integration)
window.Dashboard = {
  filterTable,
  paginateTable,
  exportTableToCSV,
  exportTableToPDF,
  highlightLowAttendance,
  renderPieChart,
  renderBarChart,
  filterReportByDate,
  renderAttendanceHeatmap
};
