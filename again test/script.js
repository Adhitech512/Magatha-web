const openPopup = document.getElementById("openPopup");
const popup = document.getElementById("popup");
const cancelBtn = document.getElementById("cancelBtn");
const sendBtn = document.getElementById("sendBtn");

openPopup.onclick = () => popup.style.display = "block";
cancelBtn.onclick = () => popup.style.display = "none";

sendBtn.onclick = () => {
  const discordUsername = document.getElementById("discordUsername").value;
  const minecraftID = document.getElementById("minecraftID").value;
  const clientType = document.getElementById("clientType").value;

  const webhookUrl = "https://discord.com/api/webhooks/1347185873841684480/_E24LSMmVyTJHi-TA8tMXcHyNLtIG6QMQK86c6xdhICmEBh89a19lVALfb_aqyYWdSCi";

  const message = {
    content: `<@&1348598085307338803>\n\nMc id = ${minecraftID}\nDc id = @${discordUsername}\nClient = ${clientType}`
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).then(res => {
    if (res.ok) {
      alert("Sent successfully!");
      popup.style.display = "none";
    } else {
      alert("Failed to send.");
    }
  });
};
