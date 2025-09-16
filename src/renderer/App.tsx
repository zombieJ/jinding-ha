import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import './App.css';
import HomePage from './HomePage';
import SetupPage from './SetupPage';
import React from 'react';
import useHA, { HAContext } from './useHA';

export default function App() {
 const instance =  useHA();

  return (
    <HAContext.Provider value={instance}>
      <AntdApp>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/setup" element={<SetupPage />} />
          </Routes>
        </Router>
      </AntdApp>
    </HAContext.Provider>
  );
}
