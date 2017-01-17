import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {
    requestMetadata,
    requestDimensions
} from '../../actions';

class Browser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialFetchRequired: false
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        if (!this.props.hasDimensions) {
            this.state.initialFetchRequired = true;
            return dispatch(requestMetadata(this.props.params.id));
        }
        dispatch(requestDimensions(this.props.params.id));
    }


    shouldComponentUpdate(nextProps) {
        if (this.state.initialFetchRequired) {
            this.state.initialFetchRequired = false;
            nextProps.dispatch(requestDimensions(this.props.params.id));
            return false;
        }
        return true;
    }

    render () {
        const pathname = this.props.location.pathname;
        const options = this.props.options;
        return (
            <div>
            <h3>Browse</h3>
                <ul>
                    {options.map((dimension, index) => {
                        return <li key={index}>
                            <Link to={{ pathname, query: { id: dimension.id }}}>{dimension.name}</Link>
                        </li>
                    })}
                </ul>

                <hr/>
                <pre>
                {JSON.stringify(this.props.options, null, 2)}
                </pre>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const dimension = dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });
    const options = dimension.options;

    return {
        dimension,
        options,
        optionsCount: dimension.optionsCount
    }
}

export default connect(mapStateToProps)(Browser);