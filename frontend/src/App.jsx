import { Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Login from './pages/Login';
import Home from './pages/Home/Home'
import News from './pages/newsSection/News'
import Analyse from './pages/Analytics/Analyse'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/home' element={<Home/>}></Route>
      <Route path="/signin" element={<Signin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/news" element={<News />} />
      <Route path="/analyze" element={<Analyse />} />

    </Routes>
  );
}

export default App;
