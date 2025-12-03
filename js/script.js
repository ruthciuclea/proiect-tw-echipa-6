if (!localStorage.getItem('quizzes')) {
    const initialQuizzes = [
        { id: 1, name: 'Test 1 - ASD', papers: 14, date: '2025-10-28' },
        { id: 2, name: 'Test 2 - P2', papers: 14, date: '2025-10-20' }
    ];
    localStorage.setItem('quizzes', JSON.stringify(initialQuizzes));
}

if (!localStorage.getItem('classes')) {
    const initialClasses = [
        { id: 'c1', name: 'First Year', subjects: ['ASD', 'P2'], code: 'adb567' }
    ];
    localStorage.setItem('classes', JSON.stringify(initialClasses));
}

if (!localStorage.getItem('studentClasses')) {
    localStorage.setItem('studentClasses', JSON.stringify([]));
}


const mockStudents = [
    { name: 'Marian Petreanu', id: '67895', avg: 85, status: 'Good' },
    { name: 'Alexandra Dobrescu', id: '67896', avg: 92, status: 'Excellent' },
    { name: 'Ion Radu', id: '67897', avg: 45, status: 'Risk' },
    { name: 'Maria Ionescu', id: '67898', avg: 70, status: 'Good' }
];


const mockMyGrades = [
    { subject: 'ASD', test: 'Midterm Exam', score: 90, total: 100 },
    { subject: 'P2', test: 'Lab Quiz 1', score: 7, total: 10 },
    { subject: 'ASD', test: 'Final Project', score: 85, total: 100 },
    { subject: 'TW', test: 'CSS Grid Test', score: 45, total: 100 } 
];



function getQuizzes() { return JSON.parse(localStorage.getItem('quizzes')); }
function getClasses() { return JSON.parse(localStorage.getItem('classes')); }

function createQuiz(name, count) {
    const quizzes = getQuizzes();
    quizzes.unshift({
        id: Date.now(),
        name: name,
        papers: 0,
        date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
}

function createClass(name, subjects) {
    const classes = getClasses();
    const code = Math.random().toString(36).substring(2, 8);
    classes.unshift({
        id: Date.now(),
        name: name,
        subjects: subjects,
        code: code
    });
    localStorage.setItem('classes', JSON.stringify(classes));
    return code;
}

function joinClass(code) {
    const allClasses = getClasses();
    const targetClass = allClasses.find(c => c.code === code);
    
    if (targetClass) {
        const studentClasses = JSON.parse(localStorage.getItem('studentClasses'));
        if (!studentClasses.find(c => c.code === code)) {
            studentClasses.push(targetClass);
            localStorage.setItem('studentClasses', JSON.stringify(studentClasses));
            return { success: true, className: targetClass.name };
        } else {
            return { success: false, message: 'Already enrolled!' };
        }
    }
    return { success: false, message: 'Invalid Code' };
}


function renderQuizList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const quizzes = getQuizzes();
    container.innerHTML = quizzes.map(q => `
        <div class="list-item">
            <div><strong>${q.name}</strong></div>
            <div class="text-right">
                <div class="text-small">Papers: ${q.papers}</div>
                <div class="text-small">${q.date}</div>
            </div>
        </div>
    `).join('');
}

function renderClassList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const classes = getClasses();
    container.innerHTML = classes.map(c => `
        <div class="list-item">
            <div>
                <strong>${c.name}</strong>
                <div class="text-small">Subjects: ${c.subjects.join(', ')}</div>
            </div>
            <div class="text-right"><span class="tag" style="background:#333">Code: ${c.code}</span></div>
        </div>
    `).join('');
}

function renderStudentClasses(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const myClasses = JSON.parse(localStorage.getItem('studentClasses'));
    
    if (myClasses.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">No classes yet.</p>';
        return;
    }
    container.innerHTML = myClasses.map(c => `
        <div style="margin-top: 15px;">
            <h4 style="color: #555; margin-bottom:5px;">${c.name}</h4>
            ${c.subjects.map(sub => `
                <div class="list-item" style="background-color: #4ecdc4; color: white; border:none;">
                    <span>${sub}</span>
                    <span style="font-size:12px; text-decoration: underline; cursor:pointer;" onclick="window.location.href='student_stats.html'">See Tests</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}


function renderProfessorStudentList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = mockStudents.map(s => `
        <div class="list-item student-item">
            <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:40px; height:40px; background:#ddd; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                <div>
                    <strong>${s.name}</strong>
                    <div class="text-small">ID: ${s.id}</div>
                </div>
            </div>
            <div class="text-right">
                <span class="tag ${s.avg < 50 ? 'grade-low' : 'grade-high'}" style="background-color: ${s.avg < 50 ? '#ff6b6b' : '#4ecdc4'}">Avg: ${s.avg}%</span>
                <div class="text-small" style="margin-top:5px; color:#4ecdc4; cursor:pointer;">View Details</div>
            </div>
        </div>
    `).join('');
}
function handleScan(input) {
    if (input.files && input.files[0]) {

        document.getElementById('uploadText').innerText = "Image Uploaded: " + input.files[0].name;
        

        document.getElementById('processing').style.display = 'block';
        document.getElementById('scanResult').style.display = 'none';

        setTimeout(() => {
            document.getElementById('processing').style.display = 'none';
            document.getElementById('scanResult').style.display = 'block';
        }, 2000);
    }
}


function handleRegister() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;

    if (!name || !email || !pass) {
        alert("Please fill in all fields.");
        return;
    }

  
    const users = JSON.parse(localStorage.getItem('users')) || [];

    
    if (users.find(u => u.email === email)) {
        alert("User already exists!");
        return;
    }

   
    users.push({ name, email, pass, role });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! Please login.");
    window.location.href = 'login.html';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    if (!email || !pass) {
        alert("Please enter email and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        
        localStorage.setItem('currentUser', JSON.stringify(user));

       
        if (user.role === 'student') {
            window.location.href = 'student_dashboard.html';
        } else {
            window.location.href = 'professor_quizzes.html';
        }
    } else {
        alert("Invalid email or password!");
    }
}


function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
function renderStudentStats(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = mockMyGrades.map(g => {
       
        const pct = (g.score / g.total) * 100;
        let colorClass = 'grade-high';
        if (pct < 50) colorClass = 'grade-low';
        else if (pct < 80) colorClass = 'grade-mid';

        return `
        <div class="stat-card">
            <div>
                <strong>${g.subject}</strong>
                <div class="text-small">${g.test}</div>
            </div>
            <div class="text-right">
                <span class="grade-badge ${colorClass}">${g.score}/${g.total}</span>
            </div>
        </div>
        `;
    }).join('');
}