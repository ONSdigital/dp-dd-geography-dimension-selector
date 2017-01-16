import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import config from '../../../config';

const propTypes = {
    id: PropTypes.string,
    datasetID: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string
}

export default class DimensionItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dimensionURL = `${config.BASE_PATH}/dataset/${this.props.datasetID}/dimension/${this.props.id}`;
        return (
            <li className="margin-left--0 padding-bottom--2 padding-top--2 border-top--gallery-md border-bottom--gallery-md col-wrap width-lg--39">
                <div className="col col--md-8 col--lg-8">
                    <strong>{this.props.name}</strong>
                </div>
                <div className="col col--md-33 col--lg-25">
                    {this.props.label}
                </div>
                <div className="col col--md-6 col--lg-6">
                    <Link to={dimensionURL} className="float-right">Customise</Link>
                </div>
            </li>

        )
    }
}

DimensionItem.propTypes = propTypes;