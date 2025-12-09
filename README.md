# Quiz & Grade Management System

Sistem de management pentru quiz-uri și note, dezvoltat pentru echipa 6 în cadrul proiectului de Tehnologii Web.

##  Descriere

Aplicația permite profesorilor să creeze și să gestioneze quiz-uri, să scaneze foi de răspuns folosind tehnologia OMR (Optical Mark Recognition), să gestioneze clase și studenți, iar studenților să-și vadă notele și statisticile.

##  Funcționalități

### Pentru Profesori
- **Autentificare și înregistrare** - Sistem de login/register pentru profesori
- **Creare quiz-uri** - Crearea de quiz-uri cu chei de răspuns și punctaje personalizate
- **Scanare OMR** - Scanarea automată a foilor de răspuns folosind procesare de imagini
- **Gestionare clase** - Crearea și gestionarea claselor cu coduri unice de acces
- **Gestionare studenți** - Vizualizarea studenților înscriși în clase
- **Vizualizare quiz-uri** - Lista tuturor quiz-urilor create cu statistici

### Pentru Studenți
- **Autentificare și înregistrare** - Sistem de login/register pentru studenți
- **Înscriere în clase** - Înscrierea în clase folosind coduri de acces
- **Dashboard** - Vizualizarea claselor și subiectelor
- **Statistici** - Vizualizarea notelor și statisticilor pentru fiecare subiect
- **Istoric teste** - Acces la toate testele și notele obținute

##  Tehnologii

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Stocare date**: LocalStorage (pentru demo)
- **Procesare imagini**: Canvas API pentru OMR scanning

##  Instalare și Rulare

Aplicația este o aplicație frontend-only și poate fi rulată direct din browser.

### Opțiunea 1: Deschidere directă în browser
1. Clonează repository-ul:
```bash
git clone <repository-url>
cd proiect-tw-echipa-6
```

2. Deschide direct fișierul `html/index.html` în browser-ul tău.

### Opțiunea 2: Cu un server local (recomandat)
Pentru a evita problemele cu CORS și pentru o experiență mai bună, poți folosi un server local simplu:

**Cu Python:**
```bash
# Python 3
python -m http.server 8000

# Apoi deschide în browser:
# http://localhost:8000/html/index.html
```

**Cu Node.js (dacă ai instalat):**
```bash
npx http-server -p 8000

# Apoi deschide în browser:
# http://localhost:8000/html/index.html
```

**Cu PHP:**
```bash
php -S localhost:8000

# Apoi deschide în browser:
# http://localhost:8000/html/index.html
```

##  Structura Proiectului

```
proiect-tw-echipa-6/
├── html/                    # Pagini HTML
│   ├── index.html          # Pagina principală
│   ├── login.html          # Pagina de login
│   ├── register.html       # Pagina de înregistrare
│   ├── create_quiz.html    # Creare quiz (profesor)
│   ├── professor_quizzes.html  # Lista quiz-uri (profesor)
│   ├── professor_classes.html  # Gestionare clase (profesor)
│   ├── professor_students.html # Gestionare studenți (profesor)
│   ├── scan_quiz.html      # Scanare OMR (profesor)
│   ├── student_dashboard.html  # Dashboard student
│   ├── student_stats.html  # Statistici student
│   └── test_answer_sheet.html  # Template foaie de răspuns
├── js/
│   └── script.js           # Logica aplicației
├── style/
│   └── styles.css          # Stiluri CSS
├── package.json            # Configurare proiect (opțional)
├── TESTING_OMR.md         # Ghid pentru testarea OMR
└── README.md              # Acest fișier
```

##  Utilizare

### Pentru Profesori

1. **Înregistrare/Login**
   - Accesează pagina de login sau înregistrare
   - Creează un cont de profesor

2. **Creare Quiz**
   - Navighează la "Quizzes"
   - Click pe "CREATE NEW QUIZ"
   - Completează numele quiz-ului, numărul de întrebări și opțiuni de răspuns
   - Selectează răspunsurile corecte pentru fiecare întrebare
   - Opțional: setează punctaje personalizate pentru fiecare întrebare
   - Salvează quiz-ul

3. **Scanare Foi de Răspuns**
   - Accesează pagina de scanare
   - Selectează quiz-ul corespunzător
   - Încarcă imaginea foii de răspuns
   - Sistemul va procesa automat și va afișa rezultatele
   - Salvează rezultatul asociind-l unui student

4. **Gestionare Clase**
   - Creează clase noi cu subiecte
   - Distribuie codul de acces studenților
   - Vizualizează studenții înscriși

### Pentru Studenți

1. **Înregistrare/Login**
   - Accesează pagina de login sau înregistrare
   - Creează un cont de student

2. **Înscriere în Clasă**
   - Folosește codul de acces primit de la profesor
   - Te vei înscrie automat în clasă

3. **Vizualizare Note**
   - Accesează dashboard-ul
   - Selectează un subiect pentru a vedea toate testele și notele
   - Vezi statistici detaliate pentru fiecare subiect

## 🔍 Testare OMR

Pentru instrucțiuni detaliate despre testarea funcționalității de scanare OMR, consultă [TESTING_OMR.md](./TESTING_OMR.md).

##  Note

- **Aplicație frontend-only**: Aplicația rulează complet în browser, fără nevoie de un server backend
- **Stocare LocalStorage**: Datele sunt stocate local în browser-ul utilizatorului (pentru demo)
- **OMR Scanning**: Funcționalitatea OMR funcționează cel mai bine cu imagini clare și contrastate
- **Layout grilă**: Sistemul presupune un layout de grilă pentru răspunsuri

##  Dezvoltare Viitoare

La pasul următor, este planificată implementarea unui backend complet folosind Node.js și Express.js, care va include:
- API REST pentru gestionarea utilizatorilor, quiz-urilor și claselor
- Integrare cu o bază de date reală (MongoDB sau MySQL)
- Autentificare și autorizare pe server
- Stocare persistentă a datelor
- Migrarea de la LocalStorage la un sistem de stocare centralizat

## 👥 Echipa

Proiect dezvoltat de Echipa 6 pentru Tehnologii Web, Ruth Alexandra Ciuclea, Elena-Amelia Corici, Alexandra Calota.

