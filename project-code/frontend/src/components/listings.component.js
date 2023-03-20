import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
import Popup from './popups/shops.popup';


const Listing = (props) => (
    <div class="content-list" title={props.listing.title}>
        <p className='flex-one'>{props.listing.listing_id}</p>
        <p className='flex-one name'>{props.listing.title}</p>
        <p className='flex-one'>{props.listing.description}</p>
        <p className='flex-one date'>{props.listing.state}</p>
    </div>
)

const Listings = (props) => {

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
        const res = axios.get(defaultVariables['backend-url'] + 'etsy/retrieve-data/?shop_id='+ shop_id +'&q=' + query);
        return res;
    }

    // UseEffect to avoid Axios to fetch the data continuously.
    useEffect(() => {
        const dataTimer = setInterval(() => {
            getData().then(response => setResult(response.data));
        }, 1000);
        return () => clearInterval(dataTimer);
    });

    const fetchListings = () =>{
        let size = result.length;
        return (
            <div>
                {
                    result.slice(0, size).map(currentListing => {
                        return <Listing
                                    listing = {currentListing}
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
                    <p className='heading'>Listings</p>
                </div>
                <div>
                { fetchListings() }
                </div>
			</div>
        </div>
    )
}

export default Listings;