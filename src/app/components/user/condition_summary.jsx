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
        summaryText: '',
        summaryType: '',
        norms:'',

    };
  }

  componentDidMount(){
    var lastPEF = 0;
     function Comparator(a, b) {
       if (a[0] > b[0]) return -1;
       if (a[0] < b[0]) return 1;
       return 0;
     }
    var pefRef = firebaseDb.ref('pef/'+this.props.currentUser.uid);
    pefRef.on('value', snap =>{
      var data = snap.val();
      if(data==null){
      this.setState({
        summaryText: "Please enter at least one PEF meassument",
      });
      }
      var chartData = [['Date', 'PEF']];
      var chartDataRaw = Object.keys(data).map(function (key) {
        return [data[key].timestamp, Number(data[key].pef)]; 
      });
      chartDataRaw = chartDataRaw.sort(Comparator)
      lastPEF = chartDataRaw[Object.keys(chartDataRaw)[0]];
      if(this.state.norms != ''){
        if(lastPEF[1] <= this.state.norms["min"]){
          console.log("BELOW MIN");
          this.setState({
            summaryText: <div><h2><span className="label label-danger">WARNING! </span></h2> <p> Your last PEF meassument was <span className="label label-danger">{lastPEF[1]} </span></p>
            <p>Its CRITICLY low please consider taking <u>imediate action</u>. Visit your doctors or refer to your action plan.</p></div>,
          });

        }else if (lastPEF[1] > this.state.norms["min"] && lastPEF[1] < this.state.norms["mid"]) {

          this.setState({

            summaryText: <div><h2><span className="label label-warning">CAUSION!</span></h2> <p>Your last PEF meassument was <span className="label label-warning"> {lastPEF[1]} </span></p>
            <p>Its below avearge and the day of meassument you may be more suceptable to alergens, physical or emotional stress.
            Please be careful.</p></div>,
          });
        }else if (lastPEF[1] >= this.state.norms["mid"] ) {

          this.setState({
            summaryText: <div><h2><span className="label label-success">Congradulations!</span></h2> <p> Your last PEF meassument was <span className="label label-success">{lastPEF[1]}</span></p>
            <p>Its above avearge and the day of meassument you should be more resiliant to alergens, physical or emotional stress.
            Enjoy your day.</p></div>,
          });
        }
        //console.log("CALL NT NULL", snap.val()["pefNorms"]["min"]);

      }else{
      this.setState({
        summaryText: "Your last PEF meassument was: "+lastPEF[1],
      });
    }
      console.log("last pEF", lastPEF[1]);
    });

    firebaseDb.ref("settings").child(this.props.currentUser.uid).child('pefNorms').on('value', snap =>{
      if(snap.val() != null){
        var norms = snap.val()["pefNorms"];
        this.setState({norms: norms});
        if(lastPEF[1] <= norms["min"]){
          console.log("BELOW MIN");
          this.setState({
            summaryText: <div><h2><span className="label label-danger">WARNING! </span></h2> <p> Your last PEF meassument was <span className="label label-danger">{lastPEF[1]} </span></p>
            <p>Its CRITICLY low plase consider taking imediate action. Visit your doctors or refer to your action plan.</p></div>,
          });

        }else if (lastPEF[1] > norms["min"] && lastPEF[1] < norms["mid"]) {

          this.setState({

            summaryText: <div><h2><span className="label label-warning">CAUSION!</span></h2> <p>Your last PEF meassument was <span className="label label-warning"> {lastPEF[1]} </span></p>
            <p>Its below avearge and the day of meassument you may be more suceptable to alergens, physical or emotional stress.
            Please be careful.</p></div>,
          });
        }else if (lastPEF[1] >= norms["mid"] ) {

          this.setState({
            summaryText: <div><h2><span className="label label-success">Congradulations!</span></h2> <p> Your last PEF meassument was <span className="label label-success">{lastPEF[1]}</span></p>
            <p>Its above avearge and the day of meassument you should be more resiliant to alergens, physical or emotional stress.
            Enjoy your day.</p></div>,
          });
        }
        console.log("CALL NT NULL", snap.val()["pefNorms"]["min"]);

      }else{

      }
      

    });
    console.log("CALL RESP", lastPEF[1]);

  }


    render() {
      return (
      <div className="jumbotron">
        <div>{this.state.summaryText}</div>
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
