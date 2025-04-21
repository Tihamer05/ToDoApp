const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".img-area img");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const mainAudio = wrapper.querySelector("#main-audio");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = progressArea.querySelector(".progress-bar");
const currentTimeEl = wrapper.querySelector(".current-time");
const maxDurationEl = wrapper.querySelector(".max-duration");


let musicIndex = Math.floor(Math.random() * allMusic.length) + 1;
let isMusicPaused = true;

function loadMusic(indexNumb) {
    musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
    
    mainAudio.addEventListener('loadedmetadata', () => {
        const duration = mainAudio.duration;
        const totalMinutes = Math.floor(duration / 60);
        let totalSeconds = Math.floor(duration % 60);
        if(totalSeconds < 10) totalSeconds = `0${totalSeconds}`;
        maxDurationEl.textContent = `${totalMinutes}:${totalSeconds}`;
    });
}

function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").textContent = "pause";
    mainAudio.play();
}


function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").textContent = "play_arrow";
    mainAudio.pause();
}


function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

function updateProgress(e) {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if(currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}


function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = mainAudio.duration;
    
    mainAudio.currentTime = (clickX / width) * duration;
    playMusic();
}


playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic();
});

prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

mainAudio.addEventListener("timeupdate", updateProgress);
mainAudio.addEventListener("ended", nextMusic);
progressArea.addEventListener("click", setProgress);


window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

