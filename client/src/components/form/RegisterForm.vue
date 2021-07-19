<template>
    <v-row class="fill-height">
        <v-col cols="12" md="4" class="indigo darken-1">
            <v-card-text class="white--text mt-12">
                <h1 class="text-center display-1">환영합니다!</h1>
                <h5 class="text-center">이미 가입된 회원이신가요?</h5>
            </v-card-text>
            <div class="text-center" style="padding:10px;">
                <v-btn rounded outlined dark @click="onChangeForm">로그인</v-btn>
            </div>
        </v-col>
        <v-col cols="12" md="8">
            <v-card-text class="mt-12">
                <h1 class="text-center display-1 indigo--text ">회원가입</h1>
                <h4 class="text-center mt-4">회원가입을 위해 작성해주세요.</h4>
                <v-form ref="form" v-model="valid" @submit.prevent="userRegister">
                    <v-text-field ref="input" v-model="email" label="이메일" name="email" :counter="20"  prepend-icon="mdi-email" type="text" color="indigo accent-2" :rules="emailRules"></v-text-field>
                    <v-text-field label="닉네임"
                    :counter="20" v-model="nickname" name="nickname" prepend-icon="mdi-account" type="text"
                        color="indigo accent-2" :rules="nicknameRules">
                    </v-text-field>
                    <v-text-field label="비밀번호" v-model="password" name="password" prepend-icon="mdi-lock" :counter="20"
                        type="password" color="indigo accent-2" :rules="passwordRules"></v-text-field>
                    <v-alert v-if="errmsg" border="left" color="red" dense text type="error">{{errmsg}}</v-alert>
                    <div class="text-center mt-3">
                        <v-btn rounded color="indigo accent-2" dark :disabled="!valid" type="submit">회원가입</v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </v-col>
    </v-row>
</template>

<script>
import {mapActions} from 'vuex';
import LoginMixin from '../../mixin/LoginMixin'
export default {
  mixins: [LoginMixin],
    data() {
        return {
            nickname:'',
            nicknameRules: [
                v => !!v || '닉네임은 필수입니다.',
                v => v && v.length<=20 || '닉네임은 20자리 이하로 입력해주세요',
            ],
        }
    },
    methods: {
        ...mapActions(['REGISTER']),
   // 기존데이터를 초기화 시키고,로그인폼과 회원가입폼 교체합니다.
      onChangeForm(){
          this.reset()
          this.$emit('decreaseStep')
      },
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

    },
}
</script>

<style>
.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg{background-color:lightgray !important; color:gray !important;}
</style>