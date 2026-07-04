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

const storedAccountsRaw = localStorage.getItem('ac_accounts');
let storedAccounts = [];
try {
  if (storedAccountsRaw) storedAccounts = JSON.parse(storedAccountsRaw);
} catch (e) {
  console.error('Error parsing stored accounts:', e);
}

export const useAuthStore = create((set, get) => ({
  token: storedToken,
  user: storedUser,
  isAuthenticated: !!storedToken,
  accounts: storedAccounts,

  login: (token, user) => {
    // 1. Set active session in localStorage
    localStorage.setItem('ac_token', token);
    localStorage.setItem('ac_user', JSON.stringify(user));

    // 2. Add or update in accounts list
    let currentAccounts = [];
    try {
      const raw = localStorage.getItem('ac_accounts');
      if (raw) currentAccounts = JSON.parse(raw);
    } catch (_) {}

    const index = currentAccounts.findIndex(acc => acc.user.id === user.id);
    if (index !== -1) {
      currentAccounts[index] = { token, user };
    } else {
      currentAccounts.push({ token, user });
    }

    localStorage.setItem('ac_accounts', JSON.stringify(currentAccounts));

    set({ token, user, isAuthenticated: true, accounts: currentAccounts });
  },

  logout: () => {
    const activeUser = get().user;
    let currentAccounts = get().accounts;

    // Remove the current active account from the saved list
    if (activeUser) {
      currentAccounts = currentAccounts.filter(acc => acc.user.id !== activeUser.id);
      localStorage.setItem('ac_accounts', JSON.stringify(currentAccounts));
    }

    localStorage.removeItem('ac_token');
    localStorage.removeItem('ac_user');

    if (currentAccounts.length > 0) {
      // Switch to the next available account
      const nextAcc = currentAccounts[0];
      localStorage.setItem('ac_token', nextAcc.token);
      localStorage.setItem('ac_user', JSON.stringify(nextAcc.user));
      
      set({
        token: nextAcc.token,
        user: nextAcc.user,
        isAuthenticated: true,
        accounts: currentAccounts
      });
      
      window.location.href = '/jobs';
    } else {
      set({ token: null, user: null, isAuthenticated: false, accounts: [] });
      window.location.href = '/login';
    }
  },

  switchAccount: (userId) => {
    const target = get().accounts.find(acc => acc.user.id === userId);
    if (!target) return;

    localStorage.setItem('ac_token', target.token);
    localStorage.setItem('ac_user', JSON.stringify(target.user));

    set({ token: target.token, user: target.user, isAuthenticated: true });

    // Reload the page to clear any in-memory state or cache of the old account
    window.location.href = '/jobs';
  },

  addAccount: () => {
    // Keep ac_accounts in localStorage, but clear current active session
    localStorage.removeItem('ac_token');
    localStorage.removeItem('ac_user');
    set({ token: null, user: null, isAuthenticated: false });
    window.location.href = '/login';
  },

  removeAccount: (userId) => {
    let currentAccounts = get().accounts.filter(acc => acc.user.id !== userId);
    localStorage.setItem('ac_accounts', JSON.stringify(currentAccounts));
    set({ accounts: currentAccounts });

    // If the removed account was the active one, log out or switch
    const activeUser = get().user;
    if (activeUser && activeUser.id === userId) {
      get().logout();
    }
  },

  updateUser: (updatedUser) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedUser };
      localStorage.setItem('ac_user', JSON.stringify(newUser));

      // Update in accounts array as well
      const updatedAccounts = state.accounts.map(acc => {
        if (acc.user.id === newUser.id) {
          return { ...acc, user: newUser };
        }
        return acc;
      });
      localStorage.setItem('ac_accounts', JSON.stringify(updatedAccounts));

      return { user: newUser, accounts: updatedAccounts };
    });
  },
}));
