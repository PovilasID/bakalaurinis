import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submitCondition } from '../../actions/firebase_actions';
import {firebase,firebaseDb} from '../../utils/firebase';



class ConditionSummary extends Component {

  constructor(props) {
      super(props);
      this.state = {
        message: '',
        fullSummary: '',
    };
  }

  renderSummary(settingsAvailable){

  }

  componentDidMount(){
    var UUID = this.props.currentUser.uid;

    firebaseDb.ref("settings").once('value', function (snap) {
        if(snap.hasChild(UUID)){
          this.setState({
            fullSummary: true,
          });
        }else{
          this.setState({
            fullSummary: false,
          });
        }
      });

  
  }

    render() {
      return (
      <div className="jumbotron">
        <h1>Hello, world!</h1>
                <div className="alert alert-success" role="alert">
          <p>WEEE</p>
        </div>
        <div>{this.renderSummary(this.state.fullSummary).bind(this)}</div>
        <p><a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p>
      </div>
    );
  }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ submitCondition }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionSummary);
