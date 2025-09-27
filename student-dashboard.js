// Student Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if student is logged in
    checkStudentAuth();
    
    // Initialize dashboard
    initializeDashboard();
    
    // Initialize camera functionality
    initializeCamera();
    
    // Load attendance history
    loadAttendanceHistory();
    
    // Set up event listeners
    setupEventListeners();
});

// Global variables
let cameraStream = null;
let capturedPhotoData = null;

// Check authentication
function checkStudentAuth() {
    const isLoggedIn = localStorage.getItem('studentLoggedIn');
    const studentData = localStorage.getItem('currentStudent');
    
    if (!isLoggedIn || !studentData) {
        window.location.href = 'student-login.html';
        return;
    }
}

// Initialize dashboard with student data
function initializeDashboard() {
    const studentData = JSON.parse(localStorage.getItem('currentStudent'));
    const currentDate = new Date();
    
    // Update header information
    document.getElementById('studentName').textContent = studentData.studentName;
    document.getElementById('currentDate').textContent = currentDate.toDateString();
    
    // Update student info card
    document.getElementById('studentId').textContent = studentData.studentId;
    document.getElementById('studentClass').textContent = studentData.class;
    document.getElementById('studentSection').textContent = studentData.section;
    document.getElementById('loginTime').textContent = new Date(studentData.loginTime).toLocaleTimeString();
    
    // Check today's attendance status
    checkTodayAttendance();
}

// Check if attendance is already marked for today
function checkTodayAttendance() {
    const today = new Date().toDateString();
    const studentData = JSON.parse(localStorage.getItem('currentStudent'));
    const attendanceKey = `attendance_${studentData.studentId}`;
    const attendanceHistory = JSON.parse(localStorage.getItem(attendanceKey) || '[]');
    
    const todayAttendance = attendanceHistory.find(record => 
        new Date(record.date).toDateString() === today
    );
    
    const statusElement = document.getElementById('attendanceStatus');
    const timeElement = document.getElementById('attendanceTime');
    const cameraSection = document.querySelector('.camera-section');
    
    if (todayAttendance) {
        // Already marked
        statusElement.innerHTML = `
            <div class="status-present">
                <span class="status-icon">✅</span>
                <span class="status-text">Present</span>
            </div>
        `;
        timeElement.textContent = `Marked at: ${new Date(todayAttendance.timestamp).toLocaleTimeString()}`;
        timeElement.style.display = 'block';
        
        // Disable camera section
        cameraSection.style.opacity = '0.6';
        cameraSection.style.pointerEvents = 'none';
        
        // Add info message
        const infoDiv = document.createElement('div');
        infoDiv.className = 'attendance-info';
        infoDiv.innerHTML = `
            <p style="text-align: center; color: #4CAF50; font-weight: 600; background: #e8f5e8; padding: 15px; border-radius: 10px; margin-top: 20px;">
                ✅ You have already marked your attendance for today!
            </p>
        `;
        cameraSection.appendChild(infoDiv);
    }
}

// Initialize camera functionality
function initializeCamera() {
    const startCameraBtn = document.getElementById('startCameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const stopCameraBtn = document.getElementById('stopCameraBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const submitBtn = document.getElementById('submitAttendanceBtn');
    
    startCameraBtn.addEventListener('click', startCamera);
    captureBtn.addEventListener('click', capturePhoto);
    stopCameraBtn.addEventListener('click', stopCamera);
    retakeBtn.addEventListener('click', retakePhoto);
    submitBtn.addEventListener('click', submitAttendance);
}

// Start camera
async function startCamera() {
    try {
        const statusElement = document.getElementById('cameraStatus');
        statusElement.innerHTML = '<p>Starting camera...</p>';
        
        const constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            },
            audio: false
        };
        
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('cameraVideo');
        video.srcObject = cameraStream;
        
        // Update UI
        document.getElementById('startCameraBtn').style.display = 'none';
        document.getElementById('captureBtn').style.display = 'inline-flex';
        document.getElementById('stopCameraBtn').style.display = 'inline-flex';
        statusElement.innerHTML = '<p style="color: #4CAF50;">📹 Camera is ready! Position yourself and click "Take Photo"</p>';
        
    } catch (error) {
        console.error('Camera access error:', error);
        handleCameraError(error);
    }
}

// Handle camera errors
function handleCameraError(error) {
    const statusElement = document.getElementById('cameraStatus');
    let errorMessage = '';
    
    if (error.name === 'NotAllowedError') {
        errorMessage = '❌ Camera access denied. Please allow camera access and refresh the page.';
    } else if (error.name === 'NotFoundError') {
        errorMessage = '❌ No camera found on this device.';
    } else if (error.name === 'NotReadableError') {
        errorMessage = '❌ Camera is being used by another application.';
    } else {
        errorMessage = '❌ Camera access failed. Please try again.';
    }
    
    statusElement.innerHTML = `<p style="color: #f44336;">${errorMessage}</p>`;
    
    // Show error in camera preview area
    const cameraPreview = document.getElementById('cameraPreview');
    cameraPreview.classList.add('camera-denied');
    cameraPreview.innerHTML = `
        <div class="camera-denied">
            <h4>Camera Access Required</h4>
            <p>${errorMessage}</p>
            <button class="control-btn" onclick="location.reload()">
                <span class="btn-icon">🔄</span>
                Refresh Page
            </button>
        </div>
    `;
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Get image data
    capturedPhotoData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Show photo preview
    showPhotoPreview();
    
    // Stop camera
    stopCamera();
}

// Show photo preview
function showPhotoPreview() {
    const cameraPreview = document.getElementById('cameraPreview');
    const photoPreview = document.getElementById('photoPreview');
    const capturedPhoto = document.getElementById('capturedPhoto');
    
    // Hide camera preview
    cameraPreview.style.display = 'none';
    
    // Show photo preview
    capturedPhoto.src = capturedPhotoData;
    photoPreview.style.display = 'block';
}

// Retake photo
function retakePhoto() {
    const cameraPreview = document.getElementById('cameraPreview');
    const photoPreview = document.getElementById('photoPreview');
    
    // Hide photo preview
    photoPreview.style.display = 'none';
    
    // Show camera preview
    cameraPreview.style.display = 'block';
    
    // Reset camera buttons
    document.getElementById('startCameraBtn').style.display = 'inline-flex';
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('stopCameraBtn').style.display = 'none';
    
    // Reset status
    document.getElementById('cameraStatus').innerHTML = '<p>Click "Start Camera" to begin</p>';
    
    // Clear captured data
    capturedPhotoData = null;
}

// Stop camera
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
            track.stop();
        });
        cameraStream = null;
    }
    
    // Update UI
    document.getElementById('startCameraBtn').style.display = 'inline-flex';
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('stopCameraBtn').style.display = 'none';
}

// Submit attendance
function submitAttendance() {
    if (!capturedPhotoData) {
        showErrorModal('No photo captured. Please take a photo first.');
        return;
    }
    
    // Show loading modal
    showModal('loadingModal');
    
    // Simulate processing
    setTimeout(() => {
        try {
            saveAttendanceRecord();
            hideModal('loadingModal');
            showModal('successModal');
            
            // Update attendance status
            updateAttendanceStatus();
            
            // Refresh history
            loadAttendanceHistory();
            
        } catch (error) {
            console.error('Attendance submission error:', error);
            hideModal('loadingModal');
            showErrorModal('Failed to submit attendance. Please try again.');
        }
    }, 2000);
}

// Save attendance record
function saveAttendanceRecord() {
    const studentData = JSON.parse(localStorage.getItem('currentStudent'));
    const now = new Date();
    
    // Generate consistent student ID for teacher dashboard compatibility
    const studentId = generateConsistentStudentId(studentData.studentId, studentData.class);
    
    const attendanceRecord = {
        id: generateId(),
        studentId: studentId,
        studentName: studentData.studentName,
        class: studentData.class,
        section: studentData.section,
        date: now.toDateString(),
        timestamp: now.toISOString(),
        photo: capturedPhotoData,
        status: 'present'
    };
    
    // Save to student's attendance history
    const attendanceKey = `attendance_${studentData.studentId}`;
    const attendanceHistory = JSON.parse(localStorage.getItem(attendanceKey) || '[]');
    attendanceHistory.unshift(attendanceRecord);
    localStorage.setItem(attendanceKey, JSON.stringify(attendanceHistory));
    
    // Save to global attendance records (for teacher view)
    const globalAttendanceKey = 'globalAttendanceRecords';
    const globalRecords = JSON.parse(localStorage.getItem(globalAttendanceKey) || '[]');
    globalRecords.unshift(attendanceRecord);
    localStorage.setItem(globalAttendanceKey, JSON.stringify(globalRecords));
    
    // Update today's attendance status
    const todayKey = `attendance_${now.toDateString()}`;
    const todayRecords = JSON.parse(localStorage.getItem(todayKey) || '[]');
    todayRecords.push(attendanceRecord);
    localStorage.setItem(todayKey, JSON.stringify(todayRecords));
}

// Generate consistent student ID for teacher dashboard compatibility
function generateConsistentStudentId(originalId, studentClass) {
    // Map class to grade for ID generation
    const classToGrade = {
        'class-9': 'grade-9',
        'class-10': 'grade-10', 
        'class-11': 'grade-11',
        'class-12': 'grade-12'
    };
    
    const grade = classToGrade[studentClass] || studentClass;
    
    // Create ID based on original student ID
    const numericPart = originalId.replace(/\D/g, '') || '001';
    const paddedNumber = numericPart.padStart(3, '0');
    
    // Generate consistent ID based on grade
    if (grade === 'grade-9') return 'S' + paddedNumber;
    if (grade === 'grade-10') return 'S' + (parseInt(paddedNumber) + 10).toString().padStart(3, '0');
    if (grade === 'grade-11') return 'S' + (parseInt(paddedNumber) + 20).toString().padStart(3, '0');
    if (grade === 'grade-12') return 'S' + (parseInt(paddedNumber) + 26).toString().padStart(3, '0');
    
    return 'S' + paddedNumber;
}

// Update attendance status after submission
function updateAttendanceStatus() {
    const statusElement = document.getElementById('attendanceStatus');
    const timeElement = document.getElementById('attendanceTime');
    const cameraSection = document.querySelector('.camera-section');
    
    statusElement.innerHTML = `
        <div class="status-present">
            <span class="status-icon">✅</span>
            <span class="status-text">Present</span>
        </div>
    `;
    
    timeElement.textContent = `Marked at: ${new Date().toLocaleTimeString()}`;
    timeElement.style.display = 'block';
    
    // Disable camera section
    cameraSection.style.opacity = '0.6';
    cameraSection.style.pointerEvents = 'none';
    
    // Add success message
    const infoDiv = document.createElement('div');
    infoDiv.className = 'attendance-info';
    infoDiv.innerHTML = `
        <p style="text-align: center; color: #4CAF50; font-weight: 600; background: #e8f5e8; padding: 15px; border-radius: 10px; margin-top: 20px;">
            ✅ Attendance successfully marked for today!
        </p>
    `;
    cameraSection.appendChild(infoDiv);
}

// Load attendance history
function loadAttendanceHistory() {
    const studentData = JSON.parse(localStorage.getItem('currentStudent'));
    const attendanceKey = `attendance_${studentData.studentId}`;
    const attendanceHistory = JSON.parse(localStorage.getItem(attendanceKey) || '[]');
    
    const historyContainer = document.getElementById('attendanceHistory');
    
    if (attendanceHistory.length === 0) {
        historyContainer.innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px;">
                <p>No attendance records found.</p>
                <p>Mark your first attendance to see history here.</p>
            </div>
        `;
        return;
    }
    
    const historyHTML = attendanceHistory.slice(0, 10).map(record => `
        <div class="history-item">
            <div>
                <div class="history-date">${new Date(record.date).toLocaleDateString()}</div>
                <div class="history-time">Marked at: ${new Date(record.timestamp).toLocaleTimeString()}</div>
            </div>
            <div class="history-status">
                <span style="color: #4CAF50;">✅ Present</span>
            </div>
        </div>
    `).join('');
    
    historyContainer.innerHTML = historyHTML;
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('studentLoggedIn');
            localStorage.removeItem('currentStudent');
            window.location.href = 'student-login.html';
        }
    });
    
    // Refresh history button
    document.getElementById('refreshHistoryBtn').addEventListener('click', loadAttendanceHistory);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeModal(modalId) {
    hideModal(modalId);
}

function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    showModal('errorModal');
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add fade-in animation to elements when they load
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.info-card, .status-card, .camera-section, .history-section');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}

// Initialize animations
setTimeout(addFadeInAnimation, 100);

// Cleanup function for when user leaves the page
window.addEventListener('beforeunload', function() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
            track.stop();
        });
    }
});

// Auto-refresh current date every minute
setInterval(function() {
    document.getElementById('currentDate').textContent = new Date().toDateString();
}, 60000);