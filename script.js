const client_id = '5fdc593b7fac43d09f36ff59862f2224';
const redirect_uri = 'https://bii05-cyber.github.io/spotify-widget/callback';
const scopes = 'streaming user-read-playback-state user-modify-playback-state playlist-read-private';

const loginBtn = document.getElementById('login');
const playerContainer = document.getElementById('playerContainer');
let player, device_id, token;

loginBtn.onclick = () => {
  const auth_url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = auth_url;
};

token = localStorage.getItem('spotify_access_token');

if(token) {
  loginBtn.style.display = 'none';
  playerContainer.style.display = 'flex';

  const script = document.createElement('script');
  script.src = "https://sdk.scdn.co/spotify-player.js";
  document.body.appendChild(script);

  window.onSpotifyWebPlaybackSDKReady = () => {
    player = new Spotify.Player({
      name: 'Notion Mini Player',
      getOAuthToken: cb => { cb(token); }
    });

    player.addListener('ready', ({ device_id: id }) => {
      console.log('Ready with Device ID', id);
      device_id = id;
    });

    player.addListener('player_state_changed', state => {
      if(!state) return;
      const track = state.track_window.current_track;
      document.getElementById('track').innerText = track.name;
      document.getElementById('artist').innerText = track.artists.map(a => a.name).join(', ');
      document.getElementById('albumArt').src = track.album.images[0]?.url || '';
      document.getElementById('progress').value = (state.position / state.duration) * 100;
      document.getElementById('play').innerText = state.paused ? '▶️' : '⏸️';
    });

    player.connect();
  };
}

// Controls
document.getElementById('play').onclick = async () => {
  const state = await player.getCurrentState();
  if(state?.paused) await player.resume();
  else await player.pause();
};

document.getElementById('next').onclick = () => player.nextTrack();
document.getElementById('prev').onclick = () => player.previousTrack();

document.getElementById('loadPlaylist').onclick = async () => {
  const playlistURL = document.getElementById('playlistURL').value;
  const playlistId = playlistURL.split('/playlist/')[1]?.split('?')[0];
  if(!playlistId) return alert('Invalid playlist URL');

  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
    method: 'PUT',
    body: JSON.stringify({ context_uri: `spotify:playlist:${playlistId}` }),
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
};
