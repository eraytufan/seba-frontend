import {authURL} from "../constants";
import {setLoginAlertText, showSnackBar} from "../actions/loginPage";

export const invalidRequest = async (response) => {
  let error = new Error();
  const res = await response.json();
  checkInvalidRequest(response.status);
  error.message = res.message;
  return error;
};

export const checkInvalidRequest = (responseStatus) => {
  if (responseStatus === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  }
};

export function isAuthenticated() {
  return localStorage["token"] ? true : false;
}

export function signUpCustomer(signUpFields) {
  const body = {
    username: signUpFields.username,
    password: signUpFields.password,
    name: signUpFields.name,
    phoneNumber: signUpFields.phoneNumber,
    address: signUpFields.address,
    email: signUpFields.email,
  };
  return (dispatch) => {
    return fetch(authURL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw invalidRequest(response);
      })
      .then(() => {
        return true;
      })
      .catch(async (err) => {
        let errorMessage = "Server not reachable";
        if (err instanceof Promise)
          errorMessage = await err.then((error) => error.message);
        dispatch(showSnackBar(true, errorMessage, "error"));
        return false;
      });
  };
}

export function loginCustomer(username, password) {
  const body = {
    username: username,
    password: password,
  };
  return (dispatch) => {
    return fetch(authURL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw invalidRequest(response);
      })
      .then((result) => {
        localStorage["token"] = result.token;
        localStorage["username"] = username;
        if (result.shouldChangePassword) localStorage["shouldChangePassword"] = true;
        return true;
      })
      .catch(async (err) => {
        let errorMessage = "Server not reachable";
        if (err instanceof Promise) errorMessage = await err.then((err) => err.message);
        dispatch(setLoginAlertText(errorMessage));
        return false;
      });
  };
}

export function logout(history) {
  return (dispatch) => {
    return fetch(authURL + "/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage["token"]}`,
      },
    })
      .then((response) => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        if (response.status !== 200) throw invalidRequest(response);
      })
      .then(() => {
        dispatch(showSnackBar(true, "Logout Successful", "success"));
        history.push("/");
        window.location.reload();
      })
      .catch(() => {
        dispatch(showSnackBar(true, "Invalid Session", "error"));
        window.location.reload();
      });
  };
}

export function forgotPassword(email) {
  const body = {
    email: email,
  };
  return (dispatch) => {
    return fetch(authURL + "/forgotPass", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw invalidRequest(response);
      })
      .then((result) => {
        dispatch(showSnackBar(true, result.message, "success"));
        return true;
      })
      .catch(async (err) => {
        let errorMessage = "Server not reachable";
        if (err instanceof Promise)
          errorMessage = await err.then((error) => error.message);
        dispatch(showSnackBar(true, errorMessage, "error"));
        return false;
      });
  };
}
