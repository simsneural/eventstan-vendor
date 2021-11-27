import React from 'react'
import {Link} from 'react-router-dom';
import {FiSearch} from  'react-icons/fi';
import {MdNotificationsNone} from 'react-icons/md';
import {BiDotsHorizontal} from 'react-icons/bi';
import "./dashboard.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { button } from '@material-ui/core';
import ExampleChart from "./charts";




class Dashboards extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            search : ""
        }
    }


    handleChange = (e) => {
        this.setState({search : e.target.value})
    }
    render(){
        return(
            <div className="dashboard">
                <div className="container">
                    <div className="row f-box-t" style={{backgroundColor : "#f6eae2" , margin : "30px 0px" , borderRadius : "8px"}}>
                        <div className="col-md-3">
                            <div className="t-box">
                                <p>Revenue generated</p>
                                <span>2300</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="t-box">
                                <p>Revenue generated</p>
                                <span>2300</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="t-box">
                                <p>Revenue generated</p>
                                <span>2300</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="t-box t-outbox">
                                <p>Revenue generated</p>
                                <span>2300</span>
                            </div>
                        </div>
                    </div>
                    <div className="chart-box" style={{marginBottom : "30px"}}>
                        <div className="left-chart-box">
                            <div className="grup-box" style={{boxShadow : "rgba(0, 0, 0, 0.1) 0px 2px 4px 0px" , padding : "30px" , marginBottom : "30px"}}>
                             <div style={{display:"flex" , alignItems : "center" , justifyContent : "space-between" , marginBottom : "20px"}}>
                                 <h4 style={{fontWeight : "bold" , color : "#000"}}> Revenue</h4>
                                 <p style={{fontWeight : "bold" , color : "#000"}}><span style={{color : "red"}}>+KD 45 (days)</span> KD 456</p>
                            </div>   
                            <ExampleChart />
                            </div>
                            <div className="">
                            <div className="right-ven-box" style={{boxShadow : "rgba(0, 0, 0, 0.1) 0px 2px 4px 0px" , border : "2px solid #eeeeee" , borderRadius : "8px"}}>
                                <div style={{display : "flex" , alignItems : "center" , justifyContent : "space-between" , padding : "20px 25px" , borderBottom : "2px solid #eeeeee"}}><h4>vendors</h4> <h4>34, 0000</h4></div>
                                <div className="right-tab-box" style={{ borderBottom : "2px solid #eeeeee"}}>
                                    <Tabs>
                                        <TabList>
                                        <Tab>pending <span>1</span></Tab>
                                        <Tab>Approved <span>2</span></Tab>
                                        <Tab>Rejected <span>4</span></Tab>
                                        </TabList>

                                        <TabPanel>
                                        <div style={{overflowX : "auto"}}>
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">VENDOR NAME</th>
                                                <th scope="col">LISTING</th>
                                                <th scope="col">SERVICE</th>
                                                <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                <th scope="row">1</th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                                <tr>
                                                <th scope="row">2</th>
                                                <td>Jacob</td>
                                                <td>Thornton</td>
                                                <td>@fat</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                                <tr>
                                                <th scope="row">3</th>
                                                <td>Larry</td>
                                                <td>the Bird</td>
                                                <td>@twitter</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        </TabPanel>
                                        <TabPanel>
                                        <div style={{overflowX : "auto"}}>
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">VENDOR NAME</th>
                                                <th scope="col">LISTING</th>
                                                <th scope="col">SERVICE</th>
                                                <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                <th scope="row">1</th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                                <tr>
                                                <th scope="row">2</th>
                                                <td>Jacob</td>
                                                <td>Thornton</td>
                                                <td>@fat</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                                <tr>
                                                <th scope="row">3</th>
                                                <td>Larry</td>
                                                <td>the Bird</td>
                                                <td>@twitter</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        </TabPanel>
                                        <TabPanel>
                                        <div style={{overflowX : "auto"}}>
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">VENDOR NAME</th>
                                                <th scope="col">LISTING</th>
                                                <th scope="col">SERVICE</th>
                                                <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                <th scope="row">1</th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                                <tr>
                                                <th scope="row">2</th>
                                                <td>Jacob</td>
                                                <td>Thornton</td>
                                                <td>@fat</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                                <tr>
                                                <th scope="row">3</th>
                                                <td>Larry</td>
                                                <td>the Bird</td>
                                                <td>@twitter</td>
                                                <td className="tab-btn"><button className="accept">Accept</button> <button className="cancel">Cancel</button></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </div>  
                        </div>
                        </div>
                        
                        <div className="right-chart-box">
                        <div className="left-ven-box" style={{boxShadow : "rgba(0, 0, 0, 0.1) 0px 2px 4px 0px"}}>
                                <div style={{display : "flex" , alignItems : "center" , justifyContent : "space-between" , padding : "20px 25px" , borderBottom : "2px solid #eeeeee"}}><h4>Vendors</h4> <h4>34, 0000</h4></div>
                                <div style={{overflowX : "auto"}}>
                                <table class="table table-striped">
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                <th scope="row">chris sanders</th>
                                                <td>Recently Joined</td>
                                                </tr>
                                                <tr>
                                                <th scope="row">chris sanders</th>
                                                <td>Recently Joined</td>
                                                </tr>
                                                <tr>
                                                <th scope="row">chris sanders</th>
                                                <td></td>
                                                </tr>
                                            </tbody>
                                            </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chart-box" style={{marginBottom : "30px"}}>
                       
                        <div className="col-md-3">
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Dashboards;