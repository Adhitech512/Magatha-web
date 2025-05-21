const baseURL = "magathaweb.horion.fun:25698/api";

async function fetchServerData() {
  try {
    const [statusRes, versionRes, onlineRes, playersRes] = await Promise.all([
      fetch(`${baseURL}/status/`),
      fetch(`${baseURL}/version/`),
      fetch(`${baseURL}/online/`),
      fetch(`${baseURL}/players/online/`)
    ]);

    const status = await statusRes.json();
    const version = await versionRes.json();
    const online = await onlineRes.json();
    const players = await playersRes.json();

    document.getElementById("server-status").innerText = status.value || "Unknown";
    document.getElementById("server-version").innerText = version.value || "Unknown";
    document.getElementById("online-players").innerText = online.value || "0";

    const listDiv = document.getElementById("player-list");
    listDiv.innerHTML = "";

    if (players.value && Array.isArray(players.value) && players.value.length > 0) {
      players.value.forEach(p => {
        const el = document.createElement("div");
        el.className = "player-entry";
        el.innerText = `${p.name} (${p.uuid})`;
        listDiv.appendChild(el);
      });
    } else {
      listDiv.innerText = "No players online.";
    }

  } catch (err) {
    console.error("API error:", err);
    document.getElementById("server-status").innerText = "Error fetching data.";
  }
}

fetchServerData();
setInterval(fetchServerData, 15000);