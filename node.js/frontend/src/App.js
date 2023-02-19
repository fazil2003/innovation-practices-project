import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import './App.css';
import Authorize from "./components/authorize.component";
import Home from "./components/home.component";
import Listings from "./components/listings.component";
import Login from './components/login.component';
import Register from "./components/register.component";

function App() {
	return (
		<Router>
			<div class="container">
				<Routes>
					<Route exact path="/" element={<Login/>} />
					<Route path="/login" element={<Login/>} />
					<Route path="/register" element={<Register/>} />
					<Route path="/authorize" element={<Authorize/>} />
					<Route path="/home" element={<Home/>} />
					<Route path="/listings/:shop_id" element={ <Listings/> } />
					<Route path="*" element={<Login/>} />
				</Routes>
			</div>
		</Router>
  	);
}

export default App;
