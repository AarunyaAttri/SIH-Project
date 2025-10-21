// admin-dashboard.js
window.addEventListener('DOMContentLoaded', function() {
    // Attendance Chart (Bar)
    const ctx = document.getElementById('attendanceChart');
    if (ctx && window.Chart) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Attendance %',
                    data: [95, 93, 97, 92, 90, 96, 94],
                    backgroundColor: [
                        '#6366f1','#6366f1','#6366f1','#6366f1','#ef4444','#6366f1','#6366f1'
                    ],
                    borderRadius: 8,
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
                        max: 100,
                        ticks: { stepSize: 10 }
                    }
                },
                animation: { duration: 700 }
            }
        });
    }
});
