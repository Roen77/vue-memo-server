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

<script>
  export default {
      props:{
          top:{
              type:Boolean,
              required:true
          },
          bottom:{
              type:Boolean,
              required:true
          },
          right:{
              type:Boolean,
              required:true
          },
          left:{
              type:Boolean,
              required:true
          },
          direction:{
              type:String,
              required:true
          },
         hover:{
              type:Boolean,
              required:true
          },
         transition:{
              type:String,
              required:true
          },
          menus:{
              type:Array,
              required:true
          }
      },
      data() {
          return {
              fab: false
          }
      },
    computed: {
      activeFab () {
        switch (this.tabs) {
          case 'one': return { class: 'purple', icon: 'account_circle' }
          case 'two': return { class: 'red', icon: 'edit' }
          case 'three': return { class: 'green', icon: 'keyboard_arrow_up' }
          default: return {}
        }
      },
    },

    watch: {
      top (val) {
        this.bottom = !val
      },
      right (val) {
        this.left = !val
      },
      bottom (val) {
        this.top = !val
      },
      left (val) {
        this.right = !val
      },
    },
  }
</script>>

<style>
  /* This is for documentation purposes and will not be needed in your application */
  .action_menu.v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>