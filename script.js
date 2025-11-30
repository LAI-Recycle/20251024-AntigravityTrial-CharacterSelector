const characters = [
    {
        id: 1,
        name: "星乃 歌 (Hoshino Uta)",
        desc: "來自銀河系的偶像歌姬，擁有治癒人心的星光歌聲。夢想是在全宇宙舉辦巡迴演唱會。",
        stats: { str: 95, spd: 100, int: 60 }, // Cute, Singing, Gaming
        image: "assets/char1.png"
    },
    {
        id: 2,
        name: "櫻 夢 (Sakura Yume)",
        desc: "守護古老神社的狐狸巫女，喜歡在櫻花樹下睡午覺。雖然有點迷糊，但占卜非常靈驗。",
        stats: { str: 100, spd: 70, int: 50 },
        image: "assets/char2.png"
    },
    {
        id: 3,
        name: "糖果 喵 (Candy Nyan)",
        desc: "充滿活力的電競貓娘，最喜歡 FPS 遊戲和能量飲料了。直播時總是充滿了歡笑與尖叫。",
        stats: { str: 90, spd: 40, int: 100 },
        image: "assets/char3.png"
    },
    {
        id: 4,
        name: "夢月 蘿 (Yume Moon)",
        desc: "居住在夢境邊緣的哥德蘿莉吸血鬼，喜歡紅茶與恐怖遊戲。雖然外表高冷，其實很怕寂寞。",
        stats: { str: 85, spd: 80, int: 90 },
        image: "assets/char4.png"
    },
    {
        id: 5,
        name: "森之 音 (Mori no Oto)",
        desc: "來自精靈之森的吟遊詩人，能聽懂植物的語言。她的 ASMR 直播能讓人瞬間進入夢鄉。",
        stats: { str: 80, spd: 95, int: 40 },
        image: "assets/char5.png"
    }
];

let currentIndex = 0;
const track = document.getElementById('track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// View Containers
const homeView = document.getElementById('home-view');
const profileView = document.getElementById('profile-view');

// Profile Elements
const backBtn = document.getElementById('backBtn');
const prevProfileBtn = document.getElementById('prevProfileBtn');
const nextProfileBtn = document.getElementById('nextProfileBtn');
const profileImage = document.getElementById('profileImage');
const charName = document.getElementById('charName');
const charDesc = document.getElementById('charDesc');
const statStr = document.getElementById('statStr');
const statSpd = document.getElementById('statSpd');
const statInt = document.getElementById('statInt');

function init() {
    renderCards();
    updateCarousel();
    setupEvents();
}

function renderCards() {
    track.innerHTML = '';
    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.dataset.index = index;

        // Use img tag for silhouette filter control
        const img = document.createElement('img');
        img.src = char.image;
        img.alt = char.name;
        card.appendChild(img);

        // Click to select and go to profile
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex !== index) {
                // Determine direction for shortest path
                const diff = (index - currentIndex + characters.length) % characters.length;
                if (diff === 1 || diff === 2) {
                    currentIndex = index;
                } else {
                    currentIndex = index;
                }
                updateCarousel();
            } else {
                // Active card clicked -> Go to Profile
                showProfile();
            }
        });

        track.appendChild(card);
    });
}

function updateCarousel() {
    const cards = document.querySelectorAll('.char-card');
    const total = characters.length;

    cards.forEach((card, index) => {
        card.className = 'char-card'; // Reset

        let relIndex = (index - currentIndex + total) % total;
        if (relIndex > total / 2) {
            relIndex -= total;
        }

        if (relIndex === 0) {
            card.classList.add('active');
        } else if (relIndex === 1) {
            card.classList.add('next');
        } else if (relIndex === -1) {
            card.classList.add('prev');
        } else {
            card.classList.add('hidden');
        }
    });
}

function showProfile() {
    homeView.classList.add('hidden');
    profileView.classList.remove('hidden');
    updateProfileContent();
}

function hideProfile() {
    profileView.classList.add('hidden');
    homeView.classList.remove('hidden');
    updateCarousel();
}

function updateProfileContent() {
    const char = characters[currentIndex];

    profileImage.src = char.image;
    charName.textContent = char.name;
    charDesc.textContent = char.desc;

    statStr.style.width = '0%';
    statSpd.style.width = '0%';
    statInt.style.width = '0%';

    requestAnimationFrame(() => {
        statStr.style.width = `${char.stats.str}%`;
        statSpd.style.width = `${char.stats.spd}%`;
        statInt.style.width = `${char.stats.int}%`;
    });
}

function nextChar() {
    currentIndex = (currentIndex + 1) % characters.length;
    updateCarousel();
    if (!profileView.classList.contains('hidden')) {
        updateProfileContent();
    }
}

function prevChar() {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
    updateCarousel();
    if (!profileView.classList.contains('hidden')) {
        updateProfileContent();
    }
}

function setupEvents() {
    // Home Carousel Controls
    prevBtn.addEventListener('click', prevChar);
    nextBtn.addEventListener('click', nextChar);

    // Profile Controls
    backBtn.addEventListener('click', hideProfile);
    prevProfileBtn.addEventListener('click', prevChar);
    nextProfileBtn.addEventListener('click', nextChar);

    // Touch/Drag Events for Carousel
    let startX = 0;
    let isDragging = false;

    const handleStart = (x) => {
        startX = x;
        isDragging = true;
    };

    const handleMove = (x) => {
        if (!isDragging) return;
    };

    const handleEnd = (x) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - x;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextChar();
            } else {
                prevChar();
            }
        }
    };

    track.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX));
    track.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX));
    track.addEventListener('touchend', (e) => handleEnd(e.changedTouches[0].clientX));

    track.addEventListener('mousedown', (e) => handleStart(e.clientX));
    track.addEventListener('mousemove', (e) => handleMove(e.clientX));
    track.addEventListener('mouseup', (e) => handleEnd(e.clientX));
    track.addEventListener('mouseleave', () => { isDragging = false; });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevChar();
        if (e.key === 'ArrowRight') nextChar();
        if (e.key === 'Enter' || e.key === ' ') {
            if (homeView.classList.contains('hidden')) {
                // In profile view, maybe nothing or select?
            } else {
                showProfile();
            }
        }
        if (e.key === 'Escape' && !profileView.classList.contains('hidden')) {
            hideProfile();
        }
    });
}

init();
