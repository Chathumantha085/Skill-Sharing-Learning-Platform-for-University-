export const getCurrentToken = () => {
    return localStorage.getItem(process.env.REACT_APP_TOKEN_NAME);
  };
  
  export const isAuthenticated = () => {
    return getCurrentToken() !== null;
  };