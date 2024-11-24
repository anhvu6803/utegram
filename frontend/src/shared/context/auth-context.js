import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  username: null,
  email: null,
  fullname: null,
  avatar: null,
  isAdmin: false,
  following: [],
  bookmark: [],
  login: () => {},
  logout: () => {},
});
