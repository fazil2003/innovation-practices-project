import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
// import Popup from 'reactjs-popup';
// import './components-styles/products.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBox, faAdd, faFileCode, faGear, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons'

const Login = () =>{

	const navigate = useNavigate();

	function userLogin(event){
		event.preventDefault();
		let username = event.target[0].value;
		let password = event.target[1].value;
		const parameters = { username: username, password: password };
		axios.post(defaultVariables['backend-url'] + 'mongodb/login', parameters)
		.then(response => {
			// alert(response.data)
			if (response.data.startsWith("success:")){
				let userEmail = response.data.split(":")[1];
				localStorage.setItem("cookie_email", userEmail);
				localStorage.setItem("cookie_username", username);
				// alert(localStorage.getItem("cookie_email"));
				// alert(localStorage.getItem("cookie_username"));
				navigate("/home");
				
			}
			else if (response.data.startsWith("authorize:")){
				let userEmail = response.data.split(":")[1];
				localStorage.setItem("cookie_email", userEmail);
				localStorage.setItem("cookie_username", username);
				navigate("/authorize");
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
			<form className='login-form' onSubmit={userLogin} >
				<p className='heading'>Login</p>
				<div className='form-input'>
					<label>Username</label><br />
					<input type='text' placeholder='Username' />
				</div>
				<div className='form-input'>
					<label>Password</label><br />
					<input type='password' placeholder='Password' />
				</div>
				<div className='form-input'>
					<center>
						<button>Login</button>
					</center>
				</div>
                <div className='form-input'>
                    <center>
                        Do you want to create new account? <a href='/register'>Register</a>
                    </center>
                </div>
			</form>
    	</div>
    )
    
}

export default Login;