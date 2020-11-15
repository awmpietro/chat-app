import decode from "jwt-decode";

//  TODO: Implement serverside sesssions and remove local storage JWT Auth

class JwtAuth {
  isSignedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return !!token && !this.isTokenExpired(token);
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      if (decoded.exp > Date.now() / 1000) return false;
    } catch (err) {
      console.log("Auth token expiration check failed!");
      console.log(err);
    }
    return true;
  };

  setToken = (token, userId, name) => {
    // Saves user token to localStorage
    localStorage.setItem("auth", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("name", name);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    let token = localStorage.getItem("auth");
    return token ? token : null;
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("auth");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
  };

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    console.log("Recieved answer!");
    return answer;
  };
}

export default new JwtAuth();
export { JwtAuth };
