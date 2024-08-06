import Cookies from "js-cookie";

class CookieManager {
  static set(name, value, options = {}) {
    Cookies.set(name, value, options);
  }

  static get(name) {
    return Cookies.get(name);
  }

  static remove(name, options = {}) {
    Cookies.remove(name, options);
  }
}

export default CookieManager;
