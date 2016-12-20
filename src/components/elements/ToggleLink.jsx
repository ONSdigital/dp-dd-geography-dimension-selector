import React, { Component, PropTypes } from 'react';

var propTypes = {
    label: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    hideOnDisabled: PropTypes.bool,
    state: PropTypes.bool,
    handleOnClick: PropTypes.func,
}

var defaultProps = {
    enabled: true,
    hideOnDisabled: false,
    state: false,
    handleOnClick: ({state = true}) => { state }
}

export default class ToggleSelectAll extends Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.props.handleOnClick({
            state: this.props.state
        })
    }

    render() {

        if (this.props.enabled) {
            return (
                <a className="btn nav--controls__item margin-right"
                   onClick={this.handleOnClick}>{this.props.label}</a>
            )
        }

        return <span className="nav--controls__item margin-right font-size--14">{this.props.label}</span>
    }
}

ToggleSelectAll.propTypes = propTypes;
ToggleSelectAll.defaultProps = defaultProps;