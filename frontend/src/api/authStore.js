const auth = { token: null };
let onChangeCallbacks = [];

export const authStore = (() => {
  return {
    notify() {
      onChangeCallbacks.forEach((cb) => {
        cb(!!auth.token);
      });
    },

    setAccessToken(token) {
      auth.token = token;
      this.notify();
    },
    getAccessToken() {
      return auth.token;
    },
    clearAccessToken() {
      auth.token = null;
      this.notify();
    },

    subscribe(callback) {
      onChangeCallbacks.push(callback);
    },

    unsubscribe(callback) {
      onChangeCallbacks = onChangeCallbacks.filter((cb) => cb !== callback);
    },
  };
})();
