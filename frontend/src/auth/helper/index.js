import { type } from "@testing-library/user-event/dist/type";
import { API } from "../../backend";

//localStorage is similar to sessionStorage,
//except that while localStorage data has no expiration time,
//sessionStorage data gets cleared when the page session ends — that is,
//when the page is closed.
export const signup = (user) => {
	//console.log(JSON.stringify(user));
	return fetch(`${API}/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const signin = (user) => {
	//response can only be consumed once.
	//JSON.stringify converts the the keys and values to strings.
	//not the entier object to string.
	return fetch(`${API}/signin`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

//store the entire data (token,body) from backend with key as jwt
export const authenticate = (data, next) => {
	if (typeof window != "undefined") {
		localStorage.setItem("jwt", JSON.stringify(data));
		next();
	}
};

export const signout = (next) => {
	if (typeof window != "undefined") {
		localStorage.removeItem("jwt");
		next();
		return fetch(`${API}/signout`, {
			method: "GET",
		})
			.then((response) => console.log("signout success"))
			.catch((err) => console.log(err));
	}
};

export const isAuthenticated = () => {
	if (typeof window == "undefined") {
		return false;
	}
	if (localStorage.getItem("jwt")) {
		return JSON.parse(localStorage.getItem("jwt"));
	} else {
		return false;
	}
};
