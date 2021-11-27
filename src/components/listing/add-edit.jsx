import React, { Component } from "react";
import axios from "axios";
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom'
import { reduxForm, formValueSelector, Field, autofill } from 'redux-form';
import { Button, CircularProgress, FormControlLabel, Checkbox } from "@material-ui/core";
import { renderTextField, renderTextFieldPrice, renderDropdownPrice, renderDropdown, renderRadio, rendernumberField } from '../../ui/form-elements';
import { TrendingFlat, ControlPoint as ControlPointIcon, CheckCircleOutline, Cancel } from "@material-ui/icons";
import Filters from './filters';
import AddOperationalHours from './add-operation-hours';
import { forEach, filter, findIndex } from 'lodash';
import { ListingOuter } from "./style";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { FaCalendar } from 'react-icons/fa';
import { Row } from "react-bootstrap";
import { uploadFile } from "react-s3";
import { API_BASE_TEST_URL } from './../../constant'
import "react-datepicker/dist/react-datepicker.css";
import S3 from "react-aws-s3";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Daykeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DayName = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thrusday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday"
}


class AddEditService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRender: true,
            loading: false,
            serviceTypesData: [],
            serviceTypes: [],
            locationData: [],
            locationList: [],
            selectedServiceTypeData: [],
            aboutSections: 1,
            oprationHrs: {},
            addOperationalHours: false,
            linkServices: false,
            linkedServices: [],
            finalLinkedServices: [],
            filters: [],
            TableCount: [{
                topic: '',
                description: '',
            }],
            filterlist2: [],
            dis: true,
            fieldCount: [1],
            Inputselect: [],
            name: "",
            minMaxValue: [null],
            createbtn: true,
            endDate: new Date(),
            startDate: new Date(),
            Date: new Date(),
            datematch: false,
            matchTime: false,
            ListData: {
                monEnd: "",
                monStart: "",
                tueStart: "",
                tueEnd: "",
                wedStart: "",
                wedEnd: "",
                thuStart: "",
                thuEnd: "",
                friStart: "",
                friEnd: "",
                satStart: "",
                satEnd: "",
                sunStart: "",
                sunEnd: ""
            },
            files: [],
            selectedStatus: "",
            linkservicetype: [],
            linkbtn: false,
            selectedService: [],
            phonenumber: "",
            vendor_id:'',
        };
    }
    componentDidMount = () => {
        this.fetchServiceTypes();
        this.fetchLocation();
        this.setState({vendor_id:localStorage.getItem("vendor-id")})
    }
    Operation = () => {
        this.setState({ addOperationalHours: false })
    }
    filterChange = (e, type, i, id, key) => {
        const temp = [...this.state.filterlist2]
        let index = -1;
        temp.forEach((filter, idx) => {
            if (filter.filterId === id) {
                index = idx
            }
        });
        if (index === -1) {
            if (e == "") {
            }
            if (type === 7) {
                const obj = {
                    filterId: id,
                    type,
                    membersMinRange: e[0],
                    membersMaxRange: e[1]
                }
                temp.push(obj)
            }
            else {
                const obj = {
                    filterId: id,
                    type,
                };
                obj[key] = e;
                if (key === 'startDate') {
                    if (!obj.endDate) {
                        obj.endDate = moment().format('x');
                    }
                }
                if (key === 'endDate') {
                    if (!obj.startDate) {
                        obj.startDate = moment().format('x');
                    }
                }
                if (key === 'startTime') {
                    if (!obj.endTime) {
                        obj.endTime = moment().format('x');
                    }
                }
                if (key === 'endTime') {
                    if (!obj.startTime) {
                        obj.startTime = moment().format('x');
                    }
                }
                temp.push(obj)
            }
            this.setState({ filterlist2: temp });
        } else {
            if (type === 7) {
                const obj = { ...temp[index] };
                obj.membersMinRange = e[0];
                obj.membersMaxRange = e[1];
                temp[index] = { ...obj }
            }
            else {
                const obj = { ...temp[index] };
                obj[key] = e;
                if (key === 'startDate') {
                    if (!obj.endDate) {
                        obj.endDate = moment().format('x');
                    }
                }
                if (key === 'endDate') {
                    if (!obj.startDate) {
                        obj.startDate = moment().format('x');
                    }
                }

                if (key === 'startTime') {
                    if (!obj.endTime) {
                        obj.endTime = moment().format('x');
                    }
                }
                if (key === 'endTime') {
                    if (!obj.startTime) {
                        obj.startTime = moment().format('x');
                    }
                }
                temp[index] = { ...obj }
            }
            this.setState({ filterlist2: temp });

        }
    }

    getRangeValue(filterDefault, id) {
        let val = { membersMinRange: filterDefault.membersMinRange, membersMaxRange: filterDefault.membersMaxRange };
        this.state.filterlist2.forEach((filter, index) => {
            if (filter.filterId === id) {
                val = {
                    membersMinRange: filter.membersMinRange,
                    membersMaxRange: filter.membersMaxRange,
                };
            }
        });
        return val;
    }

    handleChange = (e, type, i, id, idx) => {
        var id = id;
        this.setState({ dis: false })

        let temp = [...this.state.filterlist2]
        let filterIndex = -1;
        temp.forEach((filter, findex) => {
            if (id == filter.filterId) {
                filterIndex = findex;
            }
        });
        if (filterIndex < 0) {
            const obj = {
                filterId: id,
                type,
                location: [
                    {
                        address: e,
                        longitude: "11.11",
                        latitude: "11.11"
                    }
                ]
            }
            temp.push(obj)
        } else {
            temp.forEach((fill, index) => {
                if (id == fill.filterId) {
                    if (fill.location[idx]) {
                        fill.location[idx].address = e;
                    } else {
                        const obj = {
                            address: e,
                            longitude: "78.77",
                            latitude: "30.77"
                        }
                        fill.location.push(obj);
                    }
                }
            })
        }
        this.setState({ filterlist2: temp });
    }

    getmultiSelect = (arr) => {
        const values = [];
        arr.forEach(item => values.push(item.value));
        return values;
    }
    CheckDate = (enddate) => {
        this.state.filterlist2.forEach((fil) => {
            if (fil.startDate > enddate) {
                this.setState({ datematch: true })
            }
            else {
                this.setState({ datematch: false })
            }
        })
        return enddate
    }
    CheckTime = (time) => {
        this.state.filterlist2.forEach((fill) => {
            if (fill.startDate == fill.endDate) {
                var diff = Math.abs(fill.startTime - time) / 1000;
                var hours = Math.floor(diff / 3600) % 24

                if (hours < 1) {
                    if (fill.type === 6) {

                    }

                } else {

                }
            }
        })
        return time
    }
    DeleteAbout = (i) => {
        var temp = [...this.state.TableCount];
        temp.splice(i, 1);
        this.setState({ TableCount: temp });
    }


    DeleteDays = (i) => {
        let elem = document.getElementById('aboutTab-' + i);
        elem.parentNode.removeChild(elem);
    }

    static getDerivedStateFromProps(props, state) {
        if (state.initialRender && props.autofill) {
            state.initialRender = false;
            props.autofill('status', props.formValue && props.formValue.status ? props.formValue.status : "0")
        }
        return state;
    }
    fetchServiceTypes = () => {
        this.setState({ loading: true });
        axios
            .get(`${API_BASE_TEST_URL}service-types`)
            .then(response => {
                const serviceTypes = [];
                forEach(response.data.data, serviceType => {
                    serviceTypes.push({ value: serviceType._id, label: serviceType.name });
                });
                this.setState({
                    serviceTypesData: response.data.data,
                    serviceTypes: serviceTypes
                });
            })
            .catch(error => {
                console.log(error);
            })
            .then(() => {
                this.setState({ loading: false });
            });
    }

    fetchLocation = () => {
        this.setState({ loading: true });
        axios
            .get(`${API_BASE_TEST_URL}get-location`)
            .then(response => {
                const locations = [];
                forEach(response.data.data, location => {
                    locations.push({ value: location.name, label: location.name });
                });
                this.setState({
                    locationData: response.data.data,
                    locationList: locations
                });
            })
            .catch(error => {
                console.log(error);
            })
            .then(() => {
                this.setState({ loading: false });
            });
    }

    required = (value) => value ? undefined : 'Required';


    renderOperationHors = () => {

        const operationalHrs = [];
        const unordered = this.state.oprationHrs;
        var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        forEach(days, day => {
            if (unordered[day]) {
                operationalHrs.push(
                    <div key={day} id={'aboutTab-' + day} className="operational-hour" style={{ position: "relative" }}>
                        <span onClick={() => this.DeleteDays(day)} style={{ position: "absolute", cursor: "pointer", top: "-9px", right: "-9px", backgroundColor: "#f8f8f8", padding: "3px 6px", borderRadius: "50%", fontSize: "11px", fontWeight: "bold" }}>X</span>
                        <div className="day-name">{day}</div>
                        <div className="start-end-time">{unordered[day][0]}</div>
                    </div>
                );
            }
        })
        return operationalHrs;
    };
    // 

    DeleteDaysEdit = (daykey) => {
        const temp = { ...this.state.ListData };
        temp[daykey.concat('Start')] = "";
        temp[daykey.concat('End')] = "";
        this.setState({ ListData: temp })

    }

    setOperationHors = hours => {
        const day = Object.keys(hours)[0];
        const temp = { ...this.state.ListData };
        const times = [...hours[day]];
        temp[day.concat('Start')] = times[0];
        temp[day.concat('End')] = times[1];
        this.setState({ ListData: temp });
    };


    renderOperationHorsEdit = () => {
        return (<div>{
            Daykeys.map((daykey, index) => {
                if (this.state.ListData[daykey.concat('Start')] !== "" && this.state.ListData[daykey.concat('End')] !== "") {
                    return <div key={daykey} id={'aboutTab-' + daykey} className="operational-hour" style={{ position: "relative" }}>
                        <span onClick={() => this.DeleteDaysEdit(daykey)} style={{ position: "absolute", cursor: "pointer", top: "-9px", right: "-9px", backgroundColor: "#f8f8f8", padding: "3px 6px", borderRadius: "50%", fontSize: "11px", fontWeight: "bold" }}>X</span>
                        <div className="day-name">{DayName[daykey]}</div>
                        <div className="time-box1">
                            <div>
                                <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Start Time</label>
                                <input
                                    style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a" }}
                                    type="time"
                                    id="st"
                                    value={moment(Number(this.state.ListData[daykey.concat('Start')])).format("hh:mm")}
                                    onChange={(e) => {
                                        let temp = { ...this.state.ListData }
                                        temp[daykey.concat('Start')] = moment("1 January 2021 " + e.target.value + ":00").format("x")
                                        this.setState({ ListData: temp })
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>End Time</label>
                                <input
                                    value={moment(Number(this.state.ListData[daykey.concat('End')])).format("hh:mm")}
                                    style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a", }}
                                    type="time"
                                    id="et"
                                    onChange={(e) => {
                                        let temp = { ...this.state.ListData }
                                        temp[daykey.concat('End')] = moment("1 January 2021 " + e.target.value + ":00").format("x")
                                        this.setState({ ListData: temp })
                                    }}
                                />
                            </div>
                        </div>


                    </div>
                }

            })
        }</div>)

    }

    // 

    handleType = value => {
        const filterData = filter(this.state.serviceTypesData, typeData => { return value === typeData._id; });

        this.setState({ selectedServiceTypeData: filterData });

    };
    handleTypes = value => {


    }
    renderQuestions = () => {
        const question1 = [];
        if (this.state.selectedServiceTypeData.length) {
            forEach(this.state.selectedServiceTypeData[0].questions, (question, index) => {
                const options = [];
                forEach(question.value, (value, index) => {
                    options.push({ value: `${question._id}+${value}`, label: value });
                });
                question1.push(<div className="form-row"><Field
                    name={`questions[${index}]`}
                    component={renderDropdown}
                    required
                    label={question.ques}
                    validate={[this.required]}
                    options={options}
                /></div>);
            });
        }
        return question1;
    }

    setLinkedServices = linkedServices => {
        const finalLinkedServices = [];
        forEach(linkedServices, linkedService => {
            finalLinkedServices.push({ _id: linkedService._id, isCompulsory: false });
        });
        this.setState({ linkedServices: linkedServices, linkServices: false, finalLinkedServices: finalLinkedServices });
    };

    renderLinkedServices = () => {
        const linkedServices = [];
        this.state.linkedServices.forEach(linkedService => {

            const ab = findIndex(this.state.finalLinkedServices, link => { return linkedService._id === link._id; });
            linkedServices.push(
                <div className="checkbox-outer">
                    <FormControlLabel
                        control={
                            <>
                                <CheckCircleOutline style={{ color: '#F87A25', opacity: this.state.finalLinkedServices[ab] && this.state.finalLinkedServices[ab].isCompulsory ? '1' : '0.5' }} />
                                <Checkbox
                                    checked={this.state.finalLinkedServices[ab] && this.state.finalLinkedServices[ab].isCompulsory}
                                    onChange={() => {
                                        let abc = this.state.finalLinkedServices;
                                        if (abc[ab] && abc[ab].isCompulsory) {
                                            abc[ab].isCompulsory = false;
                                        } else {
                                            abc[ab].isCompulsory = true;
                                        }
                                        this.state.finalLinkedServices = abc;

                                        this.forceUpdate();
                                    }}
                                    color="primary"
                                />
                            </>
                        }
                        label={`${linkedService.title} (${linkedService.type})`}
                    />
                    <Cancel
                        style={{ color: '#F87A25', position: 'static' }}
                        onClick={() => {
                            const index = findIndex(this.state.linkedServices, function (o) { return o._id === linkedService._id; });
                            const index1 = findIndex(this.state.finalLinkedServices, function (o) { return o._id === linkedService._id; });

                            this.state.linkedServices.splice(index, index + 1);
                            this.state.finalLinkedServices.splice(index1, index1 + 1);
                            this.forceUpdate();
                        }}
                    />
                </div>
            );

        });
        return linkedServices;
    }

    getTimeStamp = (time) => {
        let d = moment();
        const [time1, formate] = time.split(' ');
        let [hrs, min] = time1.split(':');
        hrs = parseInt(hrs, 10);
        min = parseInt(min, 10);
        if (formate === 'PM') {
            hrs += 12;
        }
        return (new Date(2021, 2, 12, hrs, min)).getTime();
    };

    addUpdateService = (formValue, operationHrs, linkedService) => {


        this.setState({ loading: true });
        const questions = [];
        forEach(formValue.questions, question => {
            questions.push({ "_id": question.split('+')[0], "answ": [question.split('+')[1]] })
        });

        const data = {
            vendorServiceId: "",
            vendorId: this.state.vendor_id,
            title: formValue.title || '',
            location: formValue.location || '',
            latitude: '77.89',
            longitude: '99.89',
            images: this.state.files,
            phoneNmuber: this.state.phonenumber || '',
            filters: this.state.filterlist2,
            price: formValue.price || '',
            minGuestRange: formValue.minGuestRange || 0,
            maxGuestRange: formValue.maxGuestRange || 0,
            priceType: formValue.priceType ? parseInt(formValue.priceType, 10) : '',
            status: formValue.status ? parseInt(formValue.status, 10) : '',
            serviceId: formValue.type || '',
            features: questions,
            linkedServices: this.state.selectedService,
            monStart: this.state.ListData.monStart ? this.state.ListData.monStart : "",
            monEnd: this.state.ListData.monEnd ? this.state.ListData.monEnd : "",
            tueStart: this.state.ListData.tueStart ? this.state.ListData.tueStart : "",
            tueEnd: this.state.ListData.tueEnd ? this.state.ListData.tueEnd : "",
            wedStart: this.state.ListData.wedStart ? this.state.ListData.wedStart : "",
            wedEnd: this.state.ListData.wedEnd ? this.state.ListData.wedEnd : "",
            thuStart: this.state.ListData.thuStart ? this.state.ListData.thuStart : "",
            thuEnd: this.state.ListData.thuEnd ? this.state.ListData.thuEnd : "",
            friStart: this.state.ListData.friStart ? this.state.ListData.friStart : "",
            friEnd: this.state.ListData.friEnd ? this.state.ListData.friEnd : "",
            satStart: this.state.ListData.satStart ? this.state.ListData.satStart : "",
            satEnd: this.state.ListData.satEnd ? this.state.ListData.satEnd : "",
            sunStart: this.state.ListData.sunStart ? this.state.ListData.sunStart : "",
            sunEnd: this.state.ListData.sunEnd ? this.state.ListData.sunEnd : "",
            coverImage: this.state.files.length > 0 ? this.state.files[0] : "",
            about: this.state.TableCount
        };

        const headers = {
            'Content-Type': 'application/json'
        };
        axios
            .post(`${API_BASE_TEST_URL}addShopService`, data, { headers })
            .then(response => {
                window.location.href = "/listing";
            })
            .catch(error => {
                console.log('error', error);
            })
            .then(() => {
                this.setState({ loading: false });
            });
    }

    fileSelectedHandler = (e) => {
        this.setState({ files: [...this.state.files, ...e.target.files] })
    }



    linkserviceType = (value) => {
        axios.get(`${API_BASE_TEST_URL}vendorList?vendorId=${this.state.vendor_id}&status=${value}`)
            .then(res => {
                this.setState({ linkservicetype: res.data.data.vendorServiceList, selectedStatus: value })
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    handleOnChange = (e) => {
        const withIsCompulsory = e.map((value) => {
            return {
                ...value,
                _id: value.value,
                isCompulsory: false
            }
        })
        this.setState({ selectedService: withIsCompulsory })

    }

    RemoveImage = (index) => {
        const temp = this.state.files;
        if (index > -1) {
            temp.splice(index, 1)
        }
        this.setState({ files: temp })
    }
    Cancellink = (index) => {

        const temp = this.state.selectedService;
        if (index > -1) {
            temp.splice(index, 1)
        }
        this.setState({ selectedService: temp })
    }

    handleIsCompulsory = i => {
        const selectedService = [...this.state.selectedService];
        selectedService[i].isCompulsory = !selectedService[i].isCompulsory
        this.setState({ selectedService })
    }


    render() {
        const { formValue } = this.props;

        var date = new Date();
        var curTime = moment(date).format("HH:mm")
        var filtervalue = []

        this.state.selectedServiceTypeData.forEach((filter, i) => {
            if (filter.type === 7) {
                filtervalue[0] = filter.membersMinRange
                filtervalue[1] = filter.membersMaxRange
            }

        })

        this.state.linkservicetype.map((link, index) => {
        })
        const { handleSubmit, pristine, reset, submitting } = this.props
        return (
            <>
                {this.state.loading && (
                    <div className="loaderOuter">
                        <CircularProgress />
                    </div>
                )}
                <ListingOuter className="listingOuter">
                    <div className="listingHeader">
                        <h3 className="addOpacity">
                            <Link to="/listing"><TrendingFlat className="icon rotate" /></Link>
                            Create A Listing
                        </h3>
                        <div className="rightPart">

                        </div>
                    </div>
                    <div className="add-edit-form-outer">
                        <form
                            onSubmit={handleSubmit((values) => { this.addUpdateService(this.props.formValue, this.state.oprationHrs, this.state.finalLinkedServices) })}
                        >
                            <div className="left-part">
                                <div className="form-row left-label label-Bold typeButton">
                                    <Field
                                        name="status"
                                        type="radio"
                                        component={renderRadio}
                                        label="Status"
                                        required
                                        validate={[this.required]}
                                        options={[{ value: "1", label: "Private" }, { value: "0", label: "Public" }]}
                                        value={formValue && formValue.status ? formValue.status : '0'}
                                    />
                                </div>
                                {formValue && formValue.status === '0' && <div className="form-row left-label label-Bold composite-input">
                                    <label>Price</label>
                                    <div className="composite-container">
                                        <Field
                                            name="priceType"
                                            component={renderDropdownPrice}
                                            required
                                            validate={[this.required]}
                                            options={[{ value: '0', label: "Whole" }, { value: '1', label: "Per Person" }, { value: '2', label: "Per Hr" }]}
                                        />
                                        <Field
                                            name="price"
                                            type="number"
                                            className="price-no"
                                            component={renderTextFieldPrice}
                                            required
                                            validate={[this.required]}
                                        />
                                        <p className="abcd"></p>

                                    </div>
                                </div>}
                                {formValue && formValue.status === '0' &&
                                    <div className="form-row label-Bold">

                                        {formValue.priceType === "0" || formValue.priceType === undefined ?
                                            ''
                                            : (
                                                <>
                                                    <div className="form-row">
                                                        <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Min {formValue.priceType == 1 ? 'Person' : ''} {formValue.priceType == 2 ? 'Hour' : ''}</label>
                                                        <Field
                                                            name="minGuestRange"
                                                            type="number"
                                                            className="price-no"
                                                            component={rendernumberField}
                                                            required
                                                            validate={[this.required]}
                                                            InputProps={{ inputProps: { min: 0, max: 10 } }}
                                                        />
                                                    </div>
                                                    <div className="form-row">
                                                        <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Max {formValue.priceType == 1 ? 'Person' : ''} {formValue.priceType == 2 ? 'Hour' : ''}</label>
                                                        <Field
                                                            name="maxGuestRange"
                                                            type="number"
                                                            className="price-no"
                                                            component={rendernumberField}
                                                            required
                                                            validate={[this.required]}
                                                        />
                                                    </div>
                                                </>

                                            )
                                        }


                                        <p className="abcd"></p>
                                    </div>}
                                {formValue && formValue.status === '0' ?
                                    <div className="form-row label-Bold" style={{ paddingBottom: '15px' }}>
                                        <label>Basic</label>
                                    </div> : ''
                                }
                                <div className="form-row">
                                    <Field
                                        name="title"
                                        type="text"
                                        component={renderTextField}
                                        label={formValue && formValue.status === '0' ? 'Title' : 'Title'}
                                        required
                                        validate={[this.required]}
                                    />
                                </div>
                                <div className="form-row">
                                    <Field
                                        name="type"
                                        component={renderDropdown}
                                        required
                                        label="Type"
                                        validate={[this.required]}
                                        options={this.state.serviceTypes}
                                        onChange={value => {
                                            this.handleType(value.target.value);
                                        }}
                                    />
                                </div>
                                {formValue && formValue.status === '0' ?
                                    <>
                                        <div className="form-row">
                                            <Field
                                                name="location"
                                                component={renderDropdown}
                                                label="Location"
                                                required
                                                validate={[this.required]}
                                                options={this.state.locationList}
                                            />
                                        </div>
                                        <div className="form-row phone-no">

                                            <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Phone Number</label>
                                            <PhoneInput
                                                inputStyle={{ borderRadius: "0px", width: "100%" }}
                                                country={'us'}
                                                value={this.state.ListData.phoneNmuber}
                                                onChange={(e) => this.setState({ phonenumber: "+" + e })}
                                            />
                                        </div>
                                    </> : ''
                                }
                                {formValue &&
                                    formValue.status === '0' &&
                                    this.state.selectedServiceTypeData[0] &&
                                    this.state.selectedServiceTypeData[0].filters &&
                                    this.state.selectedServiceTypeData[0].filters.length ? ""

                                    : ''
                                }
                                {formValue && formValue.status == 0 &&
                                    this.state.selectedServiceTypeData[0] &&
                                    this.state.selectedServiceTypeData[0].questions &&
                                    this.state.selectedServiceTypeData[0].questions.length ?
                                    <>
                                        <h3 className="section-title">Feature Questions</h3>
                                        {this.renderQuestions()}
                                    </>
                                    : ''}
                                {
                                    this.state.selectedServiceTypeData.map((fil, index) => {
                                        return fil.filters.map((infiler, i) => (
                                            <div key={i} className="col-md-6" style={{ marginBottom: '15px' }}>


                                                {infiler.type === 1 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>

                                                        <Select
                                                            options={infiler.singleSelect.map((option, index) => {
                                                                return { label: option, value: option };
                                                            })}
                                                            placeholder={infiler.singleSelectData}
                                                            onChange={(e) => this.filterChange(e.value, infiler.type, i, infiler._id, "singleSelect")}

                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                        />
                                                    </div>
                                                )}


                                                {infiler.type === 2 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                                        <Select
                                                            options={infiler.multiSelect.map((option, index) => {
                                                                return { label: option, value: option };
                                                            })}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            isMulti
                                                            onChange={(e) => this.filterChange(this.getmultiSelect(e), infiler.type, i, infiler._id, "multiSelect")}
                                                        />
                                                    </div>
                                                )}

                                                {/* date */}

                                                {infiler.type === 3 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                                        <div className="inner-trw-box" style={{ position: "relative" }}>
                                                            <DatePicker
                                                                minDate={new Date()}
                                                                showYearDropdown
                                                                selected={this.state.Date}
                                                                dateFormat="dd/MM/yyyy"
                                                                onChange={(date) => {
                                                                    this.filterChange(parseInt(moment(date).format("x")), infiler.type, i, infiler._id, "date")
                                                                    this.setState({ Date: date });
                                                                }}
                                                            />
                                                            <span style={{ position: "absolute", right: "10px", top: "10px", fontSize: "20px", color: "#7a7a7a" }}>
                                                                <FaCalendar />
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* date range */}

                                                {infiler.type === 4 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                                        <div className="trw-box">
                                                            <div className="inner-trw-box" style={{ position: "relative" }}>
                                                                <DatePicker minDate={new Date()}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    selected={this.state.startDate}
                                                                    showYearDropdown
                                                                    onChange={(date) => {
                                                                        this.filterChange(parseInt(moment(date).format("x")), infiler.type, i, infiler._id, "startDate")
                                                                        this.setState({ startDate: date });
                                                                    }
                                                                    }
                                                                />
                                                                <span style={{ position: "absolute", right: "10px", top: "10px", fontSize: "20px", color: "#7a7a7a" }}>
                                                                    <FaCalendar />
                                                                </span>
                                                            </div>
                                                            <div className="inner-trw-box" style={{ position: "relative" }}>
                                                                <DatePicker minDate={new Date()}
                                                                    showYearDropdown
                                                                    dateFormat="dd/MM/yyyy"
                                                                    selected={this.state.endDate}
                                                                    onChange={(date) => {
                                                                        this.filterChange(this.CheckDate(parseInt(moment(date).format("x"))), infiler.type, i, infiler._id, "endDate")
                                                                        this.setState({ endDate: date });
                                                                    }
                                                                    }
                                                                />
                                                                <span style={{ position: "absolute", right: "10px", top: "10px", fontSize: "20px", color: "#7a7a7a" }}>
                                                                    <FaCalendar />
                                                                </span>
                                                            </div>
                                                            {
                                                                this.state.datematch ? <span style={{ fontSize: "12px", color: "red" }}>please select valid endDate</span> : ""
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                                {/* time */}

                                                {infiler.type === 5 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                                        <div style={{ display: "flex", justifyContent: "left" }}>

                                                            <input
                                                                style={{ width: "100%", backgroundColor: "#F7F7F7", border: "1px solid #dcdcdc", height: "40.5px", color: "#7a7a7a", fontSize: "14px", outline: "none", padding: "5px" }}
                                                                type="time"
                                                                id="appt"
                                                                defaultValue={curTime}
                                                                placeholder={infiler.time}
                                                                value={infiler.time}
                                                                onChange={(e) =>
                                                                    this.filterChange(parseInt(moment("1 January 2021 " + e.target.value + ":00").format("x")), infiler.type, i, infiler._id, "time")
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* time range */}
                                                {infiler.type === 6 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                                        <div className="time-box">
                                                            <input
                                                                style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a" }}
                                                                type="time"
                                                                id="st"

                                                                placeholder={infiler.startTime}
                                                                defaultValue={curTime}
                                                                onChange={(e) =>
                                                                    this.filterChange(this.CheckTime(parseInt(moment("1 January 2021 " + e.target.value + ":00").format("x"))), infiler.type, i, infiler._id, "startTime")
                                                                }
                                                            />
                                                            <input
                                                                style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a", }}
                                                                type="time"
                                                                id="et"
                                                                placeholder={infiler.endTime}
                                                                defaultValue={curTime}
                                                                onChange={(e) =>
                                                                    this.filterChange(this.CheckTime(parseInt(moment("1 January 2021 " + e.target.value + ":00").format("x"))), infiler.type, i, infiler._id, "endTime")
                                                                }
                                                            />
                                                        </div>
                                                        {
                                                            this.state.matchTime ? <span style={{ fontSize: "12px", color: "red" }}>please select valid endDate</span> : ""
                                                        }
                                                    </div>
                                                )}

                                                {/* range silder */}

                                                {infiler.type === 7 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                                        <Row style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <span>
                                                                {this.getRangeValue(infiler, infiler._id).membersMinRange}
                                                            </span>
                                                            <span >
                                                                {this.getRangeValue(infiler, infiler._id).membersMaxRange}
                                                            </span>
                                                        </Row>
                                                        <Range
                                                            key={i}
                                                            step={1}
                                                            defaultValue={[
                                                                infiler.membersMinRange,
                                                                infiler.membersMaxRange
                                                            ]}
                                                            min={parseInt(infiler.membersMinRange)}
                                                            max={parseInt(infiler.membersMaxRange)}
                                                            tipFormatter={(filtervalue) => `${filtervalue}`}

                                                            onChange={(filtervalue) => {
                                                                this.filterChange(filtervalue, infiler.type, i, infiler._id, "FilterData")
                                                                this.setState({ minMaxValue: [...filtervalue] })
                                                            }}
                                                        />
                                                    </div>
                                                )}



                                                {infiler.type === 8 && (
                                                    <div>
                                                        <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                                        <div className="locate-box">
                                                            {this.state.fieldCount.map((field, index) => (
                                                                <input
                                                                    style={{ backgroundColor: "#f7f7f7", border: "1px solid #dcdcdc", height: "40.5px", display: "block", outline: "none", color: "#7a7a7a", textTransform: "capitalize", marginBottom: "10px" }}
                                                                    type="text"
                                                                    className="loc-box"
                                                                    // key={ind}
                                                                    onChange={(e) => this.handleChange(e.target.value, infiler.type, i, infiler._id, index)}
                                                                />
                                                            ))}
                                                            <Button
                                                                onClick={() => {
                                                                    const temp = [...this.state.fieldCount];
                                                                    temp.push(1);
                                                                    this.setState({ fieldCount: temp });
                                                                }}
                                                                style={{
                                                                    color: this.state.dis ? "#7a7a7a" : "#fff",
                                                                    fontSize: "20px",
                                                                    position: "absolute",
                                                                    top: "0px",
                                                                    right: "0px",
                                                                    backgroundColor: this.state.dis ? "#d0d0d0" : "#f47824",
                                                                }}
                                                                disabled={this.state.dis}
                                                                className="Add-btn"
                                                            >
                                                                +
                                    </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    })
                                }


                            </div>
                            <div className="right-part">
                                {formValue && formValue.status === '1' &&
                                    <>
                                        <div className="form-row left-label label-Bold composite-input" style={{ width: 'calc(50% - 8px)' }}>
                                            <label>Price</label>
                                            <div className="composite-container">
                                                <Field
                                                    name="priceType"
                                                    component={renderDropdownPrice}
                                                    required
                                                    validate={[this.required]}
                                                    options={[{ value: '0', label: "Whole" }, { value: '1', label: "Per Person" }, { value: '2', label: "Per Hr" }]}
                                                />
                                                <Field
                                                    name="price"
                                                    type="test"
                                                    component={renderTextFieldPrice}
                                                    required
                                                    validate={[this.required]}
                                                    options={[{ value: 1, label: "Private" }, { value: 0, label: "Public" }]}
                                                />
                                            </div>
                                        </div>

                                    </>
                                }

                                {formValue && formValue.status === '1' &&
                                    <div className="form-row label-Bold" >


                                        {/* {formValue.priceType} */}
                                        {formValue.priceType === "0" || formValue.priceType === undefined ?
                                            ''
                                            : (
                                                <>
                                                    <div className="form-row  left-label label-Bold composite-input" style={{ width: '40%', paddingRight: "9px" }}>
                                                        <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Min {formValue.priceType == 1 ? 'Person' : ''} {formValue.priceType == 2 ? 'Hour' : ''}</label>
                                                        <Field
                                                            name="minGuestRange"
                                                            type="number"
                                                            className="price-no"
                                                            component={rendernumberField}
                                                            required
                                                            validate={[this.required]}
                                                            InputProps={{ inputProps: { min: 0, max: 10 } }}
                                                        />
                                                    </div>
                                                    <div className="form-row  left-label label-Bold composite-input" style={{ width: '40%' }}>
                                                        <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Max {formValue.priceType == 1 ? 'Person' : ''} {formValue.priceType == 2 ? 'Hour' : ''}</label>
                                                        <Field
                                                            name="maxGuestRange"
                                                            type="number"
                                                            className="price-no"
                                                            component={rendernumberField}
                                                            required
                                                            validate={[this.required]}
                                                        />
                                                    </div>
                                                </>

                                            )
                                        }


                                        <p className="abcd"></p>
                                    </div>
                                }

                                {formValue && formValue.status == 1 && this.state.selectedServiceTypeData[0] &&
                                    this.state.selectedServiceTypeData[0].questions &&
                                    this.state.selectedServiceTypeData[0].questions.length ?
                                    <div style={{ width: 'calc(50% - 8px)' }}>
                                        <h3 className="section-title">Feature Questions</h3>
                                        {this.renderQuestions()}
                                    </div >
                                    : ''
                                }

                                {formValue && formValue.status === '0' && <div className="form-row">
                                    <h3 className="section-title">About <span style={{ color: '#f47824' }}><ControlPointIcon onClick={() => {
                                        const temp = [...this.state.TableCount];
                                        temp.push({
                                            topic: '',
                                            description: '',
                                        });
                                        this.setState({ TableCount: temp });
                                    }} /></span></h3>
                                    <div className="section row">
                                        {
                                            this.state.TableCount.map((Tab, index) => {
                                                return <div key={index} id={'aboutTab-' + index} className='add-section col-md-6' style={{ position: "relative" }}>
                                                    <span onClick={(e) => this.DeleteAbout(index)} style={{ position: "absolute", cursor: "pointer", top: "-9px", right: "-9px", backgroundColor: "#f8f8f8", padding: "3px 6px", borderRadius: "50%", fontSize: "11px", fontWeight: "bold" }}>X</span>
                                                    <h4 className="inner-title">Add Section</h4>
                                                    <div className="form-row">
                                                        <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Topic</label>
                                                        <input
                                                            type="text"
                                                            value={Tab.topic}
                                                            onChange={e => {
                                                                const temp = [...this.state.TableCount];
                                                                temp[index].topic = e.target.value;
                                                                this.setState({ TableCount: temp });
                                                            }}
                                                            style={{ height: "40.5px", padding: "10px", backgroundColor: "#F8F8F8", border: "1px solid #0000001f" }}
                                                        />

                                                    </div>
                                                    <div className="form-row">
                                                        <label style={{ color: "#000000", opacity: "0.7", fontSize: "12px", display: "block", marginBottom: "10px" }}>Description</label>
                                                        <input
                                                            type="text"
                                                            style={{ height: "40.5px", padding: "10px", backgroundColor: "#F8F8F8", border: "1px solid #0000001f" }}
                                                            value={Tab.description}
                                                            onChange={e => {
                                                                const temp = [...this.state.TableCount];
                                                                temp[index].description = e.target.value;
                                                                this.setState({ TableCount: temp });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            })
                                        }

                                    </div>
                                </div>

                                }
                                {formValue && formValue.status === '0' && <div className="form-row">
                                    <h3 className="section-title">Operational hours <span style={{ color: '#f47824' }}><ControlPointIcon onClick={() => { this.setState({ addOperationalHours: true }); }} /></span></h3>
                                    <div className="operational-hours">
                                        {/* {this.renderOperationHors()} */}
                                        {this.renderOperationHorsEdit()}
                                    </div>
                                </div>
                                }

                                <div className="image-upload">
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => {
                                            const config = {
                                                bucketName: "eventstan",
                                                dirName: 'serviceImages',
                                                region: 'ap-south-1',
                                                accessKeyId: 'AKIAXF6UJQL3N7DL5CVK',
                                                secretAccessKey: '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'
                                            }
                                            uploadFile(e.target.files[0], config)
                                                .then(data => {
                                                    const temp = [...this.state.files]
                                                    temp.push(data.location);
                                                    this.setState({ files: temp })
                                                })
                                                .catch(err => console.error('data image error', err))
                                        }}

                                    />
                                    {this.state.files.length > 0 ? <h2 style={{ fontWeight: "bold" }}>Gallery</h2> : ""}
                                    <div className="inner-uploaded-images">
                                        {
                                            this.state.files.map((img, index) => {
                                                return <div className="img-box"><img src={img} alt={index + 1} /><span style={{ cursor: "pointer" }} onClick={(e) => this.RemoveImage(index)}>x</span></div>
                                            })
                                        }
                                    </div>
                                </div>
                                <ul>
                                    {
                                        this.state.selectedService.map((serve, index) => {
                                            return <li className="link-list"> {serve.isCompulsory ? <input type="checkbox" onClick={e => this.handleIsCompulsory(index)} checked /> : <input type="checkbox" onClick={e => this.handleIsCompulsory(index)} />} {serve.label} <span style={{ cursor: "pointer" }} onClick={() => this.Cancellink(index)}>x</span> </li>
                                        })
                                    }
                                </ul>
                                {formValue && formValue.status === '0' && <div className="form-row link-button" style={{ width: "200px" }}>
                                    <button type="button" onClick={() => this.setState({ linkbtn: true })}>link services</button>
                                </div>
                                }
                                {
                                    this.state.linkbtn ?
                                        <div className="link-box">
                                            <div className="innder-link-box">
                                                <span onClick={() => this.setState({ linkbtn: false })} style={{ cursor: "pointer" }}>x</span>
                                                <h2>Link With services</h2>
                                                <div className="keybox" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "30px" }}>
                                                    <button type="button" onClick={() => this.linkserviceType("0")} className={this.state.selectedStatus == "0" ? 'active' : ''}>Public</button>
                                                    <button type="button" onClick={() => this.linkserviceType("1")} className={this.state.selectedStatus == "1" ? 'active' : ''}>Private</button>
                                                </div>
                                                {/* <div className="mul-sel"> */}
                                                <Select
                                                    options={this.state.linkservicetype.map((option, index) => {
                                                        return { label: option.title, value: option._id };
                                                    })}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    isMulti
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                                {/* </div> */}
                                                <div className="multi-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "15px 0px" }}>
                                                    <button onClick={() => this.setState({ linkbtn: false })} style={{ marginTop: "30px", width: "200px", padding: "10px 0px", border: "none", background: "#8489b2", color: "#fff", fontSize: "18px", borderRadius: "5px" }}>Save</button>
                                                </div>

                                            </div>
                                        </div>
                                        : ""
                                }
                            </div>
                            <div className="rightPart">
                                <button type="submit" style={{ backgroundColor: "#8489b2", padding: "11px 54px", cursor: "pointer", border: "0", borderRadius: "5px", marginLeft: "-100px", float: "left", color: "#ffffff", fontFamily: "Roboto", fontSize: "14px", fontWeight: "600", letterSpacing: "0", lineHeight: "18px", textAlign: "center", marginTop: "-44px", position: "absolute" }} disabled={submitting}>Save</button>
                            </div>

                        </form>
                        <AddOperationalHours Operation={this.Operation} openDeleteModal={this.state.addOperationalHours} setOperationHors={this.setOperationHors} />

                    </div>


                </ListingOuter>
            </>
        );
    }
}

const addEditForm = reduxForm({
    form: 'addEditForm',
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true
})(AddEditService);




const mapStateToProps = state => {
    const {
        form: { addEditForm: { values: formValue = {} } = {} } = {}
    } = state;
    return {
        formValue
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(addEditForm);
