import {translationService} from "../services/translationService";

export const GET_TRANSLATION_SUCCESS = 'GET_TRANSLATION_SUCCESS';
export const GET_TRANSLATION_FAILURE = 'GET_TRANSLATION_FAILURE';

export const translationAction = {
    get,
};

function get() {
    return dispatch => {
        translationService.get()
            .then(
                translation => {
                    dispatch(success(translation));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(translation) { return { type: GET_TRANSLATION_SUCCESS, translation } }
    function failure(error) { return { type: GET_TRANSLATION_FAILURE, error } }
}
