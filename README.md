# Clip Fish WebSocket Signaling Server

WebSocket signaling server for Clip Fish (see <https://github.com/clip-fish/web>). This lightweight server broadcasts incoming messages to all other clients in the session.

## Quickstart

### Local dev

```bash
git clone https://github.com/clip-fish/ws-server.git
cd ws-server
npm install
npm run dev         # launches nodemon on src/index.js