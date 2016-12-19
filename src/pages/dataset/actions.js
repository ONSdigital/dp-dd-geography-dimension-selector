import { checkResponseStatus, parseResponseToJSON } from './utils';
import config from '../../config/index';

export const REQUEST_METADATA = 'REQUEST_METADATA';
export const REQUEST_METADATA_SUCCESS = 'REQUEST_METADATA_SUCCESS';
export const REQUEST_METADATA_FAILURE = 'REQUEST_METADATA_FAILURE';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS';
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS';
export const REQUEST_DIMENSIONS_FAILURE = 'REQUEST_DIMENSIONS_FAILURE';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';
export const PARSE_DIMENSIONS = 'PARSE_DIMENSIONS';

const API_URL = config.API_URL;

export function saveDimensionOptions({dimensionID, options}) {
    // we are using async to access getState() via redux-thunk
    return (dispatch, getState) => {
        const state = getState();
        // todo: use deep merge for merging hierarchies -> https://www.npmjs.com/package/deepmerge
        const dimensions = state.dataset.dimensions.map((dimension) => {
            dimension = Object.assign({}, dimension);
            if (dimension.id !== dimensionID) {
                return dimension;
            }

            dimension.options = dimension.options.map((option) => {
                option.selected = options.find((selectionOption) => {
                    return option.id === selectionOption.id;
                }).selected;
                return Object.assign({}, option);
            });
            return dimension;
        });

        dispatch({type: SAVE_DIMENSION_OPTIONS, dimensions });
        dispatch(parseDimensions(state.dataset.id, dimensions));
    }
}

export function requestDimensions(datasetID) {
    const url = `${API_URL}/datasets/${datasetID}/dimensions`
    const opts = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };

    return (dispatch) => {
        dispatch({
            type: REQUEST_DIMENSIONS,
            id: datasetID
        })
        return fetch(url, opts)
            .then(checkResponseStatus)
            .then(parseResponseToJSON)
            .then(function (json) {
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
    const dimensionTypes = [
        { type: 'SIMPLE_LIST', dimensions: ['D000123', 'D000124', 'D000125'] }
    ];

    return {
        type: PARSE_DIMENSIONS,
        dataset: {
            id: datasetID,
            dimensions: dimensionsJSON.map(dimension => {
                const typeObj = dimensionTypes.find((dimensionType) => {
                    return dimensionType.dimensions.indexOf(dimension.id) > -1;
                });
                dimension.type = typeObj ? typeObj.type : 'UNKNOWN';
                switch(dimension.type) {
                    case 'SIMPLE_LIST':
                        dimension.options = dimension.options.map(option => Object.assign({}, option, {
                            selected: option.selected === false ? false : true
                        }));
                        break;
                    default:
                        dimension.options = dimension.options.map(option => Object.assign({}, option, {
                            selected: option.selected === true
                        }));
                        break;
                }
                dimension.datasetID = datasetID,
                dimension.optionsCount = dimension.options.length; // todo: count recursively for hierarchy
                dimension.selectedCount = dimension.options.reduce((count, option) => {
                    return option.selected ? count + 1 : count
                } , 0);
                return dimension;
            }),
        }
    }
}

export function requestMetadata(id) {
    const url = `${API_URL}/datasets/${id}`;
    const opts = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };

    return dispatch => {
        dispatch({
            type: REQUEST_METADATA,
            id: id
        })
        return fetch(url, opts)
            .then(checkResponseStatus)
            .then(parseResponseToJSON)
            .then(function (json) {
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