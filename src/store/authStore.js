import { create } from 'zustand';

// Read values from localStorage if present
const storedToken = localStorage.getItem('ac_token') || null;
let storedUser = null;
try {
  const u = localStorage.getItem('ac_user');
  if (u) storedUser = JSON.parse(u);
} catch (e) {
  console.error('Error parsing stored user:', e);
}

export const useAuthStore = create((set) => ({
  token: storedToken,
  user: storedUser,
  isAuthenticated: !!storedToken,

  login: (token, user) => {
    localStorage.setItem('ac_token', token);
    localStorage.setItem('ac_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('ac_token');
    localStorage.removeItem('ac_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedUser };
      localStorage.setItem('ac_user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },
}));
