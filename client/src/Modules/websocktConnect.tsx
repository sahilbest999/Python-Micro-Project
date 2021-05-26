export const connectWebSocket = (path: string = '/') => {
  const ws = new WebSocket('ws://localhost:8080' + path);
  return ws;
};
