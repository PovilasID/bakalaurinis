import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submitCondition } from '../../actions/firebase_actions';
import {firebase,firebaseDb} from '../../utils/firebase';
import moment from 'moment';
import {RadioGroup, Radio} from 'react-radio-group';
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

//@ TODO add pull form db if set and two collumns
class SubmitUserSettings extends Component {

  constructor(props) {
      super(props);
      this.onFormSubmit = this.onFormSubmit.bind(this);
      this.state = {
        message: '',
        startDate: Datetime.moment().subtract(18, 'years'), 
        sex: '',
        height: '',
    };
    this.handleDateTimeChange = this.handleDateTimeChange.bind(this);
  }


  handleDateTimeChange(date) {
    this.setState({
      startDate: date
    });
  }
  handleHeightChange(event) {
    this.setState({height: event.target.value});
  }
  componentDidMount(){

    firebaseDb.ref("settings").child(this.props.currentUser.uid).on('value', snap =>{
      var data = snap.val();

       this.setState({
        height: data.height,
        startDate: moment(data.birthday),
        sex: data.sex,
      })

    });

  }
  onFormSubmit(event) {
      event.preventDefault();
      let height = this.state.height;
      let birthday = this.state.startDate.valueOf();
      let sex = this.state.sex;
      console.log("data imput", height, birthday, sex);
      this.setState({message: '',});
      var pefMin=0;
      var pefMid=0;
      var fev1Min=0;
      var fev1Mid=0;
      function getAge(dateString) {
          var today = new Date();
          var birthDate = new Date(dateString);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
          }
          return age;
      }
      function eTo(x){
      return Math.exp(x);
      }
      function ln(i){
      return Math.log(i);
      }

      var age = getAge(birthday);
      if(sex == "male"){
        if(age < 20){
          fev1Mid = (-0.7453+height*height*0.00014098+age*-0.04106+age*age*0.004477)*0.8*60;
          fev1Min = (-0.7453+height*height*0.00014098+age*-0.04106+age*age*0.004477)*0.5*60;
        }else{
          fev1Mid=(0.5536+height*height*0.00014098+age*-0.01303+age*age*-0.000172)*0.8*60;
          fev1Min=(0.5536+height*height*0.00014098+age*-0.01303+age*age*-0.000172)*0.5*60;

        }
        //pefMin =Math.pow(Math.E, 0.544 * Math.log10(age) - 0.0151 *(age) - 74.7/(height) + 5.48);
        pefMin=  (eTo((0.544 * ln(age)) - (0.0151 * age) - (74.7 / height) + 5.48))*0.5;
        pefMid=  eTo((0.544 * ln(age)) - (0.0151 * age) - (74.7 / height) + 5.48);
      }else{
        if(age < 18){
          fev1Mid =(-0.871+height*height*0.00011496+age*0.06537)*0.8*60;
          fev1Min =(-0.871+height*height*0.00011496+age*0.06537)*0.5*60;
        }else{
          fev1Mid=(0.4333+height*height*0.00011496+age*-0.00361+age*age*-0.000194)*0.8*60;
          fev1Min=(0.4333+height*height*0.00011496+age*-0.00361+age*age*-0.000194)*0.5*60;
        }
        pefMid =  eTo((0.376 * ln(age)) - (0.012 * age) - (58.8 / height) + 5.63);
        pefMin = (eTo((0.376 * ln(age)) - (0.012 * age) - (58.8 / height) + 5.63))*0.5;

      } 
      console.log("MID FEV1", fev1Mid*60);
      if(height && birthday && sex && this.state.startDate.isBefore(Datetime.moment().subtract(3, 'years'))){
        firebaseDb.ref("settings").child(this.props.currentUser.uid).set({
          height: height,
          birthday: birthday,
          sex: sex,
          pefNorms:{
            min: pefMin,
            mid: pefMid,
          },
          fev1Norms:{
            min: fev1Min,
            mid: fev1Mid,
          },
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

  getValidDate(currentDate, selectedDate){
    console.log("THE CURRENT", current);
    return currentDate.isAfter(  moment() );
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
              name="height" ref="height" id="height" value={this.state.height} onChange={this.handleHeightChange.bind(this)}
            />
            <span className="input-group-addon">cm</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="birthday"> Birthday  </label>
          <Datetime 
            className="birthday" 
            value={this.state.startDate} 
            dateFormat="YYYY-MM-DD" 
            isValidDate={(current) => current.isBefore(Datetime.moment().subtract(3, 'years'))}
            timeFormat={false}  
            onChange={(date) => this.setState({startDate:date})} 
          />

        </div>
        <div className="form-group">
        <label htmlFor="sex"> Sex  </label>
          <div className="input-group">
            <RadioGroup name="sex" selectedValue={this.state.sex} onChange={this.setSex.bind(this)}>
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
