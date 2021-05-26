import { ipcRenderer } from 'electron/renderer';
import React, { useContext, useEffect, useRef } from 'react';
import { BaseContext } from '../Modules/BaseContext';

const Home = () => {
  const textArea = useRef<HTMLTextAreaElement>(null);

  const {
    state: { websocket, action },
  } = useContext(BaseContext);

  useEffect(() => {
    let timeout = setTimeout(() => {}, 0);

    const handleInput = () => {
      clearTimeout(timeout);

      const text = textArea.current!!.value;

      if (text)
        timeout = setTimeout(() => {
          websocket?.send(text);
        }, 10);
    };

    textArea.current!!.addEventListener('input', handleInput);

    return () => textArea.current!!.removeEventListener('input', handleInput);
  }, []);

  useEffect(() => {
    if (action === 'viewer') {
      const handleInput = (e) => {
        textArea.current!!.value = e.data;
      };

      websocket?.addEventListener('message', handleInput);
      return () => websocket?.removeEventListener('message', handleInput);
    }
  }, []);

  return (
    <div>
      <textarea
        ref={textArea}
        readOnly={action == 'viewer'}
        style={{
          width: 500,
          height: 200,
        }}
      ></textarea>
    </div>
  );
};

export default Home;
