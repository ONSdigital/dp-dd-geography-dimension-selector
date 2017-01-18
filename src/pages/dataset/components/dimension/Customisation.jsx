import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';

import config from '../../../../config';


class Customisation extends Component {
    constructor(props) {
        super(props);
        this.selectAll = this.selectAll.bind(this);
    }

    selectAll() {
        throw new Error('.selectAll() is not implemented yet.');
    }

    render () {
        const pathname = this.props.location.pathname;

        return (
            <div className="margin-top">
                <Link onClick={browserHistory.goBack} className="btn--everything">Back</Link>

                <h2 className="margin-top margin-bottom">Customise location</h2>
                <p>
                    <Link to={{ pathname, query: { action: 'search' }}}>Search</Link><br />
                    Search for specific location
                </p>

                <p>
                    <Link to={{ pathname: pathname, query: { action: 'browse' }}}>Browse</Link><br />
                    Search for location from the list
                </p>

                <p>
                    <a onClick={this.selectAll}>All locatinos</a><br />
                    Add all locations in the dataset
                </p>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    const dimension = state.dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });

    return {
        dimension
    }
}

export default connect(mapStateToProps)(Customisation)