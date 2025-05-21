const baseURL = "http://magathaweb.horion.fun:25698/"; // Update to your actual API host if different

async function fetchServerData() {
  try {
    const [statusRes, versionRes, playersRes, onlineRes, playerListRes] = await Promise.all([
      fetch(`${baseURL}api/status/`),
      fetch(`${baseURL}api/version/`),
      fetch(`${baseURL}/get-player-number`),
      fetch(`${baseURL}/get-online-number`),
      fetch(`${baseURL}/get-player-information`)
    ]);

    const status = await statusRes.json();
    const version = await versionRes.json();
    const players = await playersRes.json();
    const online = await onlineRes.json();
    const playerList = await playerListRes.json();

    document.getElementById("server-status").innerText = status.status;
    document.getElementById("server-version").innerText = "Version: " + version.version;
    document.getElementById("total-players").innerText = players.total_players;
    document.getElementById("online-players").innerText = online.online_players;

    const listDiv = document.getElementById("player-list");
    listDiv.innerHTML = "";
    playerList.players.forEach(p => {
      const div = document.createElement("div");
      div.innerText = `Name: ${p.name}, UUID: ${p.uuid}`;
      listDiv.appendChild(div);
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchPlayer() {
  const input = document.getElementById("player-input").value;
  if (!input) return;

  const url = `${baseURL}/get-specific-player?player=${encodeURIComponent(input)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("player-details").innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("player-details").innerText = "Error fetching player info.";
  }
}

fetchServerData();
setInterval(fetchServerData, 15000); // Refresh every 15 seconds
