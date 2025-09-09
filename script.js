// 🎶 Replace with your clean SoundCloud playlist URL
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

      // fallback: use track artwork OR user avatar OR playlist artwork
     coverEl.src = "cover.jpg";
    }
  });

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

widget.bind(SC.Widget.Events.READY, () => {
  // wait a bit to let SoundCloud load the full playlist
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
  }, 2000); // 👈 half a second delay before fetching
});
