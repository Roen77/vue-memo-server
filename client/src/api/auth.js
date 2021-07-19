import {request} from './index'
export const auth={
    // 로그인
    loginUser(userInfo){
        return request.post('user/login',userInfo)
    },
    // 회원가입
    registerUser(userInfo){
        return request.post('user/register',userInfo)
    },
}
