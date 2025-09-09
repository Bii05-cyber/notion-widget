// 🎶 Replace this with your SoundCloud playlist URL
const soundcloudURL = "https://soundcloud.com/YOUR_USERNAME/sets/YOUR_PLAYLIST";

// Setup iframe player
const iframe = document.getElementById("scPlayer");
iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudURL)}&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&visual=false`;

const widget = SC.Widget(iframe);

// DOM elements
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");

// Track play/pause state
let isPlaying = false;

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    widget.pause();
  } else {
    widget.play();
  }
});

prevBtn.addEventListener("click", () => {
  widget.prev();
});

nextBtn.addEventListener("click", () => {
  widget.next();
});

// Update play button icon
widget.bind(SC.Widget.Events.PLAY, () => {
  isPlaying = true;
  playBtn.textContent = "⏸";
});

widget.bind(SC.Widget.Events.PAUSE, () => {
  isPlaying = false;
  playBtn.textContent = "▶";
});

// Update track info
widget.bind(SC.Widget.Events.PLAY, () => {
  widget.getCurrentSound(sound => {
    if (sound) {
      titleEl.textContent = sound.title;
      artistEl.textContent = sound.user.username;
      document.getElementById("cover").src = sound.artwork_url || "https://via.placeholder.com/150";
    }
  });
});
