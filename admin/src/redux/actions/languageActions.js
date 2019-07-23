import {languageService} from "../services/languageService";

export const GET_LANGUAGE_SUCCESS = 'GET_LANGUAGE_SUCCESS';
export const GET_LANGUAGE_FAILURE = 'GET_LANGUAGE_FAILURE';

export const UPDATE_LANGUAGE_SUCCESS = 'UPDATE_LANGUAGE_SUCCESS';
export const UPDATE_LANGUAGE_FAILURE = 'UPDATE_LANGUAGE_FAILURE';

export const CHANGE_STATE_LANGUAGE = 'CHANGE_STATE_LANGUAGE';
export const SELECTED_STATE_LANGUAGE = 'SELECTED_STATE_LANGUAGE';

export const languageAction = {
    get,
    update,
    changeState,
    selectedLang
};

function get(param) {
    return dispatch => {
        languageService.get(param)
            .then(
                language => {
                    dispatch(success(language));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(language) { return { type: GET_LANGUAGE_SUCCESS, language } }
    function failure(error) { return { type: GET_LANGUAGE_FAILURE, error } }
}

function update(param) {
    return dispatch => {
        languageService.update(param)
            .then(
                languages => {
                    dispatch(success(languages));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(languages) { return { type: UPDATE_LANGUAGE_SUCCESS, languages } }
    function failure(error) { return { type: UPDATE_LANGUAGE_FAILURE, error } }
}
function changeState(state) {
    return dispatch => {
        dispatch(  changeStateDispatchLanguage(state));
    };

    function changeStateDispatchLanguage(state) { return { type:  CHANGE_STATE_LANGUAGE, state } }
}function selectedLang(state) {
    return dispatch => {
        dispatch(  selectedStateDispatchLanguage(state));
    };

    function selectedStateDispatchLanguage(state) { return { type:  SELECTED_STATE_LANGUAGE, state } }
}
