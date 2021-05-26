import React, { useState } from 'react';
import './App.global.css';
import { BaseContext, defaultReducerValue } from './Modules/BaseContext';
import Editor from './Pages/Editor';
import Choice from './Pages/Choice';

const App = () => {
  const [state, dispatch] = useState(defaultReducerValue);

  return (
    <BaseContext.Provider value={{ state, dispatch }}>
      {state.isConnected ? <Editor /> : <Choice />}
    </BaseContext.Provider>
  );
};

export default App;
