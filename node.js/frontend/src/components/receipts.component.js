import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
import Popup from './popups/shops.popup';


const Receipt = (props) => (
    <div class="content-list" title={props.receipt.name}>
        <p className='flex-one'>{props.receipt.receipt_id}</p>
        <p className='flex-one name'>{props.receipt.seller_email}</p>
        <p className='flex-one'>{props.receipt.buyer_email}</p>
        <p className='flex-one date'>{props.receipt.name}</p>
    </div>
)

const Receipts = (props) => {

    // Used for Searching
    const [query, setQuery] = useState("");

    // Store the Results
    const [result, setResult] = useState([]);

    // Used for Popup
    const [buttonPopup, setButtonPopup] = useState(false);

    // For Updating the Shops
    const [shopName, setShopName] = useState("");
    const [shopOwner, setShopOwner] = useState("");
    const [lastSynched, setLastSynched] = useState("");

    let { shop_id } = useParams();

    const getData = () =>{
        // let url = defaultVariables['backend-url'] + 'etsy/retrieve-data/?email=' + localStorage.getItem("cookie_email") + '&shop_id='+ shop_id +'&q=' + query;
        // alert(url);
        const res = axios.get(defaultVariables['backend-url'] + 'etsy/retrieve-receipts/?shop_id='+ shop_id +'&q=' + query);
        return res;
    }

    // UseEffect to avoid Axios to fetch the data continuously.
    useEffect(() => {
        const dataTimer = setInterval(() => {
            getData().then(response => setResult(response.data));
        }, 1000);
        return () => clearInterval(dataTimer);
    });

    const fetchReceipts = () =>{
        let size = result.length;
        return (
            <div>
                {
                    result.slice(0, size).map(currentReceipt => {
                        return <Receipt
                                    receipt = {currentReceipt}
                                    value = {query}
                                />;
                    })
                }
            </div>
        )
    }

    return (
        <div className='container'>
            <div className='content'>
                <div style={{ display: 'flex' }} >
                    <p className='heading'>Receipts</p>
                </div>
                <div>
                { fetchReceipts() }
                </div>
			</div>
        </div>
    )
}

export default Receipts;