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

  renderSummary(){
    var lastPEF = 0;
     function Comparator(a, b) {
       if (a[0] > b[0]) return -1;
       if (a[0] < b[0]) return 1;
       return 0;
     }
    var pefRef = firebaseDb.ref('paf/'+this.props.currentUser.uid);
    pefRef.on('value', snap =>{
      var data = snap.val();
      if(data==null){
        return <p>Please enter at least one PEF meassument</p>;
      }
      var chartData = [['Date', 'PEF']];
      var chartDataRaw = Object.keys(data).map(function (key) {
        return [data[key].timestamp, Number(data[key].pef)]; 
      });
      chartDataRaw = chartDataRaw.sort(Comparator)
      lastPEF = chartDataRaw[Object.keys(chartDataRaw)[0]];
      console.log("last pEF", lastPEF);
    });

    firebaseDb.ref("settings").child(this.props.currentUser.uid).on('value', snap =>{
      if(snap.val() == null){
        console.log("CALL NULL", lastPEF[1]);
         return (<p>Your last PEF meassument was<h3>{lastPEF[1]}</h3></p>);
      }else{

      }
      

    });
    console.log("CALL RESP", lastPEF[1]);

  }


    render() {
      return (
      <div className="jumbotron">
        <h1>Hello, world!</h1>
                <div className="alert alert-success" role="alert">
          <p>WEEE</p>
        </div>
        <div>{this.renderSummary()}</div>
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
