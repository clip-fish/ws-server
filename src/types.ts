// src/types.ts
import WebSocket from 'ws';

export interface JoinMessage {
    action: 'join';
    sessionId: string;
    deviceId: string;
}

export interface SignalMessage {
    sessionId: string;
    sender: string;
    receiver: string;
    type: string;  // "offer" | "answer" | "candidate"
    signal: unknown;
}

export type IncomingMessage = JoinMessage | SignalMessage;

// Extend the WS socket so we can hang session/device metadata on it
export interface ExtendedWebSocket extends WebSocket {
    sessionId?: string;
    deviceId?: string;
}
