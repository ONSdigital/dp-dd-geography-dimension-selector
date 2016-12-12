import React, {Component} from 'react';

export default class DimensionItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="margin-left--0 padding-bottom--2 padding-top--2 border-top--gallery-md border-bottom--gallery-md col-wrap width-lg--39">
                <div className="col col--md-8 col--lg-8">
                    <strong>{this.props.name}</strong>
                </div>
                <div className="col col--md-33 col--lg-25">
                    {this.props.selected}
                </div>
                <div className="col col--md-6 col--lg-6">
                    <a href="aggregate.html" className="float-right">customise</a>
                </div>
            </li>

        )
    }

}