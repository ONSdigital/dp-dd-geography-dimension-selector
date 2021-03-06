import React, { Component, PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { findOptionsByParentID, findOptionsByType } from '../utils';
import Selector from './Selector';
import {
    requestMetadata,
    requestDimensions
} from '../../dataset/actions';


const propTypes = {
    dimensionID: PropTypes.string.isRequired,
    datasetID: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired
}

class Browser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialFetchRequired: false
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        if (!this.props.hasMetadata) {
            this.state.initialFetchRequired = true;
            return dispatch(requestMetadata(this.props.params.id));
        }
        if (!this.props.hasDimensions) {
            dispatch(requestDimensions(this.props.params.id));
        }
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
        const options = this.props.options;
        const optionsAreParents = options instanceof Array && options.length > 0 && !!options[0].options;
        return (
            <div className="margin-bottom--8">
                <div className="margin-top--2">
                    <Link onClick={hashHistory.goBack} className="btn--everything">Back</Link>
                </div>
                {(() => {return !optionsAreParents
                    ? this.renderDimensionSelector()
                    : this.renderOptions()
                })()}
            </div>
        )
    }

    renderDimensionSelector() {
        if (!this.props.hasDimensions) {
            return null;
        }

        const selectorProps = {
            router: this.props.router,
            datasetID: this.props.params.id,
            dimensionID: this.props.params.dimensionID,
            options: this.props.options,
            onSave: () => {
                this.props.router.push({
                    pathname: this.props.location.pathname,
                    query: {
                        action: 'summary'
                    }
                })
            }
        }

        return <Selector {...selectorProps} />
    }

    renderOptions () {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const options = this.props.options;

        const optionElements = options.map((option, index) => {
            const query = {
                action,
                id: option.id
            };
            let label = option.name;
            if (option.optionsType) {
                label = `${option.optionsType} in ${option.name}`;
            }
            if (option.options) {
                label += ` (${option.options.length})`;
            }
            let info = option.options && option.options.length > 0 ?`For example ${option.options[0].name}` : '';

            return (
                <div key={index} className="margin-top">
                    <Link to={{ pathname, query }}>{label}</Link><br />
                    <span>{info}</span>
                </div>
            )
        })

        return (
            <div>
                <h2 className="margin-top margin-bottom">Customise location</h2>
                {optionElements}
            </div>
        )
    }
}

Browser.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const optionID = ownProps.location.query.id || null;
    const dimension = dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });

    const options = optionID
        ? findOptionsByParentID({ options: dimension.options, id: optionID })
        : dimension.options;

    return {
        dimension,
        options: options || [],
        optionsCount: dimension.optionsCount
    }
}

export default connect(mapStateToProps)(Browser);