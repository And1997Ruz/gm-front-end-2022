import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import axios from "axios";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";

import { loadCategories } from "./store/reducers/categoriesSlice";
import { loadItems } from "./store/reducers/itemsSlice";
import { loadUsers } from "./store/reducers/usersSlice";
import { setCurrentUser } from "./store/reducers/currentUserSlice";

import NewItemForm from "./components/NewItemForm";
import EditItemForm from "./components/EditItemForm";
import EditUserForm from "./components/EditUserForm";
import HomePage from "./components/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import Register from "./components/Register";
import Login from "./components/Login";
import ItemPage from "./components/ItemPage";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";
import { Token } from "./types";
import ProfilePage from "./components/ProfilePage";
import AboutDev from "./components/AboutDev";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;

  //Load initial data from the server
  useEffect(() => {
    async function getData() {
      try {
        const categories = await axios.get(`${baseUrl}/api/categories`);
        const items = await axios.get(`${baseUrl}/api/items`);
        const users = await axios.get(`${baseUrl}/api/users`);
        dispatch(loadCategories(categories.data));
        dispatch(loadItems(items.data));
        dispatch(loadUsers(users.data));
        const token = localStorage.getItem("jwt");
        if (token) {
          const user: Token = jwtDecode(token);
          dispatch(setCurrentUser(user._id));
        }
      } catch (error: any) {
        console.log(error.message);
      }
      setIsLoading(false);
    }
    getData();
  }, [dispatch, baseUrl]);

  return (
    <div className="App">
      {isLoading ? (
        <div className="loading_wrapper">
          <PulseLoader
            speedMultiplier={0.5}
            color="#BDB8B8"
            loading={isLoading}
            margin={10}
          />
        </div>
      ) : (
        <div className="main">
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/new-item" element={<NewItemForm />} />
              <Route path="/item/:id" element={<ItemPage />} />
              <Route path="/item/edit/:id" element={<EditItemForm />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditUserForm />} />
              <Route path="/aboutDev" element={<AboutDev />} />
              <Route path="" element={<Footer />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
