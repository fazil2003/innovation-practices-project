import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import Popup from 'reactjs-popup';
// import './components-styles/products.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBox, faAdd, faFileCode, faGear, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons'

const Login = () =>{

    return (
        <div className='container'>
			<form className='login-form'>
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