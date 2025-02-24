import React, { createContext, useState, useContext, useEffect } from "react";
import { PostLogin, setToken } from "../components/ApiHandler";
import Swal from "sweetalert2";

const PersonContext = createContext();

export const PersonProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      const loggedUser = await localStorage.getItem("loggedUser");
      if (loggedUser) {
        const parsedUser = JSON.parse(loggedUser);
        const isTokenExpired = (token) => {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp * 1000 < Date.now();     
        };

        if (isTokenExpired(parsedUser.token)) {
            Swal.fire({
            title: "Sesión expirada",
            text: "Por favor, inicie sesión nuevamente.",
            icon: "warning",
            confirmButtonText: "OK",
            });
          localStorage.removeItem("loggedUser");
          setLoading(false);
          return;
        }
        setUser(parsedUser);
        setToken(parsedUser.token);
      }
      setLoading(false);
    };
    fetchLoggedUser();
  }, []);

  const doLogin = async (inputs) => {
    const response = await PostLogin(inputs);
    if (response.success) {
      await localStorage.setItem(
        "loggedUser",
        JSON.stringify({ username: inputs.username, token: response.token })
      );
      setUser({ username: inputs.username, token: response.token });
      setToken(response.token);
    }
  };

  const doLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser({});
    setToken("");
  };

  return (
    <PersonContext.Provider value={{ user, doLogin, doLogout, loading }}>
      {children}
    </PersonContext.Provider>
  );
};

export const usePerson = () => {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error("usePerson must be used within a PersonProvider");
  }
  return context;
};
