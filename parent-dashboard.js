// Parent Dashboard JS – Automated Attendance System
// 1. Sidebar Toggle for Mobile
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.createElement('button');
sidebarToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
sidebarToggleBtn.className = 'sidebar-toggle-btn';
document.body.insertBefore(sidebarToggleBtn, document.body.firstChild);
sidebarToggleBtn.onclick = () => {
  sidebar.classList.toggle('collapsed');
};

// 2. Dark Mode Toggle
const darkModeBtn = document.createElement('button');
darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
darkModeBtn.title = 'Toggle Dark Mode';
darkModeBtn.className = 'profile-btn';
const headerActions = document.querySelector('.header-actions');
if (headerActions) headerActions.appendChild(darkModeBtn);
darkModeBtn.onclick = function() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('parent-dashboard-dark', document.body.classList.contains('dark-mode'));
};
if (localStorage.getItem('parent-dashboard-dark') === 'true') {
  document.body.classList.add('dark-mode');
}

// 3. Charts (Chart.js)
// Line Chart: Monthly Attendance Trend
const lineChart = document.getElementById('lineChart');
if (lineChart && window.Chart) {
  new Chart(lineChart, {
    type: 'line',
    data: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [{
        label: 'Attendance %',
        data: [98, 97, 95, 96, 94, 96],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v=>v+'%' } }
      }
    }
  });
}
// Bar Chart: Child vs Class Average
const barChart = document.getElementById('barChart');
if (barChart && window.Chart) {
  new Chart(barChart, {
    type: 'bar',
    data: {
      labels: ['Child', 'Class Avg'],
      datasets: [{
        label: 'Attendance %',
        data: [96, 92],
        backgroundColor: ['#38bdf8', '#f59e42'],
        borderRadius: 8,
        maxBarThickness: 40
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v=>v+'%' } }
      }
    }
  });
}

// 4. Table Functions
// Highlight Absent Rows
function highlightAbsentRows() {
  const table = document.getElementById('attendanceTable');
  if (!table) return;
  table.querySelectorAll('tbody tr').forEach(row => {
    const status = row.children[2]?.textContent.trim();
    if (status === 'Absent') {
      row.classList.add('status-absent');
    }
  });
}
highlightAbsentRows();
// Filter by Month
function filterTableByMonth(month) {
  const table = document.getElementById('attendanceTable');
  if (!table) return;
  table.querySelectorAll('tbody tr').forEach(row => {
    const date = row.children[0]?.textContent;
    if (!date) return;
    const rowMonth = new Date(date).toLocaleString('default', { month: 'short' });
    row.style.display = (month === 'All' || rowMonth === month) ? '' : 'none';
  });
}
// Example: filterTableByMonth('Sep');

// 5. Notifications
const notifBell = document.getElementById('notifBell');
const notifBadge = document.getElementById('notifBadge');
const notifications = [
  'Attendance below 90% in August',
  'New message from Class Teacher',
  'School closed on Oct 2 (Gandhi Jayanti)'
];
if (notifBadge) notifBadge.textContent = notifications.length;
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

// 6. Profile Dropdown
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
