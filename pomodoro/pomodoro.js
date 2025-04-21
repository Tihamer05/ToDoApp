let pomodoro = document.getElementById("pomodoro-timer");
let short = document.getElementById("short-timer");
let long = document.getElementById("long-timer");
let timers = document.querySelectorAll(".timer-display");
let session = document.getElementById("pomodoro-session");
let shortBreak = document.getElementById("short-break");
let longBreak = document.getElementById("long-break");
let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");
let timerMsg = document.getElementById("timer-message");
let fullscreenBtn = document.getElementById("fullscreen-btn");

button = document.querySelector(".button");


let currentTimer = null;
let myInterval = null;

let darkMode = localStorage.getItem('dark-mode');
const themeSwitch = document.getElementById('theme-switch');

const enableDarkmode = () =>{
    document.body.classList.add('dark-mode');
    localStorage.setItem('dark-mode', 'active');
}

const disableDarkmode = () =>{
    document.body.classList.remove('dark-mode');
    localStorage.setItem('dark-mode', null);
}

if(darkMode === 'active') enableDarkmode();

themeSwitch.addEventListener('click', () =>{
    darkMode = localStorage.getItem('dark-mode');
    darkMode !== 'active' ? enableDarkmode() : disableDarkmode();
});

const musicPlayerBtn = document.getElementById('music-appear');
const songPlayer = document.querySelector('.wrapper');
const overlay = document.querySelector('.overlay');

songPlayer.style.display = 'none';

musicPlayerBtn.addEventListener('click', () =>{
    if(songPlayer.style.display === 'none'){
        songPlayer.style.display = 'block';
        overlay.classList.add('active');
    }else{
        songPlayer.style.display = 'none';
        overlay.classList.remove('active');
    }

})

function showDefaultTimer() {
    pomodoro.style.display = 'block';
    short.style.display = 'none';
    long.style.display = 'none';
}

showDefaultTimer();

function hideAll(){
    timers.forEach((timer) => {
        timer.style.display = 'none';
    })
}

session.addEventListener('click', () => {
    hideAll()

    pomodoro.style.display = 'block';

    session.classList.add('active');
    shortBreak.classList.remove('active');
    longBreak.classList.remove('active');

    currentTimer = pomodoro;
})

shortBreak.addEventListener('click', () => {
    hideAll()

    short.style.display = 'block';

    session.classList.remove('active');
    shortBreak.classList.add('active');
    longBreak.classList.remove('active');

    currentTimer = short;
})

longBreak.addEventListener('click', () => {
    hideAll()

    long.style.display = 'block';

    session.classList.remove('active');
    shortBreak.classList.remove('active');
    longBreak.classList.add('active');

    currentTimer = long;
})

function startTimer(timerDisplay){
    if(myInterval){
        clearInterval(myInterval);
    }

    timerDuration = timerDisplay.getAttribute('data-duration').split(":")[0];

    let durationInMillisenonds = timerDuration * 60 * 1000;
    let endTimestamp = Date.now() + durationInMillisenonds;

    myInterval = setInterval(() =>{
        const timeRemaining = new Date(endTimestamp - Date.now());

        if(timeRemaining <= 0){
            clearInterval(myInterval);
            timerDisplay.textContent = '00:00';

            const alarm = new Audio('succes.mp3');
            alarm.play();
        }else{
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
            const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            timerDisplay.textContent = formattedTime;
        }
    }, 1000)
}


fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});


startBtn.addEventListener('click', () =>{
    if(currentTimer){
        startTimer(currentTimer);
        timerMsg.style.display = 'none';
    }else{
        timerMsg.style.display = 'block';
    }
})

stopBtn.addEventListener('click', () => {
    if(currentTimer){
        clearInterval(myInterval);
    }

})

const particlesContainer = document.getElementById('particles-container');
        const particleCount = 80;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            resetParticle(particle);
            
            particlesContainer.appendChild(particle);
            
            animateParticle(particle);
        }
        
        function resetParticle(particle) {
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = '0';
            
            return {
                x: posX,
                y: posY
            };
        }
        
        function animateParticle(particle) {
            const pos = resetParticle(particle);
            
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            setTimeout(() => {
                particle.style.transition = `all ${duration}s linear`;
                particle.style.opacity = Math.random() * 0.3 + 0.1;
                
                const moveX = pos.x + (Math.random() * 20 - 10);
                const moveY = pos.y - Math.random() * 30;
                
                particle.style.left = `${moveX}%`;
                particle.style.top = `${moveY}%`;
                
                setTimeout(() => {
                    animateParticle(particle);
                }, duration * 1000);
            }, delay * 1000);
        }
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 100;
            const mouseY = (e.clientY / window.innerHeight) * 100;
            
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${mouseX}%`;
            particle.style.top = `${mouseY}%`;
            particle.style.opacity = '0.6';
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transition = 'all 2s ease-out';
                particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
                particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
                particle.style.opacity = '0';
                
                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }, 10);
            
            const spheres = document.querySelectorAll('.gradient-sphere');
            const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
            
            spheres.forEach(sphere => {
                const currentTransform = getComputedStyle(sphere).transform;
                sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
});