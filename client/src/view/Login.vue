<template>
          <v-container class="fill-height" fluid>
              <v-row align="center" justify="center">
                  <v-col cols="12" sm="8" md="8">
                      <v-card class="elevation-12">
                          <v-window v-model="step">
                              <v-window-item :value="1">
                                  <login-form @increaseStep="onIncreseStep"></login-form>
                              </v-window-item>
                               <v-window-item :value="2">
                                   <register-form @decreaseStep="onDecreaseStep"></register-form>
                              </v-window-item>
                          </v-window>
                      </v-card>
                  </v-col>
              </v-row>
          </v-container>
</template>

<script>
import LoginForm from '../components/form/LoginForm.vue'
import RegisterForm from '../components/form/RegisterForm.vue'
export default {
  components: { LoginForm, RegisterForm },
    data() {
        return {
            step: 1
        }
    },
    methods: {
        onIncreseStep() {
            this.step++;
        },
        onDecreaseStep(){
            this.step--;
        }
    },
    // props:{
    //     source:{
    //         type:String,
    //         required:true
    //     }
    // }

}
</script>

<style>

</style>