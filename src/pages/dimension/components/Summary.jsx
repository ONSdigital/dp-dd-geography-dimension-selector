import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { renderFlatHierarchy } from '../utils';

class Summary extends Component {
    constructor(props) {
        super(props)
    }


    render () {
        const options = this.props.options;
        const optionsAreParents = options instanceof Array && options.length > 0 && !!options[0].options;
        return (
            <div className="margin-bottom--8">
                <div className="margin-top--2">
                    <Link onClick={browserHistory.goBack} className="btn--everything">Back</Link>
                    <hr />
                    <pre>
                        {JSON.stringify(this.props.options, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const dimension = dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });

    const options = renderFlatHierarchy({
        hierarchy: dimension.options,
        filter: {
            selected: true
        }
    });

    return {
        options: options || [],
        optionsCount: dimension.optionsCount
    }
}

export default connect(mapStateToProps)(Summary);