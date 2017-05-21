import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changePassword } from '../../actions/firebase_actions';
import {RadioGroup, Radio} from 'react-radio-group';
import SubmitUserSettings from './submit_user_settings';
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
      console.log("ROLE FIREBAS VAL", data);
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
    const fireRoleRef = firebaseDb.ref("settings").child(this.props.currentUser.uid).child("role");
    this.setState({role: role});
    fireRoleRef.set(role);
  }

  RoleSettings() {
    if (this.state.role=="patient") {
      return <SubmitUserSettings />;
    }
    return <h1>HA</h1>;
  }

    render() {
      return (
        <div id="roleSetings">
          <div className="form-group">
          <label htmlFor="role"> Role  </label>
            <div className="input-group">
              <RadioGroup name="role" selectedValue={this.state.role} onChange={this.setRole}>
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
    return bindActionCreators({ changePassword }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleSettings);
