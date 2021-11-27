import React, { Component } from "react";
import axios from "axios";
import { Field } from "redux-form";
import Select from "react-select";
import {filter, indexOf,findIndex} from 'lodash';
import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
	CircularProgress,
	Checkbox,
	FormControlLabel,
	DialogActions
} from "@material-ui/core";
import { API_BASE_TEST_URL } from './../../constant'
import { renderTextField, renderDropdown, renderRadio } from '../../ui/form-elements';

import styled from "styled-components";

const LinkServiceContainer = styled.div`
	.form-row{
		padding-bottom: 16px;
		float:left;
		width: 100%;
		button{
			width:50%;
			border: 1px solid rgba(0,0,0,0.12);
			border-radius: 2px 0 0 2px;
			background-color: #F8F8F8;
			text-transform: capitalize;
			&.active{
				border: 1px solid rgba(248,122,37,0.94);
				background-color: rgba(248,122,37,0.06);
				color: #F87A25;
			}
		}
		.MuiFormControlLabel-root{
			width: 100%;
			margin:0;
		}
	}
`;

const ActionButton = styled(DialogActions)`
	button{
		border-radius: 2px;
		background-color: #8489B2;
		width: 100%; 
		border-radius: 2px;
		background-color: #8489B2 !important;
		margin-top: 25px;
		color: #fff;
		font-family: "camptonsemibold";
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 18px;
		text-align: center;
		padding: 15px;
		&:disabled{
			opacity: 0.5;color: #fff;
		}
	}
`;


const CloseIcon = styled.span`
	position: absolute;
	right: -9px;
	top: -9px;
	cursor: pointer;
`;


class LinkServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
			loading: false,
			vendorList: [],
			selectedListing: '',
			selectedStatus: '',
			selectedServices: []
        };
    }

    componentDidMount = () => {
        this.fetchVendorList();
	};
	
	fetchVendorList = () => {
		this.setState({ loading: true });
        axios
            .get(`${API_BASE_TEST_URL}vendorList?vendorId=1`)
            .then(response => {
                this.setState({
                    vendorList: response.data.data.vendorServiceList
                });
            })
            .catch(error => {
                console.log(error);
            })
            .then(() => {
                this.setState({ loading: false });
            });
	};

	required = (value) => value ? undefined : 'Required';

	renderVendorList = () =>{
		const checkboxes = [];
		const abc = filter(this.state.vendorList, vendor=>{
			return (vendor.serviceId._id.toString() === this.state.selectedListing.toString()) && (vendor.status.toString() === this.state.selectedStatus);
		});
		abc.forEach(vendor =>{
			checkboxes.push(<FormControlLabel
				control={
					<Checkbox
						checked={findIndex(this.state.selectedServices,function(o) { return o._id === vendor._id; }) !== -1}
						onChange={()=>{
							if(findIndex(this.state.selectedServices,function(o) { return o._id === vendor._id; }) !== -1){
								const index = findIndex(this.state.selectedServices,function(o) { return o._id === vendor._id; });
								this.state.selectedServices.splice(index, index+1);
							} else {
								this.state.selectedServices.push({_id:vendor._id, isCompulsory: false, title: vendor.title,type: vendor.status === 1 ? 'Private': 'Public'});
							}
							this.forceUpdate();
						}}
						name="checkedB"
						color="primary"
					/>
				}
				label={vendor.title}
			/>
			);
		});
		return checkboxes;
	}


    render() {
		console.log('service' , this.props.serviceTypes)
        return (
            <>
                {this.state.loading && (
                    <div className="loaderOuter">
                        <CircularProgress />
                    </div>
                )}
				<Dialog
					open={this.props.open}
					aria-labelledby={this.props.labelledby}
					aria-describedby={this.props.describedby}
					maxWidth={'md'}
					PaperProps={{
						style:{
							width:'411px',
							padding: '32px 24px',
							overflowY: 'visible'
					}}}
				>
					<CloseIcon className="closeIcon" onClick={this.props.close}>X</CloseIcon>
					<DialogTitle id={this.props.labelledby}>Link Service With</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<LinkServiceContainer>
							<div className="form-row">
									<Button onClick={()=>{this.setState({selectedStatus: "0"})}} className={this.state.selectedStatus === "0" ? 'active' : ''}>Public</Button>
									<Button onClick={()=>{this.setState({selectedStatus: "1"})}} className={this.state.selectedStatus === "1" ? 'active' : ''}>Private</Button>
								</div>
								<div className="form-row">
								{/* <Select
                                        options={this.props.serviceTypes.map((option , index) => {
                                        return { label: option, value: option };
                                        })}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        isMulti
                                        // onChange={(e) => this.filterChange(this.getmultiSelect(e) , infiler.type , i , infiler._id , "multiSelect")}
                                        /> */}
									<Field
										name={`listingtype`}
										component={renderDropdown}
										required
										label={"Listing"}
										validate={[this.required]}
										options={this.props.serviceTypes}
										onChange={(value)=>{
											console.log('value',value.target.value);
											this.setState({selectedListing:value.target.value})
										}}
									/>
								</div>
								
								<div className="form-row">
									{this.renderVendorList()}
								</div>
							</LinkServiceContainer>
							
						</DialogContentText>
					</DialogContent>
					<ActionButton className="action">
						<Button 
							// disabled={!this.state.selectedListing || !this.state.selectedStatus || !this.state.selectedServices.length} 
							onClick={()=>{this.props.setLinkedServices(this.state.selectedServices)}}
						>
							Save
						</Button>
					</ActionButton>
				</Dialog>
            </>
        );
    }
}

export default LinkServices;
