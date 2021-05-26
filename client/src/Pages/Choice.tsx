import { ipcRenderer } from 'electron';
import React, { useContext, useEffect, useRef } from 'react';
import { BaseContext } from '../Modules/BaseContext';
import { connectWebSocket } from '../Modules/websocktConnect';

const Choice = () => {
  const form = useRef<HTMLFormElement>(null);
  const { state, dispatch } = useContext(BaseContext);

  const handleLogin = () => {
    const _form = form.current!!;
    if (!_form.lobbyCode.value) {
      alert('Please enter a lobby code');
      return;
    }
    if (!_form.action_.value) {
      alert('Create or Join a lobby');
      return;
    }

    const data = JSON.stringify({
      ACTION_TYPE: _form.action_.value,
      lobbyCode: _form.lobbyCode.value,
    });

    const websocket = connectWebSocket(`/?data=${data}`);
    websocket.onopen = () =>
      dispatch({
        ...state,
        isConnected: true,
        action: form.current!!.action_.value,
        websocket,
      });
  };

  return (
    <div>
      <form ref={form}>
        <div>
          <input
            type="text"
            name="lobbyCode"
            placeholder="Lobby Code"
            required
            onSubmit={handleLogin}
          />
        </div>
        <div>
          <label htmlFor="writter">Create a lobby</label>
          <input type="radio" name="action_" required value="writter" />
          <label htmlFor="viewer">Join a lobby</label>
          <input type="radio" name="action_" required value="viewer" />
        </div>
        <div>
          <button type="button" onClick={handleLogin}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Choice;
