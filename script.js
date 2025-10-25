// --- ДАННЫЕ РАСПИСАНИЯ ---
const scheduleData = {
   'Понедельник': [
        { time: "10:35 - 11:15", subject: "Разговоры о важном" },
        { time: "13:05 - 13:45", subject: "В химии все интересно" },
        { time: "14:00 - 14:40", subject: "Алгебра" },
        { time: "14:55 - 15:35", subject: "Иностранный язык (английский)" },
        { time: "15:50 - 16:30", subject: "Изобразительное искусство" },
        { time: "16:40 - 17:20", subject: "История" },
        { time: "17:25 - 18:05", subject: "Русский язык" },
        { time: "18:10 - 18:50", subject: "Информатика" }
    ],
    'Вторник': [
        { time: "13:05 - 13:45", subject: "Башкирский язык государственный язык РБ" },
        { time: "14:00 - 14:40", subject: "Физическая культура" },
        { time: "14:55 - 15:35", subject: "Физическая культура" },
        { time: "15:50 - 16:30", subject: "История" },
        { time: "16:40 - 17:20", subject: "Геометрия" },
        { time: "17:25 - 18:05", subject: "Bit-программирование" },
        { time: "18:10 - 18:50", subject: "Информатика (2 группа)" }
    ],
    'Среда': [
        { time: "12:20 - 13:00", subject: "Алгебра" },
        { time: "13:05 - 13:45", subject: "Иностранный язык (английский)" },
        { time: "14:00 - 14:40", subject: "География" },
        { time: "14:55 - 15:35", subject: "Русский язык" },
        { time: "15:50 - 16:30", subject: "Физика" },
        { time: "16:40 - 17:20", subject: "Алгебра" },
        { time: "17:25 - 18:05", subject: "Литература" },
        { time: "18:10 - 18:50", subject: "История" }
    ],
    'Четверг': [
        { time: "12:20 - 13:00", subject: " Математика для любознательных. Занимательная математика" },
        { time: "13:05 - 13:45", subject: "Физика" },
        { time: "14:00 - 14:40", subject: "Родной язык" },
        { time: "14:55 - 15:35", subject: "Родная литература" },
        { time: "15:50 - 16:30", subject: "Геометрия" },
        { time: "16:40 - 17:20", subject: "Русский язык" },
        { time: "17:25 - 18:05", subject: "Труд (Технология)" },
        { time: "18:10 - 18:50", subject: "Труд (Технология)" }
    ],
    'Пятница': [
        { time: "14:00 - 14:40", subject: "Алгебра" },
        { time: "14:55 - 15:35", subject: "Иностранный язык (английский)" },
        { time: "15:50 - 16:30", subject: "Биология" },
        { time: "16:40 - 17:20", subject: "Русский язык" },
        { time: "17:25 - 18:05", subject: " Литература" },
        { time: "18:10 - 18:50", subject: "География" }
    ],
    'Суббота': [
        { time: "00:00 - 24:00", subject: "ВЫХОДНОЙ" },
    ],
    'Воскресенье': [
        { time: "00:00 - 24:00", subject: "ВЫХОДНОЙ" }
    ]
};

// --- ТАЙМЕР И ДАТА ---
function updateDateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour12: false });
    const dateStr = now.toLocaleDateString('ru-RU', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    document.getElementById('timer-time').textContent = timeStr;
    document.getElementById('timer-time').setAttribute('data-text', timeStr);
    document.getElementById('timer-date').textContent = dateStr;
    document.getElementById('timer-date').setAttribute('data-text', dateStr);
}

// --- ОБНОВЛЕНИЕ РАСПИСАНИЯ ---
function updateSchedule() {
    const now = new Date();
    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const currentDay = daysOfWeek[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const scheduleList = document.getElementById('schedule-list');
    const scheduleTitle = document.getElementById('schedule-day-title');
    const dayEndCountdown = document.getElementById('dayEndCountdown');

    scheduleTitle.textContent = `РАСПИСАНИЕ: ${currentDay}`;
    scheduleTitle.setAttribute('data-text', `РАСПИСАНИЕ: ${currentDay}`);
    scheduleList.innerHTML = '';

    const todaySchedule = scheduleData[currentDay] || [];
    let currentLessonIndex = -1;
    let nextLessonIndex = -1;

    // Определяем текущий и следующий уроки
    todaySchedule.forEach((lesson, index) => {
        const [startTime, endTime] = lesson.time.split(' - ');
        const startMinutes = convertTimeToMinutes(startTime);
        const endMinutes = convertTimeToMinutes(endTime);

        if (currentTime >= startMinutes && currentTime <= endMinutes) {
            currentLessonIndex = index;
        } else if (currentTime < startMinutes && nextLessonIndex === -1) {
            nextLessonIndex = index;
        }
    });

    // Отображаем уроки
    todaySchedule.forEach((lesson, index) => {
        const [startTime, endTime] = lesson.time.split(' - ');
        const startMinutes = convertTimeToMinutes(startTime);
        const endMinutes = convertTimeToMinutes(endTime);

        const lessonElement = document.createElement('div');
        lessonElement.className = 'schedule-item ios-glass';

        const isCurrent = index === currentLessonIndex;
        const isFinished = currentTime > endMinutes;
        const isNext = index === nextLessonIndex;

        if (isCurrent) {
            lessonElement.classList.add('current');
            const progress = calculateProgress(startMinutes, endMinutes, currentTime);
            
            lessonElement.innerHTML = `
                <div class="lesson-main-info">
                    <span class="lesson-name">${lesson.subject}</span>
                    <span class="lesson-time">${lesson.time}</span>
                </div>
                <div class="countdown" id="countdown-${index}">До конца: ${formatTime(endMinutes - currentTime)}</div>
                <div class="lesson-progress-bar">
                    <div class="lesson-progress-fill" style="width: ${progress}%"></div>
                </div>
            `;
        } else if (isFinished) {
            lessonElement.classList.add('finished');
            lessonElement.innerHTML = `
                <span class="lesson-name">${lesson.subject}</span>
                <span class="lesson-time">${lesson.time}</span>
                <div class="countdown">Завершен</div>
            `;
        } else {
            lessonElement.innerHTML = `
                <span class="lesson-name">${lesson.subject}</span>
                <span class="lesson-time">${lesson.time}</span>
                <div class="countdown">${isNext ? 'Следующий' : ''}</div>
            `;
        }

        scheduleList.appendChild(lessonElement);
    });

    // Обновляем таймер до конца дня
    updateDayEndCountdown(currentDay, currentTime, dayEndCountdown);
}

function convertTimeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function calculateProgress(start, end, current) {
    const total = end - start;
    const passed = current - start;
    return Math.min(100, Math.max(0, (passed / total) * 100));
}

function updateDayEndCountdown(currentDay, currentTime, countdownElement) {
    const dayEndTime = 18 * 60 + 50; // 18:50
    let timeLeft = dayEndTime - currentTime;

    if (timeLeft < 0) timeLeft = 0;

    countdownElement.innerHTML = `
        <div class="day-end-count">До конца уроков: ${formatTime(timeLeft)}</div>
    `;
}

// --- НАВИГАЦИЯ ---
function setupNavigation() {
    const sections = ['gdz-section', 'schedule-container', 'secret-container'];
    const buttons = ['gdz-btn', 'schedule-btn', 'secret-btn'];

    buttons.forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', () => {
            const targetSection = buttonId.replace('-btn', '-container');
            if (targetSection === 'secret-container') {
                document.getElementById('search-compact-panel').style.display = 'flex';
            } else {
                document.getElementById('search-compact-panel').style.display = 'none';
            }

            sections.forEach(section => {
                document.getElementById(section).classList.remove('active');
            });
            buttons.forEach(btn => {
                document.getElementById(btn).classList.remove('active');
            });

            document.getElementById(targetSection).classList.add('active');
            document.getElementById(buttonId).classList.add('active');
        });
    });

    // Активируем расписание по умолчанию
    document.getElementById('schedule-btn').click();
}

// --- СЕКРЕТНАЯ ФУНКЦИОНАЛЬНОСТЬ ---
function setupSecretFunctionality() {
    const secretInput = document.getElementById('secret-input-compact');
    const secretSendBtn = document.getElementById('secret-send-btn-compact');
    const secretContent = document.getElementById('secret-content');
    const crashedOverlay = document.getElementById('crashed-overlay');

    const correctPin = "2004";

    function checkPin() {
        const enteredPin = secretInput.value.trim();
        
        if (enteredPin === correctPin) {
            // Пин верный - показываем секретную картинку
            secretContent.innerHTML = `
                <div class="secret-image-container">
                    <img src="https://i.imgur.com/6GqPX7W.jpeg" alt="Секретное изображение" style="max-width: 100%; border-radius: 10px; border: 2px solid #e6d4ff; box-shadow: 0 0 20px #e6d4ff;">
                </div>
            `;
            secretInput.value = '';
            // Скрываем панель ввода через 5 секунд
            setTimeout(() => {
                document.getElementById('search-compact-panel').style.display = 'none';
            }, 5000);
        } else if (enteredPin.length === 4) {
            // Неверный пин из 4 цифр - активируем краш-эффект
            secretContent.innerHTML = `
                <div class="secret-error-container">
                    <span class="glitch-text-wrapper" data-text="НЕВЕРНЫЙ ПИН-КОД!">НЕВЕРНЫЙ ПИН-КОД!</span>
                </div>
            `;
            activateCrashEffect(crashedOverlay);
            secretInput.value = '';
        }
    }

    secretSendBtn.addEventListener('click', checkPin);
    secretInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPin();
        }
    });
}

function activateCrashEffect(crashedOverlay) {
    const glitchChars = "01!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    let crashText = "";
    const lines = 50;
    const charsPerLine = 60;

    for (let i = 0; i < lines; i++) {
        for (let j = 0; j < charsPerLine; j++) {
            crashText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        crashText += "\n";
    }

    crashedOverlay.textContent = crashText;
    crashedOverlay.style.display = 'block';

    // Убираем эффект через 3 секунды
    setTimeout(() => {
        crashedOverlay.style.display = 'none';
    }, 3000);
}

// --- МАТРИЧНЫЙ ФОН ---
function setupMatrixBackground() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(10, 0, 10, 0.04)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#d8b4ff";
        ctx.font = `${fontSize}px VT323, monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 33);
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);

    updateSchedule();
    setInterval(updateSchedule, 30000);

    setupNavigation();
    setupSecretFunctionality();
    setupMatrixBackground();
});
