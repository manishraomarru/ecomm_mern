import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper/index";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminApiCalls";

const AddCategory = () => {
	const [name, setName] = useState("");
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	const { user, token } = isAuthenticated();

	const goBack = () => {
		return (
			<div className="mt-5">
				<Link to="/admin/dashboard" className="btn btn-sm btn-secondary mb-3">
					Admin Home
				</Link>
			</div>
		);
	};

	const handleChange = (event) => {
		setError("");
		setName(event.target.value);
	};

	const onsubmit = (event) => {
		event.preventDefault();
		setError("");
		setSuccess(false);

		//backend request fired
		createCategory(user._id, token, { name }).then((data) => {
			if (data.error) {
				setError(true);
			} else {
				setError("");
				setSuccess(true);
				setName("");
			}
		});
	};

	const successMessage = () => {
		if (success) {
			return <h4 className="text-success">Category created successfully</h4>;
		}
	};

	const warningMessage = () => {
		if (error) {
			return <h4 className="text-error">Failed to create Category</h4>;
		}
	};

	const myCategoryForm = () => (
		<form>
			<div className="form-group">
				<p className="lead">Enter the Category</p>
				<input
					type="text"
					className="form-control my-3"
					onChange={handleChange}
					value={name}
					autoFocus
					required
					placeholder="For Ex. Summer"
				/>
				<button onClick={onsubmit} className="btn btn-outline-info">
					Create Category
				</button>
			</div>
		</form>
	);

	return (
		<Base
			title="Create a category here"
			description="Add a new category for new tshirts"
			className="container bg-info p-4">
			<div className="row bg-white rounded">
				<div className="col-md-8 offset-md-2">
					{successMessage()}
					{warningMessage()}
					{myCategoryForm()}
					{goBack()}
				</div>
			</div>
		</Base>
	);
};

export default AddCategory;
