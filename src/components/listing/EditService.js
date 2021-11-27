import React, { Component } from "react";
import axios from "axios";
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom'
import { reduxForm, formValueSelector, Field, autofill } from 'redux-form';
import { Button, CircularProgress, FormControlLabel, Checkbox } from "@material-ui/core";
import { renderTextField, renderDropdown, renderRadio, renderphonefield } from '../../ui/form-elements';
import { TrendingFlat, ControlPoint as ControlPointIcon, CheckCircleOutline, Cancel } from "@material-ui/icons";
import AddOperationalHours from './add-operation-hours';
import { forEach, filter, findIndex } from 'lodash';
import { ListingOuter } from "./style";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { FaCalendar } from 'react-icons/fa';
import { Row } from "react-bootstrap";
import { uploadFile } from 'react-s3';
import { API_BASE_TEST_URL } from './../../constant'
import "react-datepicker/dist/react-datepicker.css";
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
         features: [],
         Price: "",
         minGuestRange: "",
         maxGuestRange: "",
         initialRender: true,
         loading: false,
         serviceTypesData: [],
         serviceTypes: [],
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
         featuresData: [],
         filterlist2: [],
         filterlist3: [],
         dis: true,
         fieldCount: [1],
         Inputselect: [],
         name: "",
         minMaxValue: [0, 0],
         createbtn: true,
         endDate: new Date(),
         startDate: new Date(),
         Date: new Date(),
         PriceType: '0',
         datematch: false,
         EpriceType: "",
         Eprice: '',
         Etitle: "",
         Elocation: "",
         EphoneNum: "",
         servid: false,
         Elo: false,
         Epri: false,
         Eprit: false,
         Eprit: false,
         Etit: false,
         TypeValue: "",
         fdata: [],
         fea: false,
         selectedStatus: "",
         linkservicetype: [],
         linkbtn: false,
         selectedService: [],
         files: [],
         endTime: new Date(),
         startTime: new Date(),
         currentTime: new Date(),
         multiSelectList: [],
         singleSelectData: '',
         locationData: [],
         locationList: [],
         vendor_id:localStorage.getItem("vendor-id"),
      };
   }
   componentDidMount = () => {
      const id = this.props.match.params.vendorServiceId
      axios.get(`${API_BASE_TEST_URL}vendorServiceList?vendorServiceId=${id}&vendorId=${this.state.vendor_id}`)
         .then(res => {
            const arr = [];
               console.log(res);
            this.setState({ ListData: res.data.data.vendorServiceList[0], filterlist3: res.data.data.vendorServiceList[0].filterList, TableCount: res.data.data.vendorServiceList[0].about, features: res.data.data.vendorServiceList[0].features, PriceType: res.data.data.vendorServiceList[0].priceType, files: res.data.data.vendorServiceList[0].images, selectedService: res.data.data.vendorServiceList[0].linkedServices, EphoneNum: res.data.data.vendorServiceList[0].phoneNmuber })
            this.setState({Elocation:res.data.data.vendorServiceList[0].location});
            const filters = [];
            const featureslist = []
            res.data.data.vendorServiceList[0].filterList.forEach((file, index) => {

               if (file.type === 7) {
                  const temp = [file.membersMinRangeData, file.membersMaxRangeData]
                  this.setState({ minMaxValue: temp })
               }
            })
            this.state.ListData.features.map((feat, index) => {
               let Obj;
               Obj = {
                  _id: feat._id,
                  answ: feat.answ
               }
               featureslist.push(Obj)
               this.setState({ featuresData: featureslist })
            })
            res.data.data.vendorServiceList[0].filterList.forEach((filter, index) => {
               let Obj;
               if (filter.type === 1) {
                  this.setState({ singleSelectData: filter.singleSelectData })
                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     singleSelect: filter.singleSelectData
                  }
               }
               if (filter.type === 2) {
                  this.setState({ multiSelectList: filter.multiSelectList })
                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     multiSelect: filter.multiSelectList
                  }
               }
               if (filter.type === 3) {
                  this.setState({ Date: filter.date })

                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     date: filter.date,
                  }
               }
               if (filter.type === 4) {
                  this.setState({ startDate: filter.startDate, endDate: filter.endDate })
                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     startDate: filter.startDate,
                     endDate: filter.endDate
                  }
               }
               if (filter.type === 5) {
                  this.setState({ currentTime: filter.time })
                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     time: filter.time,
                  }
               }
               if (filter.type === 6) {
                  this.setState({ startTime: filter.startTime, endTime: filter.endTime })
                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     startTime: filter.startTime,
                     endTime: filter.endTime
                  }
               }
               if (filter.type === 7) {

                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     membersMinRange: filter.membersMinRangeData,
                     membersMaxRange: filter.membersMaxRangeData
                  }
               }
               if (filter.type === 8) {
                  Obj = {
                     filterId: filter.filterId,
                     type: filter.type,
                     location: filter.location
                  }
               }
               filters.push(Obj);
            });
            this.setState({ filterlist2: filters });
            this.fetchServiceTypes(res.data.data.vendorServiceList[0].serviceId);
            this.fetchLocation();
         })
         .catch(err => {
         })
   }
   Operation = () => {
      this.setState({ addOperationalHours: false })
   }
   filterChange = (e, type, i, id, key) => {

      const temp = [...this.state.filterlist2]
      let index = -1;

      temp.forEach((fil, idx) => {
         if (fil.filterId === id) {
            index = idx
         }
      });
      if (index === -1) {
         if (e == "") {
            // set = false;
         }
         if (type === 7) {
            const obj = {
               filterId: id,
               type,
               // set : set,
               membersMinRange: e[0],
               membersMaxRange: e[1]
            }
            temp.push(obj)
         }
         else {
            const obj = {
               filterId: id,
               type,
               // set : set
            };
            obj[key] = e;
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
            temp[index] = { ...obj }
         }
         this.setState({ filterlist2: temp });
      }
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
            // set : e !== '',
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
         if (temp[filterIndex].location[idx]) {
            temp[filterIndex].location[idx].address = e;
         } else {
            const obj = {
               address: e,
               longitude: "78.77",
               latitude: "30.77"
            }
            temp[filterIndex].location[idx] = obj;
         }
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
   fetchServiceTypes = (serviceId) => {
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
            const filterData = filter(this.state.serviceTypesData, typeData => { return serviceId === typeData._id; });
            //console.log(filterData);
            //this.setState({ selectedServiceTypeData: filterData });
            this.setState({ TypeValue: serviceId });
         })
         .catch(error => {

         })
         .then(() => {
            this.setState({ loading: false });
         });
   }
   required = (value) => value ? undefined : 'Required';
   setOperationHors = hours => {

      const day = Object.keys(hours)[0];
      const temp = { ...this.state.ListData };
      const times = [...hours[day]];

      temp[day.concat('Start')] = times[0];
      temp[day.concat('End')] = times[1];
      this.setState({ ListData: temp });
   };
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
   DeleteDaysEdit = (daykey) => {
      const temp = { ...this.state.ListData };
      temp[daykey.concat('Start')] = "";
      temp[daykey.concat('End')] = "";
      this.setState({ ListData: temp })
   }
   renderOperationHorsEdit = () => {
      return (
         <div>
            {
               Daykeys.map((daykey, index) => {
                  if (this.state.ListData[daykey.concat('Start')] !== "" && this.state.ListData[daykey.concat('End')] !== "") {
                     return <div key={daykey} id={'aboutTab-' + daykey} className="operational-hour" style={{ position: "relative" }}>
                        <span onClick={() => this.DeleteDaysEdit(daykey)} style={{ position: "absolute", cursor: "pointer", top: "-9px", right: "-9px", backgroundColor: "#f8f8f8", padding: "3px 6px", borderRadius: "50%", fontSize: "11px", fontWeight: "bold" }}>X</span>
                        <div className="day-name">{DayName[daykey]}</div>
                        <div className="time-box1">
                           <div>
                              <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Start Time</label>
                              <input
                                 style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a" }}
                                 type="time"
                                 // id="st"
                                 value={moment(Number(this.state.ListData[daykey.concat('Start')])).format("hh:mm")}
                                 onChange={(e) => {
                                    let temp = { ...this.state.ListData }
                                    temp[daykey.concat('Start')] = moment("1 January 2021 " + e.target.value + ":00").format("x")
                                    this.setState({ ListData: temp })
                                 }}
                              />
                           </div>
                           <div>
                              <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>End Time</label>
                              <input
                                 value={moment(Number(this.state.ListData[daykey.concat('End')])).format("hh:mm")}
                                 style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a", }}
                                 type="time"
                                 // id="et"
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
   featureshandle = (id, e) => {
      var Feature = []
      let Obj;
      Obj = {
         _id: id,
         answ: [e]
      }
      Feature.push(Obj);
      this.setState({ fdata: Feature, fea: true })
   }
   handleType = value => {
      const filterData = filter(this.state.serviceTypesData, typeData => { return value === typeData._id; });
      console.log(filterData);
      this.setState({ selectedServiceTypeData: filterData, servid: true, TypeValue: value, filterlist2: [] });
   };
   renderQuestions = () => {
      const question1 = [];
      if (this.state.selectedServiceTypeData.length) {

         forEach(this.state.selectedServiceTypeData[0].questions, (question, index) => {
            const options = [];
            forEach(question.value, (value, index) => {
               options.push({ value: `${question._id}+${value}`, label: value });
            });
            question1.push(
               <div className="form-row">
                  <Field
                     name={`questions[${index}]`}
                     component={renderDropdown}
                     required
                     validate={[this.required]}
                     options={options}
                  />
               </div>
            );
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
      const id = this.props.match.params.vendorServiceId;
      const data = {
         vendorServiceId: id,
         vendorId: this.state.vendor_id,
         title: this.state.Etit ? this.state.Etitle : this.state.ListData.title,
         location: this.state.Elo ? this.state.Elocation : this.state.ListData.location,
         latitude: '77.89',
         longitude: '99.89',
         images: this.state.files,
         phoneNmuber: this.state.Eph ? this.state.EphoneNum : this.state.ListData.phoneNmuber,
         filters: this.state.filterlist2,
         price: this.state.Epri ? this.state.Eprice : this.state.ListData.price,
         minGuestRange: this.state.PriceType == 0 ? 0 : (this.state.minGuestRange ? this.state.minGuestRange : this.state.ListData.minGuestRange),
         maxGuestRange: this.state.PriceType == 0 ? 0 : (this.state.maxGuestRange ? this.state.maxGuestRange : this.state.ListData.maxGuestRange),
         priceType: this.state.Eprit ? this.state.EpriceType : this.state.PriceType,
         status: this.state.ListData.status,
         serviceId: this.state.servid ? this.state.selectedServiceTypeData[0]._id : this.state.ListData.serviceId,
         features: this.state.fea ? this.state.fdata : this.state.featuresData,
         linkedServices: this.state.selectedService,
         monStart: this.state.ListData.monStart,
         monEnd: this.state.ListData.monEnd,
         tueStart: this.state.ListData.tueStart,
         tueEnd: this.state.ListData.tueEnd,
         wedStart: this.state.ListData.wedStart,
         wedEnd: this.state.ListData.wedEnd,
         thuStart: this.state.ListData.thuStart,
         thuEnd: this.state.ListData.thuEnd,
         friStart: this.state.ListData.friStart,
         friEnd: this.state.ListData.friEnd,
         satStart: this.state.ListData.satStart,
         satEnd: this.state.ListData.satEnd,
         sunStart: this.state.ListData.sunStart,
         sunEnd: this.state.ListData.sunEnd,
         coverImage: this.state.files.length > 0 ? this.state.files[0] : "",
         about: this.state.TableCount
      };
      // console.log('data', data)
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

      this.setState({ loading: false });
   }
   PricekaType = (e) => {
      this.setState({ EpriceType: e, Eprit: true, PriceType: e })
   }
   Eprice = (e) => {
      this.setState({ Eprice: e, Epri: true })
   }
   Etitle = (e) => {
      this.setState({ Etitle: e, Etit: true })
   }
   Elocation = (e) => { 
      this.setState({ Elocation: e, Elo: true})
   }
   EphoneNum = (e) => {
      this.setState({ EphoneNum: e, Eph: true })
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

   RemoveImage = (index) => {
      const temp = this.state.files;
      if (index > -1) {
         temp.splice(index, 1)
      }
      this.setState({ files: temp })
   }

   render() {
      const { formValue } = this.props;
      const price = this.state.ListData.price
      var date = new Date();
      var curTime = moment(date).format("hh:mm")
      var filtervalue = []
      this.state.selectedServiceTypeData.forEach((filter, i) => {
         if (filter.type === 7) {
            filtervalue[0] = filter.membersMinRange
            filtervalue[1] = filter.membersMaxRange
         }
      })
      var dateString1 = "";
      var dateString2 = "";
      var dateString3 = "";
      this.state.filterlist3.forEach((fil, i) => {
         if (fil.type === 3) {
            dateString1 = moment.unix(fil.Date).format("MM/DD/YYYY");
         }
         if (fil.type === 4) {

            dateString2 = moment.unix(fil.startDate).format("MM/DD/YYYY");
            dateString3 = moment.unix(fil.endDate).format("MM/DD/YYYY");
         }
      })

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
                     <Link to="/listing">
                        <TrendingFlat className="icon rotate" />
                     </Link>
         Create A Listing
      </h3>
                  <div className="rightPart">
                     <button type="button" onClick={(target, formValue) => { this.addUpdateService(this.props.formValue, this.state.oprationHrs, this.state.finalLinkedServices) }}>Save</button>
                  </div>
               </div>
               <div className="add-edit-form-outer">
                  <form  autoComplete="off" noValidate={true} >
                     <div className="left-part">
                        <div className="form-row left-label label-Bold typeButton">
                           {this.state.ListData.status == 1
                              ?
                              <Field
                                 name="status"
                                 type="radio"
                                 component={renderRadio}
                                 label="Status"
                                 required
                                 validate={[this.required]}
                                 options={[{ value: "1", label: "Private" }]}
                                 value="1"
                              />
                              : <Field
                                 name="status"
                                 type="radio"
                                 component={renderRadio}
                                 label="Status"
                                 required
                                 validate={[this.required]}
                                 options={[{ value: "0", label: "Public" }]}
                                 value="0"
                              />}

                        </div>
                        <div className="form-row left-label label-Bold composite-input">
                           <label>Price</label>
                           <div className="composite-container composite-container1">
                              <select className="Sel-ect" value={this.state.PriceType} onChange={(e) =>
                                 this.PricekaType(e.target.value)}>
                                 <option value="0">whole</option>
                                 <option value="1">Per Person</option>
                                 <option value="2">Per Hr</option>
                              </select>
                              <input className="In-box" type="number" defaultValue={this.state.ListData.price} onChange={(e) => this.Eprice(e.target.value)} />
                              <p className="abcd"></p>
                           </div>
                        </div>


                        {this.state.PriceType != "0" &&
                           <div className="form-row">
                              <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Min {this.state.PriceType == 1 ? 'Person' : ''} {this.state.PriceType == 2 ? 'Hour' : ''}</label>
                              <input className="In-box" type="number" defaultValue={this.state.ListData.minGuestRange == 0 ? 1 : this.state.ListData.minGuestRange} min={1} onChange={(e) => this.setState({ minGuestRange: e.target.value })} />
                           </div>
                        }
                        {this.state.PriceType != "0" &&
                           <div className="form-row">
                              <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Max {this.state.PriceType == 1 ? 'Person' : ''} {this.state.PriceType == 2 ? 'Hour' : ''}</label>
                              <input className="In-box" type="number" defaultValue={this.state.ListData.maxGuestRange == 0 ? 1 : this.state.ListData.maxGuestRange} min={1} onChange={(e) => this.setState({ maxGuestRange: e.target.value })} />
                           </div>
                        }


                        <div className="form-row">
                           <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Title</label>
                           <input className="In-box" type="text" defaultValue={this.state.ListData.title} onChange={(e) => this.Etitle(e.target.value)} />
                        </div>
                        <div className="form-row">
                           <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Type</label>
                           <select className="Sel-ect" value={this.state.TypeValue} onChange={value => {
                              this.handleType(value.target.value);
                           }}>
                              {
                                 this.state.serviceTypes.map((service, index) => {
                                    return <option value={service.value}>{service.label}</option>
                                 })
                              }
                           </select>
                        </div>
                        {this.state.ListData.status != 1 &&
                           <>
                              <div className="form-row">
                                 <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Location</label>
                                 
                                 <select className="Sel-ect" value={this.state.Elocation} onChange={(e) => this.Elocation(e.target.value)}>
                                    {
                                       this.state.locationList.map((loc, index) => {
                                          return <option value={loc.value}>{loc.value}</option>
                                       })
                                    }
                                 </select>
                              </div>

                              <div className="form-row form-row1">
                                 <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Phone Number</label>
                                 <PhoneInput
                                    inputStyle={{ borderRadius: "0px", width: "100%" }}
                                    country={'us'}
                                    value={this.state.EphoneNum}
                                    onChange={(e) => this.EphoneNum("+" + e)}
                                 />

                              </div>
                           </>
                        }
                        <div>
                           <h3 className="section-title">Feature Questions</h3>
                           {
                              this.state.features.map((ques, index) => (
                                 <div key={index}>
                                    <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>{ques.ques}</label>
                                    <select className="Sel-ect" defaultValue={ques.answ} onChange={(e) =>
                                       this.featureshandle(ques._id, e.target.value)}>
                                       {
                                          ques.value.map((f, i) => {
                                             return <option value={f}>{f}</option>
                                          })
                                       }
                                    </select>
                                 </div>
                              ))
                           }
                        </div>
                        <div>
                           {
                              this.state.selectedServiceTypeData.map((fil, index) => {
                                 return fil.filters.map((infiler, i) => (
                                    <div key={i} className="col-md-6" style={{ marginBottom: '15px' }}>


                                       {infiler.type === 1 && (
                                          <div>
                                             <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name}</h6>
                                             <select className="Sel-ect"
                                                onChange={(e) =>
                                                   this.filterChange(e.target.value, infiler.type, i, infiler._id, "singleSelect")}
                                                defaultValue={this.state.singleSelectData}
                                             >
                                                {this.state.singleSelectData == '' ? <option value="">Select</option> : ''}
                                                {
                                                   infiler.singleSelect.map((single, index) => {
                                                      return <option value={single}>{single}</option>
                                                   })
                                                }
                                             </select>
                                          </div>
                                       )}


                                       {infiler.type === 2 && (
                                          <div>
                                             <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                             <Select
                                                options={infiler.multiSelect.map((option, index) => {
                                                   return { label: option, value: option };
                                                })}
                                                defaultValue={
                                                   this.state.multiSelectList.map((option, index) => {
                                                      return { label: option, value: option };
                                                   })
                                                }
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                isMulti
                                                onChange={(e) => this.filterChange(this.getmultiSelect(e), infiler.type, i, infiler._id, "multiSelect")}
                                             />
                                          </div>
                                       )}


                                       {infiler.type === 3 && (
                                          <div>
                                             <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                             <div className="inner-trw-box" style={{ position: "relative" }}>
                                                <DatePicker minDate={new Date()}
                                                   showYearDropdown

                                                   selected={moment(this.state.Date).toDate()}
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


                                       {infiler.type === 4 && (
                                          <div>
                                             <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                             <div className="trw-box">
                                                <div className="inner-trw-box" style={{ position: "relative" }}>
                                                   <DatePicker minDate={new Date()}
                                                      dateFormat="dd/MM/yyyy"

                                                      showYearDropdown
                                                      onChange={(date) => {
                                                         this.filterChange(parseInt(moment(date).format("x")), infiler.type, i, infiler._id, "startDate")
                                                         this.setState({ startDate: date });
                                                      }
                                                      }
                                                      selected={moment(this.state.startDate).toDate()}
                                                   />
                                                   <span style={{ position: "absolute", right: "10px", top: "10px", fontSize: "20px", color: "#7a7a7a" }}>
                                                      <FaCalendar />
                                                   </span>
                                                </div>
                                                <div className="inner-trw-box" style={{ position: "relative" }}>
                                                   <DatePicker minDate={new Date()}
                                                      showYearDropdown
                                                      dateFormat="dd/MM/yyyy"
                                                      selected={moment(this.state.endDate).toDate()}
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


                                       {infiler.type === 5 && (
                                          <div>

                                             <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                             <div style={{ display: "flex", justifyContent: "left" }}>
                                                <input
                                                   style={{ width: "100%", backgroundColor: "#F7F7F7", border: "1px solid #dcdcdc", height: "40.5px", color: "#7a7a7a", fontSize: "14px", outline: "none", padding: "5px" }}
                                                   type="time"
                                                   id="appt"

                                                   defaultValue={moment(this.state.currentTime).format("HH:mm")}
                                                   placeholder={infiler.time}
                                                   value={infiler.time}
                                                   onChange={(e) =>
                                                      this.filterChange(moment("1 January 2021 " + e.target.value + ":00").format("x"), infiler.type, i, infiler._id, "time")
                                                   }
                                                />
                                             </div>
                                          </div>
                                       )}


                                       {infiler.type === 6 && (
                                          <div>

                                             <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                             <div className="time-box">
                                                <input
                                                   style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a" }}
                                                   type="time"
                                                   placeholder={infiler.startTime}
                                                   defaultValue={moment(this.state.startTime).format("HH:mm")}
                                                   onChange={(e) =>

                                                      this.filterChange(this.CheckTime(moment("1 January 2021 " + e.target.value + ":00").format("x")), infiler.type, i, infiler._id, "startTime")
                                                   }
                                                />
                                                <input
                                                   style={{ outline: "none", backgroundColor: "#F7F7F7", color: "#7a7a7a", }}
                                                   type="time"
                                                   placeholder={infiler.endTime}
                                                   defaultValue={moment(this.state.endTime).format("HH:mm")}
                                                   onChange={(e) =>
                                                      this.filterChange(this.CheckTime(moment("1 January 2021 " + e.target.value + ":00").format("x")), infiler.type, i, infiler._id, "endTime")
                                                   }
                                                />
                                             </div>
                                          </div>
                                       )}

                                       {infiler.type === 7 && (
                                          <div>
                                             <h6 className="title-box" style={{ marginBottom: "10px" }}>{infiler.name} </h6>
                                             <Row style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span>
                                                   {this.state.minMaxValue[0] == 0 ? parseInt(infiler.membersMinRange) : this.state.minMaxValue[0]}
                                                </span>
                                                <span >
                                                   {this.state.minMaxValue[1] == 0 ? parseInt(infiler.membersMaxRange) : this.state.minMaxValue[1]}
                                                </span>
                                             </Row>
                                             <Range
                                                key={i}
                                                step={1}
                                                defaultValue={[
                                                   this.state.minMaxValue[0] == 0 ? parseInt(infiler.membersMinRange) : this.state.minMaxValue[0],
                                                   this.state.minMaxValue[1] == 0 ? parseInt(infiler.membersMaxRange) : this.state.minMaxValue[1]
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
                                                {this.state.ListData.filterList[i].location && this.state.ListData.filterList[i].location.map((field, idx) => (
                                                   <input
                                                      style={{ backgroundColor: "#f7f7f7", border: "1px solid #dcdcdc", height: "40.5px", display: "block", outline: "none", color: "#7a7a7a", textTransform: "capitalize", marginBottom: "10px" }}
                                                      type="text"
                                                      className="loc-box"
                                                      key={idx}
                                                      defaultValue={field.address}
                                                      onChange={(e) => this.handleChange(e.target.value, infiler.type, i, infiler._id, idx)}
                                                   />
                                                ))
                                                }
                                                <Button
                                                   onClick={() => {
                                                      const temp = { ...this.state.ListData };
                                                      temp.filterList[i].location.push({
                                                         address: '',
                                                         latitude: '22.11',
                                                         longitude: '77,33',
                                                      });
                                                      this.setState({ ListData: temp });
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
                     </div>
                     <div className="right-part">
                        {formValue && formValue.status === '1' &&
                           <>
                              <div className="form-row left-label label-Bold composite-input" style={{ width: 'calc(50% - 8px)' }}>
                                 <label>Price</label>
                                 <div className="composite-container">
                                    <Field
                                       name="priceType"
                                       component={renderDropdown}
                                       required
                                       validate={[this.required]}
                                       options={[{ value: '0', label: "Whole" }, { value: '1', label: "Per Person" }, { value: '2', label: "Per Hr" }]}
                                    />
                                    <Field
                                       name="price"
                                       type="test"
                                       component={renderTextField}
                                       required
                                       validate={[this.required]}
                                       options={[{ value: 1, label: "Private" }, { value: 0, label: "Public" }]}
                                    />
                                 </div>
                              </div>
                              {this.state.selectedServiceTypeData[0] &&
                                 this.state.selectedServiceTypeData[0].questions &&
                                 this.state.selectedServiceTypeData[0].questions.length ?
                                 <div style={{ width: 'calc(50% - 8px)' }}>
                                    <h3 className="section-title">Feature Questions</h3>
                                    {this.renderQuestions()}
                                 </div >
                                 : ''
                              }
                           </>
                        }

                        {this.state.ListData.status != 1 && <div className="form-row">
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
                                          <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Title</label>
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
                                          <label style={{ color: "#000000", fontSize: "12px", display: "block", marginBottom: "10px" }}>Description</label>
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
                        {this.state.ListData.status != 1 && <div className="form-row">
                           <h3 className="section-title">Operational hours  <span style={{ color: '#f47824' }}><ControlPointIcon onClick={() => { this.setState({ addOperationalHours: true }); }} /></span></h3>
                           <div className="operational-hours">
                              {this.renderOperationHorsEdit()}
                           </div>
                        </div>
                        }
                        <input
                           accept="image/*"
                           type="file"
                           onChange={(e) => {
                              const config = {
                                 bucketName: "eventstannew",
                                 dirName: 'serviceImages',
                                 region: 'ap-south-1',
                                 accessKeyId: 'AKIA5KND4OBV5PG2JNJK',
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
                                 return <div className="img-box" ><img src={img} alt={index + 1} /><span style={{ cursor: "pointer" }} onClick={(e) => this.RemoveImage(index)}>x</span></div>
                              })
                           }
                        </div>

                        {this.state.ListData.status != 1 &&
                           <>
                              <ul>
                                 {
                                    this.state.selectedService.map((serve, index) => {
                                       var title = "";
                                       if (serve.label) {
                                          title = serve.label
                                       }
                                       if (serve.title) {
                                          title = serve.title
                                       }
                                       return <li className="link-list"> {serve.isCompulsory ? <input type="checkbox" onClick={e => this.handleIsCompulsory(index)} checked /> : <input type="checkbox" onClick={e => this.handleIsCompulsory(index)} />} {title} <span style={{ cursor: "pointer" }} onClick={() => this.Cancellink(index)}>x</span> </li>
                                    })
                                 }
                              </ul>
                              <div className="form-row link-button" style={{ width: "200px" }}>
                                 <button type="button" onClick={() => this.setState({ linkbtn: true })}>link services</button>
                              </div>

                           </>
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

                                    <Select
                                       options={this.state.linkservicetype.map((option, index) => {
                                          return { label: option.title, value: option._id };
                                       })}
                                       className="basic-multi-select"
                                       classNamePrefix="select"
                                       isMulti
                                       onChange={(e) => this.handleOnChange(e)}
                                    />

                                    <div className="multi-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "15px 0px" }}>
                                       <button onClick={() => this.setState({ linkbtn: false })} style={{ marginTop: "30px", width: "200px", padding: "10px 0px", border: "none", background: "#8489b2", color: "#fff", fontSize: "18px", borderRadius: "5px" }}>Save</button>
                                    </div>

                                 </div>
                              </div>
                              : ""
                        }
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