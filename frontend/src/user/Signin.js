import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper/index";

const Signin = () => {
	const [values, setValues] = useState({
		email: "manish@marru.com",
		password: "12345",
		error: "",
		loading: false,
		didRedirect: false, //successfull signin needs to be redirected.
	});

	const { email, password, error, loading, didRedirect } = values;

	//parse the data stored locally.
	const { user } = isAuthenticated();

	const handleChange = (name) => (event) => {
		setValues({ ...values, error: false, [name]: event.target.value });
	};

	//catch accepts a function that is called when the promise is rejected.
	//Try not to call message immediately and pass a function instead as an argument.
	const onSubmit = (event) => {
		event.preventDefault();
		setValues({ ...values, error: false, loading: true });
		signin({ email, password })
			.then((data) => {
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false });
				} else {
					authenticate(data, () => {
						setValues({
							...values,
							didRedirect: true,
						});
					});
				}
			})
			.catch(() => console.log("Sign In request Failed"));
	};

	const performRedirect = () => {
		if (didRedirect) {
			if (user && user.role == 1) {
				return <Redirect to="/admin/dashboard" />;
			} else {
				return <Redirect to="/user/dashboard" />;
			}
		}
		if (isAuthenticated()) {
			return <Redirect to="/" />;
		}
	};

	const loadingMessage = () => {
		//when the display property is set to none, it will conceal the whole element
		return (
			loading && (
				<div className="alert alert-info">
					<h2>Loading...</h2>
				</div>
			)
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
						{error}
					</div>
				</div>
			</div>
		);
	};

	const signInForm = () => {
		return (
			<div className="row">
				<div class="col-md-6 offset-sm-3 text-left">
					<form>
						<div class="form-group">
							<label class="text-light">Email</label>
							<input
								onChange={handleChange("email")}
								value={email}
								className="form-control"
								type="text"
							/>
						</div>
						<div class="form-group">
							<label class="text-light">Password</label>
							<input
								onChange={handleChange("password")}
								value={password}
								className="form-control"
								type="text"
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
	return (
		<Base title="Sign in page" description="A page for user to sign in!">
			<h1>Sign in works</h1>
			{loadingMessage()}
			{errorMessage()}
			{signInForm()}
			{performRedirect()}
			<p className="text-white text-center">{JSON.stringify(values)}</p>
		</Base>
	);
};

export default Signin;
