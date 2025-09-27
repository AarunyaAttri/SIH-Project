// Teacher Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const sessionData = sessionStorage.getItem('teacherSession');
    if (!sessionData) {
        window.location.href = 'teacher-login.html';
        return;
    }

    const session = JSON.parse(sessionData);
    let students = [];
    let currentAttendance = {};
    
    // Sample student data - In a real application, this would come from a database
    const studentDatabase = {
        'grade-9': [
            { id: 'S001', name: 'Alice Johnson', rollNumber: '09001' },
            { id: 'S002', name: 'Bob Smith', rollNumber: '09002' },
            { id: 'S003', name: 'Charlie Brown', rollNumber: '09003' },
            { id: 'S004', name: 'Diana Prince', rollNumber: '09004' },
            { id: 'S005', name: 'Edward Norton', rollNumber: '09005' },
            { id: 'S006', name: 'Fiona Apple', rollNumber: '09006' },
            { id: 'S007', name: 'George Lucas', rollNumber: '09007' },
            { id: 'S008', name: 'Hannah Montana', rollNumber: '09008' },
            { id: 'S009', name: 'Ian McKellen', rollNumber: '09009' },
            { id: 'S010', name: 'Julia Roberts', rollNumber: '09010' }
        ],
        'grade-10': [
            { id: 'S011', name: 'Kevin Hart', rollNumber: '10001' },
            { id: 'S012', name: 'Laura Croft', rollNumber: '10002' },
            { id: 'S013', name: 'Michael Jordan', rollNumber: '10003' },
            { id: 'S014', name: 'Nina Simone', rollNumber: '10004' },
            { id: 'S015', name: 'Oscar Wilde', rollNumber: '10005' },
            { id: 'S016', name: 'Penelope Cruz', rollNumber: '10006' },
            { id: 'S017', name: 'Quincy Jones', rollNumber: '10007' },
            { id: 'S018', name: 'Rachel Green', rollNumber: '10008' },
            { id: 'S019', name: 'Samuel Jackson', rollNumber: '10009' },
            { id: 'S020', name: 'Tina Turner', rollNumber: '10010' }
        ],
        'grade-11': [
            { id: 'S021', name: 'Uma Thurman', rollNumber: '11001' },
            { id: 'S022', name: 'Vincent Van Gogh', rollNumber: '11002' },
            { id: 'S023', name: 'Will Smith', rollNumber: '11003' },
            { id: 'S024', name: 'Xena Warrior', rollNumber: '11004' },
            { id: 'S025', name: 'Yoda Master', rollNumber: '11005' },
            { id: 'S026', name: 'Zoe Saldana', rollNumber: '11006' }
        ],
        'grade-12': [
            { id: 'S027', name: 'Aaron Paul', rollNumber: '12001' },
            { id: 'S028', name: 'Betty White', rollNumber: '12002' },
            { id: 'S029', name: 'Chris Evans', rollNumber: '12003' },
            { id: 'S030', name: 'Denzel Washington', rollNumber: '12004' },
            { id: 'S031', name: 'Emma Stone', rollNumber: '12005' },
            { id: 'S032', name: 'Frank Sinatra', rollNumber: '12006' }
        ]
    };

    // Initialize dashboard
    function initializeDashboard() {
        // Set teacher information
        document.getElementById('teacherName').textContent = session.name;
        document.getElementById('teacherSubject').textContent = session.subject.charAt(0).toUpperCase() + session.subject.slice(1);
        document.getElementById('teacherClass').textContent = session.class.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        document.getElementById('loginTime').textContent = session.loginTime;

        // Set current date
        const now = new Date();
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Set attendance date to today
        document.getElementById('attendanceDate').value = now.toISOString().split('T')[0];

        // Load students for the current class
        loadStudents();
        
        // Load today's attendance if it exists
        loadTodaysAttendance();
        
        // Update statistics
        updateStatistics();
        
        // Setup view toggle functionality
        setupViewToggle();
        
        // Start checking for real-time attendance updates
        setInterval(checkForAttendanceUpdates, 5000); // Check every 5 seconds
    }

    // Load students based on selected class
    function loadStudents() {
        students = studentDatabase[session.class] || [];
        renderStudentList();
    }

    // Render student list
    function renderStudentList() {
        const studentList = document.getElementById('studentList');
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        
        const filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.rollNumber.toLowerCase().includes(searchTerm)
        );

        studentList.innerHTML = '';
        
        filteredStudents.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.className = 'student-item';
            studentItem.innerHTML = `
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-id">Roll No: ${student.rollNumber}</div>
                </div>
                <div class="attendance-controls">
                    <button class="attendance-btn present-btn ${currentAttendance[student.id] === 'present' ? 'active' : ''}" 
                            onclick="markAttendance('${student.id}', 'present')">Present</button>
                    <button class="attendance-btn absent-btn ${currentAttendance[student.id] === 'absent' ? 'active' : ''}" 
                            onclick="markAttendance('${student.id}', 'absent')">Absent</button>
                </div>
            `;
            studentList.appendChild(studentItem);
        });
        
        // Also update photo grid if it's visible
        if (document.getElementById('studentPhotoGrid').style.display !== 'none') {
            renderPhotoGrid();
        }
    }

    // Render student photo grid
    function renderPhotoGrid() {
        const photoGrid = document.getElementById('studentPhotoGrid');
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        
        const filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.rollNumber.toLowerCase().includes(searchTerm)
        );

        photoGrid.innerHTML = '';
        
        filteredStudents.forEach(student => {
            const attendanceRecord = getStudentAttendancePhoto(student.id);
            const attendanceStatus = currentAttendance[student.id] || 'not-marked';
            
            const photoCard = document.createElement('div');
            photoCard.className = 'student-photo-card';
            photoCard.innerHTML = `
                <div class="attendance-status-indicator ${attendanceStatus}"></div>
                <div class="student-photo-container ${attendanceRecord ? 'has-photo' : ''}">
                    ${attendanceRecord && attendanceRecord.photo ? 
                        `<img src="${attendanceRecord.photo}" alt="${student.name}" class="student-photo" onclick="openPhotoModal('${attendanceRecord.photo}', '${student.name}', '${student.rollNumber}', '${attendanceRecord.timestamp}')">` :
                        '<div class="no-photo-placeholder">👤</div>'
                    }
                </div>
                <div class="student-photo-info">
                    <div class="student-photo-name">${student.name}</div>
                    <div class="student-photo-id">Roll No: ${student.rollNumber}</div>
                    ${attendanceRecord && attendanceRecord.timestamp ? 
                        `<div class="attendance-timestamp">Marked: ${new Date(attendanceRecord.timestamp).toLocaleTimeString()}</div>` :
                        '<div class="attendance-timestamp">Not marked today</div>'
                    }
                </div>
                <div class="photo-attendance-controls">
                    <button class="attendance-btn present-btn ${currentAttendance[student.id] === 'present' ? 'active' : ''}" 
                            onclick="markAttendance('${student.id}', 'present')">Present</button>
                    <button class="attendance-btn absent-btn ${currentAttendance[student.id] === 'absent' ? 'active' : ''}" 
                            onclick="markAttendance('${student.id}', 'absent')">Absent</button>
                </div>
            `;
            photoGrid.appendChild(photoCard);
        });
    }

    // Get student attendance photo from global records
    function getStudentAttendancePhoto(studentId) {
        const today = new Date().toDateString();
        const globalRecords = JSON.parse(localStorage.getItem('globalAttendanceRecords') || '[]');
        
        // Find today's attendance record for this student
        const record = globalRecords.find(record => 
            record.studentId === studentId && 
            new Date(record.timestamp).toDateString() === today
        );
        
        return record;
    }

    // Open photo modal
    window.openPhotoModal = function(photoSrc, studentName, rollNumber, timestamp) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="photo-modal-content">
                <button class="photo-modal-close" onclick="closePhotoModal()">&times;</button>
                <img src="${photoSrc}" alt="${studentName}" class="photo-modal-image">
                <div class="photo-modal-info">
                    <h3>${studentName}</h3>
                    <p>Roll Number: ${rollNumber}</p>
                    <p>Attendance marked: ${new Date(timestamp).toLocaleString()}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePhotoModal();
            }
        });
    };

    // Close photo modal
    window.closePhotoModal = function() {
        const modal = document.querySelector('.photo-modal');
        if (modal) {
            modal.remove();
        }
    };

    // Toggle between list and photo view
    function setupViewToggle() {
        const listViewBtn = document.getElementById('listViewBtn');
        const photoViewBtn = document.getElementById('photoViewBtn');
        const studentList = document.getElementById('studentList');
        const photoGrid = document.getElementById('studentPhotoGrid');

        listViewBtn.addEventListener('click', function() {
            listViewBtn.classList.add('active');
            photoViewBtn.classList.remove('active');
            studentList.style.display = 'block';
            photoGrid.style.display = 'none';
        });

        photoViewBtn.addEventListener('click', function() {
            photoViewBtn.classList.remove('active');
            listViewBtn.classList.remove('active');
            photoViewBtn.classList.add('active');
            studentList.style.display = 'none';
            photoGrid.style.display = 'grid';
            renderPhotoGrid();
        });

        // Initialize with photo view
        photoViewBtn.click();
    }

    // Check for real-time attendance updates
    function checkForAttendanceUpdates() {
        const globalRecords = JSON.parse(localStorage.getItem('globalAttendanceRecords') || '[]');
        const today = new Date().toDateString();
        
        // Map teacher class to student class format
        const classMapping = {
            'grade-9': 'class-9',
            'grade-10': 'class-10',
            'grade-11': 'class-11',
            'grade-12': 'class-12'
        };
        
        const studentClassFormat = classMapping[session.class] || session.class;
        
        // Get today's records for current class
        const todayRecords = globalRecords.filter(record => 
            new Date(record.timestamp).toDateString() === today &&
            (record.class === session.class || record.class === studentClassFormat)
        );

        // Update attendance automatically if students have marked attendance
        let updated = false;
        todayRecords.forEach(record => {
            if (!currentAttendance[record.studentId] && record.status === 'present') {
                currentAttendance[record.studentId] = 'present';
                updated = true;
            }
        });

        if (updated) {
            renderStudentList();
            updateStatistics();
            showAttendanceNotification('New attendance records detected!');
        }
    }

    // Show attendance update notification
    function showAttendanceNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'attendance-update-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Mark attendance for a student
    window.markAttendance = function(studentId, status) {
        currentAttendance[studentId] = status;
        renderStudentList();
        updateStatistics();
        
        // Add visual feedback
        const buttons = document.querySelectorAll(`[onclick*="${studentId}"]`);
        buttons.forEach(button => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    };

    // Update statistics
    function updateStatistics() {
        const totalStudents = students.length;
        const presentStudents = Object.values(currentAttendance).filter(status => status === 'present').length;
        const absentStudents = Object.values(currentAttendance).filter(status => status === 'absent').length;
        const attendancePercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('presentStudents').textContent = presentStudents;
        document.getElementById('absentStudents').textContent = absentStudents;
        document.getElementById('attendancePercentage').textContent = attendancePercentage + '%';
    }

    // Load today's attendance
    function loadTodaysAttendance() {
        const today = new Date().toISOString().split('T')[0];
        const attendanceKey = `attendance_${session.class}_${session.subject}_${today}`;
        const savedAttendance = localStorage.getItem(attendanceKey);
        
        if (savedAttendance) {
            currentAttendance = JSON.parse(savedAttendance);
        }
        
        // Also check for student self-marked attendance
        checkForAttendanceUpdates();
        
        renderStudentList();
        updateStatistics();
    }

    // Save attendance
    function saveAttendance() {
        const attendanceDate = document.getElementById('attendanceDate').value;
        if (!attendanceDate) {
            showMessage('Please select a date', 'error');
            return;
        }

        const attendanceKey = `attendance_${session.class}_${session.subject}_${attendanceDate}`;
        const attendanceData = {
            date: attendanceDate,
            teacher: session.name,
            subject: session.subject,
            class: session.class,
            attendance: currentAttendance,
            timestamp: new Date().toISOString(),
            statistics: {
                total: students.length,
                present: Object.values(currentAttendance).filter(status => status === 'present').length,
                absent: Object.values(currentAttendance).filter(status => status === 'absent').length
            }
        };

        localStorage.setItem(attendanceKey, JSON.stringify(attendanceData));
        
        // Also save to history
        saveToHistory(attendanceData);
        
        showMessage('Attendance saved successfully!', 'success');
    }

    // Save to history
    function saveToHistory(attendanceData) {
        const historyKey = `attendance_history_${session.class}_${session.subject}`;
        let history = JSON.parse(localStorage.getItem(historyKey)) || [];
        
        // Remove existing record for the same date if it exists
        history = history.filter(record => record.date !== attendanceData.date);
        
        // Add new record
        history.unshift(attendanceData);
        
        // Keep only last 30 records
        history = history.slice(0, 30);
        
        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    // Show message
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        const container = document.querySelector('.attendance-section');
        container.insertBefore(messageDiv, container.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('teacherSession');
            window.location.href = 'teacher-login.html';
        }
    });

    document.getElementById('studentSearch').addEventListener('input', renderStudentList);

    document.getElementById('markAllPresent').addEventListener('click', function() {
        students.forEach(student => {
            currentAttendance[student.id] = 'present';
        });
        renderStudentList();
        updateStatistics();
        showMessage('All students marked as present', 'success');
    });

    document.getElementById('markAllAbsent').addEventListener('click', function() {
        students.forEach(student => {
            currentAttendance[student.id] = 'absent';
        });
        renderStudentList();
        updateStatistics();
        showMessage('All students marked as absent', 'success');
    });

    document.getElementById('saveAttendance').addEventListener('click', saveAttendance);

    document.getElementById('attendanceDate').addEventListener('change', function() {
        const selectedDate = this.value;
        const attendanceKey = `attendance_${session.class}_${session.subject}_${selectedDate}`;
        const savedAttendance = localStorage.getItem(attendanceKey);
        
        if (savedAttendance) {
            const data = JSON.parse(savedAttendance);
            currentAttendance = data.attendance;
        } else {
            currentAttendance = {};
        }
        
        renderStudentList();
        updateStatistics();
    });

    // View history modal
    document.getElementById('viewHistory').addEventListener('click', function() {
        loadAttendanceHistory();
        document.getElementById('historyModal').style.display = 'flex';
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('historyModal').style.display = 'none';
    });

    // Load attendance history
    function loadAttendanceHistory() {
        const historyKey = `attendance_history_${session.class}_${session.subject}`;
        const history = JSON.parse(localStorage.getItem(historyKey)) || [];
        
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';
        
        history.forEach(record => {
            const row = document.createElement('tr');
            const percentage = record.statistics.total > 0 ? 
                Math.round((record.statistics.present / record.statistics.total) * 100) : 0;
            
            row.innerHTML = `
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.statistics.total}</td>
                <td>${record.statistics.present}</td>
                <td>${record.statistics.absent}</td>
                <td>${percentage}%</td>
                <td>
                    <button onclick="viewDetailedRecord('${record.date}')">View Details</button>
                    <button onclick="deleteRecord('${record.date}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // View detailed record
    window.viewDetailedRecord = function(date) {
        const attendanceKey = `attendance_${session.class}_${session.subject}_${date}`;
        const record = JSON.parse(localStorage.getItem(attendanceKey));
        
        if (record) {
            let details = `Attendance Details for ${new Date(date).toLocaleDateString()}\n\n`;
            details += `Subject: ${record.subject}\n`;
            details += `Class: ${record.class}\n`;
            details += `Teacher: ${record.teacher}\n\n`;
            
            const presentStudents = [];
            const absentStudents = [];
            
            students.forEach(student => {
                if (record.attendance[student.id] === 'present') {
                    presentStudents.push(student.name);
                } else if (record.attendance[student.id] === 'absent') {
                    absentStudents.push(student.name);
                }
            });
            
            details += `Present Students (${presentStudents.length}):\n`;
            details += presentStudents.join(', ') + '\n\n';
            details += `Absent Students (${absentStudents.length}):\n`;
            details += absentStudents.join(', ');
            
            alert(details);
        }
    };

    // Delete record
    window.deleteRecord = function(date) {
        if (confirm(`Are you sure you want to delete the attendance record for ${new Date(date).toLocaleDateString()}?`)) {
            const attendanceKey = `attendance_${session.class}_${session.subject}_${date}`;
            localStorage.removeItem(attendanceKey);
            
            // Remove from history
            const historyKey = `attendance_history_${session.class}_${session.subject}`;
            let history = JSON.parse(localStorage.getItem(historyKey)) || [];
            history = history.filter(record => record.date !== date);
            localStorage.setItem(historyKey, JSON.stringify(history));
            
            loadAttendanceHistory();
            showMessage('Record deleted successfully', 'success');
        }
    };

    // Export data
    document.getElementById('exportData').addEventListener('click', function() {
        const historyKey = `attendance_history_${session.class}_${session.subject}`;
        const history = JSON.parse(localStorage.getItem(historyKey)) || [];
        
        if (history.length === 0) {
            showMessage('No attendance data to export', 'error');
            return;
        }
        
        let csv = 'Date,Subject,Class,Teacher,Total Students,Present,Absent,Attendance %\n';
        
        history.forEach(record => {
            const percentage = record.statistics.total > 0 ? 
                Math.round((record.statistics.present / record.statistics.total) * 100) : 0;
            
            csv += `${record.date},${record.subject},${record.class},${record.teacher},${record.statistics.total},${record.statistics.present},${record.statistics.absent},${percentage}%\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${session.class}_${session.subject}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showMessage('Data exported successfully', 'success');
    });

    // Filter history
    document.getElementById('filterHistory').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!startDate || !endDate) {
            showMessage('Please select both start and end dates', 'error');
            return;
        }
        
        const historyKey = `attendance_history_${session.class}_${session.subject}`;
        const allHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
        
        const filteredHistory = allHistory.filter(record => {
            const recordDate = new Date(record.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return recordDate >= start && recordDate <= end;
        });
        
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';
        
        filteredHistory.forEach(record => {
            const row = document.createElement('tr');
            const percentage = record.statistics.total > 0 ? 
                Math.round((record.statistics.present / record.statistics.total) * 100) : 0;
            
            row.innerHTML = `
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.statistics.total}</td>
                <td>${record.statistics.present}</td>
                <td>${record.statistics.absent}</td>
                <td>${percentage}%</td>
                <td>
                    <button onclick="viewDetailedRecord('${record.date}')">View Details</button>
                    <button onclick="deleteRecord('${record.date}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    saveAttendance();
                    break;
                case 'h':
                    e.preventDefault();
                    document.getElementById('viewHistory').click();
                    break;
                case 'e':
                    e.preventDefault();
                    document.getElementById('exportData').click();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            const modal = document.getElementById('historyModal');
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        }
    });

    // Auto-save functionality
    let autoSaveTimer;
    function setupAutoSave() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            if (Object.keys(currentAttendance).length > 0) {
                saveAttendance();
            }
        }, 30000); // Auto-save after 30 seconds of inactivity
    }

    // Setup auto-save on attendance changes
    const originalMarkAttendance = window.markAttendance;
    window.markAttendance = function(studentId, status) {
        originalMarkAttendance(studentId, status);
        setupAutoSave();
    };

    // Initialize the dashboard
    initializeDashboard();
});