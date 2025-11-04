import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';


// TODO: hacer pages iniciales


const AppRouter = () => {

  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>

            {/* Default route */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            
            {/* 404 Route*/}
            <Route path="*" element={<div>Page not found</div>} />
          
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default AppRouter;
