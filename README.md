# 메모앱

## 1. Client

### 1. 버전


|vue|
|:---:|
|v2.6.11|

- 사용한 라이브러리

||<a href="https://github.com/axios/axios">axios</a>|<a href="https://router.vuejs.org/">vue-router</a>|<a href="https://dev.vuetifyjs.com/en/getting-started/installation/">vuetify</a>|<a href="https://vuex.vuejs.org/">vuex</a>|
|---|---|:---|:---|:---|
|버전|v0.21.1|v3.5.1|2.4.0|3.6.2|
|이유|서버에 api 호출|vue 라우터|vue 전용 디자인 프레임워크|상태 관리를 위한 vuex store 사용| 

### 2. 구현 목표
#### <a>1. 회원가입/로그인</a>
#### <a>2. 보드 추가 및 수정 및 삭제</a>
#### <a>3. 보드 가져오기</a>
#### <a>4. 카드 추가 및 수정 및 삭제</a>
#### <a>5. 카드 가져오기</a>
#### <a>6. 카테고리 추가 및 삭제</a>
#### <a>7. 카드 검색</a>

<br>

### 3. 구현 내용
### 3-1. 라우터
```
/ ---- login
    |
    |--board/_id 
    |
    |--card/_id
    |
    |--projects
```
### 3-2. 구현 공통 요소
- 기본적으로 <a href="https://vuetifyjs.com/en/getting-started/installation/">vuetify</a> 디자인 프레임워크를 사용하여 구현하였습니다.
- 모든 라우터는 `로그인` 시, 이용 가능하도록 구현하였습니다.
- api 호출은 `axios`를 사용하였습니다.
(<a href="#axios"><b>모든 api 호출은 axios Interceptors를 이용해 headers의 authorization에 토큰값을 확인합니다.</b></a>)
- 라우터가 존재하지 않을 시, 보여줄 컴포넌트를 구현하였습니다.
```js
// ~/router/index.js
const router = new VueRouter({
  mode: 'history',
  routes: [
    ...{
      path: '*',
      component: () => import('../view/PageNotFound.vue'),
      meta: {
        auth: true
      },
      beforeEnter: isAuth
    },
  ]

})
```
```html
<!-- 라우터가 존재하지 않는다면 해당 컴포넌트를 보여줍니다. -->
<!-- ~/view/PageNotFound.vue -->
<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card elevation="2" shaped>
                    <v-card-title>해당 페이지는 존재 하지 않습니다.</v-card-title>
                    <v-card-subtitle class="text-overline mb-4"><router-link to="/">메인으로 돌아가기</router-link></v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

```
<br>

- 오류 발생시,보여줄 컴포넌트를 구현하였습니다.
```html
<!-- ~component/common/ErrorPage.vue -->
<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="12">
                <template v-if="errMsg.status">
                    <v-card elevation="2" shaped>
                        <v-card-title>{{errMsg.status}}에러</v-card-title>
                        <v-card-subtitle v-if="errMsg.data">{{errMsg.data.msg}}</v-card-subtitle>
                    </v-card>
                </template>
            </v-col>
        </v-row>
    </v-container>
</template>
```
```js
// error 발생시, props로 에러 데이터를 받아 보여줍니다.
    props: {
        errMsg: {
            type: Object,
            required: true
        }
    }
```
<br>

- 스피너를 구현하여 데이터를 가져오기전에 로딩화면이 보여지도록 구현하였습니다.
 <br>

 스피너 구현
 ```js
// ~utils/bus.js
// 새로은 뷰 인스턴스를 생성하여 상위 하위 컴포넌트 구분없이 이벤트를 전달해줍니다.
import Vue from 'vue';
export const bus=new Vue();

```
 ```html
 <!-- App.vue -->
 <template>
 <v-app>
   <!-- 스피너 -->
   <spinner :loading="loadingState"></spinner>
  ...
    <!-- 메인 -->
   <v-main class="ma-4">
     <router-view></router-view>
   </v-main>
    <!-- 푸터 -->
   <app-footer></app-footer>
 </v-app>
</template>
 ```
```js
import {bus} from '../utils/bus';
  data() {
    return {
      loadingState: false,
    }
  },
  created(){
    // 스피너 시작
    bus.$on('start:spinner',this.startLoading)
    // 스피너 종료
    bus.$on('end:spinner',this.endLoading)
  },
  methods: {
    // 스피너를 보여준다.
    startLoading() {
      this.loadingState=true
    },
    // 스피너를 종료시킨다.
    endLoading(){
      this.loadingState=false
    },

  },
```
`Spinner.vue`컴포넌트에 `props`로 `loadingState`를 내려주어, `loadingState`에 따라 스피너를 보여주도록 구현하였습니다.

<br>
- 삭제 알림창을 구현하였습니다.

#### AlertConFirm.vue
```html
<!-- ~/components/common/AlerConFirm.vue -->
<template>
  <v-row justify="center">
    <v-dialog
        :value="value"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          {{data}} 을/를 삭제하시겠습니까??
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('disagree')"
          >
            닫기
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('agree')"
          >
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

```
```js
export default {
    props:{
        value:{
            type:Boolean,
            required:true
        },
         // 삭제할 대상의 제목
        data:{
            type:String || Number,
            required:true
        }
    }

}
```

- `v-dialog`로 팝업창을 구현하고, `삭제` 버튼을 클릭 시에만 삭제할 수 있도록 구현하였습니다.
- `보드 삭제`와 `카드 삭제`시, 공통적으로 사용하도록 구현하였습니다.

#### props
|value|
|---|
|`v-model`로 바운딩한 `data`의 값을 `props`로 내려주었습니다.|

|data|
|---|
|`보드 삭제`와 `카드 삭제`시, 보여주는 삭제할 대상의 제목을 `props`로 내려주었습니다.|


<br>

### 4. 구현 내용 정리
#### <b>1. 회원가입/로그인 </b>

#### 1-1. 회원가입/로그인 공툥오소
1. `vuetify`의  <a href="https://vuetifyjs.com/en/components/windows/#usage">v-window</a> 사용으로 로그인폼과
회원가입폼을 보여주도록 구현하였습니다.
(`v-window`는 한 창에서 다른 창으로 콘텐츠를 전환하기위한 기본 기능을 제공합니다. )
```html
<!-- view/Login.vue -->
<template>
          <v-container class="fill-height" fluid>
              <v-row align="center" justify="center">
                  <v-col cols="12" sm="8" md="8">
                      <v-card class="elevation-12">
                          <v-window v-model="step">
                              <v-window-item :value="1">
                              <!-- 로그인폼 -->
                                  <login-form @increaseStep="onIncreseStep"></login-form>
                              </v-window-item>
                               <v-window-item :value="2">
                               <!-- 회원가입폼 -->
                                   <register-form @decreaseStep="onDecreaseStep"></register-form>
                              </v-window-item>
                          </v-window>
                      </v-card>
                  </v-col>
              </v-row>
          </v-container>
</template>

```
```js
// ~components/form/LoginForm.vue

 // 기존데이터를 초기화 시키고,로그인폼과 회원가입폼 교체합니다. (버튼 클릭시, 로그인폼으로 이동)
   onChangeForm(){
          this.reset()
          this.$emit('increaseStep')
      },
```
```js
// ~components/form/RegisterForm.vue

 // 기존데이터를 초기화 시키고,로그인폼과 회원가입폼 교체합니다. (버튼 클릭시, 로그인폼으로 이동)
      onChangeForm(){
          this.reset()
          this.$emit('decreaseStep')
      },
```

<br>

2. 폼과 관련된 공통요소들은 `믹스인`으로 정리하였습니다.<br>
** 회원가입/로그인 및 카드추가 등 
```js
// ~mixin/FomrMixin.js
export default {
  data(){
    return {
      errmsg:'',
      valid: true,
    }
  },
    mounted(){
     // 내가 지정한 인풋 태그 요소에 포커스되도록 구현
      if(!this.$refs.input) return
      setTimeout(()=>{
            this.$refs.input.focus()
       },200)
      },
    methods: {
    // 유효성 검사 확인
       validate () {
        this.$refs.form.validate()
      },
      // 입력폼 초기화
      reset () {
        this.$refs.form.reset()
      },
      // 입력폼 유효성 검사 초기화
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
}

```
<br>


- `폼`에 공통적으로 사용되는 요소 이외에 회원가입과 로그인시에만 사용하는 이메일과 비밀번호 유효성 검사와 `input`태그에 `v-model`로 바운딩시켜준 `email`과 `password` 데이터를 공통적으로 사용할 수 있도록 믹스인으로 정리하였습니다.

-  `vuetify`에서 제공하는 `v-form`의 유효성 검사를 사용하였습니다.
(:rules로 규칙을 지정해주어, 유효성 검사가 가능합니다.)
<br>
(<a href="https://vuetifyjs.com/en/components/forms/#rules">v-form 바로가기</a>) <br>
(<a href="https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-form/misc-validation-with-submit-and-clear.vue">참고 github 가기</a>) <br>
( <a href="https://www.w3schools.com/howto/howto_js_password_validation.asp">유효성 검사 정규식 참고 문서</a>)

```js
// ~/mixin/LoginMixin.js

import FormMixin from '../mixin/FormMixin'
export default {
    // 폼요소에 공통적으로 사용되는 믹스인
    mixins: [FormMixin],
    data() {
        return {
            email: '',
            password: '',
            // 이메일은 필수이고, 20자리 이하로 입력할 수 있도록 규칙을 정해줍니다.
           emailRules: [
                v => !!v || '이메일은 필수입니다.',
                v => /.+@.+/.test(v) || '이메일 양식으로 입력해주세요',
              v => v && v.length<=20 || '이메일은 20자리 이하로 입력해주세요',
            ],
              // 비밀번호 필수 입력 및 최소8자리 이상 작성되고 숫자와 특수문자를 포함하도록 규칙을 정해줍니다.
            passwordRules: [
                v => !!v || '비밀번호는 필수입니다.',
              v => v && v.length >= 8 && v.length<=20 || '비밀번호는 최소 8자리 이상 20자리 이하로 입력해주세요',
                v=> /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(v) ||'비밀번호는 최소 숫자와 특수문자가 포함되어야 합니다.'
            ],
        }
    },

}
```
<br>


|`data`의 `email`과 `password`의 길이를 제한하는 이유|
|---|
|DB에서 각각 `email`은 문자열 50자까지, `password`는 문자열 100자까지 가능하도록 제한해주었기 때문에 오류 방지를 위해 길이값을 확인합니다. |


```html
<!-- ~/components/form/LoginForm.vue -->
<!-- ~/components/form/RegisterForm.vue -->
<template>
    ...
    <!-- vutify에서 제공하는 :rules를 사용해 규칙을 정할 수 있습니다. -->
    <v-text-field ref="input" label="이메일" v-model="email" name="email" prepend-icon="mdi-email" type="text" :counter="20"  color="indigo accent-2" :rules="emailRules">
          </v-text-field>
        ...
</template>
```

<br>

#### 1-2. 로그인
|컴포넌트|라우터|
|---|---|
|LoginForm|/login|

#### 1. 로그인 api 호출

#### <div id="axios">1-1. api</div>
- `axios`를 이용해 api 호출
```js
// ~api/index.js

// axios 사용
import axios from 'axios'; 
import {setInterceptors} from './common/interceptors'

const instance = axios.create({
    baseURL:process.env.VUE_APP_API_URL
})

export const request=setInterceptors(instance)
```

<br>

```js
// ~api/interceptors.js
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
```
```js
// ~api/auth.js
import {request} from './index'
export const auth={
    loginUser(userInfo){
        return request.post('user/login',userInfo)
    },
}

```
- <a href="https://axios-http.com/docs/interceptors">axios interceptors</a>를 이용해 데이터 요청시, headers의 authorization에 토큰값 부여하도록 하였습니다.<br>
(<a href="#token">토큰값은  `store`의 `state`의 `token`에 저장하도록 하였습니다.</a>)

|api 요청시 토큰값을 부여하는 이유|
|---|
|<a href="https://jwt.io/">jsonwebtoken</a>는  정보를 JSON 객체로 안전하게 전송하기위한 개방 표준입니다.|
|`headers`의 `Authorization`에 저장된 `token`으로 정보에 접근하도록 하기 위해 `axios Interceptors`를 이용해 요청을 보내기 전에 토큰값을 확인 및 저장해줍니다. |


<br>

#### 1-2. 로그인 구현
- `store`를 이용해 데이터를 저장합니다.

|actions|
|---|
|LOGIN|

```js
// ~/store/actions.js
import {auth} from '../api/auth'
 // 로그인
    async LOGIN({commit},userInfo){
      const {data}= await auth.loginUser(userInfo)
      commit('SET_USER',data)

      return data
    },
```
<br>

|<div id="token">mutations</div>|
|---|
|SET_USER|

```js
// ~/store/actions.js
import {saveAuthToCookie,saveUserToCookie,deleteCookie} from '../../utils/cookie'

 SET_USER(state,data){
        state.user=data.user.nickname
        state.token=data.token
        // 쿠키에 토큰과 사용자의 닉네임 정보 저장
        saveAuthToCookie(data.token)
        saveUserToCookie(data.user.nickname)
    },
```
- 브라우저에 쿠키에 사용자의 닉네임과 토큰값을 추가적으로 저장합니다.

|쿠키에도 따로 저장하는 이유|
|---|
|새로고침시, `store`에 저장된 정보는 유지되지 않으므로, 브라우저의 쿠키에 필요한 데이터를 사용하기 위해 저장하도록 구현하였습니다.|
|`nickname`정보는 사용자의 닉네임이 새로고침시에도 유지되도록 하기 위해서 저장합니다.|
|`token`정보로 사용자의 로그인 유무를 구분하기 때문에,로그인 시 새로고침할 때 로그인 정보가 유지되도록 하기 위해서 저장합니다.|
<br>

- 쿠키에 관련된 요소들은 함수로 따로 만들어 정리하였습니다.

```js
// ~utils/cookie.js
// 쿠키에 토큰 저장
function saveAuthToCookie(value) {
  document.cookie = `memo_auth=${value}`;
}
// 쿠키에 사용자 정보 저장
function saveUserToCookie(value) {
  document.cookie = `memo_user=${value}`;
}
export {
  saveAuthToCookie,
  saveUserToCookie,
  ...
}
```
<br>

|getters|
|---|
|getToken|
| getUser|
```js
    // 토큰 정보 가져오기
    getToken(state){
        return state.token
    },
    // 사용자 정보 가져오기
    getUser(state) {
        return state.user
      },
```
<br>

|state|
|---|
|user|
|token|
```js
   import {getAuthFromCookie,getUserFromCookie} from '../../utils/cookie'
export default {
        // 쿠키에 저장된 정보를 가져오고,없으면 빈문자열을 저장합니다.
    user:getUserFromCookie() ||'',
    token:getAuthFromCookie() || '',

}
```

- 쿠키에 관련된 요소들은 함수로 따로 만들어 정리하였습니다.

```js
// ~utils/cookie.js
// 쿠키에 저장된 토근 정보 가져오기
function getAuthFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)memo_auth\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}
// 쿠키에 저장된 사용자 정보 가져오기
function getUserFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)memo_user\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}
export {
  getAuthFromCookie,
  getUserFromCookie,
  ...
}
```
<br>

#### 1-3. 로그인 버튼 클릭
- `store`의 `actions`함수 `LOGIN` 호출
```js
 methods: {
     ...mapActions(['LOGIN']),
     async login() {
         try {
             // 성공적으로 로그인 시, 메인페이지로 라우터를 이동시킵니다.
             await this.LOGIN({
                 email: this.email,
                 password: this.password
             })
             this.$router.push('/')
         } catch (error) {
             // 오류 발생시, 메세지를 사용자에게 보여줍니다.
             this.errmsg = error.response.data.msg
         }
     }
 }
```

<br>



#### 1-3. 회원가입
|컴포넌트|라우터|
|---|---|
|RegisterForm|/login|

- 회원가입폼의 유효성 검사는 위의 로그인 폼의 유효성 검사와 같습니다.

#### 1. 회원가입 api 호출
#### <div>1-1. api</div>
```js
import {request} from './index'
export const auth={
    registerUser(userInfo){
        return request.post('user/register',userInfo)
    },
}
```
- `axios`의 `interceptors`를 이용해 구현한 내용은 위에서 설명하였습니다.(<a href="#axios">해당 내용 바로가기</a>)
<br>

#### <div>1-2. 회원가입 구현</div>
- `store`를 이용해 데이터를 저장합니다.

|actions|
|---|
|REGISTER|

```js
// ~/store/actions.js
import {auth} from '../api/auth'
  // 회원가입
    async REGISTER({commit},userInfo){
     const {data}= await auth.registerUser(userInfo)
     console.log(data)
      commit('SET_USER',data)

      return data
    },
```
<br>

|mutations|
|---|
|SET_USER|

```js
// ~/store/actions.js
import {saveAuthToCookie,saveUserToCookie,deleteCookie} from '../../utils/cookie'

 SET_USER(state,data){
        state.user=data.user.nickname
        state.token=data.token
        // 쿠키에 토큰과 사용자의 닉네임 정보 저장
        saveAuthToCookie(data.token)
        saveUserToCookie(data.user.nickname)
    },
```
- 브라우저에 쿠키에 사용자의 닉네임과 토큰값을 추가적으로 저장합니다.

- 로그인 뿐아니라 회원가입 진행시에도 회원정보를 저장시킵니다.

|회원가입시에도 사용자 정보를 저장하는 이유|
|---|
|회원가입이 성공적으로 진행되면, 로그인을 생략하고 바로 회원가입한 정보로 로그인이 진행하도록 하기위해, `mutations`을 이용해 `state`의 `user`객체에 사용자 정보를 저장합니다.|
<br>

- 쿠키에 관련된 요소들은 함수로 따로 만들어 정리하였습니다.

```js
// ~utils/cookie.js
// 쿠키에 토큰 저장
function saveAuthToCookie(value) {
  document.cookie = `memo_auth=${value}`;
}
// 쿠키에 사용자 정보 저장
function saveUserToCookie(value) {
  document.cookie = `memo_user=${value}`;
}
export {
  saveAuthToCookie,
  saveUserToCookie,
  ...
}
```
<br>

|getters|
|---|
|getToken|
| getUser|
```js
    // 토큰 정보 가져오기
    getToken(state){
        return state.token
    },
    // 사용자 정보 가져오기
    getUser(state) {
        return state.user
      },
```
<br>

|state|
|---|
|user|
|token|
```js
   import {getAuthFromCookie,getUserFromCookie} from '../../utils/cookie'
export default {
        // 쿠키에 저장된 정보를 가져오고,없으면 빈문자열을 저장합니다.
    user:getUserFromCookie() ||'',
    token:getAuthFromCookie() || '',

}
```

- 쿠키에 관련된 요소들은 함수로 따로 만들어 정리하였습니다.

```js
// ~utils/cookie.js
// 쿠키에 저장된 토근 정보 가져오기
function getAuthFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)memo_auth\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}
// 쿠키에 저장된 사용자 정보 가져오기
function getUserFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)memo_user\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}
export {
  getAuthFromCookie,
  getUserFromCookie,
  ...
}
```
<br>

#### 1-3. 회원가입 버튼 클릭
- `store`의 `actions`함수 `LOGIN` 호출
```js
 methods: {
   ...mapActions(['REGISTER']),
        async userRegister(){
         try {
          // 성공적으로 회원가입 시, 메인페이지로 라우터를 이동시킵니다.
             await this.REGISTER({email:this.email,password:this.password,nickname:this.nickname})
            this.$router.push('/')
         } catch (error) {
              // 오류 발생시, 메세지를 사용자에게 보여줍니다.
                console.log(error)
               this.errmsg = error.response.data.msg
         }
      }
 }
```

<br>

### 2. 데이터(보드,카드) 가져오기

#### 1. 데이터 가져오기 공통 구현 요소

1. `믹스인`을 사용하여 데이터를 불러올 수 있도록 구현하였습니다.
```js
// ~/mixin/FetchMixin.js
 import {mapActions} from 'vuex';
import {bus} from '../../utils/bus'
export default {
    created() {
      // 이벤트 버스로 스피너 보여주기
        bus.$emit('start:spinner')
        // 데이터 불러오기
        this.fetchData()
      },
      methods: {
        ...mapActions(['FETCHLISTS']),
        ...mapMutations(['RESETLIST']),
        async fetchData() {
          try {
            // 기존 데이터 초기화
            this.RESETLIST({
              routeId: this.$route.params.id
            })
            // 데이터 가져오기
            await this.FETCHLISTS({
              routeName: this.$route.name,
              id: this.$route.params ? this.$route.params.id : ''
            })
            // 데이터를 불러온 후 카드 데이터를 보여줍니다.
            if (this.$route.name === "cards") this.cardDialog = true
          } catch (error) {
            this.hasError = true
            this.errMsg = error.response
          } finally {
            // 이벤트 버스로 스피너 종료하기
            bus.$emit('end:spinner')
          }

        }
      }
```

|데이터를 가져올 때, 기존 데이터를 초기화하는 이유|
|---|
|`이벤트 버스`로 스피너를 작동시켜, 스피너를 보여주고, 데이터를 가져온 후, 데이터를 보여주기로 구현하였기 때문에, 해당 라우터에 진입시,기존 데이터를 초기화해야 스피너가 작동할 때, 기존데이터가 같이 보이지 않습니다.|
<a href="https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-after-navigation">라우터 참고 자료 바로 가기</a>
```js
<!-- ~/store/mutations.js -->
 RESETLIST(state,route) {
            if(route.routeId){
                // 카드 데이터 초기화
                if (state.cards.length > 0) {
                    state.cards = []
                return
                }
            }else{
                // 보드 데이터 초기화
                if (state.boards.length > 0) {
                    state.boards = []
                return
                }
            }
    },
```

<br>

```html
<template>
  <div>
  <!-- 에러가 발생되지 않고, 데이터가 있을 경우 보여줄 내용 -->
    <div v-if="!hasError && cards">
    </div>
    <div v-if="hasError">
    <!-- 에러발생시 보여줄 컴포넌트 -->
      <error-page :errMsg="errMsg"></error-page>
    </div>
  </div>
</template>
```

<br>

- 데이터를 불러올 때, 공통적으로 사용할 수 있도록 `믹스인`으로 구현하였습니다.

```js
// ~/view/Boards.vue
// ~/view/Board.vue
// ~/view/Card.vue
 mixins: [FetchMixin]
```
- 데이터를 불러올 때, 공통적으로 사용할 수 있도록 `믹스인`으로 구현하였습니다.


|_|Boards.vue|Board.vue|Card.vue|
|---|---|---|---|
|라우터|/|/board/_id|card/_id|
|데이터|보드 데이터를 불러옵니다.|보드 안에 있는 카드 데이터들을 불러옵니다.|카드 데이터(단일)를 불러옵니다.|

<br>


2. 데이터 패치 `api` 호출

- 2-1. api
```js
// ~/api/list.js
import {request} from './index'
 // 보드,카드 가져오기
    fetchs(Info){
        return Info.id?request.get(`${Info.routeName}/${Info.id}`): request.get(`${Info.routeName}`)
    },
```
- `routeName`으로 `보드` 데이터와 `카드`데이터를 불러올 수 있도록 구현하였습니다.

- `id` 속성으로 라우터를 분류하여 호출하도록 하였습니다.

`id`가 있을 때|`id`가 없을 때|
|---|---|
|`/boards/_id`를 호출하여 해당 보드의 `id`값에 속해 있는 `카드 데이터`를 호출합니다.|`/boards`를 호출하여 해당 사용자의 `보드 데이터`를 호출합니다.|

<br>


- api에 따른 데이터

|api 주소|boards|boards/_id|cards/_id|
|---|---|---|---|
|불러오는 데이터|보드 데이터|해당 id 값을 가지고 있는 보드에 포함되어 있는 카드 데이터|해당 id값을 가지고 있는 카드 데이터|
<br>

- 2-2. 데이터 호출
<br>
 `store`를 이용해 데이터를 저장합니다.

|actions|
|---|
|FETCHLISTS|
```js
// ~/store/actions.js
import {list,category,search} from '../api/list'
  // 데이터 가져오기(보드,카드)
    async FETCHLISTS({commit},Info){
        const res=await list.fetchs(Info)
        commit(`SET_LISTS`,{id:Info.id,data:res.data})
        return res.data
    },
```
- `mutaions`의 `SET_LISTS`에 저장할 데이터를 넘겨줍니다.
<br>

|mutations|
|---|
|SET_LISTS|
```js
// ~/store/mutations.js
    // 보드/카드 가져오기
    SET_LISTS(state,{id,routeName,data}){
      // 카드 저장
        if(routeName === "cards"){
            state.card=data.cards
        }else{
          // 보드들/카드들 저장
            id?state.cards=data.cards: state.boards=data.boards
        }
    },
```
- `id`가 존재한다면 `state`의 `cards`배열에 카드 데이터를 저장시키고, `id`가 존재하지 않는다면, `state`의 `boards` 배열에 보드 데이터를 저장합니다.

<br>

|state|
|---|
|boards|
|cards|
|card|

```js
//  ~/store/state.js
//보드
boards: [],
// 보드에 있는 카드
cards: [],
// 카드
card: {},
```
<br>

- `state`의 `boards`배열에 저장된 데이터의 예시
```js
boards: [{
  // 사용자의 id
  UserId: 3
  // bgcolor는 DB에서 기본값을 "#FFF8E1"로 설정해주었습니다.
  bgcolor: "#FFF8E1"
  createdAt: "2021-06-22T06:44:01.451Z"
  // 메모
  description: "333"
  // 보드 id
  id: 8
  // 보드 제목
  title: "1213"
  updatedAt: "2021-06-22T06:44:01.451Z"

}, ...]
```
<br>

- `state`의 `cards`배열에 저장된 데이터의 예시
```js
boards: [{
  // 보드의 id
  BoardId: 4
  // 카드가 가지고 있는 카데고리 리스트
  CardTypes: Array[3]
  // 카테고리 리스트 중 설정한 대표 카테고리
  Category: Object
   // 카테고리 리스트 중 설정한 대표 카테고리의 id
  CategoryId: 3
  // 사용자의 id
  UserId: 1
  bgcolor: "#00BCD4"
  // 카드의 진행중/완료 상태 여부
  complete: false
  createdAt: "2021-06-25T14:56:18.533Z"
  description: "h"
  id: 13
  title: "ggg"
  updatedAt: "2021-06-25T14:56:18.533Z"
}, ...]
```
<br>

- <div id="card_exam">`state`의 `card` 객체에 저장된 데이터의 예시</div>
```js
card:{
  // 보드의 id
  BoardId: 4
  // 카드가 가지고 있는 카데고리 리스트
  CardTypes: Array[3]
  // 카테고리 리스트 중 설정한 대표 카테고리
  Category: Object
   // 카테고리 리스트 중 설정한 대표 카테고리의 id
  CategoryId: 3
  // 사용자의 id
  UserId: 1
  bgcolor: "#00BCD4"
  // 카드의 진행중/완료 상태 여부
  complete: false
  createdAt: "2021-06-25T14:56:18.533Z"
  description: "h"
  id: 13
  title: "ggg"
  updatedAt: "2021-06-25T14:56:18.533Z"
}
```

<br>

#### 2. 불러온 데이터(보드,카드) 보여주기

- 2-1. 공통 구현 요소
<br>
데이터 호출시, 오류가 발생하거나 존재하는 데이터가 없을 경우,
따로 보여줄 컴포넌트를 구현하여 해당 컴포넌트가 보여지도록 구현하였습니다.
```html
<!-- ~/view/Board.vue -->
<template>
  <div>
    <div v-if="!hasError && cards">
      ...
    </div>
    <!-- 존재하지 않는 데이터이고, 오류가 발생했다면 해당 컴포넌트를 보여줍니다. -->
    <div v-else>
      <error-page :errMsg="errMsg"></error-page>
    </div>
  </div>
</template>
```

- route의 params의 `id`값으로 해당 `id`값을 가지는 보드와 카드 데이터 정보를 호출할 때, 사용자가 잘못된 `id`값으로 호출했을 경우,에러 페이지를 보여줍니다.
(예시) 사용자가 `/board/3333`이나 `/board/ddsss` 같은 존재하지 않는 라우터에 진입하려고 할 경우)

- 2-2. 데이터
<br>
1. 보드
```html
<!-- ~/view/Boards.vue -->
<template>
  <div v-if="boards || boards.length>0">
      <h1 class="subheading grey--text">보드</h1>
      <v-container>
          <v-row no-gutters>
              <v-col cols="12" md="4" lg="3" v-for="board in boards" :key="board.id">
                  <board-card :board="board"></board-card>
              </v-col>
          </v-row>
      </v-container>
  </div>
</template>

```
```js
    computed:{
        ...mapState(['boards'])
    }
```
- 불러온 데이터인 `boards`배열을 `BoardCard.vue` 컴포넌트에 `props`로 내려줍니다.

<br>

```html
<!-- ~/components/board.BoardCard.vue -->
<template>
  <div>
    <v-card class="text-center ma-3" :style="`background-color:${board.bgcolor}`">
      <v-card-title>
      <!-- 보드 제목 -->
        <div class="subheading">{{board.title}}</div>
        <v-spacer></v-spacer>
        <span v-if="board.description">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="black" dark small v-bind="attrs" v-on="on">
                mdi-note
              </v-icon>
            </template>
            <span>메모가 있습니다.</span>
          </v-tooltip>
        </span>
      </v-card-title>
      <v-card-actions>
        <span>
          <router-link style="color:#fff;" :to="`board/${board.id}`">
            <v-btn small elevation="1" dark color="primary">
              <v-icon small left>mdi-message</v-icon>카드 더보기
            </v-btn>
          </router-link>
        </span>
        <v-spacer></v-spacer>
        <!-- 보드 수정/보드 삭제 버튼 메뉴 -->
        <v-menu offset-y v-model="showMenu">
        ...
      </v-card-actions>
    </v-card>
      ...
  </div>
</template>
```
<br>

- 보드 세부 구현 내용
1. 보드 색상은 `style`을 바운딩하여 보여줍니다.
```html
...
 <v-card class="text-center ma-3" :style="`background-color:${board.bgcolor}`">
 ...
  </v-card>
```
<br>

2. 보드에 메모가 작성되어 있다면 메모 표시를 보여줍니다.
```html
...
<span v-if="board.description">
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon color="black" dark small v-bind="attrs" v-on="on">
        mdi-note
      </v-icon>
    </template>
    <span>메모가 있습니다.</span>
  </v-tooltip>
</span>
...
```
- `vuetify`에서 제공하는 `v-tooltip`를 이용해 `메모그림`에 마우스를 올렸을 때, 툴팁이 보이도록 구현하였습니다.
(<a href="https://vuetifyjs.com/en/components/menus/#activator-and-tooltip">`v-tooltip` 공식 문서 바로 가기</a>)
<br>

3.`카드 더보기`버튼 클릭시 라우터를 변경하여 해당 보드에 존재하는 카드 데이터를 보여줍니다.
```html
...
 <span>
   <router-link style="color:#fff;" :to="`board/${board.id}`">
     <v-btn small elevation="1" dark color="primary">
       <v-icon small left>mdi-message</v-icon>카드 더보기
     </v-btn>
   </router-link>
 </span>
 ...
```
<br>

2. 보드가 가지고 있는 카드
```html
<!-- ~/view/Boards.vue -->
<template>
  <div>
    <div v-if="!hasError && cards">
      <div>
        <h1 class="subheading grey--text">카드</h1>
        <v-container>
          <v-row no-gutters>
          <!-- 카드 -->
            <card-list v-for="card in cards" :key="card.id" :card="card"></card-list>
          </v-row>
        </v-container>
      </div>
      ...
    </div>
  </div>
</template>

```
```js
      computed:{
        ...mapState(['cards'])
    },
```
- 불러온 데이터인 `cards`배열을 `CardList.vue` 컴포넌트에 `props`로 내려줍니다.

<br>

- 카드 세부 구현 내용
1. 카드의 대표 카테고리를 보여주고,대표 카테고리 이미지가 있다면,해당 이미지를 보여주도록 구현하였습니다.
```html
...
<!-- ~/components/card/CardList.vue -->
<template>
          <v-col v-if="card" cols="12" md="4" lg="3">
            <v-card class="ma-3">
              <v-list-item >
                <v-list-item-avatar v-if="card.Category" :color="card.bgcolor" class="mt-n7 elevation-5" width="60" height="60">
                <!-- 이미지가 아니라면 아이콘 보여주기 -->
                  <v-icon v-if="!card.Category.imagetype" elevation="10" dark large>
                    {{card.Category.icon}}</v-icon>
                    <!-- 이미지라면 이미지 보여주기 -->
                  <v-img v-else :src="card.Category.icon" alt="카테고리 아이콘"> 
                   </v-img> 
                </v-list-item-avatar>
               ...
            </v-card>
          </v-col>
</template>
```
- `card`의 `Category.imagetype`의 `Boolean`값으로 이미지 여부를 확인하여 이미지가 맞다면 `img 태그`의 `src`속성에 바운딩하여 이미지 정보를 보여줍니다.
- <a href="https://vuetifyjs.com/en/api/v-list-item-avatar/">vuetify v-avatar 바로가기</a>
<br>

2. 카드의 진행중/완료 상태를 확인하여, 완료된 카드라면 완료표시를 보여주도록 구현하였습니다.

```html
<!-- ~/components/card/CardList.vue -->
...
<template>
          <v-col v-if="card" cols="12" md="4" lg="3">
            <v-card class="ma-3">
              ....
              <!-- 카드 버튼 -->
              <v-card-actions>
                <router-link :to="`/card/${card.id}`">
                  <v-btn color="secondary" @click="dialog=true">카드 보기</v-btn>
                </router-link>
                <v-spacer></v-spacer>
                <!-- 카드 상태여부를 확인하여 완료 표시를 보여줍니다. -->
                <v-icon v-if="card.complete" color="primary">mdi-check-circle</v-icon>
              </v-card-actions>
            </v-card>
          </v-col>
</template>
```
<br>


3.`카드 보기`버튼 클릭시 라우터를 변경하여 해당 카드에 존재하는 카드 데이터를 보여줍니다.
```html
<!-- ~/components/card/CardList.vue -->
<template>
          <v-col v-if="card" cols="12" md="4" lg="3">
            <v-card class="ma-3">
              ....
              <!-- 카드 버튼 -->
              <v-card-actions>
              <!-- 라우터 변경 -->
                <router-link :to="`/card/${card.id}`">
                  <v-btn color="secondary" @click="dialog=true">카드 보기</v-btn>
                </router-link>
                <v-spacer></v-spacer>
                <!-- 카드 상태여부를 확인하여 완료 표시를 보여줍니다. -->
                <v-icon v-if="card.complete" color="primary">mdi-check-circle</v-icon>
              </v-card-actions>
            </v-card>
          </v-col>
</template>
```
<br>

3. 카드 데이터(해당 카드의 세부 내용 보여주기)
```html
<!-- ~/view/Card.vue -->
<template>
  <div>
      <v-row v-if="!hasError && card" justify="center">
    <v-dialog v-model="cardDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark :color="card.bgcolor">
         ...
        </v-toolbar>
        <!-- container -->
        <v-container>
          <card-edit-form :card="card"></card-edit-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
</template>
```
```js
      computed:{
        ...mapState(['card'])
    },
```
- `v-dialog`를 이용해 `v-model="cardDialog"`가 `ture`일 경우 데이터를 보여줍니다.
```js
// ~/mixin/FetchMixin.js
        async fetchData(){
            try {
                this.hasError=false
                await this.FETCHLISTS(...)
                // 데이터를 가져온 후 화면을 보여줘야 하기 때문에, 데이터를 가져온 후 cardDialog 속성을 true로 바꾸고, 스피너를 종료시킵니다.
            if(this.$route.name ==="cards") this.cardDialog=true
                bus.$emit('end:spinner')
            } catch (error) {
                this.hasError=true
                this.errMsg=error.response
                bus.$emit('end:spinner')
            }

        },
```

- 불러온 데이터인 `card`객체를 `CardEditForm.vue` 컴포넌트에 `props`로 내려줍니다.

<br>

|컴포넌트가 아닌 라우터로 구현한 이유|
|---|
|`카드 검색`시, 진행중/완료된 카드를 구분하여 검색하고,클릭 시,
해당 카드로 이동될 수 있도록 구현해주기위해 컴포넌트가 아닌 라우터로 구현하였습니다.|

AS-IS
```html
<!-- ~/components/card/CardList.vue -->
<template>
          <v-col v-if="card" cols="12" md="4" lg="3">
            <v-card class="ma-3">
                ....
              <!-- 카드 버튼 -->
              <v-card-actions>
              <!-- 카드 보기 팝업 -->
                 <show-card-list v-if="dialog" @close="dialog=false"  v-model="dialog" :card="card"></show-card-list>
                <v-spacer></v-spacer>
                <v-icon v-if="card.complete" color="primary">mdi-check-circle</v-icon>
              </v-card-actions>
            </v-card>
          </v-col>
</template>
```
- `카드 보기`버튼 클릭시 `ShowCardList.vue` 컴포넌트를 보여줍니다.

TO-BE
```html
<template>
          <v-col v-if="card" cols="12" md="4" lg="3">
            <v-card class="ma-3">
           ...
              <!-- 카드 버튼 -->
              <v-card-actions>
                <router-link :to="`/card/${card.id}`">
                  <v-btn color="secondary" >카드 보기</v-btn>
                </router-link>
                <v-spacer></v-spacer>
                <v-icon v-if="card.complete" color="primary">mdi-check-circle</v-icon>
              </v-card-actions>
            </v-card>
          </v-col>
</template>

```
- `카드 보기`버튼 클릭시 해당 카드의 `id`로 라우터를 이동시킵니다.


- 카드 세부 구현 내용
1. 라우터에 진입시, 기존에 있는 카드의 정보를 보여줍니다.

```html
<template>
  <div>
    ...
    <!-- 카드 제목 -->
    <v-card class="my-6" elevation="7" shaped>
      <v-card-text>
        <v-text-field ref="titleinput" label="카드 제목" :clearable="editState" :readonly="!editState" v-model="cardTitle"
          prepend-icon="mdi-format-title" :rules="titleRules">
        </v-text-field>
        <!-- 카드 메모 -->
        <v-textarea ref="desInput" label="메모" v-model="cardDescription" prepend-icon="mdi-content-paste"
          :clearable="editState" :readonly="!editState">
        </v-textarea>
      </v-card-text>     
    ...
    </v-card>
  </div>
</template>
```
```js
// ~/component/form/CardEditForm.vue
 props:{
     card:{
       type:Object,
       required:true
     }
   },
```
```js
 data() {
      return {
        cardTitle:'',
      cardDescription:''
        
      }
    },
   created(){
       this.cardTitle=this.card.title
       this.cardDescription=this.card.description
   },
```
- 기존 데이터를 보여주기 위해 `created` 훅을 이용해 `props`로 받은 데이터를 저장시킨 후 `v-model`로 바운딩 시켜줍니다.

<br>

2. <div id="action-btn">`Floating Action 버튼`을 만들어, 수정과 삭제 버튼을 구현하였습니다.</div>

```html
...
<!-- 메뉴 -->
<action-menu @onClickBtn="onClickBtn" :top="menu.top" :bottom="menu.bottom" :right="menu.right" :left="menu.left"
  :direction="menu.direction" :hover="menu.hover" :transition="menu.transition" :menus="menu.txts"></action-menu>
...
```
```js
data() {
  // 메뉴에 관한 속성
  menu: {
    direction: 'top',
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: 'slide-y-reverse-transition',
    txts: [{
      icon: 'mdi-pencil',
      btnTxt: '수정모드',
      color: 'green'

    }, {

      icon: 'mdi-delete',
      btnTxt: '삭제',
      color: 'red'

    }]
  },
}
```
- `ActionMenu.vue`컴포넌트는 공통적으로 쓰일 수 있도록 구현하였습니다.

<br>

```html
<!-- ~/components/common/ActionMenu.vue -->
<template>
    <v-speed-dial class="action_menu" v-model="fab" :top="top" :bottom="bottom" :right="right" :left="left" :direction="direction"
        :open-on-hover="hover" :transition="transition">
        <template v-slot:activator>
            <v-btn v-model="fab" color="blue darken-2" dark fab>
                <v-icon v-if="fab">
                    mdi-close
                </v-icon>
                <v-icon v-else>
                    mdi-menu
                </v-icon>
            </v-btn>
        </template>
        <v-tooltip bottom v-for="(menu,index) in menus" :key="index">
      <template v-slot:activator="{ on, attrs }">
      <v-btn  @click="$emit('onClickBtn',index)" v-on="on" v-bind="attrs" fab dark small :color="menu.color">
            <v-icon>{{menu.icon}}</v-icon>
        </v-btn>
      </template>
      <span>{{menu.btnTxt}}</span>
    </v-tooltip>
    </v-speed-dial>
</template>
```
- <a href="https://vuetifyjs.com/en/components/floating-action-buttons/">vuetify 에서 제공하는 `v-speed-dial`</a>를 이용해 버튼을 구현하였습니다.

### 3. 데이터(보드,카드) 추가

#### 1. 공통 구현 요소
1. 데이터 추가 api
```js
// ~/api/list.js
import {request} from './index'
  // 데이터 추가(보드 추가, 카드 추가)
  export const list={
       create({routeName,info}){
        return request.post(`${routeName}`,info)
    }
  }

```
- `routeName`으로 `보드 추가`와 `카드 추가`시, 호출되는 api를 구분하도록 구현하였습니다.
<br>

2. 데이터 추가 api 호출
- `store`를 이용해 데이터를 저장합니다.
<br>

|actions|
|---|
|CREATLIST|
```js
// ~/store/actions.js
import {list,category,search} from '../api/list'
  // 데이터 추가(보드 추가, 카드 추가)
    async CREATLIST({commit},{routeName,info}){
        const {data}=await list.create({routeName,info})
        commit(`SET_LIST`,{data,routeName})
        return data
    }
```
- `routeName`과 추가할 보드의 데이터 객체를 넘겨주어 보드 추가 api를 호출합니다.
- `mutaions`의 `SET_LIST`에 저장할 데이터를 넘겨줍니다.
<br>

|mutations|
|---|
|SET_LIST|
```js
// ~/store/mutations.js
    //보드/카드 추가 및 수정
 SET_LIST(state, Info) {
        // 보드 추가 및 수정
        if(Info.routeName==="boards"){
            const {board}=Info.data
            if (Info.id) {
                //수정
                const index = state.boards.findIndex(b => b.id === board.id)
                state.boards.splice(index, 1, board)
            } else {
                //추가
                state.boards.unshift(board)
            }
        }
        // 카드 추가 및 수정
        if(Info.routeName==="cards"){
            const {card}=Info.data
            // 카드 내용 수정시에는 라우터로 이동시키므로 데이터 수정없이 리턴시킵니다.
            if(Info.id) return
            if (Info.cardState) {
                // 카드 진행중/완료 상태 수정
                    state.card.complete=Info.complete         
            } else {
                //카드 추가
                state.cards.unshift(card)
            }
        }
    },
```
- `routeName`으로 `보드`와 `카드`를 구분하여 데이터를 저장하였습니다.
- `id`값으로 수정과 추가 여부를 구분하여 `state`에 저장시켜줍니다.

|추가|
|---|
|최근에 추가된 데이터가 가장 앞에 보여질 수있도록 `unshift` 메서드를 이용해 기존 배열에 누적시킵니다.|

|수정|
|---|
|<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">splice</a>를 이용해 index 번호를 찾아 기존데이터를 삭제하고 변경된 데이터를 추가로 넣어줍니다.|

<br>

|state|
|---|
|boards|
|cards|
|card|

```js
//  ~/store/state.js
// 보드
boards: [],
// 카드
cards: [],
card: {},
```
<br>

#### 2. 보드 추가
|컴포넌트|
|---|
|AddBoardPopup.vue|
|BoardForm.vue|
#### 1. 보드 추가는 라우터에 상관없이 추가할 수 있도록 모든 라우터에 보여지는 `NavBar.vue` 컴포넌트에 구현하였습니다.
```html
<!-- App.vue -->
<template>
 <v-app>
 <!-- 알림창 -->
   <alert-bar :text="text" :success="success" :timeout="timeout" ></alert-bar>
   <!-- 스피너 -->
   <spinner :loading="loadingState"></spinner>
   <!-- 사용자 정보가 없다면 -->
   <template v-if="!getUser">
     <app-header></app-header>
   </template>
   <!-- 사용자 정보가 있다면 -->
  <template v-else>
    <navbar></navbar>
  </template>
  <!-- 메인 -->
   <v-main class="ma-4">
     <router-view></router-view>
   </v-main>
   <!-- 푸터 -->
   <app-footer></app-footer>
 </v-app>
</template>
```
- 로그인 하여 사용자 정보가 저장되어 있다면 `AppHeader.vue` 컴포넌트를 보여주고, 그렇지 않다면
`Navbar.vue` 컴포넌트를 보여줍니다.
<br><br>

```html
<template>
    ...
    <!-- 사용자 정보가 없다면 -->
    <template v-if="!getUser">
        <app-header></app-header>
    </template>
    <!-- 사용자 정보가 있다면 -->
    <template v-else>
        <navbar></navbar>
    </template>
    ...
</template>
```
<br>

|사용자 정보에 따라 보여줄 컴포넌트를 구분한 이유|
|---|
|`로그인`해야 이용가능하도록 구현하였으므로, 로그인 하지 않으면 아예 메뉴가 보이지 않도록 구현하였습니다.|

<br>

#### AppHeader.vue
```html
<!-- ~/components/common/AppHeader.vue -->
<template>
        <v-app-bar color="indigo darken-1" dark app>
          <v-toolbar-title>
              <span><router-link class="link-text white--text font-weight" to="/">Memo</router-link></span>
          </v-toolbar-title>
      </v-app-bar>
</template>
```
- 로그인 하지 않아 사용자 정보가 저장되어 있지 않으므로, `로고`인 `Memo`만 보여줍니다.

<br>

#### Navbar.vue
```html
<template>
  <nav>
      <v-app-bar color="indigo darken-1" dark app>      
    ...
      <v-navigation-drawer v-model="drawer" dark app class="indigo">
          ...
          <div class="my-4">
          <!--보드 추가 컴포넌트 -->
               <v-row justify="center">
                <add-board-popup :title="`새 보드`" :btnTxt="`보드 추가`"></add-board-popup>
              </v-row>
          </div>
         ...
      </v-navigation-drawer>
  </nav>
</template>
```
- 로그인 하여 사용자 정보가 저장되어 있다면, 해당 네비게이션 메뉴를 보여줍니다.

- 라우터에 상관없이 공통적으로 사용한 컴포넌트인 `Navbar.vue` 에 `보드 추가` 컴포넌트인 `AddBoardPopup.vue`컴포넌트를 구현하여, 어디서든 보드를 추가 할 수 있도록 구현하였습니다.

- `AddBoardPopup.vue`는 `보드 추가` 외에도 `보드 수정`시 재활용 할 수 있도록 구현하였습니다.
```html
<!-- ~/components/board/AddBoardPopup.vue -->
<template>
        <!-- 팝업 -->
      <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                    <!-- 보드 추가 및 수정 버튼 -->
                      <v-btn v-on="on" v-bind="attrs" :text="board?true:false" >{{btnTxt}}</v-btn>
              </template>
          <v-card>
              <v-card-title>
                  <span class="headline">{{title}}</span>
              </v-card-title>
                <!-- 보드 추가 및 수정 컴포넌트 -->
              <board-form @close="onClose" :board="board"></board-form>
          </v-card>
      </v-dialog>
</template>
```
```js
 props:{
    title:{
      type:String,
      required:true
    },
   btnTxt:{
      type:String,
      required:true
    },
    board:{
      type:Object,
      required:false
    }
  },
```
#### props

|title|
|---|
|팝업 창 제목으로 `보드 추가`와 `보드 수정`으로 보여질 수 있도록 `props`로 내려주었습니다.|

|btnTxt|
|---|
|`보드 추가 버튼`과 `보드 수정 버튼`이 보여질 수 있도록 `props`로 내려주었습니다.|

|board|
|---|
|`보드 수정`시, 기존 데이터를 보여주기 위해 해당 데이터를 `props`로 내려주었습니다.|
<a href="#add_board">보드 수정 관련 내용 바로가기</a>

<br>

#### 2. `보드 추가`버튼 클릭 시,`vuetify`의 `v-dialog`를 이용해 팝업 형식으로 보드 추가 폼을 띄우도록 하였습니다.
```html
<!-- ~/componnets/board/AddBoardPopup.vue -->
<template>
  <v-row justify="center">
  <!-- 팝업 -->
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                    <!-- 보드 추가 및 수정 버튼 -->
                      <v-btn v-on="on" v-bind="attrs" :text="board?true:false" >{{btnTxt}}</v-btn>
              </template>
          <v-card>
              <v-card-title>
                  <span class="headline">{{title}}</span>
              </v-card-title>
                <!-- 보드 추가 및 수정 컴포넌트 -->
              <board-form @close="onClose" :board="board"></board-form>
          </v-card>
      </v-dialog>
  </v-row>
</template>
```
- <a href="https://dev.vuetifyjs.com/en/components/dialogs/">`v-dialog` 공식 문서 바로가기</a>

<br>

#### 3. 보드 추가시, `제목`,`메모`,`보드 색` 세가지 정보로 보드를 추가할 수 있도록 구현하였습니다.
```html
<!--  ~/componnets/form/BoardForm.vue -->
<template>
    <v-form class="px-3" ref="form" v-model="valid">
        <v-card-text>
        <!-- 보드 제목 -->
            <v-text-field ref="input"  clearable label="보드 제목" v-model="title" prepend-icon="mdi-format-title" :rules="titleRules">
            <!-- 보드 설명(메모) -->
            </v-text-field>
            <v-textarea label="메모"  clearable v-model="description" prepend-icon="mdi-content-paste">
            </v-textarea>
        </v-card-text>
        <!-- 보드 색 변경 -->
        <v-card-subtitle>
            <v-btn outlined color="indigo darken-1" dark @click="showColorpicker=!showColorpicker">보드 색 변경</v-btn>
        </v-card-subtitle>
        <v-row v-if="showColorpicker" justify="center" align="center" class="ma-1">
            <v-card>
                <v-color-picker style="max-width: 500px" v-model="color" hide-canvas></v-color-picker>
            </v-card>
        </v-row>
        ...
    </v-form>
</template>

```
<br>

- `form`과 관련된 요소는 `믹스인`으로 구현하여 정리하였습니다.(<a href="">FormMixin 정리한 내용 바로가기</a>)
```js
import FormMixin from '../../mixin/FormMixin'
export default {
     mixins: [FormMixin],
}
```
<br>


- `보드 색 변경` 세부 내용
```html
<!--  ~/componnets/form/BoardForm.vue -->
<template>
    ...
    <!-- 보드 색 변경 -->
    <v-card-subtitle>
    <!-- 버튼을 클릭시 데이터의 showColorpicker 값을 변화시켜, 컬러 선택 창을 보여줍니다. -->
        <v-btn outlined color="indigo darken-1" dark @click="showColorpicker=!showColorpicker">보드 색 변경</v-btn>
    </v-card-subtitle>
    <v-row v-if="showColorpicker" justify="center" align="center" class="ma-1">
        <v-card>
            <v-color-picker style="max-width: 500px" v-model="color" hide-canvas></v-color-picker>
        </v-card>
    </v-row>
    ...
</template>
```
```js
//  ~/componnets/form/BoardForm.vue 
data(){
     showColorpicker:false
}
```

- `vuetify`에서 제공해주는 <a href="https://dev.vuetifyjs.com/en/components/color-pickers/">v-color-picker</a> 를 사용하여 색을 선택할 수있도록 구현하였습니다.
- `보드 색 변경 버튼`을 클릭해야 색을 변경할 수 있는 `v-color-picker`가 보이도록 구현하였습니다.

<br>

#### 3. 보드 생성 버튼 클릭 시, 보드 추가 api를 호출합니다.
```html
<!-- ~/components/form.vue -->
<template>
  <v-form class="px-3" ref="form" v-model="valid">

    <v-card-actions v-if="!board">
      <v-spacer></v-spacer>
      <v-btn color="blue daren-1" text @click="reset">닫기</v-btn>
      <!-- 보드 생성 버튼 -->
      <v-btn clor="green" text outlined @click="onAddBoard" :disabled="!valid">생성</v-btn>
    </v-card-actions>
    ...
  </v-form>
</template>

```
- `store`의 `actions`함수 `CREATLIST` 호출
```js
// ~/components/BoardForm.vue
  methods: {
      ...mapActions(['CREATLIST']),
      async onAddBoard() {
        try {
          const info = {
            title: this.title,
            description: this.description,
            bgcolor: this.color
          }
         // 보드 추가 actions 함수 호출
          await this.CREATLIST({
            routeName: 'boards',
            info
          })
          // 기존 데이터 초기화
          this.reset()
          // 메인으로 라우터 이동
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
        } catch (error) {
          console.log(error)
        }
      },
      reset() {
        this.title = ''
        this.description = ''
        this.color = ''
        this.showColorpicker = false
        //  보드 추가 팝업창 닫기
        this.$emit('close')
      }
```
<br>

#### 3. 카드 추가
|컴포넌트|
|---|
|CardForm.vue|

#### 1. 팝업 형식으로 라우터를 보여주기 위해 중첩된 라우터를 사용하였습니다.
```js
// ~/router/index.js
const router = new VueRouter({
      routes: [{
          ...{
            path: '/board/:id',
            component: () => import('../view/Board.vue'),
            name: 'boards',
            meta: {
              auth: true
            },
            beforeEnter: isAuth,
            children: [{
              path: 'add',
              component: () => import('../view/AddCards.vue'),
            }]
          },
        ]

      })
```
```html
<!-- ~/view/Board.vue -->
<template>
  <div>
    <div v-if="!hasError && cards">
      <div>
        <h1 class="subheading grey--text">카드</h1>
       ....
       <!-- 중첩된 라우터를 보여줍니다. -->
      <router-view></router-view>
    </div>
    <div v-else>
      <error-page :errMsg="errMsg"></error-page>
    </div>
  </div>
</template>
```

- 중첩된 라우터를 사용하여 `/board/:id`가 뒤에 보여지고, 팝업형식 처럼 `/board/:id/add`라우터가 보여지도록 구현하였습니다.
<br>
(<a href="https://router.vuejs.org/guide/essentials/nested-routes.html">중첩된 라우터에 관한 문서 바로가기</a>)

#### 3. 카드 추가시, `카테고리`,`카드 제목`,`메모`,`카드 색` 정보로 카드를 추가할 수 있도록 구현하였습니다.

- 세부 구현 내용
1. 기본적인 카테고리 리스트를 불러와 카드 추가시, 해당 리스트를 보여줍니다.
```html
<!-- ~/component/CardForm.vue -->
  <template>
    <v-form v-model="valid" class="px-3" ref="form">
        <!-- 카테고리 리스트 -->
       <category-list :label="`추가 카테고리`" :noDataTxt="`추가할 카테고리가 없습니다.`" 
       :categoryList="categoryList" v-model="selectList" @updateInput="onupdateInput"></category-list>
      ...
    </v-form>
</template>
```
```js
    created() {
        this.onFetchCategory()
    },
       async onFetchCategory() {
            try {
                await this.FETCHCATEGORYS({
                    BoardId: this.$route.params.id
                })
            } catch (error) {
                console.log(error)
            }
        }
```
- `created` 훅으로 카테고리 리스트를 불러오도록 구현하였습니다.
(서버에서는 default 카테고리 리스트를 만들고, 해당 테이터를 불러오도록 했습니다. )
```js
// 서버에서 내려주는 기본적인 카테고리 리스트
 const defaultcategoryList=[{type:'여행',icon:'mdi-train-car'},{type:'힐링',icon:'mdi-battery-heart'},{type:'회사',icon:'mdi-domain'}]
```
<br>

- <a href="https://vuetifyjs.com/en/components/selects/#usage">`vuetify`의 `v-select`</a>를 이용해 카테고리 리스트를 보여줍니다.
```html
<!-- ~/components/Categorys/CategoryList.vue -->
<template>
    <div>
        <v-select class="pt-4" :value="value" :rules="selectRules" :items="categoryList" item-text="type"
            item-value="type" return-object :label="label" :multiple="!isEdit" hide-selected outlined clearable
            @click:clear="$emit('categoryReset')" @change="$emit('updateInput',$event)" :no-data-text=" noDataTxt"></v-select>
    </div>
</template>

```
```js
  props:{
        label:{
            type:String,
            required:true
        },
        noDataTxt:{
            type:String,
            required:true
        },
        categoryList:{
            type:Array,
            required:true
        },
        value:{
            type:Array,
            required:false
        },
        isEdit:{
            type:Boolean,
            required:false
        }
        
    },
```

#### props
|label|
|---|
|카테고리의 라벨 제목|

| noDataTxt|
|---|
|데이터가 없을 시, 보여주는 텍스트 데이터|

|categoryList|
|---|
|카테고리의 리스트로 배열로 불러옵니다.|

| value|
|---|
|`v-model`로 바운딩 시켜준 값으로 선택한 데이터를 보여줍니다.|

|isEdit|
|---|
|카드 추가가 아닌 카드 수정 시, 활용하기위해 내려보낸 데이터|
```html
<!-- 카드 추가가 아닌 카드 수정시, `mutiple` 속성을 사용하지 않으므로, ,`props`로 내려준  isEdit 속성으로 바운딩시켜 `mutiple`속성 유무를 구분합니다. -->
  <v-select class="pt-4" :multiple="!isEdit">
  </v-select>
```
<br>

### event
<a href="https://vuetifyjs.com/en/api/v-select/#events">* v-select 에서 지원하는 이벤트 참고</a>
<br>

|change|
|---|
|`input`의 입력폼이 바뀔때마다 호출되는 이벤트|
|입력폼이 바뀔때마다 상위 컴포넌트에 이벤트를 보내주어, 카테고리 리스트 중 선택된 카테고리 데이터를 보여주도록 구현하였습니다.|
```html
<v-select class="pt-4" ... @change="$emit('updateInput',$event)"  ..></v-select>
```
```html
<!-- ~/components/CardForm.vue -->
   <category-list ... v-model="selectList" @updateInput="onupdateInput"></category-list>
```
```js
// ~/components/CardForm.vue
data() {
  return {
    // 카테고리 리스트
    selectList: [],
  },
  methods:{
    // 하위 컴포넌트에서 입력값이 바뀔때마다 이벤트를 발생시켜, 입력값이 바뀐 데이터를 selectList에 저장합니다.
     onupdateInput(value){
            this.selectList=value
        }
  }
}
```
2. 내가 선택한 카테고리 리스트 중 대표 카테고리를 선택하도록 구현하였습니다.
```html
<template>
    <v-form v-model="valid" class="px-3" ref="form">
        ....
        <!-- 대표 카테 고리 -->
        <!-- 필수 카테고리 선택 알람 메세지 -->
        <v-alert class="caption py-2"
            v-if="selectList.length>0 && representCategory" border="left"
            colored-border color="deep-purple accent-4" elevation="2">
            아래 카테고리 중 대표 카테고리를 선택해주세요
        </v-alert>
        <!--내가 선택한 카테고리 중 대표 카테고리 -->
        <v-container class="d-flex" v-if="representCategory.type">
            <v-card-title class="pa-0">대표 카테고리</v-card-title>
            <v-chip class="ml-1 font-weight-bold" style="font-size:18px;" text-color="white" color="cyan">
                {{ representCategory.type}}</v-chip>
        </v-container>
        <!-- 내가 선택한 카테고리 리스트 -->
        <category-chip :selectList="selectList" @onRepresent="onRepresent"></category-chip>
      ...
    </v-form>
</template>
```
- 내가 선택한 카테고리 리스트를 `CategoryChip.vue` 컴포넌트에  `props`로 내려주어 보여줍니다.
<br>

```html
<!-- ~/components/Categorys/CategoryChip.vue -->
  <v-chip v-for="(choice,index) in selectList" :key="index" @click="$emit('onRepresent',choice)"
    text-color="white" color="pink" :close="edit.editState && edit.removeState"
    @click:close="onChipClose(choice,index)" class="ma-1 c_chip">
    <v-icon v-if="!choice.imagetype" left>{{choice.icon}}</v-icon>
    <v-avatar class="mr-1" v-else><img :src="choice.icon" alt=""></v-avatar>
    {{choice.type}}
  </v-chip>
```
- <a href="https://vuetifyjs.com/en/components/chips/">vuetify 에서 제공하는 `v-chip`</a>를 사용하여 칩형식으로 내가 선택한 카테고리를 보여줍니다.

#### event
|click|
|---|
|해당 칩을 클릭했을 때,호출되는 이벤트|
```html
<!-- 해당칩을 클릭시, 상위 컴포넌트에 choice 데이터와 함께 이벤트를 보내줍니다. -->
 <v-chip v-for="(choice,index) in selectList" :key="index" @click="$emit('onRepresent',choice)"></v-chip>
 ...
 {{choice.type}}
 </v-chip>
```
<br>

- 상위 컴포넌트인 `CardForm.vue` 컴포넌트에서 내가 클릭한 데이터를 `representCategory`에 저장시켜 대푶 카테고리를 보여주도록 구현하였습니다.
```html
<!-- ~/component/form/CardForm.vue -->
 <category-chip :selectList="selectList" @onRepresent="onRepresent"></category-chip>
```
```js
methods:{
  data() {
        return {
            // 카테고리 리스트
            selectList:[],
            // 대표 카테고리
            representCategory:{},
        }
    },
    onRepresent(choice){
            this.representCategory=choice
        },
}
```

<br>


3. `카테고리`,`카드 제목`은 필수값으로 설정하여 해당 값이 하나라도 작성되지 않는다면,버튼을 클릭할 수 없도록 구현하였습니다.
```html
<!-- ~/components/form/CardForm.vue -->
<template>
    <v-form v-model="valid" class="px-3" ref="form">
        ...
        <v-card-actions>
            <v-spacer></v-spacer>
            <router-link :to="`/board/${$route.params.id}`"><v-btn link color="blue daren-1" text>닫기</v-btn></router-link>
            <!-- `카테고리`,`카드 제목`,`카드 메모`와 대표카테고리 설정 여부 확인합니다. -->
            <v-btn color="green" :disabled="!valid ||!representCategoryState" text outlined @click="onAddCard">생성</v-btn>
        </v-card-actions>
    </v-form>
</template>
```
 `disabled`속성을 바운딩 시켜 유효성 여부를 확인합니다.

 |valid|
 |---|
 |<a href="https://vuetifyjs.com/en/components/forms/#vuelidate">`vuetify`의`v-form`</a> 유효성 검사를 위해 제공하는 속성을 이용하였습니다.(폼과 관련된 요소는 <a href="#mixin">폼 믹스인</a>으로 구현)|


|representCategoryState|
|---|
|`data`의 `representCategory`의 `id`값을 이용해 대표 카테고리가 지정되어있는지 여부를 판단합니다.|
 ```js
   computed:{
        representCategoryState(){
           return (this.representCategory && this.representCategory.id)?true:false
        }
    },
 ```
<br>

#### 3. 카드 생성 버튼 클릭 시, 카드 추가 api를 호출합니다.
- `store`의 `actions`함수 `CREATLIST` 호출
```js
// ~/components/BoardForm.vue
  methods: {
      ...mapActions(['CREATLIST']),
            async onAddCard(){
            try {
                const info={title:this.title,description:this.description,bgcolor:this.color,category:this.selectList,BoardId:this.$route.params.id,CategoryId:this.representCategory.id}
                await this.CREATLIST({routeName:'cards',info})
                // 카드 추가 후 라우터 이동
                this.$router.push(`/board/${this.$route.params.id}`)
            } catch (error) {
                console.log(error)
            }
        },
```

### 4. 데이터(보드,카드) 수정

#### <div id="edit_common">1. 공통 구현 요소</div>
1. 데이터 수정 api
```js
// ~/api/list.js
import {request} from './index'
  // 데이터 추가(보드 추가, 카드 추가)
        // 보드,카드 수정
   export const list={
      // 보드,카드 수정
    update({routeName,id,info}){
        return request.put(`${routeName}/${id}`,info)
    },
  }

```
- `routeName`으로 `보드 수정`과 `카드 수정`시, 호출되는 api를 구분하도록 구현하였습니다.
<br>

2. 데이터 수정 api 호출
- `store`를 이용해 데이터를 저장합니다.
<br>

|actions|
|---|
|UPDATELIST|
```js
// ~/store/actions.js
import {list,category,search} from '../api/list'
   // 데이터 수정(보드 수정,카드 수정)
    async UPDATELIST({commit},{routeName,id,info}){
        const {data}=await list.update({routeName,id,info})
        commit(`SET_LIST`,{data,routeName,id,complete:info.complete,cardState:info.cardState})
        return data
    },
```
- `mutaions`의 `SET_LIST`에 저장할 데이터를 넘겨줍니다.
<br>

|mutations|
|---|
|SET_LIST|
```js
// ~/store/mutations.js
    //보드/카드 추가 및 수정
         SET_LIST(state, Info) {
        // 보드 추가 및 수정
        if(Info.routeName==="boards"){
            const {board}=Info.data
            if (Info.id) {
                //수정
                const index = state.boards.findIndex(b => b.id === board.id)
                state.boards.splice(index, 1, board)
            } else {
                //추가
                state.boards.unshift(board)
            }
        }
        // 카드 추가 및 수정
        if(Info.routeName==="cards"){
            const {card}=Info.data
            // 카드 수정
            if(Info.id) return
            if (Info.cardState) {
                // 카드 진행중/완료 상태 수정
                    state.card.complete=Info.complete         
            } else {
                //카드 추가
                state.cards.unshift(card)
            }
        }
    },
```
- `routeName`으로 `보드`와 `카드`를 구분하여 데이터를 저장하였습니다.
- `id`값으로 수정과 추가 여부를 구분하여 `state`에 저장시켜줍니다.

|추가|
|---|
|최근에 추가된 데이터가 가장 앞에 보여질 수있도록 `unshift` 메서드를 이용해 기존 배열에 누적시킵니다.|

|수정|
|---|
|<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">splice</a>를 이용해 index 번호를 찾아 기존데이터를 삭제하고 변경된 데이터를 추가로 넣어줍니다.|

|카드 상태 수정|
|---|
|`cardState`와 `complete`속성을 이용하여, 카드 상태를 수정하도록 구현하였습니다.|

- `카드 내용 수정`시, 라우터를 이동시켜서 데이터를 가져오므로, 데이터 수정 필요없이 리턴시켜줍니다.

<br>

|state|
|---|
|boards|
|cards|
|card|

```js
//  ~/store/state.js
// 보드
boards: [],
// 카드
cards: [],
card: {},
```
<br>

#### 2. 보드 수정
|컴포넌트|
|---|
|BoardForm.vue|
|BoardCard.vue|

#### 1. 보드 추가 때 사용한 컴포넌트인 `AddBoardPopup.vue`를 재사용하여 수정할 수 있도록 구현하였습니다.
```html
<!-- ~/componnets/board.BardCard.vue -->
<template>
  <v-card class="text-center ma-3" :style="`background-color:${board.bgcolor}`">
    <!-- 보드 수정/보드 삭제 버튼 메뉴 -->
    <v-menu offset-y v-model="showMenu">
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <!-- 보드 수정 -->
        <v-list-item>
          <v-list-item-title>
            <!-- 보드 수정 팝업 -->
            <add-board-popup :title="`보드 수정`" :btnTxt="`보드 보기`" :board="board" @closemenu="showMenu=false">
            </add-board-popup>
          </v-list-item-title>
        </v-list-item>
        <!-- 보드 삭제-->
        <v-list-item>
          <v-list-item-title>
            <v-btn text @click="confirm=true">
              보드 삭제
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </v-card-actions>
    ...
  </v-card>
</template>
```
- `vuetify`의 `v-menu`로 드롭다운 메뉴를 만들고, 수정/삭제 버튼을 구현하였습니다. <br>
(<a href="https://vuetifyjs.com/en/components/menus/#rounded">v-menu 공식문서 바로가기</a>) <br>

<br>

- `AddBoardPopup.vue`에 `props`로 `board` 데이터를 내려주었습니다.
```html
<!-- ~/componnets/board.AddBoardPopup.vue -->
<template>
        <!-- 팝업 -->
      <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                    <!-- 보드 추가 및 수정 버튼 -->
                      <v-btn v-on="on" v-bind="attrs" :text="board?true:false" >{{btnTxt}}</v-btn>
              </template>
          <v-card>
              <v-card-title>
                  <span class="headline">{{title}}</span>
              </v-card-title>
                <!-- 보드 추가 및 수정 컴포넌트 -->
              <board-form @close="onClose" :board="board"></board-form>
          </v-card>
      </v-dialog>
</template>
```
<br>


```html
<!-- ~/componnets/form/BoardForm.vue  -->
<template>
    <v-form class="px-3" ref="form" v-model="valid">
        <v-card-text>
            <!-- 보드 제목 -->
            <v-text-field ref="input" clearable label="보드 제목" v-model="title" prepend-icon="mdi-format-title"
                :rules="titleRules">
                <!-- 보드 설명(메모) -->
            </v-text-field>
            <v-textarea label="메모" clearable v-model="description" prepend-icon="mdi-content-paste">
            </v-textarea>
        </v-card-text>
        <!-- 보드 색 변경 -->
        <v-card-subtitle>
            <v-btn outlined color="indigo darken-1" dark @click="showColorpicker=!showColorpicker">보드 색 변경</v-btn>
        </v-card-subtitle>
        <v-row v-if="showColorpicker" justify="center" align="center" class="ma-1">
            <v-card>
                <v-color-picker style="max-width: 500px" v-model="color" hide-canvas></v-color-picker>
            </v-card>
        </v-row>
        <!-- 보드 추가와 수정시 보여지는 버튼 구분하기 -->
        <!-- props로 받은 보드 데이터가 없다면 추가 버튼을 보여줍니다. -->
        <v-card-actions v-if="!board">
            <v-spacer></v-spacer>
            <v-btn color="blue daren-1" text @click="reset">닫기</v-btn>
            <v-btn clor="green" text outlined @click="onAddBoard" :disabled="!valid">생성</v-btn>
        </v-card-actions>
        <!-- props로 받은 보드 데이터가 있다면 수정 버튼을 보여줍니다. -->
        <v-card-actions v-else>
            <v-spacer></v-spacer>
            <v-btn color="blue daren-1" text @click="reset">닫기</v-btn>
            <v-btn clor="green" text outlined @click="onEditBoard" :disabled="!valid">수정</v-btn>
        </v-card-actions>
    </v-form>
</template>

```
```js
// ~/componnets/form/BoardForm.vue
 props:{
        board:{
            type:Object,
            required:false
        },
    }
```

|props의 데이터인 `board`값은 필수`(required:false)`로 하지 않은 이유|
|---|
|`BoardForm.vue`컴포넌트로 `보드 추가`/ `보드 수정`을 구현하기 위해, `props`로 `board`데이터가 있다면, 이미 추가된 데이터가 있으므로 그 데이터를 보여주고, 없다면 아직 추가된 데이터가 없으므로 빈 데이터를 보여주게 하기 위해서입니다.|
| `props`로 받은 `board`데이터를 구분하여 `추가버튼`과 `수정 버튼`이 구분되어 보여지도록 구현하였습니다.|
|수정시에는, 기존에 존재하는 데이터를 보여주어야하기 때문에 `props`로 받은 `board`데이터를 보여줍니다.|

```js
// props로 받은 board 객체의 에시
board: {
  UserId: 1
  bgcolor: "#FFF8E1"
  createdAt: "2021-06-25T14:05:05.641Z"
  description: null
  id: 4
  title: "샘플보드.."
  updatedAt: "2021-06-25T14:05:05.641Z"

}
```
```js
// ~/componnets/form/BoardForm.vue
 data() {
    //  props로 받은 데이터가 있다면 그 데이터를 보여주고, 없다면 빈문자열을 보여줍니다.
        return {
            title:this.board &&this.board.title || '',
            description:this.board && this.board.description ||'',
            color:this.board && this.board.color || '',
            ...
    },
```
<br>


#### 2. 보드 수정 버튼 클릭 시, 보드 수정 api를 호출합니다.
- `store`의 `actions`함수 `UPDATELIST` 호출
```js
// ~/components/form/BardForm.vue
  methods: {
      ...mapActions(['UPDATELIST']),
      async onEditBoard(){
            try {
                const info={title:this.title,description:this.description,bgcolor:this.color}
                await this.UPDATELIST({routeName:'boards',info,id:this.board.id})
                // 기존 데이터 초기화
                this.reset()
            } catch (error) {
                console.log(error)
            }
        },
         reset(){
            this.title=''
            this.description=''
            this.color=''
             this.showColorpicker=false
            //  보드 추가 팝업창 닫기
                this.$emit('close')
        }
    },
 }
```
<br>

#### 3. 카드 수정
|컴포넌트|
|---|
|CardEditForm.vue|
|CardSteper.vue|
|CartegoryForm.vue|

#### 1. `카드 수정` 버튼 클릭시, 카드 수정 모드로 전환되어 카드를 수정할 수 있도록 구현하였습니다.
```html
<!-- ~/view/Card.vue -->
<template>
  <div>
      <v-row v-if="!hasError && card" justify="center">
    <v-dialog v-model="cardDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        ....
        <!-- 메뉴 -->
        <action-menu @onClickBtn="onClickBtn" :top="menu.top" :bottom="menu.bottom" :right="menu.right"
          :left="menu.left" :direction="menu.direction" :hover="menu.hover" :transition="menu.transition"
          :menus="menu.txts"></action-menu>
      </v-card>
    </v-dialog>
  </v-row>
  ...
  </div>
</template>
```
- `ActionMenu` 컴포넌트로 `수정`,`삭제`버튼을 구현하였습니다.(<a href="#action-btn">해당 내용 바로 가기</a>)

- `state`에 편집상태를 관리하도록 구현하였습니다.

|state|
|---|
|edit|

```js
// ~/store/state.js
    //편집 상태
    edit:{
      // 수정 모드 상태
        editState:false,
        // 카드 수정모드시, 카테고리 추가 상태
        addState:false,
        // 카드 수정모드시, 카테고리 삭제 상태 
        removeState:false
    }
```
<br>

|mutations|
|---|
|ChangeState|

```js
    ChangeState(state,{editState,value}){
        state.edit[editState]=value
    }
```
-`state`의 `edit`객체를 사용하여 편집 상태를 수정합니다.

```js
methods:{
     ...mapMutations(['ChangeState']),
       // 카드편집모드
       onEditCard() {
         this.ChangeState({
           editState: "editState",
           value: true
         })
       }, ,
       onClickBtn(index) {
         switch (index) {
           //수정모드
           case 0:
             this.onEditCard()
             break;
             //삭제
           case 1:
             this.onremoveCard()
             break;

           default:
             break;
         }
       },
      //  편집 모드 해제시 모든 상태를 초기화시켜줍니다.
       resetState() {
         let state = ["editState", "addState", "removeState"];
         state.forEach((state) => {
           this.ChangeState({
             editState: state,
             value: false
           })
         })
       },
     }
```

|수정모드 취소나 라우터 변경 시 편집모드를 초기화 시켜주는 이유|
|---|
|`state`의 `edit`속성을 초기화시켜주지 않으면, 수정 내역이 지워지지 않아, 라우터가 변경되더라도 해당 데이터는 남아있게 됩니다. 해당 내용을 방지하기 위해 수정 중 `수정모드 취소` 버튼을 클릭하거나, 다른 라우터로 이동했을 때,기존의 편집 상태를 초기화시켜줍니다.|

<br>

#### 2.카드 수정은 `카드 상태 수정`, `카드 카테고리 수정`, `카드 내용 수정` 으로 분류하여 구현하였습니다.

#### 2-1. 카드 상태 수정
1. 현재 카드 상태를 확인하여 상태를 보여줍니다.
```html
<!-- ~/components/form/CardEditForm.vue -->
<template>
  <div>
    <!-- 카드 스탭 -->
    <card-steper></card-steper>
      ...
  </div>
</template>
```
```html
<!-- ~/components/card/CardSteper.vue -->
<template>
    <v-stepper  class="card_step my-2 " v-model="stepState" alt-labels>
        <v-stepper-header height="100px" >
        <!-- data의 steps 배열을 v-for로 보여줍니다. -->
            <template v-for="n in steps">
                <v-stepper-step class="pa-2" color="pink accent-2" :key="`step${n.step}`" 
                :editable="edit.editState" :step="n.step" @click="changeStep(n.step)">
                <!-- 카드의 진행중/완료 상태 -->
                    {{n.state}}
                </v-stepper-step>
                <v-divider v-if="n.step===1" :key="n.step"></v-divider>
            </template>
        </v-stepper-header>
    </v-stepper>
</template>
```
```js
    data() {
        return {
            steps: [{
                step: 1,
                state: '진행중'
            }, {
                step: 2,
                state: '완료'
            }],
            complete: false,
            stepState: 1,
        }
    },
     computed: {
        ...mapState(['card', 'edit']),
        currentState(){
          // 진행중은 1, 완료는 2
           return this.card.complete?2:1;
        }

    },
   created(){
    //  진행상태를 넣어주어 보여준다.
        this.stepState=this.currentState
    }
```

- <a href="https://vuetifyjs.com/en/components/steppers/">vuetify에서 제공하는 v-steper</a>를 사용하여 진행중/완료 상태가 보여지도록 구현하였습니다.
- `computed`로 `state`의 `card`의 `complete`속성을 확인합니다.
- `created`훅으로 `data`의 `stepState`에 현재 카드의 상태를 저장시켜 보여줍니다.

<br>

2. 진행상황에 해당하는 스탭 클릭 시, 상태 수정 api를 호출합니다.
```js
methods:{
          changeStep(step) {
            try {
                // 편집모드 가 아니면 리턴해줍니다.
                if (!this.edit.editState) return
                if (step === 1) {
                    this.complete = false
                } else {
                    this.complete = true
                }
                const info = {
                    complete: this.complete,
                    cardState: true
                }
                this.UPDATELIST({
                    routeName: this.$route.name,
                    id: this.card.id,
                    info
                })
            } catch (error) {
                console.log(error)
            }

        },
}
```
- <a href="#edit_common">카드 수정 api 관련 내용 바로 가기</a>


## 2-2. 카드 카테고리 수정
#### 1. 카테고리 수정 공통 요소
```html
<!-- ~/components/form/CardEditForm.vue -->
<template>
  <div>
      ...
    <!-- 카테고리 수정 -->
    <category-form></category-form>
  </div>
</template>
```
- `CategoryForm.vue` 컴포넌트를 따로 구현하여,
`대표 카테고리 수정`,`카테고리 추가`,`카테고리 삭제`
할 수 있도록 하였습니다.

<br>

#### 2. 대표 카테고리 수정
```html
<template>
  <v-card class="pa-2">
    <h3>대표 카테고리</h3>
    <!-- 대표 카테고리 -->
    <v-chip class="my-2 subtitle-1 white--text font-weight-bold" :color="card.bgcolor">
      {{card.Category && card.Category.type}}</v-chip>
    <!-- 변경할 대표 카테고리 리스트 -->
    <div v-if="edit.editState">
      <category-list :label="`변경할 대표 카테고리`" :noDataTxt="`더이상 카테고리가 없습니다.`" :categoryList="Categorys"
        @updateInput="onupdateInput" :isEdit="category.isEdit"></category-list>
      <div class="py-1" v-if="categoryEditState">
        <!--대표 카테고리 수정 버튼 -->
        <v-btn color="cyan" dark elevation="2" small @click.prevent="onupdateCategory">대표 카테고리 수정</v-btn>
      </div>
    </div>
    <!-- 현재 가지고 있는 카테고리 리스트 -->
    <category-chip :selectList="card.CardTypes || []"></category-chip>
    ...
  </v-card>
</template>
```
<br>

2-1. 변경할 대표 카테고리 리스트를 보여줍니다.
```html
...
 <category-list :label="`변경할 대표 카테고리`" :noDataTxt="`더이상 카테고리가 없습니다.`" :categoryList="Categorys"
   @updateInput="onupdateInput" :isEdit="category.isEdit"></category-list>
 ...
```
```js
computed: {
  //대표카테고리 제외하고 보여줄 카테고리
  Categorys() {
    return this.card.CardTypes && this.card.CardTypes.filter(category => category.id !== this.card.Category.id)
  },
}
```
- `computed`를 이용해 카드의 카테고리 중 대표카데고리의 `id`를 비교하여 현재 지정된 대표 카테고리를 제외한 카테고리 리스트를 만들어줍니다.

|대표 카테고리를 제외한 이유|
|---|
|내가 가지고 있는 카테고리 중 대표 카테고리로 수정할 리스트를 보여주는 것으로, 이미 지정된 대표 카테고리는 보여줄 필요가 없으므로 배열의 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter">filter</a>메서드를 사용해 카테고리 리스트를 만들었습니다.|
(<a href="#card_exam">카드 데이터 바로 가기</a>)

<br>

2-2. 변경할 대표 카테고리 리스트 중 내가 선택한 카테고리를 저장해줍니다.
```js
methods:{
  ...mapMutations(['SET_CATEGORYS']),
  // 하위 컴포넌트에서  입력폼이 바뀔때마다 이벤트를 발생시켜 mutations 함수를 호출해줍니다.
   onupdateInput(value) {
          this.SET_CATEGORYS([value])
      }
}
```
<br>


|mutations|
|---|
|SET_CATEGORYS|
```js
// ~/store/mutation.js
// state의 categoryList에 내가 선택한 카테고리를 저장합니다.
 SET_CATEGORYS(state,categorys){
        state.categoryList=categorys
    },
```
<br>

|state|
|---|
|categoryList|
```js
// ~/store/state.js
  // 카테고리 리스트
    categoryList:[],
```

2-3. 변경할 대표 카테고리를 선택하지 않았다면, `대표 카테고리 수정` 버튼이 보이지 않도록 구현하였습니다.

2-4 `대표 카테고리 수정`시 수정 api를 호출합니다.
1. `카테고리 수정` api
```js
import {request} from './index'
export const category={
    update({CategoryId,BoardId,CardId}){
        return request.put(`categorys/${BoardId}/${CardId}`,{CategoryId})
    },,
}
```

- store

|actions|
|---|
|UPDATECATEGORY|
```js
// ~/store/actions.js
 // 카테고리 수정
    async UPDATECATEGORY({commit},{BoardId,CardId,choice}){
        const {data}=await category.update({BoardId,CardId,CategoryId:choice[0].id})
        commit(`SET_CATEGORY`,{updateId:true,choice})
        return data
    },
```
- `mutations`의 `SET_CATEGORY`를 호출합니다.
<br>

|mutations|
|---|
|SET_CATEGORY|

```js
// ~/store/mutations.js
 SET_CATEGORY(state,category){
        // 카테고리 수정
        if(category.updateId){
            state.card.Category=category.choice[0]
        }else{
          // 카테고리 추가
            state.card.CardTypes.push(category)
        }

    },
```
|카테고리 수정|
|---|
|`updateId`속성으로 카테고리 수정과 카테고리 추가 여부를 구분하도록 구현하였습니다.|
|카테고리 수정시, 기존 대표카테고리 배열에 내가 수정한 카테고리 값을 저장해줍니다.|

|카테고리 추가|
|---|
|카드의 카테고리 배열에 새롭게 추가된 카테고리 데이터를 추가시켜줍니다.|

<br>


2. `대표 카테고리 수정`버튼 클릭 시, 카테고리 수정 api를 호출합니다.
- `state`의 `actions`함수 `UPDATECATEGORY`를 호출합니다.
```js
meothods:{
  ...mapActions(['UPDATECATEGORY']),
    async onupdateCategory() {
          try {
              this.UPDATECATEGORY({
                  BoardId: this.card.BoardId,
                  CardId: this.card.id,
                  // state의 categoryList에 저장된 카테고리
                  choice: this.categoryList
              })
          } catch (error) {
              this.category.errmsg = error.response.data.msg
          }
      },
}
```
<br>

#### 3. 카테고리 추가
```html
<template>
  <v-card class="pa-2">
    <h3>대표 카테고리</h3>
    ...
    <!-- 카드 수정모드시, 카테고릴 추가/삭제 보여줍니다. -->
    <div v-if="edit.editState">
      <!-- 카테고리 추가/삭제 -->
      <v-btn type="button" class="my-1" text small @click="addchangeState" rounded outlined color="info">원하시는
        카테고리가 없나요??
      </v-btn>
      <v-btn type="button" class="my-1" @click="removechangeState" text small rounded outlined color="info">카테고리를
        삭제하고
        싶으신가요??</v-btn>
      <v-card v-if="edit.addState && edit.editState">
      <!-- 카테고리 추가 폼  -->
        <v-card-text>
          <v-form @submit.prevent="onAddCategory" v-model="category.validcategory">
            <v-text-field label="카테고리 이름" v-model="category.categoryType" prepend-icon="mdi-emoticon-outline"
              :rules="category.categoryRules" clearable>
            </v-text-field>
            <v-file-input v-model="files" show-size counter label="아이콘 이미지"></v-file-input>
            <v-btn type="submit" name="submit" :disabled="fileInvalid || !category.categoryType" color="green" text
              outlined>추가</v-btn>
              <!-- 오류 발생시 오류메세지 보여주기 -->
            <v-alert class="mt-3" v-if="category.errmsg" border="left" color="red" dense text type="error">
              {{category.errmsg}}
            </v-alert>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>
```
1. 카테고리 추가시, `카테고리 이름`과 `카테고리 이미지`로 카테고리를 추가할 수 있도록 구현하였습니다.
- <a href="https://vuetifyjs.com/en/components/file-inputs/#usage" >`vuetify`에서 제공하는 `v-file-input` </a>을 사용하여 이미지 데이터를 저장하였습니다.
```html
....
  <v-file-input v-model="files" show-size counter label="아이콘 이미지"></v-file-input>
  ...
```
```js
data(){
  return:{
     files: []
  }
}
```

2. `카테고리 이름`과 `카테고리 이미지`는 필수값으로 설정하였습니다.

```html
...
<v-btn type="submit" name="submit" :disabled="fileInvalid || !category.validcategory" color="green" text outlined>추가
</v-btn>
...
```
```js
data() {
  return: {
    files: [],
    category: {
      ...
      validcategory: true,
      input: "",
      categoryRules: [
        v => v && v.length < 10 || '카테고리는 10자이하로 입력해주세요.'
      ],
    }
  }
},
computed:{
  // data의 files에 이미지 데이터가 들어 있지 않은지 확인
   fileInvalid() {
          return (this.files && this.files.length === 0) || !this.files
      },
}
```
- <a href="https://vuetifyjs.com/en/components/forms/#vuelidate">vuetify 에서 제공하는 v-form 의 유효성 검사</a>를 사용하여 카테고리 입력폼에 데이터가 작성되어 있고,이미지 데이터가 선택될때
버튼을 클릭할 수 있도록 구현했습니다. 

<br>

3.`추가` 버튼 클릭 시, `카테고리 추가` api를 호출합니다.
1. `카테고리 추가` api
```js
import {request} from './index'
export const category={
    create({info,BoardId,CardId}){
        return request.post(`categorys/${BoardId}/${CardId}`,info)
    },
}
```

- store

|actions|
|---|
|CREATCATEGORY|
```js
// ~/store/actions.js
 // 카테고리 추가
    async CREATCATEGORY({commit},{BoardId,CardId,info}){
        const {data}=await category.create({BoardId,CardId,info})
        commit(`SET_CATEGORY`,data.category[0])
        return data
    },
```
- `mutations`의 `SET_CATEGORY`를 호출합니다.
<br>

|mutations|
|---|
|SET_CATEGORY|

```js
// ~/store/mutations.js
 SET_CATEGORY(state,category){
        // 카테고리 수정
        if(category.updateId){
            state.card.Category=category.choice[0]
        }else{
          // 카테고리 추가
            state.card.CardTypes.push(category)
        }

    },
```
|카테고리 수정|
|---|
|`updateId`속성으로 카테고리 수정과 카테고리 추가 여부를 구분하도록 구현하였습니다.|
|카테고리 수정시, 기존 대표카테고리 배열에 내가 수정한 카테고리 값을 저장해줍니다.|

|카테고리 추가|
|---|
|카드의 카테고리 배열에 새롭게 추가된 카테고리 데이터를 추가시켜줍니다.|

<br>


2. `카테고리 추가` 버튼 클릭 시, 카테고리 추가 api를 호출합니다.
- `state`의 `actions`함수 ` CREATCATEGORY`를 호출합니다.
```js
meothods:{
  ...mapActions(['CREATCATEGORY']),
    async onAddCategory() {
        try {
          // 입력된 카테고리 이름이 없다면 리턴해줍니다.
          if (this.category.input.trim().length < 0) { this.category.errmsg="카테고리 이름을 입력해주세요" return }
          const data = new FormData()
          data.append('type', this.category.input)
          data.append('image', this.files)
          await this.CREATCATEGORY({
              BoardId: this.card.BoardId,
              CardId: this.card.id,
              info: data,
            })
            .then(() => {
              this.errmsg = ''
            })
        } catch (error) {
          // 카테고리 이름이 이미 생성되어 있다면 오류 메세지를 보여줍니다.
          this.category.errmsg = error.response.data.msg
        } finally {
          // 입력폼에 작성된 데이터 초기화
          this.categoryReset()
        }

      },
      categoryReset() {
        this.category.input = ''
        this.files = []
      },
  }
```
<br>

#### 4. 카테고리 삭제

1. 편집 모드 중 카테고리 삭제 모드로 변경 시,
카테고리를 삭제할 수 있도록 구현하였습니다.
```html
<!-- ~/components/Categorys/CategoryChip.vue -->
<template>
  <div>
  <!-- v-chip에서 제공해주는 close 속성을 바운딩하여, 편집모드일때만 엑스 버튼이 보이도록 구현했습니다. -->
    <v-chip v-for="(choice,index) in selectList" :key="index" ... :close="edit.editState && edit.removeState" @click:close="onChipClose(choice,index)"
      class="ma-1 c_chip">
      ...
      {{choice.type}}
    </v-chip>
    ...
  </div>
</template>
```

- <a href="https://vuetifyjs.com/en/api/v-chip/#events">`vuetify`의 `v-chip` 에서 제공하는 event</a>함수를 이용하여 삭제모드 시, 엑스 버튼이 보이고, 엑스버튼 클릭 시, 해당 카테고리가 삭제되도록 구현하였습니다.

#### event
|<a href="https://vuetifyjs.com/en/api/v-chip/#events-click:close">click:close</a>|
|---|
|닫기 버튼을 클릭할 때,호출되는 함수로 클릭한 대상을 삭제하도록 구현하였습니다.|

```js
methods: {
  ...mapActions(['DELETECATEGORY']),
  onChipClose(choice) {
    try {
      // 현재 설정된 대표 카테고리는 삭제할 수 없습니다.
      if (choice.id === this.card.Category.id) {
        this.errmsg = `현재 등록된 대표 카테고리 ${this.card.Category.type}은/는 삭제 할 수 없습니다`
        return
      }
      // 카테고리 삭제
      this.DELETECATEGORY({
          BoardId: this.card.BoardId,
          CardId: this.card.id,
          choice
        })
        .then((data) => {
          // 이벤트 버스로 삭제성공여부를 알림메세지로 알려줍니다.
          bus.$emit('start:alert', data.msg)
          this.errmsg = ''
        })
    } catch (error) {
      console.error(error)
      this.errmsg = error.response.data.msg
    }
  }
}
```

<br>

2. `엑스` 버튼 클릭 시, `카테고리 삭제` api를 호출합니다.

<p>1. 카테고리 삭제 api </p>

```js
import {request} from './index'
export const category={
   remove({CategoryId,BoardId,CardId}){
        return request.delete(`categorys/${BoardId}/${CardId}/${CategoryId}`)
    },
}
```

- store

|actions|
|---|
|DELETECATEGORY|
```js
// ~/store/actions.js
  // 카테고리 삭제
    async DELETECATEGORY({commit},{BoardId,CardId,choice}){
        const {data}=await category.remove({BoardId,CardId,CategoryId:choice.id})
        commit(`DELETE_CATEGORYS`,choice)
        return data
    },
```
- `mutations`의 `DELETE_CATEGORYS`를 호출합니다.
<br>

|mutations|
|---|
|DELETE_CATEGORYS|

```js
// ~/store/mutations.js
    DELETE_CATEGORYS(state, choiceCategory) {
      const index = state.card.CardTypes.findIndex(category => category.id == choiceCategory.id)
      state.card.CardTypes.splice(index, 1)

    },
```
- `카테고리`의 `id`로 카테고리 데이터를 찾아 `splice`를 이용해 삭제해줍니다.

<br>


#### 2-3. 카드 내용 수정
1. `편집 모드` 해제시, 입력폼에 작성된 데이터를 원래 데이터로 초기화시켜줍니다.
```js
   watch:{
     'editState':function(){
       if(!this.editState){
          this.cardTitle=this.card.title
         this.cardDescription=this.card.description
       }
     }
   }
```
- `state`의 `eidt`를 관찰하여, 편집모드가 아닐때, 기존 카드가 가지고 있는 데이터로 초기화시켜줍니다.
(사용자가 카드 내용을 편집한 후, 저장 버튼을 누르지 않고, 편집모드를 취소했다면, 기존의 데이터를 보여주기 위해서입니다.)

<br>


2. 카드 수정 버튼 클릭 시, 보드 수정 api를 호출합니다.
- `store`의 `actions`함수 `UPDATELIST` 호출
```js
// ~/components/form/BardForm.vue
  methods: {
      ...mapActions(['UPDATELIST']),
          async onUpdateCard() {
        try {
          const info = {
            title: this.cardTitle,
            description: this.cardDescription,
            bgcolor: this.color,
          }
          await this.UPDATELIST({
              routeName: this.$route.name,
              id: this.$route.params.id,
              info
            })
            .then((data) => {
              // 라우터 이동
              this.$router.push(`/board/${this.card.BoardId}`)
              // 카드 수정 메세지 출력
              bus.$emit('start:alert', data.msg)
            })
        } catch (error) {
          console.log(error)
        }
      
      }
```
- <a href="#edit_common">카드 수정 api 관련 내용 바로 가기</a>

<br>

### 4. 데이터(보드,카드) 삭제

#### 1. 공통 구현 요소
1. 데이터 삭제 api
```js
// ~/api/list.js
import {request} from './index'
  // 데이터 추가(보드 추가, 카드 추가)
  export const list={
    // 보드,카드 삭제
    remove({routeName,id,BoardId}){
        return BoardId?request.delete(`${routeName}/${BoardId}/${id}`) :request.delete(`${routeName}/${id}`)
    },
  }

```
- `routeName`으로 `보드 삭제`와 `카드 삭제`시, 호출되는 api를 구분하도록 구현하였습니다.
- `카드 삭제`시, 보드에 더이상 카드가 존재하지 않는다면 해당 `보드`도 삭제해주기 위해 보드의 `id`인 `Boardid`값을 서버에 보내주었습니다.
<br>

2. 데이터 삭제 api 호출

|actions|
|---|
|DELETELIST|
```js
// ~/store/actions.js
import {list,category,search} from '../api/list'
 // 데이터 삭제(보드 삭제,카드 삭제)
    async DELETELIST({commit},{routeName,id,BoardId}){
        const {data}=await list.remove({routeName,id,BoardId})
        commit(`DELETE_LIST`,{routeName,id})
        return data
    },
```
- `mutaions`의 `DELETE_LIST`를 호출합니다.
<br>

|mutations|
|---|
|DELETE_LIST|
```js
// ~/store/mutations.js
    // 보드,카드 삭제
    DELETE_LIST(state,{routeName,id}){
        if(routeName==="boards"){
            const index=state.boards.findIndex(board=>board.id === id)
        state.boards.splice(index,1)
        }
    },
```

- `id`값으로 삭제할 데이터를 찾아 삭제해줍니다.


<br>

|state|
|---|
|boards|
|cards|

```js
//  ~/store/state.js
// 보드
boards: [],
// 카드
cards: [],
```
<br>

#### 2. 보드 삭제

1. 보드 삭제 버튼 클릭 시 한번더 확인하는 확인창을 띄워, 한번더 확인하도록 구현하였습니다.
```html
<!-- ~/components/board/BardCard.vue -->
<template>
  <div>
    <v-card class="text-center ma-3" :style="`background-color:${board.bgcolor}`">
      <!-- 보드 수정/보드 삭제 버튼 메뉴 -->
      <v-menu offset-y v-model="showMenu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          ...
          <!-- 보드 삭제-->
          <v-list-item>
            <v-list-item-title>
            <!-- 삭제 버튼 클릭 시 알림창이 보입니다. -->
              <v-btn text @click="confirm=true">
                보드 삭제
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </v-card-actions>
    </v-card>
    <!-- 삭제 알림창 -->
    <alert-con-firm v-model="confirm" @agree="onAgree" @disagree="ondisAgree" :data="`보드 ${board.title}`">
    </alert-con-firm>
  </div>
</template>
```
<br>

- `store`의 `actions`함수 `DELETELIST` 호출
```js
// ~/components/form/BardForm.vue
    data() {
        return {
            confirm:false
        }
    },
 methods: {
        ...mapActions(['DELETELIST']),
        // 보드 삭제 동의
        onAgree() {
            this.onDeleteBoard()
            this.confirm = false

        },
        //보드 삭제 비동의
        ondisAgree() {
            this.confirm = false
        },
        // 보드 삭제
        onDeleteBoard() {
            this.DELETELIST({
                routeName: 'boards',
                id: this.board.id
            })
        },
    },
```
<br>

### 3. 카드 삭제

1. 카드 삭제 버튼 클릭 시 한번더 확인하는 확인창을 띄워, 한번더 확인하도록 구현하였습니다.
```html
<!-- ~/components/view/Card.vue -->
<template>
  <div>
    <v-row v-if="!hasError && card" justify="center">
      <v-dialog v-model="cardDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        ....
        <!-- 메뉴 -->
        <action-menu @onClickBtn="onClickBtn" :top="menu.top" :bottom="menu.bottom" :right="menu.right"
          :left="menu.left" :direction="menu.direction" :hover="menu.hover" :transition="menu.transition"
          :menus="menu.txts"></action-menu>
        </v-card>
      </v-dialog>
      <!--삭제 알림창 -->
      <alert-con-firm v-model="confirm" @agree="onAgree" @disagree="ondisAgree" :data="`카드 ${card.title}`">
      </alert-con-firm>
    </v-row>
    ...
  </div>
</template>
```
<br>

- `store`의 `actions`함수 `DELETELIST` 호출
```js
// ~/components/form/BardForm.vue
    data() {
        return {
            confirm:false
        }
    },
methods: {
  ...mapActions(['DELETELIST']),
  // 카드 삭제
  onremoveCard() {
    try {
      this.DELETELIST({
          routeName: this.$route.name,
          id: this.card.id,
          BoardId: this.card.BoardId
        })
        .then((data) => {
          // 카드 데이터가 더이상 존재하지 않는다면,메인으로 라우터를 이동시켜줍니다.
          data.isNotCard ? this.$router.push(`/`) : this.$router.push(`/board/${this.card.BoardId}`)

        })
    } catch (error) {
      console.log(error)
    }
  },
  onClickBtn(index) {
    switch (index) {
      //수정모드
      case 0:
        this.onEditCard()
        break;
        //삭제
      case 1:
        this.confirm = true
        break;

      default:
        break;
    }
  },
  // 카드 삭제 동의 후 확인창 닫기
  onAgree() {
    this.onremoveCard()
    this.confirm = false

  },
  //카드 삭제 비동의 후 확인창 닫기
  ondisAgree() {
    this.confirm = false
  }
}
```
<br>

### 5. 데이터(보드,카드) 검색

#### 1. 공통 구현 요소
- 진행중인 카드/ 완료중인 카드로 카드를 가져올 수 있도록 구현하였습니다.
- 불러온 카드 리스트는 라이브러리인 `vue-virtual-scroller`를 사용하였습니다.
<br>
(`RecycleScroller`는 많은 양의 데이터를 스크롤할 시,목록에서 보이는 항목 만 렌더링하는 컴포넌트입니다.)
<a href="https://github.com/Akryum/vue-virtual-scroller#readme">공식 문서 바로 가기</a>

```html
<!-- ~/component/search/RScroller.vue -->
<template>
   <RecycleScroller
    class="scroller"
    :items="searchList"
    :item-size="150"
    key-field="id"
     page-mode
      v-slot="{ item }"
  > 
        <router-link :to="`/card/${item.id}`">
              <v-card class="mb-1 pa-1 card" :style="`border:5px solid ${item.bgcolor}`"  height="130">
            <v-row no-gutters class="`pa-3 project" :class="{'complete':item.complete}">
            <!-- 카드 이름 -->
                <v-col  md="6" sm="4">
                    <div class="caption grey--text">
                       카드 이름
                    </div>
                    <div>{{item.title}}</div>
                </v-col>
                <!-- 대표 카테고리 -->
                <v-col  md="2" sm="4" >
                    <div class="caption grey--text">
                        대표 카테고리
                    </div>
                    <div><v-chip :color="item.bgcolor">{{item.Category.type}}</v-chip></div>
                </v-col>
                <!-- 카드 메모 -->
                <v-col  md="4" sm="4" >
                    <div class="caption grey--text">
                       카드 메모
                    </div>
                    <div class="overline">{{formatDescription(item.description)}}</div>
                </v-col>
            </v-row>
        </v-card>
        </router-link>
  </RecycleScroller>
</template>

```
```js
    computed:{
        ...mapState(['searchList']),
    },
    methods: {
        formatDescription(value) {
            if(value.length>4){
              return  value && String(value).split('').splice(0,5).concat(['.','.','.','.']).join('')
            }else return value
        }
    },
```
#### methods

|formatDescription|
|----|
|`card`데이터의 `description`를 포맷하기 위해 구현하였습니다.|
|`card`의 `description`의 길이가 5자 이상이라면 앞에서 5글자까지 보여주고 `...`를 추가하여 보여줍니다. |
|`card`의 `description`의 길이가 5자 미만이라면 그대로 보여줍니다. |

#### 2. 진행중인 카드/완료된 카드  가져오기
1. 진행중인카드/완료된 카드 버튼 클릭시, 해당 데어트를 불러옵니다.

```js
// ~/view/Projects.vue
    methods: {
        ...mapActions(['FETCHSEARCHCARD']),
        // 완료된 카드 버튼 클릭시, 완료된 카드 가져오기
        onCompleteFetchCard() {
            try {
                this.FETCHSEARCHCARD({
                    routeName: 'cards',
                    complete: "2"
                })
            } catch (error) {
                console.log(error)
            }
        },
          // 진행중인 카드 버튼 클릭시, 진행중인 카드 가져오기
        ondisCompleteFetchCard() {
            try {
                this.FETCHSEARCHCARD({
                    routeName: 'cards',
                    complete: "1"
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
```
2. 카드 상태에 따라 카드 데이터를 호출하는 api
```js
// ~/api/list.js
import {request} from './index'
// 검색
export const search={
    fetchs({routeName,complete}){
        return request.get(`${routeName}/status/${complete}`)
    }
}

```
<br>

|actions|
|---|
|FETCHSEARCHCARD|
```js
// ~/store/actions.js
import {list,category,search} from '../api/list'
     // 검색/필터
    async FETCHSEARCHCARD({commit},{routeName,complete}){
        const {data}=await search.fetchs({routeName,complete})
        commit(`SET_SEARCH`,data.cards)
        return data
    },
```
- `mutaions`의 `SET_SEARCH`에 저장할 데이터를 넘겨줍니다.
<br>

|mutations|
|---|
|SET_SEARCH|
```js
// ~/store/mutations.js
       SET_SEARCH(state,cards){
        state.searchList=cards
    }
```
<br>

|state|
|---|
|boards|
|cards|
|card|

```js
//  ~/store/state.js
// 검색 리스트
    searchList:[],
```
<br>

#### 3. 검색 결과는 초기화시켜줍니다.
```js
  created(){
        // 검색 결과 초기화
        if(this.searchList)this.RESET_SEARCH()
    },
     methods: {
        ...mapMutations(['RESET_SEARCH'])
     }
```
```js
// ~/store/mutations.js
    RESET_SEARCH(state){
        state.searchList=[]
    },
```

- 라우터 변경시 검색 결과가 유지되지 않도록, 초기화 시켜줍니다.

## 2. Server
### 1. 구현 목표
### 2. 구현 내용