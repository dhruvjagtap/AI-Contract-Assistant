// AI-Contract-Assistant-Frontend/src/hooks/useAuth.ts
import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  type UserResponse,
} from "@/api/auth";

interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserResponse | null;
  loading: boolean;
}

let state: AuthState = {
  isAuthenticated:
    localStorage.getItem("access_token") !== null,
  currentUser: null,
  loading: true,
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function setState(nextState: Partial<AuthState>) {
  state = {
    ...state,
    ...nextState,
  };

  emitChange();
}

async function loadUser() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    setState({
      isAuthenticated: false,
      currentUser: null,
      loading: false,
    });

    return;
  }

  try {
    const user = await getCurrentUser();

    setState({
      isAuthenticated: true,
      currentUser: user,
      loading: false,
    });
  } catch {
    localStorage.removeItem("access_token");

    setState({
      isAuthenticated: false,
      currentUser: null,
      loading: false,
    });
  }
}

export function useAuth() {
  const authState = useSyncExternalStore(
    subscribe,
    () => state,
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.access_token,
      );

      const user = await getCurrentUser();

      setState({
        isAuthenticated: true,
        currentUser: user,
        loading: false,
      });

      return user;
    },
    [],
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
    ) => {
      const response = await registerUser({
        full_name: fullName,
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.access_token,
      );

      const user = await getCurrentUser();

      setState({
        isAuthenticated: true,
        currentUser: user,
        loading: false,
      });

      return user;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");

    setState({
      isAuthenticated: false,
      currentUser: null,
      loading: false,
    });
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    currentUser: authState.currentUser,
    loading: authState.loading,
    login,
    register,
    logout,
  };
}