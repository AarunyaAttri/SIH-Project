// --- Settings Section Interactivity ---
// Collapsible cards
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', function(e) {
        if (e.target.classList.contains('card-toggle') || e.target.closest('.card-toggle')) {
            const card = header.closest('.collapsible-card');
            card.classList.toggle('collapsed');
            const icon = card.querySelector('.card-toggle i');
            if (card.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        }
    });
});

// Password verification modal logic
function showVerifyModal(callback) {
    const modal = document.getElementById('verifyModal');
    modal.style.display = 'flex';
    document.getElementById('verifyPasswordInput').value = '';
    document.getElementById('verifyPasswordInput').focus();
    function cleanup() {
        modal.style.display = 'none';
        document.getElementById('verifyConfirmBtn').onclick = null;
        document.getElementById('verifyCancelBtn').onclick = null;
    }
    document.getElementById('verifyConfirmBtn').onclick = function() {
        // For demo, accept any non-empty password
        const val = document.getElementById('verifyPasswordInput').value;
        if (val.length < 3) {
            alert('Please enter your current password.');
            return;
        }
        cleanup();
        callback();
    };
    document.getElementById('verifyCancelBtn').onclick = function() {
        cleanup();
    };
}

// Email and password update require verification
document.getElementById('verifyEmailBtn').onclick = function() {
    showVerifyModal(() => alert('Email updated!'));
};
document.getElementById('verifyPasswordBtn').onclick = function() {
    showVerifyModal(() => alert('Password updated!'));
};

// 2-step verification toggle
document.getElementById('twoStepToggle').addEventListener('change', function() {
    alert('2-step verification ' + (this.checked ? 'enabled' : 'disabled'));
});

// Notification preferences form
document.getElementById('notificationForm').onsubmit = function(e) {
    e.preventDefault();
    alert('Notification preferences updated!');
};

// Account form save
document.getElementById('accountForm').onsubmit = function(e) {
    e.preventDefault();
    alert('Account details saved!');
};

// Support form
document.getElementById('supportForm').onsubmit = function(e) {
    e.preventDefault();
    alert('Support ticket submitted!');
    this.reset();
};
// --- Attendance Data and Timeline Control ---
const attendanceData = {
    '7': [
        { subject: 'Math', total: 5, attended: 5, absent: 0 },
        { subject: 'Science', total: 5, attended: 4, absent: 1 },
        { subject: 'English', total: 5, attended: 5, absent: 0 },
        { subject: 'History', total: 5, attended: 4, absent: 1 },
        { subject: 'Art', total: 2, attended: 2, absent: 0 },
    ],
    '30': [
        { subject: 'Math', total: 20, attended: 18, absent: 2 },
        { subject: 'Science', total: 18, attended: 17, absent: 1 },
        { subject: 'English', total: 21, attended: 20, absent: 1 },
        { subject: 'History', total: 19, attended: 18, absent: 1 },
        { subject: 'Art', total: 8, attended: 8, absent: 0 },
    ],
    'semester': [
        { subject: 'Math', total: 40, attended: 38, absent: 2 },
        { subject: 'Science', total: 38, attended: 36, absent: 2 },
        { subject: 'English', total: 42, attended: 41, absent: 1 },
        { subject: 'History', total: 39, attended: 37, absent: 2 },
        { subject: 'Art', total: 20, attended: 20, absent: 0 },
    ]
};

const attendanceTrends = {
    '7':   { labels: ['Fri','Sat','Sun','Mon','Tue','Wed','Thu'], data: [1,1,0,1,1,1,1] },
    '30':  { labels: Array.from({length:30},(_,i)=>`Day ${i+1}`), data: [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] },
    'semester': { labels: Array.from({length:40},(_,i)=>`Day ${i+1}`), data: Array(40).fill(1).map((v,i)=>i%13===0?0:1) }
};

function renderAttendanceTable(timeline) {
    const table = document.getElementById('attendanceTable');
    if (!table) return;
    const data = attendanceData[timeline];
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const percent = ((row.attended/row.total)*100).toFixed(1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.subject}</td>
            <td>${row.total}</td>
            <td>${row.attended}</td>
            <td>${row.absent}</td>
            <td>${percent}%</td>
        `;
        if (row.absent > 0 && timeline === '7') tr.classList.add('recent-row','absent-row');
        else if (row.absent > 0) tr.classList.add('absent-row');
        else if (timeline === '7') tr.classList.add('recent-row');
        tbody.appendChild(tr);
    });
}

function renderAttendanceGraph(timeline) {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    if (window.attendanceChart) window.attendanceChart.destroy();
    const trend = attendanceTrends[timeline];
    window.attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trend.labels,
            datasets: [{
                label: 'Attendance',
                data: trend.data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.12)',
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: trend.data.map(v=>v?"#4338ca":"#ef4444"),
                pointBorderColor: '#fff',
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    min: 0,
                    max: 1,
                    ticks: {
                        callback: v => v === 1 ? 'Present' : 'Absent',
                        stepSize: 1
                    }
                }
            },
            animation: { duration: 600 }
        }
    });
}

function updateAttendanceUI(timeline) {
    const content = document.querySelector('#attendanceSection .card-content');
    content.style.opacity = 0.5;
    setTimeout(() => {
        renderAttendanceTable(timeline);
        renderAttendanceGraph(timeline);
        content.style.opacity = 1;
    }, 250);
}

// Timeline selector event
const timelineSelect = document.getElementById('attendanceTimeline');
if (timelineSelect) {
    timelineSelect.addEventListener('change', function() {
        updateAttendanceUI(this.value);
    });
    // Initial render
    updateAttendanceUI(timelineSelect.value);
}
// Also update on Attendance tab click
const attendanceTab = document.querySelectorAll('.sidebar nav a')[2];
attendanceTab.addEventListener('click', function() {
    setTimeout(()=>{
        if (timelineSelect) updateAttendanceUI(timelineSelect.value);
    }, 200);
});
// --- Student Marks Data and Dynamic Table/Recent Marks ---
const marksData = [
    { subject: 'Math', date: '2025-09-20', type: 'Quiz', assessment: 'Quiz 3', score: 18, total: 20 },
    { subject: 'Math', date: '2025-09-10', type: 'Assignment', assessment: 'HW 4', score: 9, total: 10 },
    { subject: 'Math', date: '2025-08-30', type: 'Test', assessment: 'Chapter Test', score: 44, total: 50 },
    { subject: 'Science', date: '2025-09-18', type: 'Exam', assessment: 'Midterm', score: 85, total: 100 },
    { subject: 'Science', date: '2025-09-12', type: 'Quiz', assessment: 'Quiz 2', score: 8, total: 10 },
    { subject: 'English', date: '2025-09-19', type: 'Assignment', assessment: 'Essay', score: 19, total: 20 },
    { subject: 'English', date: '2025-09-15', type: 'Quiz', assessment: 'Quiz 1', score: 9, total: 10 },
    { subject: 'History', date: '2025-09-17', type: 'Test', assessment: 'Unit Test', score: 38, total: 40 },
    { subject: 'History', date: '2025-09-05', type: 'Assignment', assessment: 'Project', score: 10, total: 10 },
    { subject: 'Art', date: '2025-09-21', type: 'Assignment', assessment: 'Sketch', score: 10, total: 10 },
    { subject: 'Art', date: '2025-09-14', type: 'Quiz', assessment: 'Quiz 1', score: 9, total: 10 },
];

let marksSort = { key: 'date', dir: 'desc' };

function renderMarksTable() {
    const table = document.getElementById('marksTable');
    if (!table) return;
    // Sort data
    let sorted = [...marksData];
    sorted.sort((a, b) => {
        let v1 = a[marksSort.key], v2 = b[marksSort.key];
        if (marksSort.key === 'date') {
            v1 = new Date(v1); v2 = new Date(v2);
        } else if (marksSort.key === 'score' || marksSort.key === 'total' || marksSort.key === 'percent') {
            v1 = Number(a.score) / Number(a.total); v2 = Number(b.score) / Number(b.total);
        } else {
            v1 = v1.toString().toLowerCase(); v2 = v2.toString().toLowerCase();
        }
        if (v1 < v2) return marksSort.dir === 'asc' ? -1 : 1;
        if (v1 > v2) return marksSort.dir === 'asc' ? 1 : -1;
        return 0;
    });
    // Render rows
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    sorted.forEach(mark => {
        const percent = ((mark.score / mark.total) * 100).toFixed(1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Subject">${mark.subject}</td>
            <td data-label="Date">${mark.date}</td>
            <td data-label="Type">${mark.type}</td>
            <td data-label="Assessment">${mark.assessment}</td>
            <td data-label="Score">${mark.score}</td>
            <td data-label="Total">${mark.total}</td>
            <td data-label="%">${percent}%</td>
        `;
        tbody.appendChild(tr);
    });
    // Set sorted header highlight
    table.querySelectorAll('th').forEach(th => th.classList.remove('sorted'));
    const th = table.querySelector(`th[data-sort="${marksSort.key}"]`);
    if (th) th.classList.add('sorted');
}

function renderRecentMarks() {
    const container = document.getElementById('recentMarksSummary');
    if (!container) return;
    // Get 4 most recent
    const recent = [...marksData].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
    container.innerHTML = recent.map(mark =>
        `<div class="recent-mark"><strong>${mark.subject}</strong> ${mark.assessment} (${mark.type})<span style="margin-left:1rem;">${mark.score}/${mark.total}</span> <span style="margin-left:1rem; color:#6b7280; font-size:0.97rem;">${mark.date}</span></div>`
    ).join('');
}

function renderSubjectStats() {
    const container = document.getElementById('subjectStats');
    if (!container) return;
    // Group by subject
    const stats = {};
    marksData.forEach(m => {
        if (!stats[m.subject]) stats[m.subject] = { total: 0, scored: 0, count: 0 };
        stats[m.subject].total += Number(m.total);
        stats[m.subject].scored += Number(m.score);
        stats[m.subject].count++;
    });
    container.innerHTML = '<div class="subject-stats">' + Object.entries(stats).map(([subject, s]) =>
        `<div class="stat-card"><strong>${subject}</strong><br>Total: ${s.total}<br>Scored: ${s.scored}<br>Avg: ${(s.scored/s.count).toFixed(1)}<br>Percent: ${((s.scored/s.total)*100).toFixed(1)}%</div>`
    ).join('') + '</div>';
}

function setupMarksSorting() {
    const table = document.getElementById('marksTable');
    if (!table) return;
    table.querySelectorAll('th[data-sort]').forEach(th => {
        th.onclick = function() {
            const key = th.getAttribute('data-sort');
            if (marksSort.key === key) marksSort.dir = marksSort.dir === 'asc' ? 'desc' : 'asc';
            else { marksSort.key = key; marksSort.dir = 'asc'; }
            renderMarksTable();
        };
    });
}

function updateMarksUI() {
    renderMarksTable();
    renderRecentMarks();
    renderSubjectStats();
    setupMarksSorting();
}

// Initial render
updateMarksUI();

// For demo: addMark function to simulate new marks being added
window.addMark = function(mark) {
    marksData.push(mark);
    updateMarksUI();
};
// Chart.js attendance graph rendering
function renderAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    if (window.attendanceChart) window.attendanceChart.destroy();
    window.attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
            datasets: [{
                label: 'Attendance',
                data: [1, 1, 0, 1, 1, 1, 1],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.12)',
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#4338ca',
                pointBorderColor: '#fff',
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    min: 0,
                    max: 1,
                    ticks: {
                        callback: v => v === 1 ? 'Present' : 'Absent',
                        stepSize: 1
                    }
                }
            },
            animation: { duration: 600 }
        }
    });
}

// Show chart when Attendance tab is clicked
const attendanceLink = document.querySelectorAll('.sidebar nav a')[2];
attendanceLink.addEventListener('click', () => {
    setTimeout(renderAttendanceChart, 200);
});

// Responsive attendance table (add data-labels)
function setAttendanceTableLabels() {
    document.querySelectorAll('.attendance-table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
        table.querySelectorAll('tbody tr').forEach(row => {
            row.querySelectorAll('td').forEach((td, i) => {
                td.setAttribute('data-label', headers[i]);
            });
        });
    });
}
setAttendanceTableLabels();

// Notification expand/collapse
document.querySelectorAll('.notification-item.expandable').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

// Profile dropdown
const profileIcon = document.getElementById('profileIcon');
const profileDropdown = document.getElementById('profileDropdown');
profileIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', function(e) {
    if (profileDropdown.style.display === 'block') profileDropdown.style.display = 'none';
});

// Logout modal
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    logoutModal.style.display = 'flex';
});
cancelLogout.addEventListener('click', function() {
    logoutModal.style.display = 'none';
});
confirmLogout.addEventListener('click', function() {
    window.location.href = 'whoami.html';
});
// parent-dashboard.js
// Sidebar collapse/expand
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Sidebar navigation and content switching
const sidebarLinks = Array.from(document.querySelectorAll('.sidebar nav a')).filter(a => !a.href.endsWith('whoami.html'));
const sectionIds = ['homeSection', 'progressSection', 'attendanceSection', 'notificationsSection', 'settingsSection'];
sidebarLinks.forEach((link, idx) => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Set active link
        sidebarLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        // Show corresponding section
        sectionIds.forEach((id, i) => {
            const sec = document.getElementById(id);
            if (i === idx) {
                sec.style.display = 'block';
                sec.style.opacity = 0;
                setTimeout(() => { sec.style.opacity = 1; }, 10);
            } else {
                sec.style.display = 'none';
                sec.style.opacity = 0;
            }
        });
    });
});

// Card expand/collapse (for all cards in all sections)
function setupCardToggles() {
    document.querySelectorAll('.card-toggle').forEach(btn => {
        btn.onclick = function() {
            const card = this.closest('.card');
            card.classList.toggle('collapsed');
            const icon = this.querySelector('i');
            if (card.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        };
    });
}
setupCardToggles();

// Search bar (optional demo functionality)
document.getElementById('searchInput').addEventListener('input', function() {
    // Demo: highlight if 'John' is typed
    if (this.value.toLowerCase().includes('john')) {
        document.querySelectorAll('.dashboard-section').forEach(sec => {
            if (sec.style.display !== 'none') {
                sec.querySelectorAll('.card').forEach(card => {
                    card.style.boxShadow = '0 0 0 3px #6366f1';
                });
            }
        });
    } else {
        document.querySelectorAll('.card').forEach(card => {
            card.style.boxShadow = '';
        });
    }
});

// Profile form (Settings)
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Profile updated!');
    });
}
