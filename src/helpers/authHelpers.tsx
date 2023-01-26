const TOKEN = "token";

export const AuthHelpers = {
  isAuthenticated: () => {
    // return !!localStorage.getItem(TOKEN)
    return true;
  },
  login: () => {
    // Add api for login
  },
  signup: () => {
    // addd api for signup
  },
  logout: (type: any) => {
    if (AuthHelpers.isAuthenticated()) {
      console.log(AuthHelpers.isAuthenticated());
      if (!type) {
        // window.location.href = getAuthRoute();
      } else {
        // redirectToUrl(getAuthRoute());
      }
      localStorage.removeItem(TOKEN);
    }
  },
};
