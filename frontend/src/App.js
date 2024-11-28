import './App.css';
import React, { useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import io from 'socket.io-client';
import Cookies from 'js-cookie'; // Import js-cookie
import { jwtDecode } from 'jwt-decode'; // Correct import of jwt-decode

// Import Pages
import PostWithTag from './pages/PostWithTag/PostWithTag';
import HomePage from './pages/HomePage/HomePage';
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
import MessagePage from './pages/MessagePage/MessagePage';
import { AuthContext } from './shared/context/auth-context';

const App = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: null, 
    userId: null,
    username: null,
    email: null,
    fullname: null,
    avatar: null,
    isAdmin: false,
    following: [], 
    bookmark: [],
  });

  const login = useCallback((token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthState({
          isLoggedIn: true,
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
          fullname: decoded.fullname,
          avatar: decoded.avatar,
          isAdmin: decoded.isAdmin,
          following: decoded.following || [],
          bookmark: decoded.bookmark || [],
        });
      } catch (error) {
        console.error('Error decoding token during login:', error);
        logout(); 
      }
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isLoggedIn: false,
      userId: null,
      username: null,
      email: null,
      fullname: null,
      avatar: null,
      isAdmin: false,
      following: [], 
      bookmark: [],
    });
    Cookies.remove('accessToken');
  }, []);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      login(token);
    } else {
      setAuthState((prevState) => ({ ...prevState, isLoggedIn: false }));
    }
  }, [login]);

  if (authState.isLoggedIn === null) {
    return;
  }

  let routes;

  if (authState.isLoggedIn) {
    if (authState.isAdmin) {
      routes = (
        <Routes>
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/posts" element={<PostManagement />} />
          <Route path="*" element={<Navigate to="/admin/users" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/post/:id" element={<DetailPost />} />
          <Route path="/accounts/:option" element={<EditAccount />} />
          <Route path="/videos" element={<VideoPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/tag/:tagName" element={<PostWithTag />} />
          <Route path="/messages/:username" element={<MessagePage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      );
    } else {
      routes = (
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/post/:id" element={<DetailPost />} />
          <Route path="/accounts/:option" element={<EditAccount />} />
          <Route path="/videos" element={<VideoPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/tag/:tagName" element={<PostWithTag />} />
          <Route path="/messages/:username" element={<MessagePage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      );
    }
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
        ...authState,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
