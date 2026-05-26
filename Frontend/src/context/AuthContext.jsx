import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@services/auth.service';

const AuthContext = createContext(null);

const initialState = { user: null, isLoading: true, isAuthenticated: false };

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':    return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':  return { user: action.payload, isLoading: false, isAuthenticated: true };
    case 'LOGOUT':         return { user: null, isLoading: false, isAuthenticated: false };
    case 'UPDATE_USER':    return { ...state, user: { ...state.user, ...action.payload } };
    default: return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { dispatch({ type: 'SET_LOADING', payload: false }); return; }
      try {
        const user = await authService.getMe();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    restore();
  }, []);

  const login = async (email, password) => {
    const { user, accessToken, refreshToken } = await authService.login(email, password);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return user;
  };

  const logout = () => {
    authService.logout().catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data) => dispatch({ type: 'UPDATE_USER', payload: data });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
