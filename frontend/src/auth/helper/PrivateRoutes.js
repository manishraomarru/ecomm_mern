import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

//Class componenets: are simple classes, made up of multiple functions
//that add functionality to the application.
//It must have the render() method returning JSX

//When React sees an element representing a user-defined component,
//it passes JSX attributes and children to this component as a single object.
//We call this object “props”.

//The term “render prop” refers to a technique for sharing code between React components
//using a prop whose value is a function.

//isAuthenticated() parse the data (token, user) stored locally.

const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/signin",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

export default PrivateRoute;
