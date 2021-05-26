const WebSocket = require('webSocket');

const ws = new WebSocket('ws://localhost:6666');
ws.onopen((e) => {
  console.log('onopen', e);
});

ws.onmessage((e) => {
  console.log('Message Received from Client', e);
});

ws.onerror((e) => {
  console.log('onerror', e);
});

ws.onclose((e) => {
  console.log('onclose', e);
});
