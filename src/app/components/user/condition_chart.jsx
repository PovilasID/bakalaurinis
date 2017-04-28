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
        title: 'Age vs. Weight comparison',
        hAxis: { title: 'Age', minValue: 0, maxValue: 15 },
        vAxis: { title: 'Weight', minValue: 0, maxValue: 15 },
        legend: 'none',
      },
      data: [
        ['Age', 'Weight'],
        [8, 12],
        [4, 5.5],
        [11, 14],
        [4, 5],
        [3, 3.5],
        [6.5, 7],
      ],
    };
  }

  componentDidMount(){
    console.log("USER ID IN CHARTS", this.props.currentUser.uid);
    firebaseDb.ref("pef").child(this.props.currentUser.uid).orderByChild("timestamp").on('value', snap =>{
      console.log("USERS PEF IN CHART", snap.val());
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
