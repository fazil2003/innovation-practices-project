import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';


const Shop = (props) => (
    <div class="content-list" title={props.shop.shop_name}>
        <img className='flex-one' src={process.env.PUBLIC_URL + '/images/icon-shop.png'} />
        <p className='name flex-three'>{props.shop.shop_name}</p>
        <p className='owner flex-three'>{props.shop.shop_owner}</p>
        <p className='date flex-three'>{props.shop.last_synched}</p>
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
        const res = axios.get(defaultVariables['backend-url'] + 'mongodb/shops/get/?q=' + query);
        return res;
    }

    getData().then(response => setResult(response.data));

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
                    <button>Add Shop</button>
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