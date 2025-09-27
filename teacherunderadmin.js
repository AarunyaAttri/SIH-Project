const teachers = [
  { id: 'T03', name: 'Mrs. Kavita Rao', subject: 'English', status: 'Present', time: '08:05 AM' },
  { id: 'T04', name: 'Mr. Amit Verma', subject: 'History', status: 'Present', time: '08:15 AM' },
  { id: 'T05', name: 'Ms. Pooja Singh', subject: 'Biology', status: 'Absent', time: '-' }
];

const teacherTable = document.getElementById('teacher-table');

teachers.forEach(teacher => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${teacher.id}</td>
    <td>${teacher.name}</td>
    <td>${teacher.subject}</td>
    <td>${teacher.status}</td>
    <td>${teacher.time}</td>
  `;
  teacherTable.appendChild(row);
});
