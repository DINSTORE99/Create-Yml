const TELEGRAM_BOT = "8206994792:AAGo26LadC8a86sF9VRiL_Q_S39FCbRMlZQ";
const TELEGRAM_CHAT = "6452266025";

/* =========================
   TELEGRAM OPEN NOTIF
========================= */
function sendOpenNotif() {
  const info = getBrowserInfo();
  
  const message = `
🌐 WEBSITE CREATE YML DI BUKA
📱 Device: ${info.device}
🌍 Browser: ${info.browser}
⏰ Waktu: ${new Date().toLocaleString()}
🔗 URL: ${window.location.href}
  `;
  
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT,
        text: message
      })
    })
    .then(res => res.json())
    .then(data => console.log("Telegram OK:", data))
    .catch(err => console.log("Telegram ERROR:", err));
}

/* =========================
   DEVICE INFO
========================= */
function getBrowserInfo() {
  const ua = navigator.userAgent;
  
  let browser = "Unknown";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";
  
  let device = "Unknown";
  if (ua.includes("Android")) device = "Android";
  else if (ua.includes("iPhone")) device = "iPhone";
  else if (ua.includes("Windows")) device = "Windows";
  else if (ua.includes("Linux")) device = "Linux";
  
  return { browser, device };
}

/* =========================
   AUTO SEND SAAT WEB OPEN
========================= */
window.addEventListener("load", () => {
  sendOpenNotif();
});

const $ = (id) => document.getElementById(id)


function b64decode(b64) {
  let s = b64.replace(/-/g, "+").replace(/_/g, "/")
  while (s.length % 4) s += "="
  return decodeURIComponent(escape(atob(s)))
}


function convert() {
  const input = $("input").value.trim()
  if (!input) return alert("❌ Masukkan link")
  
  if (
    !input.startsWith("vmess://") &&
    !input.startsWith("trojan://") &&
    !input.startsWith("vless://")
  ) {
    return alert("❌ Format tidak didukung\nGunakan vmess:// trojan:// vless://")
  }
  
  let yml = ""
  
  try {
    if (input.startsWith("vmess://")) {
      const j = JSON.parse(b64decode(input.replace("vmess://", "")))
      yml = vmessTemplate(j)
    }
    
    else if (input.startsWith("trojan://")) {
      const u = new URL(input)
      yml = trojanTemplate(u)
    }
    
    else if (input.startsWith("vless://")) {
      const u = new URL(input)
      yml = vlessTemplate(u)
    }
    
  } catch (e) {
    return alert("❌ Link rusak / tidak valid")
  }
  
  $("output").value = yml.trim()
}


function vmessTemplate(j) {
  const port = j.port || 443
  return `
proxies:
  -
    type: vmess
    name: ${j.ps || "vmess"}
    server: ISI_BUG_DI_SINI
    port: ${port}
    uuid: ${j.id}
    alterId: ${j.aid || 0}
    cipher: auto
    tls: true
    servername: ${j.add}
    udp: true
    network: ws
    ws-opts:
      path: ${j.path || "/"}
      headers:
        Host: ${j.add}
`
}

function trojanTemplate(u) {
  const port = u.port || 443
  return `
proxies:
  -
    type: trojan
    name: ${u.hash.replace("#","") || "trojan"}
    server: ISI_BUG_DI_SINI
    port: ${port}
    password: ${u.username}
    sni: ${u.hostname}
    udp: true
    skip-cert-verify: true
`
}

function vlessTemplate(u) {
  const port = u.port || 443
  const sni = u.searchParams.get("sni") || u.hostname
  const path = u.searchParams.get("path") || "/"
  
  return `
proxies:
  -
    type: vless
    name: ${u.hash.replace("#","") || "vless"}
    server: ISI_BUG_DI_SINI
    port: ${port}
    uuid: ${u.username}
    tls: true
    servername: ${sni}
    udp: true
    network: ws
    ws-opts:
      path: ${path}
      headers:
        Host: ${sni}
`
}

$("convert").onclick = convert
$("copy").onclick = () => {
  navigator.clipboard.writeText($("output").value)
  alert("Copied!")
}
$("clear").onclick = () => {
  $("input").value = ""
  $("output").value = ""
}
