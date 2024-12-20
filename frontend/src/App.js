import './App.css';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import io from 'socket.io-client';
import Cookies from 'js-cookie'; // Import js-cookie
import { jwtDecode } from 'jwt-decode'; // Correct import of jwt-decode
import { useHttpClient } from './shared/hooks/http-hook';

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
import ChangePass from './pages/SettingPages/ChangePass';
import PostManagement from './pages/Admin/PostManagement/PostManagement';
import InputBornDay from './pages/SignUpPage/InputBornDay';
import ConfirmCode from './pages/SignUpPage/ConfirmCode';
import MessagePage from './pages/MessagePage/MessagePage';
import CommentManagement from './pages/Admin/PostManagement/CommentManagement';
import SetNewPasswordPage from './pages/ResetPassPage/SetNewPasswordPage';
import { AuthContext } from './shared/context/auth-context';

function calculateYearDifference(mongoDate) {
  const givenDate = new Date(mongoDate);
  const currentDate = new Date();

  // Lấy năm từ ngày được cung cấp và ngày hiện tại
  const givenYear = givenDate.getFullYear();
  const currentYear = currentDate.getFullYear();

  // Tính sự chênh lệch giữa hai năm
  const yearDifference = currentYear - givenYear;

  return yearDifference;
}

const Accounts = () => {
  const { option } = useParams();

  switch (option) {
    case 'edit':
      return <EditAccount />;

    case 'change_pass':
      return <ChangePass />;

    default:
      return <div>Invalid Option</div>; // Handle unknown options
  }
};

const App = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: null,
    userId: null,
    username: null,
    email: null,
    fullname: null,
    avatar: null,
    isAdmin: false,
    age: null,
    tags: []
  });

  const { timeLoading, sendRequest } = useHttpClient();

  const login = useCallback((token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(calculateYearDifference(decoded.bornDay))
        setAuthState({
          isLoggedIn: true,
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
          fullname: decoded.fullname,
          isAdmin: decoded.isAdmin,
          age: calculateYearDifference(decoded.bornDay),
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
      age: null,
      tags: []
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
    const fetchAuthor = async () => {
      try {
        const decoded = jwtDecode(token);
        const responseUser = await sendRequest(`http://localhost:5000/api/auth/${decoded.userId}`);

        const response = await sendRequest(`http://localhost:5000/api/tag`);

        setAuthState((prevState) => ({
          ...prevState,
          avatar: responseUser.user.avatar,
          tags: response.tags
        }));
      } catch (err) {
      }
    };
    fetchAuthor();
  }, [login, sendRequest]);

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
          <Route path="/admin/comments" element={<CommentManagement />} />
          <Route path="*" element={<Navigate to="/admin/users" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/post/:id" element={<DetailPost />} />
          <Route path="/accounts/:option" element={<Accounts />} />
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
          <Route path="/accounts/:option" element={<Accounts />} />
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
        <Route path="/setnewpassword" element={<SetNewPasswordPage />} />
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
