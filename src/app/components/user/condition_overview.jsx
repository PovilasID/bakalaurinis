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
import moment from 'moment';


require('react-bootstrap-table/css/react-bootstrap-table.css')


class ConditionOverview extends Component {

    constructor(props) {
        super(props);


        this.state = {
            message: '',
            data: [],
            products:[],
            pefRaw: {},
            options: {
                defaultSortName: 'date', 
                defaultSortOrder: 'desc'
            },
        };
    }


    componentWillMount(){
        firebaseDb.ref("pef").child(this.props.patient).on('value', snap =>{
            var data = snap.val();
            if(data){
                console.log("PEF in overview", snap.val());
                this.setState({pefRaw: data});
                var pefDataRaw = Object.keys(data).map(function (key) {
                    return {date: moment(data[key].timestamp).format('YYYY-MM-DD HH:mm'), pef: Number(data[key].pef), id: key};
                });
                this.setState({data: pefDataRaw});
                console.log("PEF table", pefDataRaw);
            }
        });
    }
    removePEF(e, refPath){
        e.preventDefault();
        if(confirm('If there are any recomendations for this it will make them unaccesable. Are you sure you want to delete it?')){
            console.log("NUKE THAT PEF", refPath);
            firebaseDb.ref(refPath).remove();
        }

    }

    actionFormatter(cell, row) {
      return (
            <Link to={'pef/'+this.props.patient+'/'+cell}>
                <button type="button" className="btn btn-info">Recomendations</button>
                {(this.props.patient == this.props.currentUser.uid)?
                    <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={(e) => this.removePEF(e, 'pef/'+this.props.patient+'/'+cell)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>:''
                    
                    }
            </Link>
        );
    }


    // @ TODO add delete add color lights add lines or dot coloring add difference chart
    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        return (

            <div className="col-md-12">

                <ConditionChart patient={this.props.patient} pefRaw={this.state.pefRaw}/>
                  <BootstrapTable data={this.state.data} options={ this.state.options} striped hover pagination>
                      <TableHeaderColumn dataSort={ true } dataField='pef'>PEF value</TableHeaderColumn>
                      <TableHeaderColumn dataSort={ true } dataField='date'>Date and time</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField='id'  dataFormat={ this.actionFormatter.bind(this) }>Recomendations</TableHeaderColumn>
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
