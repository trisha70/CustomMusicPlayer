const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = wrapper.querySelector("#close");

let musicIndex = 2;
window.addEventListener("load", () => {
  loadMusic(musicIndex); //calling load music function once window loaded
});
// function to load music
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}
//play music function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}
//pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}
//play next music
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
}
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

//play or pause music button
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});
nextBtn.addEventListener("click", () => {
  nextMusic();
});
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//update progress bar according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting current time of the song
  const duration = e.target.duration; //getting total duration of the song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current");
  musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //update total song duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      // adding 0 if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song currentTime
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    // adding 0 if sec is less than 10
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});
//update playing song current line according to the width of progressbar
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //getting width of progress bar
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration
  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});
//repeat btn
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "song Looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "playback Shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic(); // if icon is repeat then  next song will play
      break;
    case "repeat_one": // if icon is repeat_one then set the current playing song current time to 0 so song will play from beginning
      mainAudio.currentTime = 0;
      playMusic();
      break;
    case "shuffle":
      //generating random index between min range to max range;
       let previousIndex = musicIndex;
      if (allMusic.length === 1) return;

      do {
        musicIndex = Math.floor(Math.random() * allMusic.length) + 1; // 1-based index
      } while (musicIndex === previousIndex);

      loadMusic(musicIndex);
      playMusic();
      break;
    } 
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});
const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li>
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio  class="${allMusic[i].src}"  src="songs/${allMusic[i].src}.mp3"></audio>
                <span  id="${allMusic[i].src}" class="audio-duration"></span>
            </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);
  let liAudioDurtion = ulTag.querySelector(`#${allMusic[i].src}`);
let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

liAudioTag.addEventListener("loadeddata", () => {
  let audioDuration = liAudioTag.duration;
  let totalMin = Math.floor(audioDuration / 60);
  let totalSec = Math.floor(audioDuration % 60);
  if (totalSec < 10) {
    totalSec = `0${totalSec}`;
  }
  liAudioDurtion.innerText = `${totalMin}:${totalSec}`;
});

}
