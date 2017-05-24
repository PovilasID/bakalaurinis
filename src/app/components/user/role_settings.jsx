import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {RadioGroup, Radio} from 'react-radio-group';

import SubmitUserSettings from './submit_user_settings';
import RegisterToDoctor from './register_to_doctor'

import {firebase,firebaseDb} from '../../utils/firebase';


class RoleSettings extends Component {

  constructor(props) {
      super(props);
      this.setRole = this.setRole.bind(this);
      this.state = {
        message: '',
        role: '',
    };
  }


  componentDidMount(){
    const fireRoleRef = firebaseDb.ref("settings").child(this.props.currentUser.uid).child("role");
    fireRoleRef.on('value', snap =>{
      var data = snap.val();
      if(data==null){
        this.setState({
          role: "patient",
        });
        fireRoleRef.set("patient");
      }else{
        this.setState({
          role: data,
        });
      }
    });    
  }
  setRole(role) {
    if(this.refs.roleSwitch)
      this.setState({role: role});
    const fireRoleRef = firebaseDb.ref("settings").child(this.props.currentUser.uid).child("role");
    fireRoleRef.set(role);
    const fireDoctorListRef = firebaseDb.ref("doctors").child(this.props.currentUser.uid);
    if (role == "doctor") {
      var name = this.props.currentUser.displayName ? this.props.currentUser.displayName : this.props.currentUser.email; 
      fireDoctorListRef.child("name").set(name);
    } else {
      fireDoctorListRef.remove();
    }
    

  }


  RoleSettings() {
    if (this.state.role=="patient") {
      return (
        <div id="patientSettings">
          <SubmitUserSettings />
          <RegisterToDoctor />
        </div>);
    }
  }

    render() {

      return (
        <div id="roleSetings">
          <h3> Select your role </h3> 
          <div className="form-group">
          <label htmlFor="role">Role </label>
            <div className="input-group">
              <RadioGroup name="role" ref="roleSwitch" selectedValue={this.state.role} onChange={this.setRole}>
                <Radio value="patient" />Patient
                <Radio value="doctor" />Doctor
              </RadioGroup>
            </div>
          </div>
          {this.RoleSettings()}

        </div>
    );
  }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ RoleSettings }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleSettings);
