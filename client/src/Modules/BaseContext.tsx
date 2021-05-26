import { createContext, Dispatch } from 'react';

interface reducerIF {
  isConnected: boolean;
  action?: 'viewer' | 'writter';
  websocket?: WebSocket;
}

export const defaultReducerValue: reducerIF = {
  isConnected: false,
};

export const BaseContext = createContext<{
  state: reducerIF;
  dispatch: React.Dispatch<reducerIF>;
}>(null);
