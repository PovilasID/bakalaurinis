import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submitCondition } from '../../actions/firebase_actions';
import {firebase,firebaseDb} from '../../utils/firebase';
import { Chart } from 'react-google-charts';
import moment from 'moment';
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

class ConditionChart extends Component {

  constructor(props) {
      super(props);
      this.state = {
        message: '',
        startDate : moment().subtract(1, 'month').valueOf(),
        endDate: moment().valueOf(),
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

  populateChart(){
    function Comparator(a, b) {
       if (a[0] < b[0]) return -1;
       if (a[0] > b[0]) return 1;
       return 0;
     }

    var startDate = moment().subtract(2, 'days').valueOf();
    var endDate = moment().valueOf();
    firebaseDb.ref("pef").child(this.props.patient).orderByChild("timestamp").startAt(this.state.startDate).endAt(this.state.endDate).on('value', snap =>{
      var data = snap.val();
      if(data){

        var chartData = [['Date', 'PEF']];
        var chartDataRaw = Object.keys(data).map(function (key) {
          return [new Date(data[key].timestamp), Number(data[key].pef)]; 
        });
        chartDataRaw = chartDataRaw.sort(Comparator)
         this.setState({
          data: chartData.concat(chartDataRaw)
        });
      }
    });
  }

  handleStartDateChenge(date){
    this.setState({startDate:date.valueOf()});
    this.populateChart();
  }
  handleEndDateChenge(date){
    this.setState({endDate:date.valueOf()});
    this.populateChart();
  }
  componentWillMount(){
    this.populateChart();

  }


    render() {
      return (
        <div>

          <form className="form-inline">
              <Datetime className="form-group" id="exampleInputName2"
                value={this.state.startDate} 
                dateFormat="YYYY-MM-DD" 
                timeFormat={false} 
                isValidDate={(current) => current.isBefore(Datetime.moment())}
                onChange={this.handleStartDateChenge.bind(this)} 
              />
              <Datetime 
                className="form-group" id="exampleInputEmail2"
                value={this.state.endDate} 
                dateFormat="YYYY-MM-DD" 
                timeFormat={false} 
                isValidDate={(current) => current.isBefore(Datetime.moment())}
                onChange={this.handleEndDateChenge.bind(this) } 
              />
          </form>
          <Chart
            chartType="LineChart"
            data={this.state.data}
            options={this.state.options}
            width="100%"
            height="400px"
            legend_toggle
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(ConditionChart);
