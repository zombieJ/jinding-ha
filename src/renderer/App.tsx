import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import './App.css';
import HomePage from './HomePage';

export default function App() {
  return (
    <AntdApp>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </AntdApp>
  );
}
