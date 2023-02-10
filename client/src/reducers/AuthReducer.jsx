export default function AuthReducer(state, action) {
    switch (action.type) {
        case "AUTH_START": 
            return {
                user: null,
                isFetching: true,
                error: "",   
            };
        case "AUTH_SUCCESS": 
            return {
                user: action.payload,
                isFetching: false,
                error: ""
            };
        case "AUTH_FAILURE": 
            return {
                user: null, 
                isFetching: false,
                error: action.payload,
            };
        case "LOGOUT": 
            return {
                ...state, 
                user: null
            }
        default: 
            return state;
    }
}