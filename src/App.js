// import { Grid } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import SideNavbar from "./components/SideNavbar";
// import TopNavbar from "./components/TopNavbar";
// import Listings from "./pages/Listings";
// import MyModal from "./components/MyModal";
// import CreateListing from "./components/CreateListing";
import React, { useState, useEffect } from "react";
import LeftPanel from "./components/left-panel";
import RightTopHeader from "./components/right-header";
import Dashboards from "./components/dashboard";
import Listings1 from "./components/listing";
import Listings from "./components/listing";
import Add from "./components/listing/add-edit";
import AddEditService from "./components/listing/EditService";
import "./App.css";
import { reducer as reduxFormReducer } from 'redux-form';
import UserContext from "./context/userContext";
import Login from "./components/Login";
import axios from "axios";
import { API_BASE_TEST_URL } from './constant';
/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxPromise from 'redux-promise';
const reducer = (state = {}, action) => {
    return {
        form: reduxFormReducer(state.form, action, state),
    };
};

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const store = createStoreWithMiddleware(reducer);

const App = ()=> {
    const [userData, setUserData] = useState({
        token: undefined,
        userName: undefined,
      });

      const checkLoggedIn = async () => {
        let token = localStorage.getItem("vend-auth-token");
        if (token === null) {
          localStorage.setItem("vend-auth-token", "");
          token = "";
        }
        else{
          const headers = {
            'Content-Type': 'application/json',
            'authorization': token
        };
        const data = {
          'token':token
        }
        axios
            .post(`${API_BASE_TEST_URL}vendorProfile`, data,{ headers })
            .then(response => {
              setUserData({
                token,
                userName:response.data.data[0].firstName,
                vendor_id:response.data.data[0]._id,
              });
            })
            .catch(error => {
                console.log('error', error);
            });
        }
    
        
      };
      useEffect(() => {
        checkLoggedIn();
      }, []);

    return (
        <Provider store={store}>
            <UserContext.Provider value={{ userData, setUserData }}>
            {userData.token ? (
            <Router>
                <LeftPanel />
                <div className="right-panel">
                    <RightTopHeader />
                    <div className="right-bottom">
                        <Switch>
                            <Route exact path="/" component={Dashboards} />
                            <Route path="/listing" component={Listings} />
                            <Route path="/add" component={Add} />
                            <Route path="/EditService/:vendorServiceId" component={AddEditService} />
                        </Switch>
                    </div>
                </div>
            </Router>
            ) : (
                <Login />
              )}
            </UserContext.Provider>
        </Provider>
        
    );
}

export default App;
