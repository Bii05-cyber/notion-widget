// 🎶 Replace with your SoundCloud playlist URL
const soundcloudURL = "https://soundcloud.com/kianfong-wong/sets/study-playlist";

// Setup hidden player
const iframe = document.getElementById("scPlayer");
iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  soundcloudURL
)}&auto_play=false&show_comments=false&show_user=false&visual=false&single_active=true`;

const widget = SC.Widget(iframe);

// Elements
const playBtn = document.getElementById("play");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const tracklistEl = document.getElementById("tracklist");
const coverEl = document.getElementById("cover");

// --- CUSTOM SETTINGS ---
coverEl.src = "cover.jpg"; // Your custom cover
titleEl.textContent = "Lofi Study Playlist";           // Your custom playlist title
artistEl.textContent = "by Starlight_Dreamer";                        // Your custom artist/author

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

  // Highlight current track
  widget.getCurrentSoundIndex(index => {
    document.querySelectorAll(".track").forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });
  });
});

// Update UI on pause
widget.bind(SC.Widget.Events.PAUSE, () => {
  isPlaying = false;
  playBtn.textContent = "▶";
});

// Populate tracklist when ready
widget.bind(SC.Widget.Events.READY, () => {
  // Give SoundCloud a moment to load the full playlist
  setTimeout(() => {
    widget.getSounds(sounds => {
      tracklistEl.innerHTML = "";

      const validTracks = sounds.filter(track => track && track.title);

      validTracks.forEach((track, i) => {
        const row = document.createElement("div");
        row.className = "track";

        const minutes = Math.floor(track.duration / 60000);
        const seconds = Math.floor((track.duration % 60000) / 1000);
        const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;

        row.innerHTML = `
          <div>${i + 1}. ${track.title}<br><span style="color:#aaa;font-size:12px;">${track.user.username}</span></div>
          <span>${formattedTime}</span>
        `;

        row.onclick = () => widget.skip(i);
        tracklistEl.appendChild(row);
      });
    });
  }, 8000); // Wait 2 seconds to ensure tracks load
});
