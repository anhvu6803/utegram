import './App.css';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import PostForm from './components/PostForm/PostForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
export default App;
