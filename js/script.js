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

// Track which students are enrolled in which classes
if (!localStorage.getItem('classEnrollments')) {
    localStorage.setItem('classEnrollments', JSON.stringify([]));
}

// Track student test results (tests taken by students)
if (!localStorage.getItem('studentTestResults')) {
    localStorage.setItem('studentTestResults', JSON.stringify([]));
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

function createQuiz(name, count, answerKeys = {}, justificationPDF = null, questionPoints = {}, answerOptions = 4) {
    const quizzes = getQuizzes();
    quizzes.unshift({
        id: Date.now(),
        name: name,
        papers: 0,
        date: new Date().toISOString().split('T')[0],
        questionCount: count,
        answerKeys: answerKeys,
        questionPoints: questionPoints, // Points per question: { "1": 1, "2": 2, ... }
        answerOptions: answerOptions, // Number of answer options (A, B, C, D, etc.)
        justificationPDF: justificationPDF // Contains { name, size, type, data } or null
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
            
            // Track enrollment for professor to see students
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                const enrollments = JSON.parse(localStorage.getItem('classEnrollments')) || [];
                const enrollmentExists = enrollments.find(
                    e => e.classId === targetClass.id && e.studentId === currentUser.email
                );
                if (!enrollmentExists) {
                    enrollments.push({
                        classId: targetClass.id,
                        classCode: targetClass.code,
                        studentId: currentUser.email,
                        studentName: currentUser.name,
                        studentEmail: currentUser.email
                    });
                    localStorage.setItem('classEnrollments', JSON.stringify(enrollments));
                }
            }
            
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
        <div class="list-item" style="cursor: pointer;" onclick="showClassStudents('${c.id}')">
            <div>
                <strong>${c.name}</strong>
                <div class="text-small">Subjects: ${c.subjects.join(', ')}</div>
            </div>
            <div class="text-right">
                <span class="tag" style="background:#333">Code: ${c.code}</span>
                <div class="text-small" style="margin-top:5px; color:#4ecdc4;">View Students →</div>
            </div>
        </div>
    `).join('');
}

function showClassStudents(classId) {
    const classes = getClasses();
    const classInfo = classes.find(c => c.id === classId || c.id.toString() === classId);
    if (!classInfo) {
        alert('Class not found');
        return;
    }
    
    const enrollments = JSON.parse(localStorage.getItem('classEnrollments')) || [];
    const classEnrollments = enrollments.filter(e => 
        e.classId === classId || e.classId.toString() === classId.toString()
    );
    
    // Create modal to display students
    const modal = document.createElement('div');
    modal.id = 'studentsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #4ecdc4;">${classInfo.name} - Enrolled Students</h2>
            <button onclick="closeStudentsModal()" style="background: #ff6b6b; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">×</button>
        </div>
        <div id="students-list-modal">
            ${classEnrollments.length === 0 
                ? '<p style="text-align: center; color: #888; padding: 20px;">No students enrolled yet.</p>'
                : classEnrollments.map(e => `
                    <div class="list-item student-item" style="margin-bottom: 10px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="width:40px; height:40px; background:#ddd; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                            <div>
                                <strong>${e.studentName}</strong>
                                <div class="text-small">${e.studentEmail}</div>
                            </div>
                        </div>
                    </div>
                `).join('')
            }
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeStudentsModal();
        }
    });
}

function closeStudentsModal() {
    const modal = document.getElementById('studentsModal');
    if (modal) {
        modal.remove();
    }
}

function renderStudentClasses(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const myClasses = JSON.parse(localStorage.getItem('studentClasses')) || [];
    
    if (myClasses.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">No classes yet. Join a class to see subjects and tests.</p>';
        return;
    }
    container.innerHTML = myClasses.map(c => `
        <div style="margin-top: 15px;">
            <h4 style="color: #555; margin-bottom:5px;">${c.name}</h4>
            ${c.subjects.map(sub => `
                <div class="list-item" style="background-color: #4ecdc4; color: white; border:none; cursor: pointer;" onclick="showSubjectTests('${sub}')">
                    <span>${sub}</span>
                    <span style="font-size:12px; text-decoration: underline;">See Tests →</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function showSubjectTests(subject) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Please login to view tests');
            return;
        }
        
        // Get all test results for this student and subject
        const testResults = JSON.parse(localStorage.getItem('studentTestResults')) || [];
        
        // Filter by current user's email and subject
        // Use case-insensitive comparison for subject names
        const subjectTests = testResults.filter(result => 
            result.studentEmail === currentUser.email && 
            result.subject && 
            result.subject.toUpperCase().trim() === subject.toUpperCase().trim()
        );
        
        // Also get all quizzes to show available tests (even if not taken yet)
        const allQuizzes = getQuizzes() || [];
        
        // Create modal to display tests
        const modal = document.createElement('div');
        modal.id = 'subjectTestsModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 700px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        // Group tests by taken/not taken
        const takenTests = subjectTests.map(result => {
            const quiz = allQuizzes.find(q => q.id === result.quizId);
            return {
                ...result,
                quizName: quiz ? quiz.name : result.quizName || 'Unknown Quiz',
                quizDate: quiz ? quiz.date : result.date
            };
        });
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #4ecdc4;">${subject} - Tests</h2>
                <button onclick="closeSubjectTestsModal()" style="background: #ff6b6b; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">×</button>
            </div>
            <div id="subject-tests-list">
                ${takenTests.length === 0 
                    ? '<p style="text-align: center; color: #888; padding: 20px;">No tests taken yet for this subject.</p>'
                    : takenTests.map(test => {
                        const pct = test.total > 0 ? (test.score / test.total) * 100 : 0;
                        let colorClass = 'grade-high';
                        if (pct < 50) colorClass = 'grade-low';
                        else if (pct < 80) colorClass = 'grade-mid';
                        
                        return `
                            <div class="list-item" style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <strong>${test.quizName}</strong>
                                        <div class="text-small">Date: ${test.quizDate || test.date}</div>
                                    </div>
                                    <div class="text-right">
                                        <span class="grade-badge ${colorClass}" style="font-size: 16px; padding: 8px 15px;">
                                            ${test.score}/${test.total}
                                        </span>
                                        <div class="text-small" style="margin-top: 5px; color: #666;">
                                            ${pct.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')
                }
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSubjectTestsModal();
            }
        });
    } catch (error) {
        console.error('Error showing subject tests:', error);
        alert('Error loading tests. Please try again.');
    }
}

function closeSubjectTestsModal() {
    const modal = document.getElementById('subjectTestsModal');
    if (modal) {
        modal.remove();
    }
}

// Helper function to add a test result for a student
function addStudentTestResult(quizId, quizName, subject, score, total, date = null, studentName = null, studentEmail = null, studentId = null) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // If student name/email provided (professor scanning for student), use those
    // Otherwise, use current logged-in user
    const finalStudentName = studentName || (currentUser ? currentUser.name : 'Unknown Student');
    const finalStudentEmail = studentEmail || (currentUser ? currentUser.email : 'unknown@example.com');
    
    if (!finalStudentEmail) {
        console.error('No student email available');
        return;
    }
    
    const testResults = JSON.parse(localStorage.getItem('studentTestResults')) || [];
    
    // Check if this test result already exists for this student and quiz
    const existingIndex = testResults.findIndex(result => 
        (result.quizId === quizId || result.quizId.toString() === quizId.toString()) && 
        result.studentEmail === finalStudentEmail
    );
    
    const testResult = {
        quizId: quizId,
        quizName: quizName,
        subject: subject,
        studentEmail: finalStudentEmail,
        studentName: finalStudentName,
        studentId: studentId || null,
        score: score,
        total: total,
        date: date || new Date().toISOString().split('T')[0]
    };
    
    if (existingIndex >= 0) {
        // Update existing result
        testResults[existingIndex] = testResult;
    } else {
        // Add new result
        testResults.push(testResult);
    }
    
    localStorage.setItem('studentTestResults', JSON.stringify(testResults));
}

// Helper function to extract subject from quiz name (e.g., "Test 1 - ASD" -> "ASD")
function extractSubjectFromQuizName(quizName) {
    // Try to extract subject from common patterns
    const patterns = [
        /- ([A-Z]+)$/,  // "Test 1 - ASD"
        /\(([A-Z]+)\)/,  // "Test (ASD)"
        /\b([A-Z]{2,})\b/ // Any uppercase word (2+ letters)
    ];
    
    for (const pattern of patterns) {
        const match = quizName.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    // Default: return first part or "General"
    return quizName.split(' - ')[0] || 'General';
}

// Get all students who took a specific quiz
function getStudentsForQuiz(quizId) {
    const testResults = JSON.parse(localStorage.getItem('studentTestResults')) || [];
    return testResults.filter(result => result.quizId === quizId || result.quizId.toString() === quizId.toString());
}

// Display students who took a specific quiz in a modal
function showQuizStudents(quizId) {
    const quizzes = getQuizzes() || [];
    const quiz = quizzes.find(q => q.id === quizId || q.id.toString() === quizId.toString());
    
    if (!quiz) {
        alert('Quiz not found');
        return;
    }
    
    const students = getStudentsForQuiz(quizId);
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'quizStudentsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 700px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    // Calculate statistics
    let totalStudents = students.length;
    let avgScore = 0;
    let highestScore = 0;
    let lowestScore = Infinity;
    
    if (students.length > 0) {
        const totalPoints = students.reduce((sum, s) => sum + s.score, 0);
        const totalPossible = students.reduce((sum, s) => sum + s.total, 0);
        avgScore = totalPossible > 0 ? (totalPoints / totalPossible) * 100 : 0;
        
        students.forEach(s => {
            const percentage = s.total > 0 ? (s.score / s.total) * 100 : 0;
            if (percentage > highestScore) highestScore = percentage;
            if (percentage < lowestScore) lowestScore = percentage;
        });
    }
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #4ecdc4;">${quiz.name} - Students</h2>
            <button onclick="closeQuizStudentsModal()" style="background: #ff6b6b; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">×</button>
        </div>
        
        ${students.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #4ecdc4;">${totalStudents}</div>
                    <div class="text-small">Students</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #4ecdc4;">${avgScore.toFixed(1)}%</div>
                    <div class="text-small">Average</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #4ecdc4;">${highestScore.toFixed(1)}%</div>
                    <div class="text-small">Highest</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #4ecdc4;">${lowestScore.toFixed(1)}%</div>
                    <div class="text-small">Lowest</div>
                </div>
            </div>
        ` : ''}
        
        <div id="quiz-students-list">
            ${students.length === 0 
                ? '<p style="text-align: center; color: #888; padding: 20px;">No students have taken this test yet.</p>'
                : students.map(student => {
                    const percentage = student.total > 0 ? (student.score / student.total) * 100 : 0;
                    let colorClass = 'grade-high';
                    if (percentage < 50) colorClass = 'grade-low';
                    else if (percentage < 80) colorClass = 'grade-mid';
                    
                    return `
                        <div class="list-item student-item" style="margin-bottom: 10px;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:40px; height:40px; background:#ddd; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                                <div>
                                    <strong>${student.studentName || 'Unknown Student'}</strong>
                                    <div class="text-small">${student.studentEmail}</div>
                                    ${student.studentId ? `<div class="text-small" style="color: #666;">ID: ${student.studentId}</div>` : ''}
                                    <div class="text-small" style="color: #666;">Date: ${student.date}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="grade-badge ${colorClass}" style="font-size: 14px; padding: 6px 12px;">
                                    ${student.score.toFixed(1)}/${student.total.toFixed(1)}
                                </span>
                                <div class="text-small" style="margin-top: 5px; color: #666;">
                                    ${percentage.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')
            }
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuizStudentsModal();
        }
    });
}

function closeQuizStudentsModal() {
    const modal = document.getElementById('quizStudentsModal');
    if (modal) {
        modal.remove();
    }
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
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    document.getElementById('uploadText').innerText = "Image Uploaded: " + file.name;
    
    // Check if quiz is selected
    const quizSelect = document.getElementById('quizSelect');
    if (!quizSelect || !quizSelect.value) {
        alert('Please select a quiz first');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Show preview
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            
            // Process the image
            processOMRImage(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function processOMRImage(img) {
    document.getElementById('processing').style.display = 'block';
    document.getElementById('scanResult').style.display = 'none';
    
    // Get selected quiz
    const quizSelect = document.getElementById('quizSelect');
    const quizzes = getQuizzes() || [];
    const selectedQuiz = quizzes.find(q => q.id.toString() === quizSelect.value);
    
    if (!selectedQuiz || !selectedQuiz.answerKeys) {
        alert('Selected quiz does not have an answer key. Please select a valid quiz.');
        document.getElementById('processing').style.display = 'none';
        return;
    }
    
    // Use setTimeout to allow UI to update, then process
    setTimeout(() => {
        try {
            const detectedAnswers = detectBubbles(img, selectedQuiz);
            const questionPoints = selectedQuiz.questionPoints || {};
            const result = gradeAnswers(detectedAnswers, selectedQuiz.answerKeys, questionPoints);
            
            scanResults = result;
            displayScanResults(result);
            
            document.getElementById('processing').style.display = 'none';
            document.getElementById('scanResult').style.display = 'block';
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please try again with a clearer image.');
            document.getElementById('processing').style.display = 'none';
        }
    }, 500);
}

function detectBubbles(img, quiz) {
    // Create canvas for image processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to image size
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Convert to grayscale and detect dark regions
    const questionCount = quiz.questionCount || 20;
    
    // Get number of answer options from quiz, or infer from answer keys
    let answerOptions = quiz.answerOptions || 4;
    
    // If not stored, try to infer from answer keys
    if (!quiz.answerOptions && quiz.answerKeys) {
        const allOptions = new Set();
        for (const q in quiz.answerKeys) {
            const answers = Array.isArray(quiz.answerKeys[q]) ? quiz.answerKeys[q] : [quiz.answerKeys[q]];
            answers.forEach(a => allOptions.add(a.toUpperCase()));
        }
        // Find the highest option letter (A=0, B=1, C=2, D=3, etc.)
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const maxOptionIndex = Math.max(...Array.from(allOptions).map(a => letters.indexOf(a)).filter(i => i >= 0));
        if (maxOptionIndex >= 0) {
            answerOptions = maxOptionIndex + 1;
        }
    }
    
    // Calculate approximate bubble positions
    // This is a simplified OMR - assumes bubbles are in a grid pattern
    const detectedAnswers = {};
    
    // First, calculate average image brightness to set adaptive threshold
    let totalBrightness = 0;
    let sampleCount = 0;
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = (r * 0.299 + g * 0.587 + b * 0.114);
        totalBrightness += gray;
        sampleCount++;
    }
    const avgBrightness = totalBrightness / sampleCount;
    
    // Adaptive threshold: darker images need lower threshold
    // For light images (avg > 200), use threshold around 60-80
    // For dark images (avg < 100), use threshold around 30-50
    const baseThreshold = avgBrightness > 200 ? 60 : (avgBrightness > 150 ? 45 : 30);
    const threshold = baseThreshold;
    
    // Reserve space for margins - use smaller margins to cover more area
    const marginTop = canvas.height * 0.05; // 5% top margin
    const marginBottom = canvas.height * 0.05; // 5% bottom margin
    const marginLeft = canvas.width * 0.05; // 5% left margin
    const marginRight = canvas.width * 0.05; // 5% right margin
    
    const usableHeight = canvas.height - marginTop - marginBottom;
    const usableWidth = canvas.width - marginLeft - marginRight;
    
    // Calculate row and column spacing - distribute evenly
    const rowSpacing = usableHeight / questionCount;
    const colSpacing = usableWidth / answerOptions;
    
    // Process each question row - use scanning approach for better alignment tolerance
    for (let q = 1; q <= questionCount; q++) {
        // Calculate approximate Y position for this question row
        const approximateRowY = marginTop + ((q - 0.5) * rowSpacing);
        
        // Define a search window for this row (wider to handle misalignment)
        const rowSearchStart = Math.max(0, Math.floor(approximateRowY - rowSpacing * 0.3));
        const rowSearchEnd = Math.min(canvas.height, Math.floor(approximateRowY + rowSpacing * 0.3));
        
        // For each answer option, scan horizontally to find the darkest region
        const optionDarkness = [];
        
        for (let opt = 0; opt < answerOptions; opt++) {
            // Calculate approximate X position for this option
            const approximateColX = marginLeft + ((opt + 0.5) * colSpacing);
            
            // Define a search window for this column (wider to handle misalignment)
            const colSearchStart = Math.max(0, Math.floor(approximateColX - colSpacing * 0.4));
            const colSearchEnd = Math.min(canvas.width, Math.floor(approximateColX + colSpacing * 0.4));
            
            // Scan the search area to find the darkest circular region (bubble)
            let maxDarkness = 0;
            let bestX = approximateColX;
            let bestY = approximateRowY;
            let bestDarkness = 0;
            
            // Sample in a grid pattern to find the darkest spot
            const scanStep = Math.max(2, Math.floor(Math.min(rowSpacing, colSpacing) / 10));
            
            for (let y = rowSearchStart; y < rowSearchEnd; y += scanStep) {
                for (let x = colSearchStart; x < colSearchEnd; x += scanStep) {
                    // Check a small circular region around this point (simulating a bubble)
                    const bubbleRadius = Math.min(rowSpacing, colSpacing) * 0.15;
                    let regionDarkness = 0;
                    let regionPixels = 0;
                    
                    // Sample pixels in a circular region
                    for (let dy = -bubbleRadius; dy <= bubbleRadius; dy += 2) {
                        for (let dx = -bubbleRadius; dx <= bubbleRadius; dx += 2) {
                            const checkX = Math.floor(x + dx);
                            const checkY = Math.floor(y + dy);
                            
                            // Check if within circle
                            if (dx * dx + dy * dy <= bubbleRadius * bubbleRadius) {
                                if (checkX >= 0 && checkX < canvas.width && checkY >= 0 && checkY < canvas.height) {
                                    const idx = (checkY * canvas.width + checkX) * 4;
                                    const r = data[idx];
                                    const g = data[idx + 1];
                                    const b = data[idx + 2];
                                    // Convert to grayscale and invert (darker = higher value)
                                    const gray = 255 - (r * 0.299 + g * 0.587 + b * 0.114);
                                    regionDarkness += gray;
                                    regionPixels++;
                                }
                            }
                        }
                    }
                    
                    if (regionPixels > 0) {
                        const avgRegionDarkness = regionDarkness / regionPixels;
                        if (avgRegionDarkness > bestDarkness) {
                            bestDarkness = avgRegionDarkness;
                            bestX = x;
                            bestY = y;
                        }
                    }
                }
            }
            
            optionDarkness.push({
                option: opt,
                darkness: bestDarkness,
                x: bestX,
                y: bestY
            });
        }
        
        // Determine which options are filled based on relative darkness
        // Sort by darkness and use threshold
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const detectedOptions = [];
        
        // Find the maximum darkness among all options for this question
        const maxDarkness = Math.max(...optionDarkness.map(o => o.darkness));
        
        // An option is filled if:
        // 1. Its darkness is above the threshold, AND
        // 2. It's significantly darker than the average (at least 1.5x the threshold)
        optionDarkness.forEach(optData => {
            if (optData.darkness > threshold && optData.darkness > threshold * 1.5) {
                detectedOptions.push(letters[optData.option]);
            }
        });
        
        // Alternative: if no clear answers, use relative comparison
        // (the darkest option(s) that are significantly darker than others)
        if (detectedOptions.length === 0 && maxDarkness > threshold) {
            // Find options that are at least 70% as dark as the darkest
            const relativeThreshold = maxDarkness * 0.7;
            optionDarkness.forEach(optData => {
                if (optData.darkness >= relativeThreshold) {
                    detectedOptions.push(letters[optData.option]);
                }
            });
        }
        
        if (detectedOptions.length > 0) {
            detectedAnswers[q] = detectedOptions;
        }
    }
    
    console.log('Detected answers:', detectedAnswers);
    console.log('Threshold used:', threshold, 'Average brightness:', avgBrightness.toFixed(1));
    
    return detectedAnswers;
}

function gradeAnswers(detectedAnswers, answerKeys, questionPoints = {}) {
    let pointsEarned = 0;
    let totalPoints = 0;
    const details = [];
    
    // Compare detected answers with answer key
    for (const questionNum in answerKeys) {
        // Get points for this question (default to 1 if not specified)
        const questionPointValue = parseFloat(questionPoints[questionNum]) || 1;
        totalPoints += questionPointValue;
        
        const correctAnswers = Array.isArray(answerKeys[questionNum]) 
            ? answerKeys[questionNum] 
            : [answerKeys[questionNum]];
        const studentAnswers = detectedAnswers[questionNum] || [];
        
        // Check if student answers match (order doesn't matter for multiple choice)
        const correctSet = new Set(correctAnswers.map(a => a.toUpperCase()));
        const studentSet = new Set(studentAnswers.map(a => a.toUpperCase()));
        
        // For multiple correct answers, all must match
        let isCorrect = correctSet.size === studentSet.size && 
                       [...correctSet].every(a => studentSet.has(a));
        
        // Award points if correct
        if (isCorrect) {
            pointsEarned += questionPointValue;
        }
        
        details.push({
            question: questionNum,
            correct: correctAnswers,
            detected: studentAnswers,
            isCorrect: isCorrect,
            points: questionPointValue,
            pointsEarned: isCorrect ? questionPointValue : 0
        });
    }
    
    return {
        score: pointsEarned,
        total: totalPoints,
        percentage: totalPoints > 0 ? ((pointsEarned / totalPoints) * 100).toFixed(1) : 0,
        details: details
    };
}

function displayScanResults(result) {
    const resultContent = document.getElementById('resultContent');
    
    let html = `
        <p><strong>Points Earned:</strong> <span style="color:#4ecdc4; font-weight:bold; font-size:18px;">${result.score.toFixed(1)}/${result.total.toFixed(1)}</span></p>
        <p><strong>Percentage:</strong> <span style="font-weight:bold; font-size:16px;">${result.percentage}%</span></p>
        <div style="margin-top: 15px; max-height: 200px; overflow-y: auto; background: #f9f9f9; padding: 10px; border-radius: 5px;">
            <strong>Answer Details:</strong>
            <div style="margin-top: 10px; font-size: 12px;">
    `;
    
    result.details.forEach(detail => {
        const status = detail.isCorrect ? '✅' : '❌';
        const color = detail.isCorrect ? '#4ecdc4' : '#ff6b6b';
        const pointsText = detail.pointsEarned > 0 
            ? `<span style="color: ${color}; font-weight: bold;">+${detail.pointsEarned.toFixed(1)}/${detail.points.toFixed(1)} pts</span>`
            : `<span style="color: #999;">0/${detail.points.toFixed(1)} pts</span>`;
        html += `
            <div style="margin-bottom: 5px; padding: 5px; background: white; border-left: 3px solid ${color};">
                Q${detail.question}: ${status} ${pointsText}
                <br>
                <span style="font-size: 11px; color: #666;">
                    Correct: [${detail.correct.join(', ')}] | 
                    Detected: [${detail.detected.length > 0 ? detail.detected.join(', ') : 'None'}]
                </span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    resultContent.innerHTML = html;
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
