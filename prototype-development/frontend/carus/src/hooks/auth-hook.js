import * as React from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = React.useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = React.useState();
  const [userId, setUserId] = React.useState(false);
  const [user, setUser] = React.useState(false);

  const login = React.useCallback((uid, token, user) => {
    setToken(token);
    setUserId(uid);
    setUser(user)
    
    const tokenExpirationDate = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24
    );
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        user: user,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = React.useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUser(null)
    localStorage.removeItem("userData");
  }, []);

  // Auto - Logout
  React.useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //Auto - Login
  React.useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.user,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, user };
};
