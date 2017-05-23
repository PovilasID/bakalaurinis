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

        const renderRecomendations =
            (val, row) =>
              <Link to="pef/booo">
                <button type="button" class="btn btn-info">Recomendations</button>
              </Link>;

class ConditionOverview extends Component {

    constructor(props) {
        super(props);


        this.state = {
            message: '',
            data: [
            { name: 'name ', city: 'city value', address: 'address value', phone: 'phone value' }
            ],
            columns : [
              { title: 'Name', prop: 'name'  },
              { title: 'City', prop: 'city' },
              { title: 'Address', prop: 'address' },
              { title: 'Recomendations', render: renderRecomendations, className: 'text-center' },
            ],
            products:[],
        };
    }




    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }

        return (

            <div className="col-md-12">
                
                <ConditionChart patient={this.props.patient}/>

                <DataTable
                  keys="name"
                  columns={this.state.columns}
                  initialData={this.state.data}
                  initialPageLength={5}
                  initialSortBy={{ prop: 'city', order: 'descending' }}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConditionOverview);
