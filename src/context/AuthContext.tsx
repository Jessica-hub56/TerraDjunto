import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  name: string;
  email: string;
  nif: string;
  role: 'admin' | 'user';
};

type StoredUser = AuthUser & { password: string };

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (data: { name: string; email: string; nif: string; password: string }) => Promise<{ ok: true } | { ok: false; error: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'users';
const SESSION_KEY = 'sessionUser';
const REMEMBER_KEY = 'rememberMe';
const ADMIN_EMAIL = 'admin@terradjunto.cv';

const loadUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return arr.map((u: any) => ({ ...u, role: u.role ?? 'user' }));
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed: any = JSON.parse(raw);
        const normalized: AuthUser = { name: parsed.name, email: parsed.email, nif: parsed.nif, role: parsed.role ?? 'user' };
        setUser(normalized);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // Semente/Promoção de conta admin
  useEffect(() => {
    const users = loadUsers();
    let updated = [...users];
    const idx = updated.findIndex(u => (u.email?.toLowerCase() === ADMIN_EMAIL));
    if (idx !== -1) {
      if (updated[idx].role !== 'admin') {
        updated[idx] = { ...updated[idx], role: 'admin' } as StoredUser;
        localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      }
    } else {
      const hasAdmin = updated.some(u => u.role === 'admin');
      if (!hasAdmin) {
        const adminUser = {
          name: 'Administrador',
          email: ADMIN_EMAIL,
          nif: '999999999',
          password: 'Admin@123',
          role: 'admin'
        } as StoredUser;
        updated = [adminUser, ...updated];
        localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    const users = loadUsers();
    const found = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { ok: false as const, error: 'Utilizador não encontrado. Faça o registo.' };
    }
    if (found.password !== password) {
      return { ok: false as const, error: 'Palavra-passe incorreta.' };
    }
    const sessionUser: AuthUser = { name: found.name, email: found.email, nif: found.nif, role: found.role ?? 'user' };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
    setUser(sessionUser);
    return { ok: true as const };
  }, []);

  const register = useCallback(async (data: { name: string; email: string; nif: string; password: string }) => {
    const users = loadUsers();
    const emailExists = users.some(u => u.email.trim().toLowerCase() === data.email.trim().toLowerCase());
    if (emailExists) {
      return { ok: false as const, error: 'Já existe um utilizador com este email.' };
    }
    // validações adicionais simples
    if (!/^\d{9}$/.test(data.nif)) {
      return { ok: false as const, error: 'NIF inválido. Deve conter 9 dígitos.' };
    }
    const newUser: StoredUser = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      nif: data.nif.trim(),
      password: data.password,
      role: 'user'
    } as StoredUser;
    saveUsers([...users, newUser]);

    const sessionUser: AuthUser = { name: newUser.name, email: newUser.email, nif: newUser.nif, role: 'user' };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(REMEMBER_KEY, 'true');
    setUser(sessionUser);
    return { ok: true as const };
  }, []);

  const resetPassword = useCallback(async (email: string, newPassword: string) => {
    const users = loadUsers();
    const idx = users.findIndex(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (idx === -1) {
      return { ok: false as const, error: 'Email não encontrado.' };
    }
    users[idx] = { ...users[idx], password: newPassword };
    saveUsers(users);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: !!user, loading, login, register, resetPassword, logout }), [user, loading, login, register, resetPassword, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
