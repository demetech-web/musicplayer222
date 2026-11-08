const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const downloadCurrentBtn = document.getElementById('download-current');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');

// Song Data
const songs = [
  {
    name: 'Arike',
    artist: 'Artist A',
    src: 'arike.mp3'
  },
  {
    name: 'Jehovah',
    artist: 'Artist B',
    src: 'Jehovah.mp3'
  },
  {
    name: 'I Believe',
    artist: 'Artist C',
    src: 'I-Believe.mp3'
  },
  {
    name: 'Angelina',
    artist: 'Artist D',
    src: 'Angelina.mp3'
  },
  {
    name: 'Holdinghands',
    artist: 'Artist D',
    src: 'Holdinghands.mp3'
  },
  {
    name: 'I Will be what i believe',
    artist: 'Artist E',
    src: 'bewhat.mp3'
  }
];

let songIndex = 0;

// Reusable download helper function
function triggerDownload(src, filename) {
  const link = document.createElement('a');
  link.href = src;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Build the HTML tracklist dynamically
function buildPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    
    // Create text wrapper for selection target area mapping
    const trackInfo = document.createElement('div');
    trackInfo.style.flexGrow = "1";
    trackInfo.innerHTML = `<span>${song.name}</span> <br> <small style="color:#888">${song.artist}</small>`;
    
    trackInfo.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });

    // Explicit specific row instance down button element
    const dlBtn = document.createElement('button');
    dlBtn.className = 'row-download-btn';
    dlBtn.innerHTML = '📥';
    dlBtn.title = `Download ${song.name}`;
    dlBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents song from playing when clicking download
      triggerDownload(song.src, `${song.name}.mp3`);
    });

    li.appendChild(trackInfo);
    li.appendChild(dlBtn);
    
    if (index === songIndex) {
      li.classList.add('active');
    }

    playlistEl.appendChild(li);
  });
}

function updateActivePlaylistItem() {
  const items = playlistEl.querySelectorAll('li');
  items.forEach((item, index) => {
    if (index === songIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function loadSong(song) {
  title.innerText = song.name;
  artist.innerText = song.artist;
  audio.src = song.src;
  updateActivePlaylistItem();
}

function playSong() {
  audio.play();
  playBtn.innerText = '⏸ Pause';
}

function pauseSong() {
  audio.pause();
  playBtn.innerText = '▶ Play';
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

playBtn.addEventListener('click', () => {
  const isPlaying = !audio.paused;
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

nextBtn.addEventListener('click', () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

// Download button execution for currently playing track link pointer source
downloadCurrentBtn.addEventListener('click', () => {
  const currentSong = songs[songIndex];
  triggerDownload(currentSong.src, `${currentSong.name}.mp3`);
});

// Update progress bar and time displays
audio.addEventListener('timeupdate', () => {
  const { duration, currentTime } = audio;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
  }
  
  currentTimeEl.innerText = formatTime(currentTime);
  durationEl.innerText = formatTime(duration);
});

// Auto-play next song when current one ends
audio.addEventListener('ended', () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

// Set progress on click
progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Adjust volume level
volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// Initialize player & playlist
buildPlaylist();
loadSong(songs[songIndex]);
