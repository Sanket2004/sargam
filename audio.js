const playerButton = document.querySelector('.player-button'),
    audio = document.querySelector('audio'),
    timeline = document.querySelector('.timeline'),
    soundButton = document.querySelector('.sound-button'),
    playIcon = `
    <span class="material-symbols-outlined">
    play_arrow
    </span>`,
    pauseIcon = `
    <span class="material-symbols-outlined">
    pause</span>      `,
    soundIcon = `
    <span class="material-symbols-outlined">
    volume_up</span>`,
    muteIcon = `
    <span class="material-symbols-outlined">
    volume_off</span>`;

function toggleAudio() {
    if (audio.paused) {
        audio.play();
        playerButton.innerHTML = pauseIcon;
    } else {
        audio.pause();
        playerButton.innerHTML = playIcon;
    }
}

playerButton.addEventListener('click', toggleAudio);

function changeTimelinePosition() {
    const percentagePosition = (100 * audio.currentTime) / audio.duration;
    timeline.style.backgroundSize = `${percentagePosition}% 100%`;
    timeline.value = percentagePosition;
}

audio.ontimeupdate = changeTimelinePosition;

function audioEnded() {
    playerButton.innerHTML = playIcon;
}

audio.onended = audioEnded;

function changeSeek() {
    const time = (timeline.value * audio.duration) / 100;
    audio.currentTime = time;
}

timeline.addEventListener('change', changeSeek);

function toggleSound() {
    audio.muted = !audio.muted;
    soundButton.innerHTML = audio.muted ? muteIcon : soundIcon;
}

soundButton.addEventListener('click', toggleSound);