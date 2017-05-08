import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submitCondition } from '../../actions/firebase_actions';
import {firebase,firebaseDb} from '../../utils/firebase';
import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {RadioGroup, Radio} from 'react-radio-group';


//@ TODO add pull form db if set and two collumns
class SubmitUserSettings extends Component {

  constructor(props) {
      super(props);
      this.onFormSubmit = this.onFormSubmit.bind(this);
      this.state = {
        message: '',
        startDate: moment().subtract(18, 'years'),  // Yesterday at 4:11 PM
        sex: '',
    };
    this.handleDateTimeChange = this.handleDateTimeChange.bind(this);
  }

  handleDateTimeChange(date) {
    this.setState({
      startDate: date
    });
  }
  onFormSubmit(event) {
      event.preventDefault();
      let height = this.refs.height.value;
      let birthday = this.state.startDate.valueOf();
      let sex = this.state.sex;
      console.log("data imput", height, birthday, sex);
      this.setState({message: '',});

      if(height && birthday && sex){
        firebaseDb.ref("settings").child(this.props.currentUser.uid).set({
          height: height,
          birthday: birthday,
          sex: sex,
        });
        this.setState({
          message: 'Personal settings set',
        });  
      }else{
        this.setState({
          message: 'Please enter height, birthday and sex',
        });        
      }
    
  }

  setSex(value) {
    this.setState({sex: value});
  }

    render() {
      return (
      <form id="SubmitConditionData" role="form" onSubmit={this.onFormSubmit}>
        <h4> Your health details </h4>
        <em>For automated condition evaluation</em>
        <h5> {this.state.message} </h5>
        <div className="form-group">
          <label htmlFor="height"> Height </label>
          <div className="input-group">
            <input type="number" min="0" className="form-control"
              name="height" ref="height" id="height"
            />
            <span className="input-group-addon">cm</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="birthday"> Birthday  </label>
          <DatePicker
              className="birthday"
              dateFormat="YYYY-MM-DD"
              selected={this.state.startDate}
              showYearDropdown
              todayButton="Today"
              onChange={this.handleDateTimeChange}
          />
        </div>
        <div className="form-group">
        <label htmlFor="sex"> Sex  </label>
          <div className="input-group">
            <RadioGroup name="fruit" selectedValue={this.state.sex} onChange={this.setSex.bind(this)}>
              <Radio value="male" />Male
              <Radio value="female" />Female
            </RadioGroup>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Sumbmit</button>
      </form>
    );
  }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ submitCondition }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitUserSettings);
