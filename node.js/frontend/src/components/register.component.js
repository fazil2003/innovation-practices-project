import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
// import Popup from 'reactjs-popup';
// import './components-styles/products.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBox, faAdd, faFileCode, faGear, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons'

const Register = () => {

	const navigate = useNavigate();

	function userRegister(event) {

		event.preventDefault();

		let username = event.target[0].value;
		let password = event.target[1].value;
		let email = event.target[2].value;

		const parameters = {
			username: username,
			password: password,
			email: email
		};

		axios.post(defaultVariables['backend-url'] + 'mongodb/register', parameters)
		.then(response => {
			if (response.data == "success"){
				localStorage.setItem("cookie_email", email);
				localStorage.setItem("cookie_username", username);
				// alert(localStorage.getItem("cookie_email"));
				// alert(localStorage.getItem("cookie_username"));
				navigate("/home");
				
			}
			else{
				alert("Invalid credentials.")
			}
		})
		.catch(error => {
			alert("Error.")
		});
	}

    return (
        <div className='container'>
			<form className='login-form' onSubmit={userRegister} >
				<p className='heading'>Register</p>
				<div className='form-input'>
					<label>Username</label><br />
					<input type='text' placeholder='Username' />
				</div>
				<div className='form-input'>
					<label>Password</label><br />
					<input type='password' placeholder='Password' />
				</div>
				<div className='form-input'>
					<label>Email</label><br />
					<input type='email' placeholder='Email' />
				</div>
				<div className='form-input'>
					<center>
						<button>Register</button>
					</center>
				</div>
                <div className='form-input'>
                    <center>
                        Already have an account? <a href='/login'>Login</a>
                    </center>
                </div>
			</form>
    	</div>
    )
    
}

export default Register;