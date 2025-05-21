const baseURL = "http://magatha.run.place:25698/api";

// Server Status Fetch
async function fetchServerData() {
  try {
    const [versionRes, onlineRes, playersRes] = await Promise.all([
      fetch(`${baseURL}/version/`),
      fetch(`${baseURL}/online/`),
      fetch(`${baseURL}/players/online/`)
    ]);

    const version = await versionRes.json();
    const online = await onlineRes.json();

    const rawPlayersText = await playersRes.text();
    let trimmed = rawPlayersText.trim().replace(/,\s*$/, '');
    const fixedText = `[${trimmed}]`;

    let players = [];
    try {
      players = JSON.parse(fixedText);
    } catch (e) {
      console.error("JSON Parse Error:", e);
    }

    document.getElementById("server-version").innerText = version?.value || "Unknown";
    document.getElementById("online-players").innerText = online?.value || "0";

    const listDiv = document.getElementById("player-list");
    listDiv.innerHTML = "";

    if (players.length > 0) {
      players.forEach(p => {
        const el = document.createElement("div");
        el.className = "player-entry";
        el.innerText = p.name;
        listDiv.appendChild(el);
      });
    } else {
      listDiv.innerText = "No players online.";
    }

  } catch (err) {
    console.error("Fetch Error:", err);
    document.getElementById("player-list").innerText = "Error fetching data.";
  }
}

fetchServerData();
setInterval(fetchServerData, 15000);

// Whitelist UI
const openPopup = document.getElementById("openPopup");
const popup = document.getElementById("popup");
const cancelBtn = document.getElementById("cancelBtn");
const sendBtn = document.getElementById("sendBtn");
const popupMessage = document.getElementById("popup-message");

openPopup.onclick = async () => {
  try {
    const res = await fetch("whitelist_status.json");
    const data = await res.json();

    if (data.whitelist_enabled) {
      popup.style.display = "block";
    } else {
      showPopupMessage("Whitelist is currently closed.");
    }
  } catch (err) {
    showPopupMessage("Error checking whitelist status.");
  }
};

cancelBtn.onclick = () => popup.style.display = "none";

sendBtn.onclick = async () => {
  const discordUsername = document.getElementById("discordUsername").value.trim();
  const minecraftID = document.getElementById("minecraftID").value.trim();
  const clientType = document.getElementById("clientType").value;

  if (!discordUsername || !minecraftID) {
    showPopupMessage("Please fill in all fields.");
    return;
  }

  const webhookUrl = "https://discord.com/api/webhooks/1347185873841684480/_E24LSMmVyTJHi-TA8tMXcHyNLtIG6QMQK86c6xdhICmEBh89a19lVALfb_aqyYWdSCi";
  const swlWebhook = "https://discord.com/api/webhooks/1371023674487869561/znJ8_btS4OMKx_GQi1uRt17wwrJGcdJuJwQK37QnWeNM2MSf38PnG-8R3tTSlzSs6TO2"; // replace with your actual swl webhook

  const mainMessage = {
    content: `<@&1348598085307338803>\n\nMc id = ${minecraftID}\nDc id = @${discordUsername}\nClient = ${clientType}`
  };

  const swlCommand = clientType === "JAVA" 
    ? `swl add ${minecraftID}` 
    : `swl add .${minecraftID}`;
    
  const swlMessage = {
    content: swlCommand
  };

  try {
    // Send both webhooks
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mainMessage)
    });

    await fetch(swlWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(swlMessage)
    });

    await updateWhitelistLog();

    showPopupMessage("Whitelist request sent! after whitelist you will get notification in discord dm");
    popup.style.display = "none";

  } catch (err) {
    console.error("Webhook Error:", err);
    showPopupMessage("Failed to send webhook.");
  }
};

function showPopupMessage(text) {
  popupMessage.innerText = text;
  popupMessage.style.display = "block";
  setTimeout(() => popupMessage.style.display = "none", 3000);
}

// Track whitelist count in JSON
async function updateWhitelistLog() {
  try {
    const res = await fetch("whitelist_log.json");
    let logData = await res.json();

    logData.count = (logData.count || 0) + 1;

    await fetch("whitelist_log.json", {
      method: "PUT", // Note: this requires backend support
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logData)
    });
  } catch (err) {
    console.warn("Whitelist count tracking failed. Server must allow JSON write.");
  }
}
