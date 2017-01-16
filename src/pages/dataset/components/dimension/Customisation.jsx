import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';

import config from '../../../../config';


export default class Customisation extends Component {
    constructor(props) {
        super(props);
        this.selectAll = this.selectAll.bind(this);
    }

    selectAll() {
        throw new Error('.selectAll() is not implemented yet.');
    }

    render () {
        const datasetID = this.props.params.id;
        const dimensionID = this.props.params.dimensionID;
        const basePath = `${config.BASE_PATH}/dataset/${datasetID}/dimension/${dimensionID}`;

        return (
            <div className="margin-top--2">
                <Link onClick={browserHistory.goBack} className="btn--everything">Back</Link>

                <h3>Customise location</h3>

            </div>
        )
    }
}


