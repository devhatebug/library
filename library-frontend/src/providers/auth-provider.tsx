import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { IUser } from "../types/user";
import { LoginResponse, loginApi } from "../api/auth-api.ts";
import { LocalStorageKey } from "../types/localstorage.ts";

type loginFn = (email: string, password: string) => Promise<LoginResponse>;
type logoutFn = () => Promise<void>;

interface AuthContextTypes {
  user: IUser | null;
  loading: boolean;
  login: loginFn;
  logout: logoutFn;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextTypes | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const login: loginFn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const dataLogin = {
        username,
        password,
      };
      const response = await loginApi(dataLogin);
      setUser(response.user || null);
      localStorage.setItem(LocalStorageKey.USER, JSON.stringify(response.user));
      localStorage.setItem(
        LocalStorageKey.ACCESS_TOKEN,
        JSON.stringify(response.token)
      );
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout: logoutFn = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem(LocalStorageKey.USER);
      localStorage.removeItem(LocalStorageKey.ACCESS_TOKEN);
      setLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
      return Promise.reject(error);
    }
  };
  useEffect(() => {
    const savedUser = localStorage.getItem(LocalStorageKey.USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider returned no auth provider");
  }
  return context;
};
