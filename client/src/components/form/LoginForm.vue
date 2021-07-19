<template>
  <v-row>
    <v-col cols="12" md="8">
      <span class="ttt"></span>
      <v-card-text class="test mt-12">
        <h2 class="text-center display-1 indigo--text">로그인</h2>
        <h4 class="text-center mlt-4">로그인을 위해 작성해주세요</h4>
          <v-form ref="form" v-model="valid" @submit.prevent="login" >
          <v-text-field  class="test" ref="input" label="이메일" v-model="email" name="email" prepend-icon="mdi-email" type="text" :counter="20"  color="indigo accent-2" :rules="emailRules">
          </v-text-field>
          <v-text-field label="비밀번호" v-model="password" name="password" prepend-icon="mdi-lock" :counter="20" type="password" color="indigo accent-2" :rules="passwordRules">
          </v-text-field>
          <v-alert v-if="errmsg" border="left" color="red"  dense text type="error">{{errmsg}}</v-alert>
          <div class="text-center mt-3">
            <v-btn id="login_btn"  rounded color="indigo accent-2" dark :disabled="!valid" type="submit">로그인</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-col>
    <v-col cols="12" md="4" class="indigo darken-1">
      <v-card-text class="white--text mt-12">
        <h1 class="text-center display-1">환영합니다!</h1>
        <h5 class="text-center mt-2">아직 회원가입된 회원이 아니신가요?</h5>
      </v-card-text>
      <div class="text-center pa-3">
        <v-btn rounded outlined dark @click="onChangeForm">회원가입</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {mapActions} from 'vuex';
import LoginMixin from '../../mixin/LoginMixin'
export default {
   mixins: [LoginMixin],
  methods: {
      ...mapActions(['LOGIN']),
      // 기존데이터를 초기화 시키고,로그인폼과 회원가입폼 교체합니다. (버튼 클릭시, 로그인폼으로 이동)
      onChangeForm() {
        this.reset()
        this.$emit('increaseStep')
      },
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
    },

  }
</script>

<style>

</style>