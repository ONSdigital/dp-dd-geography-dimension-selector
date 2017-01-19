import React, { Component, PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { deselectAllOptions, selectAllOptions } from '../../dataset/actions';
class Customisation extends Component {
    constructor(props) {
        super(props);
        this.selectAll = this.selectAll.bind(this);
    }

    selectAll() {
        this.props.dispatch(selectAllOptions(this.props.dimensionID))
        this.props.router.push({
            pathname: this.props.location.pathname,
            query: {
                action: 'summary'
            }
        })
    }

    componentWillMount() {
        if (!this.props.dimension.edited) {
            this.props.dispatch(deselectAllOptions(this.props.dimensionID))
        }
    }

    render () {
        const pathname = this.props.location.pathname;

        return (
            <div className="margin-top">
                <Link onClick={hashHistory.goBack} className="btn--everything">Back</Link>

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
                    <a onClick={this.selectAll}>All locations</a><br />
                    Add all locations in the dataset
                </p>

                <p>
                    <Link to={{ pathname: pathname, query: { action: 'summary' }}}>Your selections</Link><br />
                    Review your selected locations
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