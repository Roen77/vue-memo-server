<template>
  <v-alert class="alert_bar"
   :value="success"
      dense
      color="teal"
      type="success"
      transition="scale-transition"
    >
        {{text}}
    </v-alert>
</template>

<script>
export default {
        props:{
         success:{
             type:Boolean,
             required:true
         },
         text:{
             type:String,
             required:true
         },
         timeout:{
             type:String,
             required:false
         }
    },

}
</script>

<style>
.alert_bar{position: fixed  !important; top:8%; left:50%; transform: translateX(-50%); z-index: 9999; width: 60%; }
</style>