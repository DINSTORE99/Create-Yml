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