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
        case "ADD_FRIEND_REQUEST": {
            const freq = state.user.friendRequests.find((fr) => fr.id === action.payload.id);
            return {
                ...state,
                user: {
                    ...state.user,
                    friendRequests: (freq ? state.user.friendRequests : [...state.user.friendRequests, action.payload])
                }
            }
        }

        case "REMOVE_FRIEND_REQUEST": {
            return {
                ...state, 
                user: {
                    ...state.user,
                    friendRequests: (state.user.friendRequests.filter((fr) => fr.id !== action.payload))
                }
            }
        }

        case "ADD_FRIEND": {
            const fr = state.user.friends.find((id) => id === action.payload);
            return {
                ...state,
                user: {
                    ...state.user,
                    friends: (fr ? state.user.friends : [...state.user.friends, action.payload])
                }
            }
        }

        case "REMOVE_FRIEND": {
            return {
                ...state,
                user: {
                    ...state.user,
                    friends: (state.user.friends.filter((fr) => fr.id !== action.payload))
                }
            }
        }

        default: 
            return state;
    }
}