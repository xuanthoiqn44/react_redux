import {
    GET_LANGUAGE_SUCCESS,
    GET_LANGUAGE_FAILURE,
    UPDATE_LANGUAGE_SUCCESS,
    UPDATE_LANGUAGE_FAILURE,
    CHANGE_STATE_LANGUAGE,
    SELECTED_STATE_LANGUAGE
} from "../actions/languageActions";

const languageReducer = (state = {stateLanguage: 'us',selectedLanguage:''}, action) => {
    switch (action.type) {
        case GET_LANGUAGE_SUCCESS:
            let temp = [];
            for ( let value of action.language ) {
                for ( let element of value.languages ) {
                    temp.push(element)
                }
            }
            return {
                ...state,
                language: temp
            };
        case GET_LANGUAGE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_LANGUAGE_SUCCESS:
            return {
                ...state,
                language: action.language
            };
        case UPDATE_LANGUAGE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case CHANGE_STATE_LANGUAGE:
            return {
                ...state,
                stateLanguage: action.state
            };
        case SELECTED_STATE_LANGUAGE:
            return {
                ...state,
                selectedLanguage: action.state
            };
        default:
            return state
    }
};

export default languageReducer;
