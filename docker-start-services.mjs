import { spawn } from "node:child_process"

const serviceNames = [
  "artist-service",
  "auth-service",
  "banner-service",
  "gateway-service",
  "genre-service",
  "home-service",
  "notification-service",
  "playlist-service",
  "social-service",
  "song-service",
  "user-service",
  "video-service",
]

const services = serviceNames.map((name) => {
  const child = spawn(process.execPath, ["dist/index.js"], {
    cwd: new URL("./services/" + name + "/", import.meta.url),
    env: process.env,
    stdio: "inherit",
  })

  const exited = new Promise((resolve) => {
    child.once("exit", (code, signal) => resolve({ code, signal }))
  })

  return { name, child, exited }
})

let shuttingDown = false

async function shutdown(signal, exitCode) {
  if (shuttingDown) return
  shuttingDown = true

  for (const { child } of services) {
    if (child.exitCode === null && child.signalCode === null) child.kill(signal)
  }

  const forceExit = setTimeout(() => {
    for (const { child } of services) {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL")
    }
  }, 10_000)
  forceExit.unref()

  await Promise.all(services.map(({ exited }) => exited))
  clearTimeout(forceExit)
  process.exit(exitCode)
}

for (const service of services) {
  service.exited.then(({ code, signal }) => {
    if (shuttingDown) return

    const reason = signal || "exit " + (code ?? 1)
    console.error(service.name + " stopped unexpectedly (" + reason + ")")
    void shutdown("SIGTERM", code && code > 0 ? code : 1)
  })
}

process.once("SIGINT", () => void shutdown("SIGINT", 0))
process.once("SIGTERM", () => void shutdown("SIGTERM", 0))
