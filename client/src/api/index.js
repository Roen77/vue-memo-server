import axios from 'axios';
import {setInterceptors} from './common/interceptors'

const instance = axios.create({
    baseURL:process.env.VUE_APP_API_URL
})

export const request=setInterceptors(instance)



