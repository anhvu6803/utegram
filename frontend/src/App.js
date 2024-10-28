import './App.css';
import React, { useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';
import PostWithTag from './pages/PostWithTag/PostWithTag';
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import ResetPassPage from './pages/ResetPassPage/ResetPassPage';
import LoggedPage from './pages/LoggedPage/LoggedPage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import DetailPost from './pages/DetailPost/DetailPost';
import VideoPage from './pages/VideoPage/VideoPage';
import UserManagement from './pages/Admin/UserManagement/UserManagement';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditAccount from './pages/SettingPages/EditAccount';
import NotificationSetting from './pages/SettingPages/NotificationSeting';
import BlockedAccount from './pages/SettingPages/BlockedAccount';
import CommentSetting from './pages/SettingPages/CommentSetting';
import PostManagement from './pages/Admin/PostManagement/PostManagement';
import InputBornDay from './pages/SignUpPage/InputBornDay';
import ConfirmCode from './pages/SignUpPage/ConfirmCode';
import PrivateRoute from './components/PrivateRoute';

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
      return <div>Invalid Option</div>;
  }
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
    localStorage.setItem('isLoggedIn', 'true'); 
    localStorage.setItem('userId', uid); 
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('userId'); 
  }, []);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUserId(localStorage.getItem('userId'));
    }
  }, []);

  console.log(userId)

  let routes;

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path='/post/:id' element={<DetailPost />} />
        <Route path='/accounts/:option' element={<Accounts />} />
        <Route path="/videos" element={<VideoPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/tag/:tagName" element={<PostWithTag />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/posts" element={<PostManagement />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/resetpass" element={<ResetPassPage />} />
        <Route path="/logged" element={<LoggedPage />} />
        <Route path="/input-born" element={<InputBornDay />} />
        <Route path="/confirm-code" element={<ConfirmCode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
