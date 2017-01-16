import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestMetadata } from '../actions';
import config from '../../../config';
import DocumentTitle from '../../../components/elements/DocumentTitle';

const propTypes = {
    metadata: PropTypes.object,
    title: PropTypes.string
}

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            downloadPath: `${config.BASE_PATH}/dataset/${this.props.params.id}/download`,
            customisePath: `${config.BASE_PATH}/dataset/${this.props.params.id}/dimensions`,
        }
    }

    componentWillMount() {
        if (this.props.params.id !== this.props.id) {
            const dispatch = this.props.dispatch;
            dispatch(requestMetadata(this.props.params.id));
        }
    }

    render () {
        if (!this.props.id) {
            return null;
        }

        const page = {};
        if (this.props.metadata) {
            page.description =  this.props.metadata.description
            page.title = this.props.title
        }

        return (
            <div>
                <div className="col--lg-two-thirds">
                    <DocumentTitle title={page.title}>
                        <h1 className="margin-bottom-md--0">{page.title}</h1>
                    </DocumentTitle>

                    <p className="page-intro__content margin-bottom-md--1">{page.description}</p>

                    <Link to={this.state.downloadPath}
                          className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                            <strong>Download the complete dataset</strong>
                    </Link>
                    <br />
                    <Link to={this.state.customisePath}
                          className="btn btn--primary btn--thick btn--big btn--wide margin-top--2 font-size--17">
                            <strong>Customise this dataset</strong>
                    </Link>

                    <p className="margin-bottom--8 margin-top--4">
                        <strong>Supporting information</strong><br />
                        &middot;&nbsp;<a href="./files/background-notes.pdf" target="_blank">Background notes</a> (PDF, 168KB)
                    </p>
                </div>
            </div>
        )
    }
}

Component.propTypes = propTypes;

function mapStateToProps(state) {
    return state.dataset;
}


export default connect(mapStateToProps)(Details)