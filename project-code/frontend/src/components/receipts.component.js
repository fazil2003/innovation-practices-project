import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
import Popup from './popups/shops.popup';


const Receipt = (props) => (
    // class="content-list"

    <tr title={props.receipt.name}>
        <td>{props.receipt.isProcessed + ''}</td>
        <td>{props.receipt.receipt_id}</td>
        <td>{props.receipt.receipt_type}</td>
        <td>{props.receipt.seller_user_id}</td>
        <td>{props.receipt.seller_email}</td>
        <td>{props.receipt.buyer_user_id}</td>
        <td>{props.receipt.buyer_email}</td>
        <td>{props.receipt.name}</td>
        <td>{props.receipt.first_line}</td>
        <td>{props.receipt.second_line}</td>
        <td>{props.receipt.city}</td>
        <td>{props.receipt.state}</td>
        <td>{props.receipt.zip}</td>
        <td>{props.receipt.status}</td>
        <td>{props.receipt.formatted_address}</td>
        <td>{props.receipt.country_iso}</td>
        <td>{props.receipt.payment_method}</td>
        <td>{props.receipt.payment_email}</td>
        <td>{props.receipt.message_from_payment}</td>
        <td>{props.receipt.message_from_seller}</td>
        <td>{props.receipt.message_from_buyer}</td>
        <td>{props.receipt.is_shipped.toString()}</td>
        <td>{props.receipt.is_paid.toString()}</td>
        <td><TimeComponent timestamp={props.receipt.create_timestamp} /></td>
        <td><TimeComponent timestamp={props.receipt.created_timestamp} /></td>
        <td><TimeComponent timestamp={props.receipt.update_timestamp} /></td>
        <td><TimeComponent timestamp={props.receipt.updated_timestamp} /></td>
        <td>{props.receipt.is_gift.toString()}</td>
        <td>{props.receipt.gift_message}</td>
        <td><PriceComponent amount={props.receipt.grandtotal.amount} divisor={props.receipt.grandtotal.divisor} currency_code={props.receipt.grandtotal.currency_code} /></td>
        <td><PriceComponent amount={props.receipt.subtotal.amount} divisor={props.receipt.subtotal.divisor} currency_code={props.receipt.subtotal.currency_code} /></td>
        <td><PriceComponent amount={props.receipt.total_price.amount} divisor={props.receipt.total_price.divisor} currency_code={props.receipt.total_price.currency_code} /></td>
        <td><PriceComponent amount={props.receipt.total_shipping_cost.amount} divisor={props.receipt.total_shipping_cost.divisor} currency_code={props.receipt.total_shipping_cost.currency_code} /></td>
        <td><PriceComponent amount={props.receipt.total_tax_cost.amount} divisor={props.receipt.total_tax_cost.divisor} currency_code={props.receipt.total_tax_cost.currency_code} /></td>
        <td><PriceComponent amount={props.receipt.total_vat_cost.amount} divisor={props.receipt.total_vat_cost.divisor} currency_code={props.receipt.total_vat_cost.currency_code} /></td>
        <td><PriceComponent amount={props.receipt.discount_amt.amount} divisor={props.receipt.discount_amt.divisor} currency_code={props.receipt.discount_amt.currency_code} /></td>
        <td><PriceComponent amount={props.receipt.gift_wrap_price.amount} divisor={props.receipt.gift_wrap_price.divisor} currency_code={props.receipt.gift_wrap_price.currency_code} /></td>
    </tr>
)

function TimeComponent(props){
    var time = props.timestamp;
    var date = new Date(time);
    return <span> { date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() } </span>
}

function PriceComponent(props){

    var currencySymbols = {
        'USD': '$', // US Dollar
        'EUR': '€', // Euro
        'CRC': '₡', // Costa Rican Colón
        'GBP': '£', // British Pound Sterling
        'ILS': '₪', // Israeli New Sheqel
        'INR': '₹', // Indian Rupee
        'JPY': '¥', // Japanese Yen
        'KRW': '₩', // South Korean Won
        'NGN': '₦', // Nigerian Naira
        'PHP': '₱', // Philippine Peso
        'PLN': 'zł', // Polish Zloty
        'PYG': '₲', // Paraguayan Guarani
        'THB': '฿', // Thai Baht
        'UAH': '₴', // Ukrainian Hryvnia
        'VND': '₫', // Vietnamese Dong
    };

    var amount = props.amount;
    var divisor = props.divisor;
    var currency_code = props.currency_code;
    var s = currencySymbols[currency_code] + (amount/divisor).toString();
    return <div>
                <span> { s } </span>
            </div>
}

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
        const res = axios.get(defaultVariables['backend-url'] + 'mongodb/receipts/get/?shop_id='+ shop_id +'&q=' + query);
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
            <>
                {
                    result.slice(0, size).map(currentReceipt => {
                        
                        let isProcessed = false;
                        // if(currentReceipt.created_timestamp < lastEpochTime){
                        //     isProcessed = true;
                        // }
                        // else{
                        //     // Insert the receipts into the database.
                        //     const tokenParameters = {
                        //         receipt_id: currentReceipt.receipt_id,
                        //         created_timestamp: currentReceipt.created_timestamp,
                        //         updated_timestamp: currentReceipt.updated_timestamp,
                        //         shop_id: shop_id,
                        //         is_processed: isProcessed
                        //     };

                        //     var modifiedReceipt = currentReceipt;
                        //     modifiedReceipt['isProcessed'] = true;

                        //     axios.post(defaultVariables['backend-url'] + 'mongodb/receipts/insert', modifiedReceipt)
                        //     .then(response4 => {})
                        //     .catch(error => {});
                        // }

                        return <Receipt
                                    receipt = {currentReceipt}
                                    value = {query}
                                    isProcessed = {isProcessed}
                                />;
                    })
                }
            </>
        )
    }

    const getReceiptsFromEtsy = () => {
        axios.get(defaultVariables['backend-url'] + 'etsy/retrieve-receipts/?shop_id='+ shop_id +'&q=' + query)
        .then(response => {
			alert(response.data)
		})
		.catch(error => {
			alert("Error.")
		});
    }

    return (
        <div className='container'>
            <div className='content'>
                <div style={{ display: 'flex' }} >
                    <p className='heading' style={{ flex: 2 }}>All Receipts</p>
                    <button className='btn' onClick = { () => { getReceiptsFromEtsy() } } >Retrieve Data</button>
                </div>
                
                <div className='scroll-div'>

                    <table className='receipts-table'>

                    <tr>
                        <th>Is Processed?</th>
                        <th>Receipt ID</th>
                        <th>Receipt Type</th>
                        <th>Seller User ID</th>
                        <th>Seller Email</th>
                        <th>Buyer User ID</th>
                        <th>Buyer Email</th>
                        <th>Name</th>
                        <th>First Line</th>
                        <th>Second Line</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Zip</th>
                        <th>Status</th>
                        <th>Formatted Address</th>
                        <th>Country ISO</th>
                        <th>Payment Method</th>
                        <th>Payment Email</th>
                        <th>Message from payment</th>
                        <th>Message from seller</th>
                        <th>Message from buyer</th>
                        <th>Is shipped?</th>
                        <th>Is paid?</th>
                        <th>Create Timestamp</th>
                        <th>Created Timestamp</th>
                        <th>Update Timestamp</th>
                        <th>Updated Timestamp</th>
                        <th>Is gift?</th>
                        <th>Gift message</th>
                        <th>Grandtotal amount</th>
                        <th>Subtotal amount</th>
                        <th>Total price</th>
                        <th>Total Shipping Cost</th>
                        <th>Total Tax Cost</th>
                        <th>Total VAT Cost</th>
                        <th>Discount amount</th>
                        <th>Gift wrap price</th>
                    </tr>

                    { fetchReceipts() }

                    </table>

                </div>
                
			</div>
        </div>
    )
}

export default Receipts;