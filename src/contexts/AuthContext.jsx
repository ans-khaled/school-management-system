import { createContext, useContext, useEffect, useReducer } from "react";
import {
  getUser,
  login as loginApi,
  logout as logoutApi,
} from "../services/apiAuth";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loginStart":
      return { ...state, loading: true, error: null };

    case "loginSuccess":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "loginError":
      return { ...state, loading: false, error: action.payload };

    case "logout":
      return { ...initialState };

    case "logoutError":
      return { ...initialState, error: action.payload };

    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated, loading, error, message } = state;

  // Using token to keep user logged in if refershing browser
  // To keep user consist unless logout.
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();

        dispatch({
          type: "loginSuccess",
          payload: data.data,
        });
      } catch (err) {
        console.error("Auto login failed");
        localStorage.removeItem("token");
      }
    }

    fetchUser();
  }, []);

  async function login({ email, password }) {
    if (!email || !password) return;

    dispatch({ type: "loginStart" });

    try {
      const data = await loginApi(email, password);

      if (!data) {
        dispatch({
          type: "loginError",
        });

        return;
      }

      localStorage.setItem("token", data.data?.token || "");

      dispatch({
        type: "loginSuccess",
        payload: data.data.user,
      });
    } catch (err) {
      dispatch({
        type: "loginError",
        payload: err,
      });
    }
  }

  async function logout() {
    try {
      const data = await logoutApi();
      dispatch({ type: "logout" });
    } catch (err) {
      dispatch({ type: "logoutError", payload: err.message });
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading, error, message }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthProvider is used to outside AuthContext");

  return context;
}

export { AuthProvider, useAuth };
