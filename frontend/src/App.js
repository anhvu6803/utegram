import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import OptionBar from './components/OptionBar/OptionBar';
import SearchForm from './components/SearchBar/SearchBar';

const App = () => {
  return (
    <Router>
      <OptionBar />
    </Router>
  );
}
export default App;
