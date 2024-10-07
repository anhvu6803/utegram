import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import OptionBar from './components/OptionBar';
const App = () => {
  return (
    <Router>
      <OptionBar />
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
      </Routes>
    </Router>
  );
}
export default App;
