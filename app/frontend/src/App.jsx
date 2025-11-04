import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './AppRouter';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App
