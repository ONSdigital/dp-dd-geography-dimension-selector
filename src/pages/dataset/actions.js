import { Request } from './utils';
import config from '../../config/index';
import { updateOption, toggleSelectedOptions } from '../dimension/utils';

export const REQUEST_METADATA = 'REQUEST_METADATA';
export const REQUEST_METADATA_SUCCESS = 'REQUEST_METADATA_SUCCESS';
export const REQUEST_METADATA_FAILURE = 'REQUEST_METADATA_FAILURE';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS';
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS';
export const REQUEST_DIMENSIONS_FAILURE = 'REQUEST_DIMENSIONS_FAILURE';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';
export const PARSE_DIMENSIONS = 'PARSE_DIMENSIONS';

export const DESELECT_ALL_OPTIONS = 'DESELECT_ALL_OPTIONS';
export const SELECT_ALL_OPTIONS = 'SELECT_ALL_OPTIONS';

export const SAVE_DOWNLOAD_OPTIONS = 'SAVE_DOWNLOAD_OPTIONS';
export const SAVE_DOWNLOAD_PROGRESS = 'SAVE_DOWNLOAD_PROGRESS';
export const SAVE_DOWNLOAD_OPTIONS_SUCCESS = 'SAVE_DOWNLOAD_OPTIONS_SUCCESS';
export const CANCEL_DOWNLOAD = 'CANCEL_DOWNLOAD';

const API_URL = config.API_URL;
const request = new Request();

export function cancelDownload() {
    return {
        type: CANCEL_DOWNLOAD
    }
}

export function deselectAllOptions(dimensionID) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dataset.dimensions.find(dimension => dimension.id === dimensionID));

        dispatch({
            type: DESELECT_ALL_OPTIONS,
            dimensionID
        })

        const options = toggleSelectedOptions({ options: dimension.options, selected: false});
        dispatch(saveDimensionOptions({dimensionID, options}));
    }
}

export function selectAllOptions(dimensionID) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dataset.dimensions.find(dimension => dimension.id === dimensionID));

        dispatch({
            type: SELECT_ALL_OPTIONS,
            dimensionID
        })

        const options = toggleSelectedOptions({ options: dimension.options, selected: true})
        dispatch(saveDimensionOptions({dimensionID, options}))
    }
}

export function saveDownloadOptions(options) {
    const url = `${config.JOB_API_URL}/job`;
    return dispatch => {
        dispatch({
            type: SAVE_DOWNLOAD_OPTIONS,
            options: options
        });

        const body = JSON.stringify({fileFormats: options});
        return request.post(url, {body: body}).then(json => {
            dispatch(requestDownloadProgress(json.id));
        }).catch(err => {
            throw(err);
        });
    }
}

export function requestDownloadProgress(id) {
    const url = `${config.JOB_API_URL}/job/${id}`;
    return dispatch => request.get(url).then(json => {
        dispatch(saveDownloadProgress(json));
    })
}

function saveDownloadProgress(json) {
    return {
        type: SAVE_DOWNLOAD_PROGRESS,
        download: json
    }
}

export function saveDimensionOptions({dimensionID, options}) {
    return (dispatch, getState) => {
        const state = getState();
        const dimensions = state.dataset.dimensions.map((dimension) => {
            dimension = Object.assign({}, dimension);
            if (dimension.id !== dimensionID) {
                return dimension;
            }

            options.forEach(option => {
                updateOption({
                    id: option.id,
                    options: dimension.options,
                    update: { selected: option.selected }
                })
            });

            return dimension;
        });

        dispatch({type: SAVE_DIMENSION_OPTIONS, dimensions });
        dispatch(parseDimensions(state.dataset.id, dimensions));
    }
}

export function requestDimensions(datasetID) {
    const url = `${API_URL}/datasets/${datasetID}/dimensions.json`

    return (dispatch) => {
        dispatch({
            type: REQUEST_DIMENSIONS,
            id: datasetID
        });

        request.get(url).then(function (json) {
            dispatch(requestDimensionsSuccess(datasetID, json));
            dispatch(parseDimensions(datasetID, json));
        }).catch(function (err) {
            throw(err);
        })
    }
}

export function requestDimensionsSuccess(datasetId, responseData) {
    return {
        type: REQUEST_DIMENSIONS_SUCCESS,
        dataset: {
            datasetId,
            responseData
        }
    }
}

export function parseDimensions(datasetID, dimensionsJSON) {
    let optionsCount;
    let selectedCount;

    return {
        type: PARSE_DIMENSIONS,
        dataset: {
            id: datasetID,
            dimensions: dimensionsJSON.map(dimension => {
                optionsCount = 0;
                selectedCount = 0;

                dimension.options = parseOptions(dimension.options);
                dimension.datasetID = datasetID;
                dimension.optionsCount = optionsCount;
                dimension.selectedCount = selectedCount;
                return dimension;
            }),
        }
    }

    function parseOptions(options, selectedStatus = true) {
        return options.map(option => {
            optionsCount ++;
            option.selected = option.selected === false ? false : selectedStatus;
            selectedCount += option.selected ? 1 : 0;
            if (option.options && option.options.length > 0) {
                option.options = parseOptions(option.options, selectedStatus);
            }
            return option;
        });
    }
}

export function requestMetadata(id) {
    const url = `${API_URL}/datasets/${id}.json`;

    return dispatch => {
        dispatch({
            type: REQUEST_METADATA,
            id: id
        })

        return request.get(url).then(function (json) {
            dispatch(parseMetadata(json));
        }).catch(function (err) {
            throw(err);
        })
    }
}

export function parseMetadata(json) {
    return {
        type: REQUEST_METADATA_SUCCESS,
        dataset: json
    }
}