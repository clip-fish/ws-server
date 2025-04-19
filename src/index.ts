import WebSocket, {RawData, WebSocketServer} from 'ws';
import {ExtendedWebSocket, IncomingMessage, SignalMessage} from "./types";

// Map<sessionId, Map<deviceId, socket>>
const sessions = new Map<string, Map<string, ExtendedWebSocket>>();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const wss = new WebSocketServer({ port: PORT, host: HOST });

wss.on('connection', (wsRaw) => {
    const ws = wsRaw as ExtendedWebSocket;
    console.log('New client connected');

    ws.on('message', (data: RawData) => {
        const text = data.toString();
        console.log('received:', text);

        let msg: IncomingMessage;
        try {
            msg = JSON.parse(text) as IncomingMessage;
        } catch (err) {
            console.error('Invalid JSON:', err);
            return;
        }

        if ('action' in msg && msg.action === 'join') {
            const { sessionId, deviceId } = msg;
            ws.sessionId = sessionId;
            ws.deviceId = deviceId;

            if (!sessions.has(sessionId)) {
                sessions.set(sessionId, new Map());
            }
            sessions.get(sessionId)!.set(deviceId, ws);
            return;
        }

        const { sessionId, receiver } = msg as SignalMessage;
        const sessionMap = sessions.get(sessionId);
        if (!sessionMap) {
            console.warn(`No such session: ${sessionId}`);
            return;
        }

        const target = sessionMap.get(receiver);
        if (target && target.readyState === WebSocket.OPEN) {
            target.send(text);
        } else {
            console.warn(`Target device ${receiver} not connected`);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const { sessionId, deviceId } = ws;
        if (sessionId && deviceId) {
            const sessionMap = sessions.get(sessionId);
            sessionMap?.delete(deviceId);
            if (sessionMap && sessionMap.size === 0) {
                sessions.delete(sessionId);
            }
        }
    });
});

console.log(`WebSocket server is running on ws://${HOST}:${PORT}`);
