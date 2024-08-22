export const authStore = (() => {
  let auth = {};

  return {
    setAccessToken(token) {
      auth = { token: token };
    },
    getAccessToken() {
      return auth.token;
    },
    clearAccessToken() {
      auth.token = null;
    },
  };
})();
