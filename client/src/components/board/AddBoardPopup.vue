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

<script>
import BoardForm from '../form/BoardForm.vue'
export default {
  components: { BoardForm },
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
    data() {
        return {
            dialog:false
        }
    },
    methods:{
      onClose(){
        this.dialog=false
        this.$emit("closemenu")
      }
    }
}
</script>

<style>

</style>