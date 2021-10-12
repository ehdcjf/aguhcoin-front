const initialState = {
    isError:false, 
    isLoading:false,
    isLogin: false,
    success: null,
    userid: null,
    useridx: null,
    myAsset: 0,
    lockedAsset: 0,
    availableAsset: 0,
    myCoin: 0,
    lockedCoin: 0,
    availableCoin: 0,
    msg:""
}

const server = process.env.REACT_APP_SERVER_URI || "http://3.34.76.79:3500"; 


const DUPLICATECHECK_REQUEST = "DUPLICATECHECK_REQUEST";
const DUPLICATECHECK_SUCCESS = "DUPLICATECHECK_SUCCESS";
const DUPLICATECHECK_ERROR = "DUPLICATECHECK_ERROR";
const USER_JOIN_REQUEST = "USER_JOIN_REQUEST";
const USER_JOIN_SUCCESS = "USER_JOIN_SUCCESS";
const USER_JOIN_ERROR = "USER_JOIN_ERROR";
const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
const USER_LOGIN_ERROR = "USER_LOGIN_ERROR";
const USER_LOGOUT_REQUEST = "USER_LOGOUT_REQUEST";
const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
const USER_LOGOUT_ERROR = "USER_LOGOUT_ERROR";
const GET_TOTAL_ASSET = "GET_TOTAL_ASSET"


// Join -> DuplicateCheck(), 회원가입 아이디 유효성 검사
export const DuplicateCheckAction = data => {
    return async (dispatch) => {
        dispatch(DuplicateCheck_REQUEST());

        try {
            let url = server+`/user/idcheck`;
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: { "content-type": "application/json", },
                body: JSON.stringify({ ...data }),
            });
            const result = await response.json();

            dispatch(DuplicateCheck_SUCCESS(result));
        } catch (e) {
            dispatch(DuplicateCheck_ERROR());
        }
    }
}

export const DuplicateCheck_REQUEST = () => {
    return {
        type: DUPLICATECHECK_REQUEST,
    }
}
export const DuplicateCheck_SUCCESS = data => {
    return {
        type: DUPLICATECHECK_SUCCESS,
        data: data,
    }
}
export const DuplicateCheck_ERROR = () => {
    return {
        type: DUPLICATECHECK_ERROR,
    }
}

// join, 회원가입
export const UserJoinAction = data => {
    return async (dispatch) => {
        dispatch(UserJoin_REQUEST());

        try {
            let url =  server+`/user/join`;
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: { "content-type": "application/json", },
                body: JSON.stringify({ ...data }),
            });
            const result = await response.json();

            if(result.success){
                dispatch(UserJoin_SUCCESS(result));
            }
        } catch (e) {
            dispatch(UserJoin_ERROR());
        }
    }
}

export const UserJoin_REQUEST = () => {
    return {
        type: USER_JOIN_REQUEST,
    }
}
export const UserJoin_SUCCESS = data => {
    return {
        type: USER_JOIN_SUCCESS,
        data: data,
    }
}
export const UserJoin_ERROR = () => {
    return {
        type: USER_JOIN_ERROR,
    }
}

// Login, 로그인
export const UserLoginAction = data => {
    return async (dispatch) => {
        dispatch(UserLogin_REQUEST());

        try {
            let url = server+'/user/login';
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: { "content-type": "application/json", },
                body: JSON.stringify({ ...data }),
            });
            const result = await response.json();

            if(result.success){
                dispatch(UserLogin_SUCCESS(result));
            }else{
                dispatch(UserLogin_ERROR(result));

            }


            if (result.totalAsset.success) {
                dispatch(GetMyAsset(result.totalAsset));
            }
        } catch (e) {
            dispatch(UserLogin_ERROR());
        }
    }
}


export const GetMyAsset = (data) => {
    let totalAsset = data;
    delete totalAsset.sussess
    return {
        type: GET_TOTAL_ASSET,
        data: totalAsset,
    }
}


export const UserLogin_REQUEST = () => {
    return {
        type: USER_LOGIN_REQUEST,
    }
}
export const UserLogin_SUCCESS = data => {
    return {
        type: USER_LOGIN_SUCCESS,
        data: data,
    }
}
export const UserLogin_ERROR = (data) => {
    return {
        type: USER_LOGIN_ERROR,
        data:data,
    }
}

// Logout, 로그아웃
export const UserLogoutAction = data => {
    return async (dispatch) => {
        dispatch(UserLogout_REQUEST());

        try {
            let url = server+'/user/logout';
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: { "content-type": "application/json", },
                body: JSON.stringify({ ...data }),
            });
            const result = await response.json();

            dispatch(UserLogout_SUCCESS(result));
        } catch (e) {
            dispatch(UserLogout_ERROR());
        }
    }
}

export const UserLogout_REQUEST = () => {
    return {
        type: USER_LOGOUT_REQUEST,
    }
}
export const UserLogout_SUCCESS = data => {
    return {
        type: USER_LOGOUT_SUCCESS,
        data: data,
    }
}
export const UserLogout_ERROR = () => {
    return {
        type: USER_LOGOUT_ERROR,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case DUPLICATECHECK_REQUEST:
            return {
                ...state,
                success: null,
            }
        case DUPLICATECHECK_SUCCESS:
            return {
                ...state,
                success: action.data.success,
            }
        case DUPLICATECHECK_ERROR:
            return {
                ...state,
            }
        case USER_JOIN_REQUEST:
            return {
                ...state,
                userid: null,
            }
        case USER_JOIN_SUCCESS:
            return {
                ...state,
                userid: action.data.userid,
            }
        case USER_JOIN_ERROR:
            return {
                ...state,
            }
        case USER_LOGIN_REQUEST:
            return {
                ...state,
                isLoading:true,
            }
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoading:false, 
                isLogin: true,
                success: action.data.success,
                userid: action.data.userid,
                useridx: action.data.user_idx,
            }
        case USER_LOGIN_ERROR:
            return {
                ...state,
                isLoading:false, 
                isError:true,
                msg:action.data.msg,
            }
        case USER_LOGOUT_REQUEST:
            return {
                ...state,
            }
        case USER_LOGOUT_SUCCESS:
            return {
                ...state,
                isLogin: action.data.isLogin,
                uesrid: '',
                useridx: null,
            }
        case USER_LOGOUT_ERROR:
            return {
                ...state,
                ...initialState
            }
        case GET_TOTAL_ASSET:
            return {
                ...state,
                ...action.data,
            }
        default:
            return state;
    }
}

export default reducer;