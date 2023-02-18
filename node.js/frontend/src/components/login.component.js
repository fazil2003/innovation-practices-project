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

	function userLogin(){
		const parameters = { username: 'johndoe', password: 'johndoe' };
		axios.post(defaultVariables['backend-url'] + 'mongodb/login', parameters)
		.then(response => {
			// alert(response.data)
			if (response.data === 'success'){
				navigate("/register");
			}
			else{
				alert("Failed to login")
			}
		})
		.catch(error => {
			alert("Error.")
		});
	}
	
    return (
        <div className='container'>
			<div className='login-form'>
				<p className='heading'>Login</p>
				<div className='form-input'>
					<label>User ID / Email</label><br />
					<input type='text' placeholder='User ID / Email' />
				</div>
				<div className='form-input'>
					<label>Password</label><br />
					<input type='password' placeholder='User ID / Email' />
				</div>
				<div className='form-input'>
					<center>
						<button onClick={userLogin}>Login</button>
					</center>
				</div>
                <div className='form-input'>
                    <center>
                        Do you want to create new account? <a href='/register'>Register</a>
                    </center>
                </div>
			</div>
    	</div>
    )
    
}

export default Login;