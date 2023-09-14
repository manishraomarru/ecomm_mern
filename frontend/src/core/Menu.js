import React, { Fragment } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/helper";

const currentTab = (history, path) => {
	if (history.location.pathname === path) {
		//console.log(history.location.pathname);
		return { color: "#2ecc72" };
	} else {
		return { color: "#FFFFFF" };
	}
};

//In React, when a component returns multiple elements,
//we must wrap them in a container element.
//Fragments are syntax that allow us to add multiple elements to a React component
//without wrapping them in an extra DOM node.
const Menu = () => {
	const history = useHistory();
	return (
		<div>
			<ul className="nav nav-tabs bg-dark">
				<li className="nav-item">
					<Link style={currentTab(history, "/")} className="nav-link" to="/">
						Home
					</Link>
				</li>
				<li className="nav-item">
					<Link
						style={currentTab(history, "/cart")}
						className="nav-link"
						to="/cart">
						Cart
					</Link>
				</li>
				{isAuthenticated() && isAuthenticated().user.role === 0 && (
					<li className="nav-item">
						<Link
							style={currentTab(history, "/user/dashboard")}
							className="nav-link"
							to="/user/dashboard">
							U. Dashboard
						</Link>
					</li>
				)}
				{isAuthenticated() && isAuthenticated().user.role === 1 && (
					<li className="nav-item">
						<Link
							style={currentTab(history, "/admin/dashboard")}
							className="nav-link"
							to="/admin/dashboard">
							A. Dashboard
						</Link>
					</li>
				)}
				{!isAuthenticated() && (
					<Fragment>
						<li className="nav-item">
							<Link
								style={currentTab(history, "/signup")}
								className="nav-link"
								to="/signup">
								SignUp
							</Link>
						</li>
						<li className="nav-item">
							<Link
								style={currentTab(history, "/signin")}
								className="nav-link"
								to="/signin">
								SignIn
							</Link>
						</li>
					</Fragment>
				)}
				{isAuthenticated() && (
					<li className="nav-item">
						<span
							className="nav-link text-warning"
							onClick={() => {
								signout(() => {
									history.push("/");
								});
							}}>
							Signout
						</span>
					</li>
				)}
			</ul>
		</div>
	);
};

export default Menu;
