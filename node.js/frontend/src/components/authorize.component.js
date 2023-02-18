import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
import Popup from './popups/shops.popup';

const Authorize = () => {

    const authorizeWithEtsy = () => {
        window.location.href = defaultVariables['backend-url'] + "etsy/request-code?email=" + localStorage.getItem('cookie_email');
    }

    return (
        <div className='container'>
            <div className='content'>
                <center>
                    You have not authorized with Etsy. Please kindly click the button below.
                    <br /><br />
                    <button onClick={authorizeWithEtsy}>Authorize with Etsy</button>
                </center>
			</div>
        </div>
    )
}

export default Authorize;