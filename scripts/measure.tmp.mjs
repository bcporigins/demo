// Evaluate JS in headless Chrome via CDP. Usage:
//   node scripts/measure.tmp.mjs <url> <width> <height> '<js expression>'
import { spawn } from 'node:child_process'

const [url, width = '390', height = '900', expr = '1'] = process.argv.slice(2)
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const port = 9222 + Math.floor(Math.random() * 500)

const chrome = spawn(CHROME, [
  '--headless',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  `--window-size=${width},${height}`,
  '--no-first-run',
  'about:blank',
])

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function targets() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      const list = await res.json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page
    } catch {}
    await wait(250)
  }
  throw new Error('chrome did not start')
}

const page = await targets()
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
})
await new Promise((r) => ws.addEventListener('open', r))

const send = (method, params = {}) =>
  new Promise((resolve) => {
    const msgId = ++id
    pending.set(msgId, resolve)
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: Number(width),
  height: Number(height),
  deviceScaleFactor: 1,
  mobile: Number(width) < 768,
})
await send('Page.navigate', { url })
await wait(3500)

const res = await send('Runtime.evaluate', {
  expression: expr,
  returnByValue: true,
  awaitPromise: true,
})
console.log(
  typeof res.result?.result?.value === 'string'
    ? res.result.result.value
    : JSON.stringify(res.result?.result?.value ?? res.result, null, 1)
)

ws.close()
chrome.kill()
process.exit(0)
