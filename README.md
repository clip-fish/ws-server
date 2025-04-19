# Clip Fish WebSocket Signaling Server

WebSocket signaling server for Clip Fish (see https://github.com/clip-fish/web).  
This lightweight Node/TypeScript service registers each client by **sessionId** + **deviceId** and forwards signaling messages only to the intended recipient (instead of blanket broadcasting).

---

## Environment Variables

| Name   | Default   | Description           |
|--------|-----------|-----------------------|
| `PORT` | `3000`    | WebSocket listen port |
| `HOST` | `0.0.0.0` | Host to bind          |

You can also set these via a `.env` file or your container orchestrator.

---

## Quickstart

### Local development

```bash
git clone https://github.com/clip-fish/ws-server.git
cd ws-server
npm install

# launches ts-node-dev with hot‑reload
npm run dev
```

_Server will start on_ `ws://HOST:PORT` _(`ws://0.0.0.0:3000` by default)._

### Build & run for production

```bash
npm run build      # compile TS → ./dist
npm start          # run dist/index.js
```

---

## Scripts

| Command         | Description                                    |
|-----------------|------------------------------------------------|
| `npm run dev`   | Run TS with hot‑reload (`ts-node-dev`)         |
| `npm run build` | Transpile TypeScript to JavaScript (`tsc`)     |
| `npm start`     | Run the compiled server (`node dist/index.js`) |
| `npm test`      | (no tests yet)                                 |

---

## Messaging Protocol

All messages are JSON. Two shapes are supported:

1. **Join a session**
   ```json
   {
     "action": "join",
     "sessionId": "<your-session-id>",
     "deviceId":  "<your-device-id>"
   }
   ```
   Registers your socket under that session + device.

2. **Signaling payload**
   ```json
   {
     "sessionId": "<session-id>",
     "sender":    "<my-device-id>",
     "receiver":  "<target-device-id>",
     "type":      "offer" | "answer" | "candidate",
     "signal":    { /* WebRTC SDP / ICE info */ }
   }
   ```
   Server will lookup the socket for `receiver` within `sessionId` and forward the JSON only to that client.

---

## Docker (optional)

If you prefer Docker, you can build and run the compiled image:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci --production
COPY dist ./dist
ENV PORT=3000 HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Then:

```bash
npm run build
docker build -t clip-fish-ws-server .
docker run -e PORT=3000 -p 3000:3000 clip-fish-ws-server
```

---

## License

MIT © Clip Fish
