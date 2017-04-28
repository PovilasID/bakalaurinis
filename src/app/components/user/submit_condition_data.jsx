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
      firebaseDb.ref("pef").child(this.props.currentUser.uid).push().set({
        pef: pef,
        timestamp: this.state.startDate.unix()*1000,
      });

    
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
