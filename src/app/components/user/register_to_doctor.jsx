import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase,firebaseDb} from '../../utils/firebase';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const FLAVOURS = [
  { label: 'Chocolate', value: 'chocolate' },
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Caramel', value: 'caramel' },
  { label: 'Cookies and Cream', value: 'cookiescream' },
  { label: 'Peppermint', value: 'peppermint' },
];

class RegisterToDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            allDoctors: FLAVOURS,
            doctors: [],
        };
    }
  componentDidMount(){
    const fireDoctorRef = firebaseDb.ref("doctors");

    var options = [];
    fireDoctorRef.on('value', snap =>{
      var data = snap.val();
      Object.keys(data).map(function(key, index) {
         options = options.concat({ value: key, label: data[key].name});
      });
      this.setState({allDoctors: options});
    });
  }
  handleSelectChange (value) {
    console.log('You\'ve selected:', value);
    this.setState({ doctors: value });
  }
  finalizeRegistration(){
    console.log("POKEE POKEE");

  }

    render() {
        return (

            <div id="RegisterToDoctor">
            <h4>Register to doctor(s)</h4>
            <em>You can allow doctors to see your data</em>
              <div className="form-group">
                <label htmlFor="registration">Doctors </label>
                <div className="">
                    <Select name="registration" className="d-block" multi simpleValue 
                        value={this.state.doctors} 
                        placeholder="Select your doctor(s)" 
                        options={this.state.allDoctors} 
                        onChange={this.handleSelectChange.bind(this)} />
                </div>
              </div>
              <div><button className="btn btn-primary" onClick={this.finalizeRegistration()}>Register</button></div>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        RegisterToDoctor,
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(RegisterToDoctor);
