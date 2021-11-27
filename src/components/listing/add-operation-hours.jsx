import React, { Component } from "react";
import { renderDropdown } from '../../ui/form-elements';
import { findIndex } from 'lodash';
import moment from 'moment';
import { reduxForm, formValueSelector, Field } from 'redux-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress
} from "@material-ui/core";

const timeSlots = [
    { value: "12.00 AM", label: "12.00 AM" },
    { value: "12.30 AM", label: "12.30 AM" },
    { value: "01:00 AM", label: "01:00 AM" },
    { value: "01:30 AM", label: "01:30 AM" },
    { value: "02:00 AM", label: "02:00 AM" },
    { value: "02:30 AM", label: "02:30 AM" },
    { value: "03:00 AM", label: "03:00 AM" },
    { value: "03:30 AM", label: "03:30 AM" },
    { value: "04:00 AM", label: "04:00 AM" },
    { value: "04:30 AM", label: "04:30 AM" },
    { value: "05:00 AM", label: "05:00 AM" },
    { value: "05:30 AM", label: "05:30 AM" },
    { value: "06:00 AM", label: "06:00 AM" },
    { value: "06:30 AM", label: "06:30 AM" },
    { value: "07:00 AM", label: "07:00 AM" },
    { value: "07:30 AM", label: "07:30 AM" },
    { value: "08:00 AM", label: "08:00 AM" },
    { value: "08:30 AM", label: "08:30 AM" },
    { value: "09:00 AM", label: "09:00 AM" },
    { value: "09:30 AM", label: "09:30 AM" },
    { value: "10:00 AM", label: "10:00 AM" },
    { value: "10:30 AM", label: "10:30 AM" },
    { value: "11:00 AM", label: "11:00 AM" },
    { value: "11:30 AM", label: "11:30 AM" },
    { value: "12:00 PM", label: "12:00 PM" },
    { value: "12:30 PM", label: "12:30 PM" },
    { value: "01:00 PM", label: "01:00 PM" },
    { value: "01:30 PM", label: "01:30 PM" },
    { value: "02:00 PM", label: "02:00 PM" },
    { value: "02:30 PM", label: "02:30 PM" },
    { value: "03:00 PM", label: "03:00 PM" },
    { value: "03:30 PM", label: "03:30 PM" },
    { value: "04:00 PM", label: "04:00 PM" },
    { value: "04:30 PM", label: "04:30 PM" },
    { value: "05:00 PM", label: "05:00 PM" },
    { value: "05:30 PM", label: "05:30 PM" },
    { value: "06:00 PM", label: "06:00 PM" },
    { value: "06:30 PM", label: "06:30 PM" },
    { value: "07:00 PM", label: "07:00 PM" },
    { value: "07:30 PM", label: "07:30 PM" },
    { value: "08:00 PM", label: "08:00 PM" },
    { value: "08:30 PM", label: "08:30 PM" },
    { value: "09:00 PM", label: "09:00 PM" },
    { value: "09:30 PM", label: "09:30 PM" },
    { value: "10:00 PM", label: "10:00 PM" },
    { value: "10:30 PM", label: "10:30 PM" },
    { value: "11:00 PM", label: "11:00 PM" },
    { value: "11:30 PM", label: "11:30 PM" }
];

const days = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" }
];

const reverseDayKey = {
    'Monday': 'mon',
    'Tuesday': 'tue',
    'Wednesday': 'wed',
    'Thursday': 'thu',
    'Friday': 'fri',
    'Saturday': 'sat',
    'Sunday': 'sun',
};

class AddOperationalHours extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OperationDay: [],
            day: '',
            startTime: '',
            endtime: ''
        };
    }

    required = (value) => value ? undefined : 'Required';

    handleDropDown = (value) => {
        this.setState({ [value.name]: value.value });
    };

    render() {
        const { openDeleteModal, closeDeleteModal, serviceTobeDeleted } = this.props;
        // console.log('timer' ,this.props , this.state.day , this.state.startTime , this.state.endtime )

        return (
            <Dialog
                open={openDeleteModal}
                className="Days-box"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ minWidth: '760px', overflowY: "unset" }}
            >
                <span onClick={this.props.Operation} style={{ position: "absolute", cursor: "pointer", top: "-9px", right: "-9px", backgroundColor: "#fff", padding: "3px 6px", borderRadius: "50%", fontSize: "11px", fontWeight: "bold" }}>X</span>
                <DialogTitle id="alert-dialog-title">Select Day and Time</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="form-row Day-box">
                            <Field
                                name="day"
                                component={renderDropdown}
                                required
                                label="Day"
                                validate={[this.required]}
                                options={days}
                                onChange={value => {
                                    this.handleDropDown(value.target);
                                }}
                            />
                        </div>
                        <div className="form-row" style={{ width: '48%' }}>
                            <Field
                                name="starttime"
                                component={renderDropdown}
                                required
                                label="Start Time"
                                validate={[this.required]}
                                options={timeSlots}
                                onChange={value => {
                                    this.handleDropDown(value.target);
                                }}
                            />
                        </div>
                        <div className="form-row" style={{ width: '48%', float: 'right' }}>
                            <Field
                                name="endtime"
                                component={renderDropdown}
                                required
                                label="End Time"
                                validate={[this.required]}
                                options={timeSlots.slice(findIndex(timeSlots, o => o.value == this.state.starttime) + 1, timeSlots.length)}
                                onChange={value => {
                                    this.handleDropDown(value.target);
                                }}
                            />
                        </div>
                        <div className="form-row" style={{ width: '100%' }}>
                            <Button
                                onClick={() => {
                                    const start = moment('Jan 1, 2021 '.concat(this.state.starttime)).format(('x'));
                                    const end = moment('Jan 1, 2021 '.concat(this.state.endtime)).format(('x'));
                                    this.props.setOperationHors({ [reverseDayKey[this.state.day]]: [start, end] });
                                    this.props.Operation();
                                }}
                                disabled={!(this.state.day || this.state.starttime || this.state.endtime)}
                                variant="contained"
                                style={{ width: '100%', marginTop: "10px" }}
                            >
                                Add
                            </Button>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        );
    }
}

export default AddOperationalHours;
