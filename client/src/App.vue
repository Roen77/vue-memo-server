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

<script>
import {mapGetters} from 'vuex'
import {bus} from '../utils/bus';
import AlertBar from './components/common/AlertBar.vue';
import AppFooter from './components/common/AppFooter.vue';
import AppHeader from './components/common/AppHeader.vue';
import Navbar from './components/common/Navbar.vue';
import Spinner from './components/common/Spinner.vue';


export default {
  components: { Navbar, AppFooter, Spinner, AppHeader, AlertBar },
  name: 'App',
  data() {
    return {
      loadingState: false,
      success:false,
      timeout:'3000',
      text:'',
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  created(){
    bus.$on('start:spinner',this.startLoading)
    bus.$on('end:spinner',this.endLoading)
    bus.$on('start:alert',(alert)=>{
      this.success=true
      this.text=alert
      setTimeout(()=>{
        this.success=false
      },this.timeout)
    })
    bus.$on('end:alert',()=>{
      this.success=false
      this.text=''
    })
  },
  methods: {
    startLoading() {
      this.loadingState=true
    },
    endLoading(){
      this.loadingState=false
    },

  },
};
</script>

<style>
a{text-decoration: none; color:#222;}
.link-text{text-decoration: none; color:#fff; display: block; width: 100%; height: 100%;}
</style>