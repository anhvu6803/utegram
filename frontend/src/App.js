import './App.css';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import ResetPassPage from './pages/ResetPassPage/ResetPassPage';
import LoggedPage from './pages/LoggedPage/LoggedPage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import DetailPost from './pages/DetailPost/DetailPost';
import VideoPage from './pages/VideoPage/VideoPage';
import AdminPage from './pages/Admin/UserManagement/UserManagement';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditAccount from './pages/SettingPages/EditAccount';
import NotificationSetting from './pages/SettingPages/NotificationSeting';
import BlockedAccount from './pages/SettingPages/BlockedAccount';
import CommentSetting from './pages/SettingPages/CommentSetting';

const Accounts = () => {
  const { option } = useParams();

  switch (option) {
    case 'edit':
      return <EditAccount />;
    case 'notifications':
      return <NotificationSetting />;
    case 'blocked_accounts':
      return <BlockedAccount />;
    case 'comments':
      return <CommentSetting />;
    default:
      return <div>Invalid Option</div>; // Handle unknown options
  }
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path='/post/:id' element={<DetailPost />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/resetpass" element={<ResetPassPage />} />
        <Route path="/logged" element={<LoggedPage />} />
        <Route path='/accounts/:option' element={<Accounts />} />
        <Route path="/videos" element={<VideoPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}
export default App;
