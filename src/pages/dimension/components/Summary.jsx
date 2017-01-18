import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { renderFlatHierarchy } from '../utils';
import { saveDimensionOptions } from '../../dataset/actions';

class Summary extends Component {
    constructor(props) {
        super(props)
        this.removeOptions = this.removeOptions.bind(this);
    }

    removeOptions(options) {
        const dispatch = this.props.dispatch;
        const dimensionID = this.props.dimensionID;
        return function () {
            options = options instanceof Array ? options : [options];
            options = options.map(option => {
                option.selected = false;
                return option;
            })
            dispatch(saveDimensionOptions({ dimensionID, options }));
        }
    }

    render () {
        const options = this.props.options;
        return (
            <div className="margin-bottom--8">
                <div className="margin-top--2">
                    <Link onClick={browserHistory.goBack} className="btn--everything">Back</Link>
                    <h2 className="margin-top margin-bottom--double">Your location selection</h2>
                    <ul className="list--neutral">
                    {options.map(option => (
                        this.renderSummaryItemParent(option)
                    ))}
                    </ul>
                </div>

                <div className="margin-bottom">
                    <a onClick={browserHistory.goBack} className="btn--everything">Add more locations</a>
                </div>
                <div className="margin-bottom--double">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half">Save selection</a>
                </div>
            </div>
        )
    }

    renderSummaryItemParent({ name, id, options}) {
        if (options.length === 0) {
            return null;
        }

        return (
            <li key={id} className="margin-left--0 margin-left--0 padding-bottom--2 col-wrap width-lg--39">

                <div className="col margin-left--0 width-lg--39 border-bottom--gallery-md padding-bottom--2">
                    <h3 className="col col--md-34 col--lg-34">{name} ({options.length})</h3>
                    <div className="col col--md-5 col--lg-5 float-right">
                        <a onClick={this.removeOptions(options)}>Remove all</a>
                    </div>
                </div>
                <ul className="list--neutral col width-lg--39 margin-left--0 margin-top--0 border-bottom--gallery-md">
                {options.map(option => (
                    this.renderSummaryItemChild(option)
                ))}
                </ul>
            </li>
        )
    }

    renderSummaryItemChild({ name, id }) {
        return (
            <li key={id} className="margin-left--0 col width-lg--39 border-bottom--gallery-md padding-bottom--2">
                    <div className="col col--md-34 col--lg-34">
                        <span>{name}</span>
                    </div>
                    <div className="col col--md-5 col--lg-5 float-right">
                        <a onClick={this.removeOptions({id})}>Remove</a>
                    </div>
            </li>
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