import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../config';

import Browser from './dimension/Browser';
import Customisation from './dimension/Customisation';
import Search from './dimension/Search';
import Summary from './dimension/Summary';

import {
    requestMetadata,
    requestDimensions
} from '../actions';

import DimensionList from './DimensionList';
import DimensionSelector from './dimension/DimensionSelector';
import DocumentTitle from '../../../components/elements/DocumentTitle';

const propTypes = {
    hasDimensions: PropTypes.bool.isRequired,
    hasMetadata: PropTypes.bool.isRequired,
    dimensions: PropTypes.array
}

class Dimension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialFetchRequired: false,
            parentPath: `${config.BASE_PATH}/dataset/${this.props.params.id}/`,
            currentPath: `${config.BASE_PATH}/dataset/${this.props.params.id}/dimensions`,
            downloadPath: `${config.BASE_PATH}/dataset/${this.props.params.id}/download`
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        if (!this.props.title) {
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

    render() {
        const props = this.props;
        if (!props.hasDimensions) return null;
        if (props.params.dimensionID === undefined) {
            return this.renderDimensionList();
        }
        const defaultProps = {
            datasetID: props.params.id,
            dimensionID: props.params.dimensionID
        }
        const componentProps = Object.assign({}, props, defaultProps);

        switch (props.location.query.action) {
            case 'customise':
                return <Customisation {...componentProps} />;
            case 'browse':
                return <Browser {...componentProps} />;
            case 'search':
                return <Search {...componentProps} />;
            case 'summary':
                return <Summary {...componentProps} />;
        }
        return this.renderDimensionSelector();
    }

    renderDimensionList() {
        const parentPath = this.state.parentPath;
        const dimensions = this.props.dimensions;

        if (!this.props.hasMetadata) {
            return null;
        }

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                    <DocumentTitle title={`Customise ${this.props.title}`}>
                        <h1 className="margin-top--half margin-bottom">Customise this dataset</h1>
                    </DocumentTitle>
                </div>
                <div>
                    <DimensionList dimensions={dimensions} />
                    <div className="margin-top--4 margin-bottom--8">
                        <Link className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                              to={this.state.downloadPath}>Choose a download format</Link>
                        <Link className="btn btn--secondary btn--thick btn--wide btn--big"
                              to={this.state.parentPath}>Cancel</Link>
                    </div>
                </div>
            </div>
        )
    }

    renderDimensionSelector() {
        if (!this.props.hasDimensions) {
            return null;
        }

        const parentPath = this.state.currentPath;
        const selectorProps = {
            router: this.props.router,
            datasetID: this.props.params.id,
            dimensionID: this.props.params.dimensionID,
            onSave: () => this.props.router.push(this.state.currentPath)
        }

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                </div>
                <div>
                    <DimensionSelector {...selectorProps} />
                </div>
            </div>
        )
    }
}

Dimension.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        dimensions: state.dataset.dimensions,
        title: state.dataset.title,
        hasDimensions: state.dataset.hasDimensions,
        hasMetadata: state.dataset.hasMetadata
    }
}

export default connect(mapStateToProps)(Dimension);