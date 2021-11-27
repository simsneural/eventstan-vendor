import React, { Component } from "react";
import { Field } from "redux-form";
import { Typography,
    Slider } from "@material-ui/core";

import { renderTextField, renderDropdown, datePicker } from '../../../ui/form-elements';

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderValue: [23,25]
        };
    }
    required = (value) => value ? undefined : 'Required';

    handleSliderChange = (event, newValue) => {
        this.setState({sliderValue: newValue})
    };

    renderFilters = (filter) => {
        console.log('filter',filter);
        switch (filter.type) {
            case 1:
                const singleSelectOptions = []
                filter.singleSelect.forEach(option => {
                    console.log('option',option)
                    singleSelectOptions.push({value: option,label: option});
                });
                    
                return <Field
                            name="priceType"
                            component={renderDropdown}
                            required
                            label={filter.name}
                            validate={[this.required]}
                            options={singleSelectOptions}
                        />;
                break;
            case 2:
                const multiSelectOptions = []
                filter.multiSelect.forEach(option => {
                    console.log('option',option)
                    multiSelectOptions.push({value: option,label: option});
                });
                return '';
                break;
            case 3:
                return <Field
                        name="date"
                        type="date"
                        component={renderTextField}
                        required
                        label={filter.name}
                        validate={[this.required]}
                    />;
                break;
            case 4:
                return 'Date Range/';
                break;
            case 5:
                return <Field
                            name="time"
                            type="time"
                            component={renderTextField}
                            required
                            label={filter.name}
                            validate={[this.required]}
                        />;;
                break;
            case 6:
                console.log('time range',filter);
                return 'Time Range/';
                break;
            case 7:
                return <div>
                    <Typography id="range-slider" gutterBottom>
                        Temperature range
                    </Typography>
                    <Slider
                        value={this.state.sliderValue}
                        onChange={this.handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={filter.membersMinRange ? parseInt(filter.membersMinRange,10): ''}
                        max={filter.membersMaxRange ? parseInt(filter.membersMaxRange,10): ''}
                    />
                </div>;
                break;
            case 8:
                return 'Location/';
                break;
            default:
                return '';
        }
    };
    render() {
        return (
            <>
            {this.props.filters.map((filter, index) => (
                this.renderFilters(filter)
            ))}
            </>
        );
    }
}

export default Filters;
