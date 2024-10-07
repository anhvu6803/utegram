import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
const App = () => {
  return <Router>
    <Route path="/">
    <LoginPage />
    </Route>
  </Router>
}
export default App;
