let volume = parseInt(localStorage.getItem('volume'));
let music = document.createElement('audio');
let m_timestamp = 0;
export function setMusic() {
    if (!isNaN(volume) && volume > 0 && volume < 100) {
        music.volume = parseInt(volume) * 0.01;
    } else {
        music.volume = 0.1;      // 10%
    }
    if (music.canPlayType('audio/mpeg')) {
        music.setAttribute('src', '../assets/Hot Butter - Popcorn.mp3');
    } else {
        console.log('rip');
    }
    music.setAttribute('autoplay', 'autoplay');
    music.loop = true;
    document.body.appendChild(music);
    // console.log('done music', { music });
    music.play();
}

export function isMusicMuted(){
    return music.paused;
}

export function muteMusic(timestamp) {
    if (timestamp - m_timestamp >= 200) {
        m_timestamp = timestamp;
        if (music.paused) {
            music.play();
            console.log('music playing at', music.currentTime);
        } else {
            music.pause();
            console.log('music paused at', music.currentTime);
        }
    }
}

export function lowerMusic() {
    localStorage.volume = parseInt(localStorage.volume) - 10;
    music.volume = parseInt(localStorage.volume) * 0.01;
    if (parseInt(localStorage.volume) <= 0) {
        localStorage.volume = '0';
        music.volume = 0;
    }

}

export function higherMusic() {
    localStorage.volume = parseInt(localStorage.volume) + 10;
    music.volume = parseInt(localStorage.volume) * 0.01;
    if (parseInt(localStorage.volume) >= 40) {
        localStorage.volume = '40';
        music.volume = 0.4;
    }
    console.log();
}

export function getMusicTime() {
    return music.currentTime;
}
export function setMusicTime(time) {
    if (!time) {
        time = 0;
    }
    music.currentTime = parseFloat(time);
}