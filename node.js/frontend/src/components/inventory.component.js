import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from 'react-dom';
import axios from 'axios';
import defaultVariables from '../variables/variables';
import Popup from './popups/shops.popup';

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(dateString).toLocaleDateString(undefined, options)
}

const Inventory = (props) => (
    <div class="content-list" title={props.inventory.full_name}>
        <img className='flex-one' src={process.env.PUBLIC_URL + '/images/icon-shop.png'} />
        <p className='name flex-three'>{props.inventory.unique_name}</p>
        <p className='owner flex-three'>{props.inventory.full_name}</p>
        <p className='date flex-three'>{ props.inventory.stocks.toString() }</p>
        <p className='date flex-three'>{ formatDate(props.inventory.last_updated) }</p>

        <p className='flex-two'>
            <button className='btn-transparent' onClick={() => 

                // alert(props.inventory.full_name)

                editInventory(
                    props.inventory._id,
                    props.inventory.unique_name,
                    props.inventory.full_name,
                    props.inventory.stocks,
                    props.setInventoryID,
                    props.setUniqueName,
                    props.setFullName,
                    props.setStocks,
                    props.setButtonPopup
                )

            }>Edit</button>
        </p>
        <p className='flex-two'>
            <button className='btn-transparent' onClick={(event) => {
                deleteInventory(event, props.inventory._id)
            }}>Delete</button>
        </p>

        {/* <p className='flex-three'>
            <button onClick={() => viewListings(props.navigate, props.shop.shop_id, props.shop.last_epoch_time)}>Get</button>
        </p> */}
        
    </div>
)


const deleteInventory = (event, inventoryID) => {
    event.preventDefault();

    const parameters = {
        inventory_id: inventoryID
    };

    axios.post(defaultVariables['backend-url'] + 'inventory/delete/', parameters)
    .then(response => {
        alert("Inventory deleted successfully.");
    })
    .catch(error => {
        alert("Error.")
    });
}

const editInventory = (id, uniqueName, fullName, stocks, setInventoryID, setUniqueName, setFullName, setStocks, setButtonPopup) => {
    setInventoryID(id);
    setUniqueName(uniqueName);
    setFullName(fullName);
    setStocks(stocks);
    setButtonPopup(true);
}


const Inventories = () => {

    // Used for Searching
    const [query, setQuery] = useState("");

    // Store the Results
    const [result, setResult] = useState([]);

    // Used for Popup
    const [buttonPopup, setButtonPopup] = useState(false);

    // For Updating the Shops
    const [inventoryID, setInventoryID] = useState(0);
    const [shopID, setShopID] = useState(0);
    const [uniqueName, setUniqueName] = useState("");
    const [fullName, setFullName] = useState("");
    const [stocks, setStocks] = useState(0);
    const [lastUpdated, setLastUpdated] = useState("");

    const navigate = useNavigate();

    let { shop_id } = useParams();

    const getData = () =>{
        const res = axios.get(defaultVariables['backend-url'] + 'inventory/get/?shop_id=' + shop_id + '&q=' + query);
        return res;
    }

    // UseEffect to avoid Axios to fetch the data continuously.
    useEffect(() => {
        const dataTimer = setInterval(() => {
            getData().then(response => setResult(response.data));
        }, 1000);
        return () => clearInterval(dataTimer);
    });

    const addNewInventory = (event) => {

        event.preventDefault();

        const parameters = {
            inventory_id: inventoryID,
            shop_id: shop_id,
            unique_name: event.target[0].value,
            full_name: event.target[1].value,
            stocks: event.target[2].value
        };
        const res = axios.post(defaultVariables['backend-url'] + 'inventory/insert/', parameters)
        .then(response => {
            alert("Inventory added/updated successfully.");
		})
		.catch(error => {
			alert("Error.")
		});

        setButtonPopup(false);
        return res;
    }

    const inventoriesList = () =>{
        let size = result.length;
        return (
            <div>
                {
                    result.slice(0, size).map(currentInventory => {
                        return <Inventory
                                    inventory = {currentInventory}
                                    value = {query}
                                    navigate = {navigate}
                                    setButtonPopup = {setButtonPopup}
                                    setInventoryID = {setInventoryID}
                                    setUniqueName = {setUniqueName}
                                    setFullName = {setFullName}
                                    setStocks = {setStocks}
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
                    <p className='heading' style={{ flex: 2 }}>All Inventories</p>
                    <button className='btn' onClick = { () => {
                            setInventoryID(0);
                            setButtonPopup(true);
                            setUniqueName("");
                            setFullName("");
                            setStocks(0);
                            }
                        }
                        >Add Inventory</button>
                </div>

                <div>
                    <Popup trigger={buttonPopup} setTrigger={setButtonPopup} >
                        <center>
                            <p className='heading'>Add Inventory</p>
                            
                            <form onSubmit={addNewInventory}>

                                <p className='label'>Unique Name:</p>
                                <input className='text-field' type='text' placeholder='Unique Name' defaultValue={uniqueName} required />
                                <br />

                                <p className='label'>Full Name:</p>
                                <input className='text-field' type='text' placeholder='Full Name' defaultValue={fullName} required />
                                <br />

                                <p className='label'>Stocks:</p>
                                <input className='text-field' type='number' placeholder='Stocks' defaultValue={stocks} required />
                                <br /><br />

                                <button className='btn'>Add/Update</button>

                            </form>

                        </center>
                    </Popup>
                </div>

                <div style={{ paddingLeft: '24px', paddingRight: '24px', display: 'flex', marginBottom: '-10px', textAlign: 'left'}}>
                    <p className='flex-one'>Icon</p>
                    <p className='flex-three'>Full Name</p>
                    <p className='flex-three'>Unique Name</p>
                    <p className='flex-three'>Stocks</p>
                    <p className='flex-three'>Last updated</p>
                    <p className='flex-two'>Edit</p>
                    <p className='flex-two'>Delete</p>
                </div>

                <div>
                { inventoriesList() }
                </div>
			
			</div>
        </div>
    )
}

export default Inventories;