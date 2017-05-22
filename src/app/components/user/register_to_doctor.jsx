import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase,firebaseDb} from '../../utils/firebase';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


class RegisterToDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            allDoctors: [],
            doctors: '',
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
  // @ TODO make it work with async
  finalizeRegistration(e){
    e.preventDefault();

    const fireRegistrationsRef = firebaseDb.ref("registrations");
    fireRegistrationsRef.child(this.props.currentUser.uid).child("doctors").once('value', snap =>{
      console.log("PATH rez", Object.keys(snap.val()));
      console.log("DOCTORS",  this.state.doctors.split(','));
      let oldList = Object.keys(snap.val());
      let newList = this.state.doctors.split(',');
      let wipeList = oldList.filter(x => newList.indexOf(x) == -1);
      let addList = newList.filter(x => oldList.indexOf(x) == -1);
      //diff running two cycles id matches with old remove if matches with 
      console.log("wipeList",  wipeList);
      console.log("addList",  addList);
      for (let item of wipeList) {
        console.log("DESTROYYY",  item);
        fireRegistrationsRef.child(this.props.currentUser.uid).child("doctors").child(item).remove();
      }
      for (let item of wipeList) {
        console.log("SPAMM",  item);
        //add without deleting
        fireRegistrationsRef.child(this.props.currentUser.uid).child("doctors").update({});
      }
      
      console.log("DONE");
    });



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
              <div><button onClick={this.finalizeRegistration.bind(this)} className="btn btn-primary">Register</button></div>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ RegisterToDoctor }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterToDoctor);
