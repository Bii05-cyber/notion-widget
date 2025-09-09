// 🎶 Replace with your SoundCloud playlist URL
const soundcloudURL = "https://soundcloud.com/kianfong-wong/sets/study-playlist?si=5641384bdf754973838ffed0e1505917&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing";

// Setup hidden player
const iframe = document.getElementById("scPlayer");
iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudURL)}&auto_play=false&show_comments=false&show_user=false&visual=false&single_active=true`;

const widget = SC.Widget(iframe);

// Elements
const playBtn = document.getElementById("play");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverEl = document.getElementById("cover");
const tracklistEl = document.getElementById("tracklist");

let isPlaying = false;

// Toggle play/pause
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    widget.pause();
  } else {
    widget.play();
  }
});

// Update UI on play
widget.bind(SC.Widget.Events.PLAY, () => {
  isPlaying = true;
  playBtn.textContent = "⏸";
  widget.getCurrentSound(track => {
    if (track) {
      titleEl.textContent = track.title;
      artistEl.textContent = track.user.username;
      coverEl.src = track.artwork_url || "https://via.placeholder.com/100";
    }
  });
});

// Update UI on pause
widget.bind(SC.Widget.Events.PAUSE, () => {
  isPlaying = false;
  playBtn.textContent = "▶";
});

// Populate playlist
widget.bind(SC.Widget.Events.READY, () => {
  widget.getSounds(sounds => {
    tracklistEl.innerHTML = "";
    sounds.forEach((track, i) => {
      const row = document.createElement("div");
      row.className = "track";
      row.innerHTML = `<div>${i+1}. ${track.title}</div><span>${Math.floor(track.duration/60000)}:${String(Math.floor((track.duration%60000)/1000)).padStart(2,'0')}</span>`;
      row.onclick = () => widget.skip(i);
      tracklistEl.appendChild(row);
    });
  });
});
