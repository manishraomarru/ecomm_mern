import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

//collect all the data from the form and submit it to the backend API.
const Signup = () => {
	//Hooks are special functions that allow ReactJS features to be used in functional components.
	//useState is Hook that lets you add React state to fuction components
	//If you write a function component and realize you need to add some state to it,
	//previously you had to convert it to a class by extending it to React.Componet.
	//Now you can use a Hook inside the existing function component.
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		error: "",
		success: false,
	});

	//destructure the values
	const { name, email, password, error, success } = values;

	//maniplate the values using setValue method.
	const handleChange = (name) => (event) => {
		setValues({ ...values, error: false, [name]: event.target.value });
	};

	const onSubmit = (event) => {
		//prevent the default action on submit
		event.preventDefault();
		setValues({ ...values, error: false });
		signup({ name, email, password })
			.then((data) => {
				if (data.error) {
					setValues({ ...values, error: data.error, success: false });
				} else {
					setValues({
						...values,
						name: "",
						email: "",
						password: "",
						error: "",
						success: true,
					});
				}
			})
			.catch(() => console.log("Error in signup"));
	};

	//The value attribute for <input> element in HTML is used to specify the initial value
	//of the input element.
	const signUpForm = () => {
		return (
			<div className="row">
				<div class="col-md-6 offset-sm-3 text-left">
					<form>
						<div class="form-group">
							<label class="text-light">Name</label>
							<input
								className="form-control"
								onChange={handleChange("name")}
								type="text"
								value={name}
							/>
						</div>
						<div class="form-group">
							<label class="text-light">Email</label>
							<input
								className="form-control"
								onChange={handleChange("email")}
								type="text"
								value={email}
							/>
						</div>
						<div class="form-group">
							<label class="text-light">Password</label>
							<input
								className="form-control"
								onChange={handleChange("password")}
								type="text"
								value={password}
							/>
						</div>
						<button onClick={onSubmit} class="btn btn-success btn-block">
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	};

	const successMessage = () => {
		//when the display property is set to none, it will conceal the whole element
		return (
			<div className="row">
				<div class="col-md-6 offset-sm-3 text-left">
					<div
						className="alert alert-success"
						style={{ display: success ? "" : "none" }}>
						New account was created successfully.
						<Link to="/signin">Login Here</Link>
					</div>
				</div>
			</div>
		);
	};

	const errorMessage = () => {
		//Objects are not valid as a React child. error is an object.
		//error.msg is string.
		return (
			<div className="row">
				<div class="col-md-6 offset-sm-3 text-left">
					<div
						className="alert alert-danger"
						style={{ display: error ? "" : "none" }}>
						{error.msg}
					</div>
				</div>
			</div>
		);
	};

	//{} brackets seperate the JSX logic
	//only JSX can return the HTML element.
	//For JS the to return HTML elements it should be string
	return (
		<Base title="Sign up page" description="A page for user to sign up!">
			<h1>Sign up works</h1>
			{successMessage()}
			{errorMessage()}
			{signUpForm()}
			<p className="text-white text-center">{JSON.stringify(values)}</p>
		</Base>
	);
};

export default Signup;
