import React, { Component } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from "@material-ui/core";
import {
    AccessTime as AccessTimeIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
} from "@material-ui/icons";
import { API_BASE_TEST_URL } from './../../constant'

import Placeholder from "./placeholder";
import DeleteModal from "./delete";
import { ListingOuter } from "./style";

class Listing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            services: [],
            nonFilterableServices: [],
            hasSearchResult: true,
            openDeleteModal: false,
            serviceTobeDeleted: "",
            refreshparent: false,
            vendor_id:localStorage.getItem("vendor-id"),
        };
    }

    componentDidMount = () => {
        this.fetchServiceList();
    };

    static getDerivedStateFromProps = (props, state) => {
        return state;
    };
    
    DeleteService = (id) =>{
        axios
        .get(`${API_BASE_TEST_URL}deleteVendorService?vendorServiceId=${id}`)
        .then(response =>{
           
        })
        .catch(e =>{
            console.log('error' , e)
        })
    }
    EditService = (id) => {
        window.location.href = `/EditService/${id}`
        
    }

    fetchServiceList = () => { 
        this.setState({ loading: true });
        axios
            .get(`${API_BASE_TEST_URL}vendorServiceList?vendorId=${this.state.vendor_id}`)
            .then(response => {
             
                this.setState({
                    services: response.data.data.vendorServiceList,
                    nonFilterableServices: response.data.data.vendorServiceList
                });
            })
            .catch(error => {
                console.log(error);
            })
            .then(() => {
                this.setState({ loading: false });
            });
    };

    // search
    filterServiceList = searchTerm => {
      
        const timer = setTimeout(() => {
            axios.get(`${API_BASE_TEST_URL}vendorServiceList?search=${searchTerm}&vendorId=${this.state.vendor_id}`)
            .then(response =>{
                this.setState({
                    services: response.data.data.vendorServiceList,
                    nonFilterableServices: response.data.data.vendorServiceList
                });
            })
            .catch(e=>{
                console.log(e)
            })
          }, 1000);

    };

    handler(action) {
        window.location.reload();
    }

    render() {
        return (
            <>
                {this.state.loading && (
                    <div className="loaderOuter">
                        <CircularProgress />
                    </div>
                )}

                <ListingOuter className="listingOuter">
                    {!this.state.loading && (
                        <div className="listingHeader">
                            <h3>Listings</h3>
                            <div className="rightPart">
                                    <div className="search-container">
                                        <SearchIcon className="searchIcon" />
                                        <input
                                            placeholder="Search"
                                            type="text"
                                            onChange={value => this.filterServiceList(value.target.value)}
                                        />
                                    </div>
                                <Link to="/add" className="creta-btn">Create Service</Link>
                            </div>
                        </div>
                    )}
                    {this.state.services.length > 0 && (
                        <TableContainer component={Paper} className="listing-table-outer">
                            <Table aria-label="customized table" className="listing-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>NAME</TableCell>
                                        <TableCell>SERVICE</TableCell>
                                        <TableCell>TYPE</TableCell>
                                        <TableCell>LOCATION</TableCell>
                                        <TableCell>PHONE NUMBER</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.services.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell >{row.title || "-"}</TableCell>
                                            <TableCell>{row.serviceName || "-"}</TableCell>
                                            <TableCell>{row.status==0?'Public':'Private'}</TableCell>
                                            <TableCell>{row.location || "-"}</TableCell>
                                            <TableCell>{row.phoneNmuber || "-"}</TableCell>
                                            <TableCell align="right" style={{width: "125px"}}>
                                                <EditIcon role="button" onClick={() => this.EditService(row._id)} className="actionIcon" />
                                                <DeleteIcon
                                                    role="button"
                                                    className="actionIcon"
                                                    onClick={() => {
                                                        this.setState(() => {
                                                            return {
                                                                openDeleteModal: true,
                                                                serviceTobeDeleted: row._id,
                                                                refreshparentbychild:false
                                                            };
                                                        });
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </ListingOuter>
                <DeleteModal
                    refreshparentbychild={this.handler}
                    openDeleteModal={this.state.openDeleteModal}
                    closeDeleteModal={() => {
                        this.setState({ openDeleteModal: false, serviceTobeDeleted: "" });
                    }}
                    serviceTobeDeleted={this.state.serviceTobeDeleted}
                />
            </>
        );
    }
}

export default Listing;
