import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import config from '../../../config';
import FileTypesHelp from '../../../components/elements/FileTypesHelp';
import Checkbox from '../../../components/elements/Checkbox';
import {
    saveDownloadOptions,
    requestDownloadProgress,
    cancelDownload
} from '../actions';

class Download extends Component {

    constructor(props) {
        super(props);

        this.cacheOption = this.cacheOption.bind(this);
        this.saveOptions = this.saveOptions.bind(this);

        this.state = {
            options: [{
                id: 'xls',
                label: 'XLS',
                value: 'xls',
                selected: false
            }, {
                id: 'csv',
                label: 'CSV',
                value: 'csv',
                selected: false
            }, {
                id: 'json',
                label: 'JSON',
                value: 'json',
                selected: false
            }],
            selectedOptions: [],
            parentPath: `${config.BASE_PATH}/dataset/${this.props.datasetID}/customise/`,
            errorMessage: ''
        };
    }

    cacheOption({id, checked}) {
        const options = this.state.options.map((option) => {
            option.selected = option.id === id ? checked : option.selected;
            return option;
        });

        const errorMessage = '';

        this.setState({options, errorMessage});
    }

    isSelectionValid() {
        return (this.state.options).some(option => {
            return option.selected;
        });
    }

    saveOptions() {

        if (!this.isSelectionValid()) {
            this.setState({errorMessage: "Select at least one option"});
            return;
        }

        const options = this.state.options;
        const selectedOptions = [];

        options.map(option => {
            if (option.selected) {
                selectedOptions.push(option.id);
            }
        });

        this.state.selectedOptions = selectedOptions; // this might not be needed once we are getting the files back from the server, for the moment it still lets us only show links for the formats they chose once they're 'ready for download
        this.props.dispatch(saveDownloadOptions(selectedOptions));
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.download.completed && nextProps.download.inProgress) {
            setTimeout(() => nextProps.dispatch(requestDownloadProgress(nextProps.download.id)), 500);
        }
    }

    componentWillUnmount() {
        const download = this.props.download;
        const dispatch = this.props.dispatch;
        if (!download.completed && download.inProgress) {
            dispatch(cancelDownload(), 500);
        }
    }

    render() {
        const download = this.props.download;

        if (download.inProgress) {
            return this.renderInProgress();
        }

        if (download.completed) {
            return this.renderCompleted();
        }

        return this.renderOptions();
    }

    renderOptions() {
        const options = this.state.options;
        const errorMessage = this.state.errorMessage;

        return (
            <div>
                <h1 className="margin-top--2 margin-bottom--half">Download options</h1>
                <p className="flush">Choose the file type(s) you want to download.</p>
                <div className={(errorMessage.length > 0) && "error__group"}>
                    <div className={(errorMessage.length > 0) && "error__message"}>{errorMessage}</div>
                    {
                        options.map((props, index) => {
                            props['key'] = index;
                            props['checked'] = props.selected;
                            return <Checkbox {...props} onChange={this.cacheOption}/>
                        })
                    }
                </div>

                <div className="margin-top--2"><FileTypesHelp/></div>

                <div className="margin-top--3 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half" onClick={this.saveOptions}>Generate files</a>
                    <a className="btn btn--secondary btn--thick btn--wide btn--big" onClick={hashHistory.goBack}>Cancel</a>
                </div>
            </div>
        )
    }

    renderInProgress() {
        return (
            <div>
                <h1 className="margin-top--2 margin-bottom--half">Download options</h1>
                <p className="margin-top--0 margin-bottom--8 font-size--17 loading">Your file is being generated</p>
            </div>
        )
    }

    renderCompleted() {
        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--2 margin-bottom--half">Download options</h1>
                <p className="margin-top--0 margin-bottom--1">These files are available for you to download.</p>
                {
                    this.state.selectedOptions.map((option, index) => {
                        return (
                            <div key={index} className="margin-top--1">
                               <button className="btn btn--primary btn--thick btn--wide btn--big uppercase">{option}</button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        download: state.dataset.download
    }
}

export default connect(mapStateToProps)(Download)