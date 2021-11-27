import React, { Component } from "react";
import axios from "axios";
import { API_BASE_TEST_URL } from './../../constant'

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress
} from "@material-ui/core";

class DeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false
        };
    }
    deleteService = serviceTobeDeleted => {
        this.setState({ loading: true });
        axios
            .get(`${API_BASE_TEST_URL}deleteVendorService?vendorServiceId=${serviceTobeDeleted}`)
            .then(response => {
                console.log('asdf', response)
                if (response.status && response.status === 200) {
                    this.setState({ loading: false });
                    this.props.closeDeleteModal();
                    this.props.refreshparentbychild(true)
                } 
                else {
                    this.setState({ loading: false, error: true });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ loading: false, error: true });
            });
    };
    render() {
        const { refreshparentbychild, openDeleteModal, closeDeleteModal, serviceTobeDeleted } = this.props;
        // console.log(refreshparentbychild)
        // console.log(serviceTobeDeleted)
        return (
            <Dialog
                open={openDeleteModal}
                // onClose={closeDeleteModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {this.state.loading && (
                    <div className="loaderOuter">
                        <CircularProgress />
                    </div>
                )}
                <DialogTitle id="alert-dialog-title">{this.state.error ? "Went wrong." : "Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.error
                            ? "Something went wrong. Please try again."
                            : "You want to delete this service?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {this.state.error ? (
                        <Button
                            onClick={() => {
                                window.location.reload(true);
                            }}
                            color="primary"
                        >
                            Ok
                        </Button>
                    ) : (
                        <>
                            <Button onClick={closeDeleteModal} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => this.deleteService(serviceTobeDeleted)} color="primary">
                                Yes
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        );
    }
}

export default DeleteModal;
