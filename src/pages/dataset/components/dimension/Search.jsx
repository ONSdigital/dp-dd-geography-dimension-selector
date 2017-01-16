import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';


export default class Search extends Component {
    constructor(props) {
        super(props)
    }


    render () {
        return (
            <div className="margin-top--2 margin-bottom--4">
                <Link onClick={browserHistory.goBack} className="btn--everything">Back</Link>

                <h3>What location do you want?</h3>
                <input type="text" style={{padding: "6px 12px"}}/>
                <div className="margin-top--2 margin-bottom--4">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveSelections}>Save selection</a>
                </div>
            </div>
        )
    }
}