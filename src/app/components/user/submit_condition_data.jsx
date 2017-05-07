import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submitCondition } from '../../actions/firebase_actions';
import {firebase,firebaseDb} from '../../utils/firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';



class SubmitConditionData extends Component {

  constructor(props) {
      super(props);
      this.onFormSubmit = this.onFormSubmit.bind(this);
      this.state = {
        message: '',
        startDate: moment(),
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
      let pef = this.refs.pef.value;
      let fev1 = this.refs.fev1.value;
      let timestamp = this.state.startDate.valueOf();
      this.setState({message: '',});
      if (pef) {
        firebaseDb.ref("pef").child(this.props.currentUser.uid).push().set({
          pef: pef,
          timestamp: timestamp,
        });
        if(fev1){
          firebaseDb.ref("fev1").child(this.props.currentUser.uid).push().set({
          fev1: fev1,
          timestamp: timestamp,
        });
        }
      }else{
        this.setState({
          message: 'Please enter PEF',
        });
      }
      
    
  }

    render() {
      return (
      <form id="SubmitConditionData" role="form" onSubmit={this.onFormSubmit}>
        <h4> How do you feel? </h4>
        <h5> {this.state.message} </h5>
        <div className="form-group">
          <label htmlFor="pef"> PEF </label>
          <input type="number" min="0" className="form-control"
            name="pef" ref="pef" id="pef" 
          />
          <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
            Add FEV 1
          </button>
          <div className="collapse" id="collapseExample">
            <label htmlFor="fev1"> FEV1 </label>
            <input type="number" min="0" className="form-control"
              name="fev1" ref="fev1" id="fev1" 
            />
          </div>
        </div>
        <div className="form-group">
          <DatePicker
              dateFormat="DD-MMM HH:mm"
              selected={this.state.startDate}
              todayButton="Today"
              onChange={this.handleDateTimeChange}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(SubmitConditionData);
