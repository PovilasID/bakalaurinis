import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submitCondition } from '../../actions/firebase_actions';
import {firebase,firebaseDb} from '../../utils/firebase';
import { Chart } from 'react-google-charts';




class ConditionChart extends Component {

  constructor(props) {
      super(props);
      this.state = {
        message: '',
        options: {
        title: 'PEF change overtiem',
        hAxis: { title: 'Time'},
        vAxis: { title: 'PEF',
          viewWindow: {
            min: 0
          } 
        },
        legend: 'none',
        curveType: 'function',
        pointSize: 7,

      },
      data: [
        ['Date', 'PEF'],
        [0,0]
      ],

    };
  }

  //@ TODO code for no data

  componentDidMount(){

     function Comparator(a, b) {
       if (a[0] < b[0]) return -1;
       if (a[0] > b[0]) return 1;
       return 0;
     }
    console.log("USER ID IN CHARTS", this.props.patient);
    firebaseDb.ref("pef").child(this.props.patient).on('value', snap =>{
      var data = snap.val();
      var chartData = [['Date', 'PEF']];
      var chartDataRaw = Object.keys(data).map(function (key) {
        return [new Date(data[key].timestamp), Number(data[key].pef)]; 
      });
      chartDataRaw = chartDataRaw.sort(Comparator)
       this.setState({
        data: chartData.concat(chartDataRaw)
      })
      console.log("STATE FORMAT", this.state.data);
      console.log("CONCAT RESULTS", chartData.concat(chartDataRaw) );
      console.log("CHART ARRAY DEFAULTS", this.state.data);
      console.log("TEST GOOGLE DATE FORMAT", new Date(2000, 8, 5));

    });
  }


    render() {
      return (
      <Chart
        chartType="LineChart"
        data={this.state.data}
        options={this.state.options}
        graph_id="LineChart"
        width="100%"
        height="400px"
        legend_toggle
      />
    );
  }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ submitCondition }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionChart);
