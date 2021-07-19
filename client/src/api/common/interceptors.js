import store from '../../store'
// axios interceptor를 이용해 headers의 authorization에 토큰값 부여 
export const setInterceptors=(instance)=>{
instance.interceptors.request.use(function (config) {
    config.headers.authorization = store.state.token;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  return instance
}