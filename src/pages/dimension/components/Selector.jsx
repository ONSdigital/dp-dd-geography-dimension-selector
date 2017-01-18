import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import config from '../../../config';
import Checkbox from '../../../components/elements/Checkbox';
import ToggleLink from '../../../components/elements/ToggleLink';

import {
    saveDimensionOptions
} from '../../dataset/actions';

const propTypes = {
    datasetID: PropTypes.string.isRequired,
    dimensionID: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selected: PropTypes.bool
    })).isRequired,
    optionsCount: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired
};

class DimensionSelector extends Component {
    constructor(props) {
        super(props);

        this.saveSelections = this.saveSelections.bind(this);
        this.cacheSelection = this.cacheSelection.bind(this);

        this.state = {
            cachedOptions: props.options.map(option => {
                return { id: option.id, selected: option.selected }
            }),
            errorMessage: "",
            parentPath: `${config.BASE_PATH}/dataset/${this.props.datasetID}/customise/`,
            allEnabled: false,
            allDisabled: false
        }
    }

    isSelectionValid() {
        return (this.state.cachedOptions).some(option => {
            return option.selected;
        });
    }

    saveSelections() {
        if (!this.isSelectionValid()) {
            this.setState({errorMessage: "Select at least one option"});
            return;
        }

        this.props.dispatch(saveDimensionOptions({
            dimensionID: this.props.dimensionID,
            options: this.state.cachedOptions
        }));

        this.props.onSave();
    }

    cacheSelection({id, checked = true}) {
        const cachedOptions = this.state.cachedOptions.map((option) => {
            if (option.id === id) {
                option.selected = checked;
            }
            return option;
        });

        const errorMessage = this.isSelectionValid() ? "" : this.state.errorMessage;
        const {allEnabled, allDisabled} = this.getEnabledStatus();
        this.setState({ cachedOptions, allEnabled, allDisabled, errorMessage })
    }

    getEnabledStatus() {
        let allEnabled = true;
        let allDisabled = true;

        this.state.cachedOptions.forEach((option) => {
            if (option.selected) {
                allDisabled = false;
            } else {
                allEnabled = false;
            }
        });

        return {allEnabled, allDisabled}
    }

    toggleAll(state) {
        state = typeof state === 'undefined' || state === true
        return () => {
            const cachedOptions = this.state.cachedOptions.map((option) => {
                option.selected = state;
                return option;
            });
            this.setState({ cachedOptions, allEnabled: state, allDisabled: !state })
        }
    }

    componentWillMount() {
        const {allEnabled, allDisabled} = this.getEnabledStatus();
        this.state.allEnabled = allEnabled;
        this.state.allDisabled = allDisabled;
    }

    render () {
        const errorMessage = this.state.errorMessage;
        const allEnabled = this.state.allEnabled;
        const allDisabled = this.state.allDisabled;

        return (
            <form className="form">
                <h2 className="margin-top--half margin-bottom">What do you want to include?</h2>
                <div className="margin-bottom--2">
                    <ToggleLink label="Enable all" enabled={!allEnabled} onClick={this.toggleAll(true)} />
                    <ToggleLink label="Disable all" enabled={!allDisabled} onClick={this.toggleAll(false)} />
                </div>
                <div className={(errorMessage.length > 0) && "error__group"}>
                    <div className={(errorMessage.length > 0) && "error__message"}>{errorMessage}</div>
                    { this.renderSelector() }
                </div>
                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveSelections}>Save selection</a>
                    <a className="btn btn--secondary btn--thick btn--wide btn--big" onClick={browserHistory.goBack}>Cancel</a>
                </div>
            </form>
        )
    }

    renderSelector() {
        const { options } = this.props;
        return options.map((optionItem, key) => {
            const cachedOption = this.state.cachedOptions.find((option) => {
                if (option.id === optionItem.id) return option;
            });
            const checkboxProps = {
                id: optionItem.id,
                label: optionItem.name,
                value: optionItem.id,
                onChange: this.cacheSelection,
                checked: cachedOption.selected,
                key
            }
            return <Checkbox {...checkboxProps} />
        });
    }
}

DimensionSelector.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const dimension = state.dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });
    const options = ownProps.options || dimension.options;

    return {
        dimension,
        options,
        optionsCount: dimension.optionsCount
    }
}

export default connect(mapStateToProps)(DimensionSelector)