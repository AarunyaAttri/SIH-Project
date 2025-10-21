from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
import base64
from datetime import datetime
from flask_jwt_extended import create_access_token

app = Flask(__name__)

# ------------------ DATABASE CONFIG ------------------
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',         # Change if needed
    'password': '',         # Change if needed
    'database': 'attendance_db'
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# ------------------ INITIALIZE DB ------------------
def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Create database if not exists
        cursor.execute("CREATE DATABASE IF NOT EXISTS attendance_db")
        cursor.execute("USE attendance_db")

        # Students table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                class VARCHAR(20) NOT NULL,
                section VARCHAR(10) NOT NULL
            )
        """)

        # Teachers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teachers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                subject VARCHAR(50) NOT NULL
            )
        """)

        # Parents table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS parents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                student_id INT,
                FOREIGN KEY (student_id) REFERENCES students(id)
            )
        """)

        # Admins table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL
            )
        """)

        # Attendance table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                date DATETIME NOT NULL,
                status VARCHAR(20) NOT NULL,
                photo LONGBLOB,
                FOREIGN KEY (student_id) REFERENCES students(id)
            )
        """)

        # Insert one sample user in each table (only if not exists)
        cursor.execute("SELECT * FROM students WHERE username=%s", ("mahesh",))
        if cursor.fetchone() is None:
            cursor.execute("INSERT INTO students (username, password, name, class, section) VALUES (%s,%s,%s,%s,%s)",
                           ("mahesh", "1234", "Mahesh Kumar", "CSE", "A"))

        cursor.execute("SELECT * FROM teachers WHERE username=%s", ("teacher1",))
        if cursor.fetchone() is None:
            cursor.execute("INSERT INTO teachers (username, password, name, subject) VALUES (%s,%s,%s,%s)",
                           ("teacher1", "1234", "Mr. Sharma", "Maths"))

        cursor.execute("SELECT * FROM parents WHERE username=%s", ("parent1",))
        if cursor.fetchone() is None:
            cursor.execute("INSERT INTO parents (username, password, name, student_id) VALUES (%s,%s,%s,%s)",
                           ("parent1", "1234", "Mr. Kumar", 1))

        cursor.execute("SELECT * FROM admins WHERE username=%s", ("admin1",))
        if cursor.fetchone() is None:
            cursor.execute("INSERT INTO admins (username, password, name) VALUES (%s,%s,%s)",
                           ("admin1", "1234", "System Admin"))

        conn.commit()
    except Error as e:
        print(f"DB Init Error: {e}")
    finally:
        cursor.close()
        conn.close()

# ------------------ LOGIN ROUTES ------------------
def login_user(table, username, password):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(f"SELECT * FROM {table} WHERE username=%s AND password=%s", (username, password))
        user = cursor.fetchone()
        if user:
            return {'success': True, 'message': f'{table.capitalize()} login successful'}
        else:
            return {'success': False, 'message': 'Invalid credentials'}
    except Error as e:
        return {'success': False, 'error': str(e)}
    finally:
        cursor.close()
        conn.close()

@app.route('/student-login', methods=['POST'])
def student_login():
    data = request.get_json()
    return jsonify(login_user("students", data.get('username'), data.get('password')))

@app.route('/teacher-login', methods=['POST'])
def teacher_login():
    data = request.get_json()
    return jsonify(login_user("teachers", data.get('username'), data.get('password')))

@app.route('/parent-login', methods=['POST'])
def parent_login():
    data = request.get_json()
    return jsonify(login_user("parents", data.get('username'), data.get('password')))

@app.route("/admin-login", methods=["POST"])
def admin_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if email == "admin@example.com" and password == "admin123":
        token = create_access_token(identity={"role": "admin", "email": email})
        return jsonify({"success": True, "token": token}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401
# ------------------ ATTENDANCE ROUTES ------------------
@app.route('/mark-attendance', methods=['POST'])
def mark_attendance():
    data = request.get_json()
    student_id = data.get('studentId')
    photo_b64 = data.get('base64')
    try:
        photo_blob = base64.b64decode(photo_b64) if photo_b64 else None
        conn = get_db_connection()
        cursor = conn.cursor()
        now = datetime.now()
        cursor.execute("INSERT INTO attendance (student_id, date, status, photo) VALUES (%s,%s,%s,%s)",
                       (student_id, now, "Present", photo_blob))
        conn.commit()
        return jsonify({'success': True, 'message': 'Attendance marked'})
    except Error as e:
        return jsonify({'success': False, 'error': str(e)})
    finally:
        cursor.close()
        conn.close()

@app.route('/attendance-history', methods=['GET'])
def attendance_history():
    student_id = request.args.get('studentId')
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, date, status FROM attendance WHERE student_id=%s ORDER BY date DESC", (student_id,))
        records = cursor.fetchall()
        return jsonify({'success': True, 'data': records})
    except Error as e:
        return jsonify({'success': False, 'error': str(e)})
    finally:
        cursor.close()
        conn.close()

# ------------------ MAIN ------------------
if __name__ == '__main__':
    init_db()
    app.run(debug=True)