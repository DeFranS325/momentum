const audioPlayer = new Audio();
const playListContainer = document.querySelector('.play-list');
const currentTrack = document.querySelector('.title-track');
const player = document.querySelector(".player");
const currentProgressBar = document.querySelector('#progress-bar');
let playButton = document.querySelector('.play');
let prevButton = document.querySelector('.play-prev');
let nextButton = document.querySelector('.play-next');
let isPlay = false;
let playNum = -1;
let trackCount = 0;
let currentPositionPlay = 0;

import playList from './playList.js';

function createPlayList() {
    playList.forEach(el => {
        const playListElement = document.createElement('li');
        const imgElement = document.createElement('img');
        const titleElement = document.createElement('p');
        const timeElement = document.createElement('p');
        imgElement.classList.add('item-icon', 'icono-play');
        imgElement.id = trackCount;
        titleElement.textContent = el.title;
        titleElement.classList.add('title-song');
        timeElement.textContent = el.duration
        playListElement.classList.add('play-item');
        playListElement.append(imgElement);
        playListElement.append(titleElement);
        playListElement.append(timeElement);
        playListContainer.append(playListElement);
        trackCount++;
    });
}
createPlayList();

const itemIcon = document.querySelectorAll('.item-icon');
itemIcon.forEach(el => {
    el.addEventListener('click', function () {
        if (parseInt(this.id) != playNum) { //new song
            playNum = parseInt(this.id);
            isPlay = false;
            currentPositionPlay = 0;
            playButton.classList.add('pause');
            playAudio();
        }
        else { //pause -> play
            if (isPlay) {
                const allTracks = document.querySelectorAll('.play-item');
                const currIcon = allTracks[playNum].querySelector('.icono-pause');
                currIcon.classList.add('icono-play');
                currIcon.classList.remove('icono-pause');
                playButton.classList.remove('pause');
                audioPlayer.pause();
                isPlay = false;
            }
            else {
                currentPositionPlay = audioPlayer.currentTime;
                playButton.classList.add('pause');
                playAudio();
                isPlay = true;
            }
        }
        
    });
});

function setCurrentAudio(){
    const allTracks = document.querySelectorAll('.play-item');
    allTracks.forEach(el => {
        const currIcon = el.querySelector('.item-icon');
        currIcon.classList.remove('icono-pause');
        currIcon.classList.add('icono-play');
        el.classList.remove('item-active');
    });
    allTracks[playNum].classList.add('item-active');
    const currIcon = allTracks[playNum].querySelector('.icono-play');
    currIcon.classList.remove('icono-play');
    currIcon.classList.add('icono-pause');
}

function playAudio() {
    if (!isPlay) {
        audioPlayer.src = playList[playNum].src;
        audioPlayer.currentTime = currentPositionPlay;
        currentTrack.textContent = `${playNum + 1}. ${playList[playNum].title}`;
        audioPlayer.play();
        setCurrentAudio();
        isPlay = true;
    }
    else {
        currentPositionPlay = audioPlayer.currentTime;
        const allTracks = document.querySelectorAll('.play-item');
        const currIcon = allTracks[playNum].querySelector('.icono-pause');
        currIcon.classList.add('icono-play');
        currIcon.classList.remove('icono-pause');
        audioPlayer.pause();        
        isPlay = false;
    }
}

audioPlayer.addEventListener('ended', nextTrack);

function setSongPosition() {
    audioPlayer.currentTime = currentProgressBar.value;
}

currentProgressBar.addEventListener('change', setSongPosition);

audioPlayer.addEventListener(
  "loadeddata",
  () => {
      player.querySelector(".time-song .length").textContent = getTimeCodeFromNum(audioPlayer.duration);
      audioPlayer.volume = volumeSlider.value;
  },
  false
);

//click volume slider to change volume
const volumeSlider = player.querySelector("#volume-slider");
volumeSlider.value = .75;
volumeSlider.addEventListener('change', () => {
    audioPlayer.volume = volumeSlider.value;
});

//check audio percentage and update time accordingly
setInterval(() => {
    currentProgressBar.max = audioPlayer.duration;
    currentProgressBar.value = audioPlayer.currentTime;
    player.querySelector(".time-song .current").textContent = getTimeCodeFromNum(audioPlayer.currentTime);
}, 500);

player.querySelector(".volume-button").addEventListener("click", () => {
    const volumeEl = player.querySelector(".volume-container .volume");
    audioPlayer.muted = !audioPlayer.muted;
    volumeSlider.disabled = !volumeSlider.disabled;
    if (audioPlayer.muted) {
        volumeEl.classList.remove("icono-volumeMedium");
        volumeEl.classList.add("icono-volumeMute");
    } else {
        volumeEl.classList.add("icono-volumeMedium");
        volumeEl.classList.remove("icono-volumeMute");
    }
});

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}


function toggleBtn() {
    if (playNum < 0)
        playNum = 0;
    playButton.classList.toggle('pause');
    playAudio();
}

function playNext() {
    playNum++;
    if (playNum > trackCount - 1)
        playNum = 0;
}

function playPrev() {
    playNum--;
    if (playNum < 0)
        playNum = trackCount - 1;
}

function nextTrack() {
    if (!isPlay) {
        playButton.classList.add('pause');
    }
    isPlay = false;
    currentPositionPlay = 0;
    playNext();
    playAudio();
}

function prevTrack() {
    if (!isPlay) {
        playButton.classList.add('pause');
    }
    isPlay = false;
    currentPositionPlay = 0;
    playPrev();
    playAudio();
}

playButton.addEventListener('click', toggleBtn);
prevButton.addEventListener('click', prevTrack);
nextButton.addEventListener('click', nextTrack);