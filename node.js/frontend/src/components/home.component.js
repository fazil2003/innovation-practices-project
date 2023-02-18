import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
import Popup from './popups/shops.popup';


const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(dateString).toLocaleDateString(undefined, options)
}

const timeDifference = (date) => {
    let curr = new Date();
    let seconds = Math.abs(new Date(date).getTime() - curr.getTime()) / 1000;
    // return seconds;
    alert(seconds);
}

const Shop = (props) => (
    <div class="content-list" title={props.shop.shop_name}>
        <img className='flex-one' src={process.env.PUBLIC_URL + '/images/icon-shop.png'} />
        <p className='name flex-three'>{props.shop.shop_name}</p>
        <p className='owner flex-three'>{props.shop.shop_owner}</p>
        <p className='date flex-three'>{ formatDate(props.shop.last_synched) }</p>
        <p className='flex-three'>
            <button onClick={() => timeDifference(props.shop.last_synched)}>Get</button>
        </p>
        {/* <p class="name flex-three">{props.product.name}</p>
        <p class="description flex-three">{props.product.description}</p>
        <p class="price flex-one">{props.product.price}</p>
        <p class="stocks flex-one">{props.product.stocks}</p>
        <FontAwesomeIcon icon={faEdit} className="icon blue" onClick={ (event) =>
            editProduct(
                props.product._id,
                props.product.name,
                props.product.description,
                props.product.price,
                props.product.stocks,
                props.setProductID,
                props.setProductName,
                props.setProductDescription,
                props.setProductPrice,
                props.setProductStocks,
                props.setButtonPopup
                )
            }
        />
        <FontAwesomeIcon icon={faDeleteLeft} className="icon red" onClick={ (event) => deleteProduct(event, props.product._id) } /> */}
    </div>
)


const Home = () => {

    // Used for Searching
    const [query, setQuery] = useState("");

    // Store the Results
    const [result, setResult] = useState([]);

    // Used for Popup
    const [buttonPopup, setButtonPopup] = useState(false);

    // For Updating the Shops
    const [shopID, setShopID] = useState(0);
    const [shopName, setShopName] = useState("");
    const [shopOwner, setShopOwner] = useState("");
    const [lastSynched, setLastSynched] = useState("");


    const getData = () =>{
        const res = axios.get(defaultVariables['backend-url'] + 'mongodb/shops/get/?shop_owner=' + localStorage.getItem("cookie_username") + '&q=' + query);
        return res;
    }

    getData().then(response => setResult(response.data));

    const addNewShop = (event) => {

        event.preventDefault();

        const parameters = { userEmail: localStorage.getItem("cookie_email"), shop: event.target[0].value };
        const res = axios.post(defaultVariables['backend-url'] + 'etsy/get-shop-details/', parameters)
        .then(response => {
            if(response.data != "0"){
                const parametersShopDetails = { shop_id: response.data, shop_name: event.target[0].value, shop_owner: localStorage.getItem("cookie_username") };
                const res2 = axios.post(defaultVariables['backend-url'] + 'mongodb/shops/insert', parametersShopDetails)
                .then(response2 => {
                    alert("Shop added successfully.");
                    setShopName("");
                })
                .catch(error2 => {
                    alert("Failed to add the shop.");
                });
                // alert(response.data)
            }
            else{
                alert("Invalid shop name.");
            }
            
		})
		.catch(error => {
			alert("Error.")
		});

        setButtonPopup(false);
        return res;
    }

    const shopsList = () =>{
        let size = result.length;
        return (
            <div>
                {
                    result.slice(0, size).map(currentShop => {
                        return <Shop
                                    shop = {currentShop}
                                    value = {query}
                                    setButtonPopup = {setButtonPopup}
                                    setShopID = {setShopID}
                                    setShopName = {setShopName}
                                    setShopOwner = {setShopOwner}
                                />;
                    })
                }
            </div>
        )
        // return this.state.result.slice(0, size).map(currentProduct => {
        //     return <Product product={currentProduct} value={this.state.val} />;
        // })
    }


    return (
        <div className='container'>
            <div className='content'>
                <div style={{ display: 'flex' }} >
                    <p className='heading' style={{ flex: 2 }}>All Shops</p>
                    <button onClick = { () => {
                            setButtonPopup(true);
                            setShopName("");
                            }
                        }
                        >Add Shop</button>
                </div>

                <div>
                    <Popup trigger={buttonPopup} setTrigger={setButtonPopup} >
                        <center>
                            <p className='heading'>Add Shop</p>
                            
                            <form onSubmit={addNewShop}>

                                <p className='label'>Shop Name:</p>
                                <input className='text-field' type='text' placeholder='Shop Name' defaultValue={shopName} required />
                                <br /><br />

                                {/* <p className='label'>Product Description:</p>
                                <input className='text-field' type='text' placeholder='Product Description' defaultValue={productDescription} required />

                                <p className='label'>Product Price:</p>
                                <input className='text-field' type='number' placeholder='Product Price' defaultValue={productPrice} required />

                                <p className='label'>Product Stocks:</p>
                                <input className='text-field' type='number' placeholder='Product Stocks' defaultValue={productStocks} required /> */}

                                <button className='button'>Add/Update</button>

                            </form>

                        </center>
                    </Popup>
                </div>

                <div style={{ paddingLeft: '24px', paddingRight: '24px', display: 'flex', marginBottom: '-10px', textAlign: 'left'}}>
                    <p className='flex-one'>Icon</p>
                    <p className='flex-three'>Shop name</p>
                    <p className='flex-three'>Owner</p>
                    <p className='flex-three'>Last synched</p>
                    <p className='flex-three'>Listings</p>
                </div>

                <div>
                { shopsList() }
                </div>
				{/* <div className='form-input'>
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
                </div> */}
			</div>
        </div>
    )
}

export default Home;