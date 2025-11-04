import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

//Paginas
import Login from './Login.tsx';
import Home from './Home.tsx';
import Stock from './Stock.tsx';
import Config from './Config.tsx';

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-white text-white dark:bg-black'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path='/settings' element={<Config />} />
        </Routes>
      </div>
    </Router>

  )
}

export default App;