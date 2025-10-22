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
         { time: "00:00 - 24:00", subject: "ВЫХОДНОЙ" },
    ]
};

function getCurrentDay() {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const now = new Date();
    return days[now.getDay()];
}

// --- ЛОГИКА ТАЙМЕРА И ДАТЫ ---
function updateTimer() {
    const now = new Date();
    const timeText = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateText = now.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const timerElement = document.getElementById('timer-time');
    timerElement.innerText = timeText;
    timerElement.setAttribute('data-text', timeText);

    const dateElement = document.getElementById('timer-date');
    dateElement.innerText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    dateElement.setAttribute('data-text', dateText.charAt(0).toUpperCase() + dateText.slice(1));
}

// --- ЛОГИКА РАСПИСАНИЯ (С ПРОГРЕСС-БАРОМ) ---
function updateSchedule() {
    const currentDay = getCurrentDay();
    const now = new Date();
    const schedule = scheduleData[currentDay] || [];
    const scheduleList = document.getElementById('schedule-list');
    const dayTitle = document.getElementById('schedule-day-title');

    dayTitle.textContent = `РАСПИСАНИЕ на ${currentDay}`;
    dayTitle.setAttribute('data-text', `РАСПИСАНИЕ на ${currentDay}`);

    scheduleList.innerHTML = '';

    let currentLessonIndex = -1;
    let nextLessonIndex = -1;

    // 1. Определение текущего/следующего урока
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        const [startTime, endTime] = lesson.time.split(' - ');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const lessonStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
        const lessonEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

        if (now >= lessonStart && now <= lessonEnd) {
            currentLessonIndex = i;
        } else if (now < lessonStart && nextLessonIndex === -1) {
            nextLessonIndex = i;
        }
    }

    // 2. Генерация списка уроков
    schedule.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.classList.add('schedule-item', 'ios-glass');

        const lessonMainInfo = document.createElement('div');
        lessonMainInfo.classList.add('lesson-main-info');

        // --- ДОБАВЛЕНО: Класс 'finished' для выцветания ---
        if (index === currentLessonIndex) {
            lessonItem.classList.add('current');
        } else if (index < currentLessonIndex) {
            lessonItem.classList.add('finished');
        }

        const lessonInfo = document.createElement('div');
        lessonInfo.classList.add('lesson-info');

        const lessonName = document.createElement('div');
        lessonName.classList.add('lesson-name');
        const lessonNameWrapper = document.createElement('span');
        lessonNameWrapper.classList.add('glitch-text-wrapper');
        lessonNameWrapper.setAttribute('data-text', lesson.subject);
        lessonNameWrapper.textContent = lesson.subject;
        lessonName.appendChild(lessonNameWrapper);

        const lessonTime = document.createElement('div');
        lessonTime.classList.add('lesson-time');
        const lessonTimeWrapper = document.createElement('span');
        lessonTimeWrapper.classList.add('glitch-text-wrapper');
        lessonTimeWrapper.setAttribute('data-text', lesson.time);
        lessonTimeWrapper.textContent = lesson.time;
        lessonTime.appendChild(lessonTimeWrapper);

        lessonInfo.appendChild(lessonName);
        lessonInfo.appendChild(lessonTime);

        const countdown = document.createElement('div');
        countdown.classList.add('countdown');

        let countdownText = 'Ожидание';
        let progressPercent = 0;

        if (index === currentLessonIndex) {
            const [startTime, endTime] = lesson.time.split(' - ');
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            const lessonStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
            const lessonEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

            const totalDuration = lessonEnd - lessonStart;
            const timePassed = now - lessonStart;
            const timeLeft = lessonEnd - now;

            if (timeLeft > 0) {
                const minutesLeft = Math.floor(timeLeft / (1000 * 60));
                countdownText = `Осталось: ${minutesLeft} мин`;
                progressPercent = Math.min(100, (timePassed / totalDuration) * 100);
            } else {
                countdownText = 'Завершен';
            }
        } else if (index === nextLessonIndex) {
            const [startTime] = lesson.time.split(' - ');
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const lessonStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);

            const timeUntil = lessonStart - now;
            if (timeUntil > 0) {
                const minutesUntil = Math.floor(timeUntil / (1000 * 60));
                countdownText = `Через: ${minutesUntil} мин`;
            } else {
                countdownText = 'Сейчас';
            }
        } else if (index < currentLessonIndex) {
            countdownText = 'Завершен';
        }

        const countdownWrapper = document.createElement('span');
        countdownWrapper.classList.add('glitch-text-wrapper');
        countdownWrapper.setAttribute('data-text', countdownText);
        countdownWrapper.textContent = countdownText;

        countdown.appendChild(countdownWrapper);

        lessonMainInfo.appendChild(lessonInfo);
        lessonMainInfo.appendChild(countdown);

        lessonItem.appendChild(lessonMainInfo);

        // 3. Добавление Прогресс-Бара для текущего урока
        if (index === currentLessonIndex) {
            const progressBarContainer = document.createElement('div');
            progressBarContainer.classList.add('lesson-progress-bar');
            
            const progressBarFill = document.createElement('div');
            progressBarFill.classList.add('lesson-progress-fill');
            progressBarFill.style.width = `${progressPercent}%`;

            progressBarContainer.appendChild(progressBarFill);
            lessonItem.appendChild(progressBarContainer);
        }
        
        scheduleList.appendChild(lessonItem);
    });
}

// --- ОТСЧЕТ ДО КОНЦА УЧЕБНОГО ДНЯ ---
function updateDayEndCountdown() {
    const currentDay = getCurrentDay();
    const schedule = scheduleData[currentDay] || [];
    const now = new Date();
    const countdownElement = document.getElementById('dayEndCountdown');

    if (schedule.length === 0 || currentDay === 'Суббота' || currentDay === 'Воскресенье') {
        countdownElement.innerHTML = `
            <div class="day-end-item ios-glass" style="text-align: center; padding: 15px;">
                <div class="day-end-info">
                    <div class="day-end-name glitch-text-wrapper" data-text="Сегодня выходной!">Сегодня выходной!</div>
                </div>
            </div>
        `;
        return;
    }

    const lastLesson = schedule[schedule.length - 1];
    const [_, endTime] = lastLesson.time.split(' - ');
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

    let dayEndCountText = 'Отдыхай!';
    let hoursLeft = 0;
    let minutesLeft = 0;

    if (now < dayEnd) {
        const timeLeft = dayEnd - now;
        hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        dayEndCountText = `${hoursLeft}ч ${minutesLeft}м`;
    } else {
         dayEndCountText = '';
    }

    countdownElement.innerHTML = `
        <div class="day-end-item ios-glass" style="display: flex; justify-content: space-between; align-items: center; padding: 15px;">
            <div class="day-end-info">
                <div class="day-end-name glitch-text-wrapper" data-text="До конца учебного дня">До конца учебного дня</div>
                <div class="day-end-time glitch-text-wrapper" data-text="Последний урок: ${lastLesson.subject}">Последний урок: ${lastLesson.subject}</div>
            </div>
            <div class="day-end-count glitch-text-wrapper" data-text="${dayEndCountText}">
                ${dayEndCountText}
            </div>
        </div>
    `;
}

// --- ЛОГИКА: СЕКРЕТНАЯ ФУНКЦИЯ С ПИН-КОДОМ ---
function initSecretFunction() {
    const inputElement = document.getElementById('secret-input-compact');
    const sendButton = document.getElementById('secret-send-btn-compact');
    const secretContent = document.getElementById('secret-content');
    const correctPin = "3415";

    function checkSecretPin() {
        const userPin = inputElement.value.trim();
        
        if (userPin === correctPin) {
            // Пин-код верный - показываем картинку
            secretContent.innerHTML = `
                <div class="secret-image-container ios-glass" style="text-align: center; padding: 20px;">
                    <img src="https://avatars.mds.yandex.net/i?id=d9a1f8c506ba401c5ae530be694203d1_l-10549345-images-thumbs&n=13" 
                         alt="Секретная картинка" 
                         style="max-width: 100%; border: 2px solid #00ff41; border-radius: 5px;">
                    <div style="margin-top: 10px; font-size: 1.4rem;">
                        <span class="glitch-text-wrapper" data-text="Доступ разрешен!">Доступ разрешен!</span>
                    </div>
                </div>
            `;
            inputElement.value = '';
            inputElement.placeholder = 'Доступ открыт!';
        } else {
            // Неверный пин-код
            secretContent.innerHTML = `
                <div class="secret-error-container ios-glass" style="text-align: center; padding: 20px;">
                    <i class="fas fa-times-circle" style="font-size: 3rem; color: #ff0000; margin-bottom: 10px;"></i>
                    <div style="font-size: 1.4rem;">
                        <span class="glitch-text-wrapper" data-text="Неверный пин-код!">Неверный пин-код!</span>
                    </div>
                </div>
            `;
            inputElement.value = '';
            inputElement.placeholder = 'Попробуйте снова...';
            
            // Автоматически очищаем сообщение об ошибке через 3 секунды
            setTimeout(() => {
                secretContent.innerHTML = '';
                inputElement.placeholder = 'Введите пин-код...';
            }, 3000);
        }
    }

    sendButton.addEventListener('click', checkSecretPin);
    inputElement.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkSecretPin();
        }
    });
}

// --- ЛОГИКА НАВИГАЦИИ ---
function initNavigation() {
    const mainContentArea = document.getElementById('main-content-area');
    const searchCompactPanel = document.getElementById('search-compact-panel');
    const sections = {
        'gdz-btn': 'gdz-section',
        'schedule-btn': 'schedule-container',
        'secret-btn': 'secret-container'
    };

    function showSection(sectionId) {
        const isSecretSection = sectionId === 'secret-container';
        searchCompactPanel.style.display = isSecretSection ? 'flex' : 'none';

        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
            activeSection.style.display = 'flex';
            mainContentArea.scrollTop = 0;
        }

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeButton = document.querySelector(`[id=\"${Object.keys(sections).find(key => sections[key] === sectionId)}\"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    Object.keys(sections).forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', () => {
            showSection(sections[buttonId]);
        });
    });

    showSection('schedule-container'); // По умолчанию показываем расписание
    document.getElementById('schedule-btn').classList.add('active');
}

// --- ГЕНЕРАТОР КРАШ-ТЕКСТА ---
function generateCrashText() {
    const chars = "▓▒░█▄▀■-+=<>/\\`~!@#$%^&*()[]{};:'\",./<>?|";
    let crashText = "";
    const numChars = 1500;
    for (let i = 0; i < numChars; i++) {
        crashText += chars[Math.floor(Math.random() * chars.length)];
        if (Math.random() < 0.02) {
            crashText += "\n";
        }
    }
    document.getElementById('crashed-overlay').textContent = crashText;
}

// --- Эффект Матрицы JS ---
function initMatrixEffect() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrixChars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜZRMNBYXCVLKFGHJK:OPQASDTYUIO@#$%^&*}][{?/>';
    const font_size = 16;
    const columns = canvas.width / font_size;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = font_size + 'px VT323';

        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 33); 

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight; 
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    });
}


// --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ---
document.addEventListener('DOMContentLoaded', function() {
    initMatrixEffect();
    initSecretFunction();
    initNavigation();
    generateCrashText();

    updateTimer();
    updateSchedule();
    updateDayEndCountdown();

    setInterval(() => {
        updateTimer();
    }, 1000);

    // Обновляем расписание каждые 10 секунд
    setInterval(() => {
        updateSchedule();
        updateDayEndCountdown();
    }, 10000); 
});
