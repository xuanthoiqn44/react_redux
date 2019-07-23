import {
    GET_TRANSLATION_SUCCESS,
    GET_TRANSLATION_FAILURE,
} from "../actions/translationActions";

const languageReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_TRANSLATION_SUCCESS:
            return {
                ...state,
                translation: action.translation
            };
        case GET_TRANSLATION_FAILURE:
            return {
                ...state,
                error: action.error
            };
        default:
            return state
    }
};

export default languageReducer;
