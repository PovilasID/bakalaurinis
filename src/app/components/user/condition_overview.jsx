import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import { submitCondition } from '../../actions/firebase_actions';
import {Link} from 'react-router';

import Loading from '../helpers/loading';
import ConditionChart from './condition_chart';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {DataTable} from 'react-data-components';
require('react-bootstrap-table/css/react-bootstrap-table.css')

class ActionFormatter extends React.Component {
  render() {
    return (
      <button className='btn btn-info'>Action</button>
    );
  }
}

function actionFormatter(cell, row) {
    console.log("ACTION DATA", cell);
  return (
        <Link to={'pef/'+cell}>
            <button type="button" className="btn btn-info">Recomendations</button>
        </Link>
    );
}
class ConditionOverview extends Component {

    constructor(props) {
        super(props);


        this.state = {
            message: '',
            data: [
            { pef: 300, date: 'city value', id: 'dfgfgd', },
            { pef: 500, date: 'city value', id: '0000', }

            ],
            products:[],
            pefRaw: {},
        };
    }


    componentDidMount(){
        firebaseDb.ref("pef").child(this.props.patient).on('value', snap =>{
            console.log("PEF in overview", snap.val());
            this.setState({pefRaw: snap.val()
            });
        });
    }
    renderRecomendations(){
    return (
        <Link to="pef/booo">
            <button type="button" className="btn btn-info">Recomendations</button>
            </Link>
            );
    }


    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        var products = [{
              id: 1,
              name: "Product1",
              price: 120
          }, {
              id: 2,
              name: "Product2",
              price: 80
          }];
        return (

            <div className="col-md-12">
                
                <ConditionChart patient={this.props.patient} pefRaw={this.state.pefRaw}/>

                  <BootstrapTable data={this.state.data} striped hover pagination>
                      <TableHeaderColumn dataSort={ true } dataField='pef'>Product ID</TableHeaderColumn>
                      <TableHeaderColumn dataSort={ true } dataField='date'>Product Name</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField='id'  dataFormat={ actionFormatter }>Product Price</TableHeaderColumn>
                  </BootstrapTable>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConditionOverview);
