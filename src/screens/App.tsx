import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import MenuPersonal from '../components/MenuPersonal'

import Login from './Login'
import Home from './Home'
import Stock from './Stock'
import Config from './Config'
import About from './About'
import Support from './Support'
import Dashboard from './Dashboard'

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}

function App() {
  const location = useLocation();

  const hideMenu = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white text-white dark:bg-black">
      {!hideMenu && <MenuPersonal />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Stock />} />
        <Route path="/settings" element={<Config />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
