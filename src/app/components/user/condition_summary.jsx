import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submitCondition } from '../../actions/firebase_actions';
import {firebase,firebaseDb} from '../../utils/firebase';
import moment from 'moment';



class ConditionSummary extends Component {

  constructor(props) {
      super(props);
      this.state = {
        message: '',
        fullSummary: '',
        summaryText: '',
        summaryType: '',
        norms:'',
        fev1orms:'',

    };
  }

  componentDidMount(){
    var lastPEF = 0;
    var previousPEF = 0;
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
      }else{
      var chartDataRaw = Object.keys(data).map(function (key) {
        return [data[key].timestamp, Number(data[key].pef), Number(data[key].fev1)]; 
      });
      chartDataRaw = chartDataRaw.sort(Comparator)
      lastPEF = chartDataRaw[Object.keys(chartDataRaw)[0]];

      // @ TODO handel if its the only one
      previousPEF = chartDataRaw[Object.keys(chartDataRaw)[1]];

      if(this.state.norms != ''){
        if(lastPEF[2] > 0 ){
          //FEV 
          if(lastPEF[2] <= this.state.fev1Norms["min"]){
            this.setState({
              summaryText: <div><h2><span className="label label-danger">WARNING! </span></h2> <p> Your last FEV1 meassument was <span className="label label-danger">{lastPEF[2]} </span></p>
              <p>Its CRITICLY low please consider taking <u>imediate action</u>. Visit your doctors or refer to your action plan.</p></div>,
            });

          }else if ((lastPEF[2] > this.state.fev1Norms["min"] && lastPEF[2] < this.state.fev1Norms["mid"]) ||
            (moment(previousPEF[0]).isAfter(moment(lastPEF[0]).subtract(1, 'day')) &&  (lastPEF[2]*0.8 >= previousPEF[2] || lastPEF[2]*1.2 <= previousPEF[2]) && previousPEF[2] > 0 ) ){

            this.setState({

              summaryText: <div><h2><span className="label label-warning">CAUSION!</span></h2> <p>Your last FEV1 meassument was <span className="label label-warning"> {lastPEF[2]} </span></p>
              <p>Its below avearge and the day of meassument you may be more suceptable to alergens, physical or emotional stress.
              Please be careful.</p></div>,
            });
          }else if (lastPEF[2] >= this.state.fev1Norms["mid"] ) {

            this.setState({
              summaryText: <div><h2><span className="label label-success">Congradulations!</span></h2> <p> Your last FEV1 meassument was <span className="label label-success">{lastPEF[2]}</span></p>
              <p>Its above avearge and the day of meassument you should be more resiliant to alergens, physical or emotional stress.
              Enjoy your day.</p></div>,
            });
          }

        }else{
          if(lastPEF[1] <= this.state.norms["min"]){
            this.setState({
              summaryText: <div><h2><span className="label label-danger">WARNING! </span></h2> <p> Your last PEF meassument was <span className="label label-danger">{lastPEF[1]} </span></p>
              <p>Its CRITICLY low please consider taking <u>imediate action</u>. Visit your doctors or refer to your action plan.</p></div>,
            });

          }else if ((lastPEF[1] > this.state.norms["min"] && lastPEF[1] < this.state.norms["mid"]) ||
            (moment(previousPEF[0]).isAfter(moment(lastPEF[0]).subtract(1, 'day')) &&  (lastPEF[1]*0.8 >= previousPEF[1] || lastPEF[1]*1.2 <= previousPEF[1])) ){

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
        }
      }else{
      this.setState({
        summaryText: "Your last PEF meassument was: "+lastPEF[1],
      });
    }
  }
    });

    firebaseDb.ref("settings").child(this.props.currentUser.uid).on('value', snap =>{
      var norms = snap.val().pefNorms;
      var fev1Norms = snap.val().fev1Norms;
      if(snap.val() != null){
        this.setState({norms: norms});
        this.setState({fev1Norms: fev1Norms});

        if(lastPEF[2] > 0 ){
          //FEV
          if(lastPEF[2] <= fev1Norms.min){
            this.setState({
              summaryText: <div><h2><span className="label label-danger">WARNING! </span></h2> <p> Your last FEV1 meassument was <span className="label label-danger">{lastPEF[2]} </span></p>
              <p>Its CRITICLY low please consider taking <u>imediate action</u>. Visit your doctors or refer to your action plan.</p></div>,
            });

          }else if ((lastPEF[2] > fev1Norms.min && lastPEF[2] < fev1Norms.mid) ||
            (moment(previousPEF[0]).isAfter(moment(lastPEF[0]).subtract(1, 'day')) &&  (lastPEF[2]*0.8 >= previousPEF[2] || lastPEF[2]*1.2 <= previousPEF[2]) && previousPEF[2] > 0 ) ){

            this.setState({

              summaryText: <div><h2><span className="label label-warning">CAUSION!</span></h2> <p>Your last FEV1 meassument was <span className="label label-warning"> {lastPEF[2]} </span></p>
              <p>Its below avearge and the day of meassument you may be more suceptable to alergens, physical or emotional stress.
              Please be careful.</p></div>,
            });
          }else if (lastPEF[2] >= fev1Norms.mid ) {

            this.setState({
              summaryText: <div><h2><span className="label label-success">Congradulations!</span></h2> <p> Your last FEV1 meassument was <span className="label label-success">{lastPEF[2]}</span></p>
              <p>Its above avearge and the day of meassument you should be more resiliant to alergens, physical or emotional stress.
              Enjoy your day.</p></div>,
            });
          }

        }else{

          if(lastPEF[1] <= norms.min){
            this.setState({
              summaryText: <div><h2><span className="label label-danger">WARNING! </span></h2> <p> Your last PEF meassument was <span className="label label-danger">{lastPEF[1]} </span></p>
              <p>Its CRITICLY low plase consider taking imediate action. Visit your doctors or refer to your action plan.</p></div>,
            });

          }else if ((lastPEF[1] > norms.min && lastPEF[1] < norms.mid) ||
            (moment(previousPEF[0]).isAfter(moment(lastPEF[0]).subtract(1, 'day')) &&  (lastPEF[1]*0.8 >= previousPEF[1] || lastPEF[1]*1.2 <= previousPEF[1])) )  {


            this.setState({

              summaryText: <div><h2><span className="label label-warning">CAUSION!</span></h2> <p>Your last PEF meassument was <span className="label label-warning"> {lastPEF[1]} </span></p>
              <p>Its below avearge and the day of meassument you may be more suceptable to alergens, physical or emotional stress.
              Please be careful.</p></div>,
            });
          }else if (lastPEF[1] >= norms.mid ) {

            this.setState({
              summaryText: <div><h2><span className="label label-success">Congradulations!</span></h2> <p> Your last PEF meassument was <span className="label label-success">{lastPEF[1]}</span></p>
              <p>Its above avearge and the day of meassument you should be more resiliant to alergens, physical or emotional stress.
              Enjoy your day.</p></div>,
            });
          }
        }

      }else{

      }
      

    });

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
