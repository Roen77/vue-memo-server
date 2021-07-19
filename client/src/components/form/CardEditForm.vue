<template>
  <div>
    <!-- 카드 스탭 -->
    <card-steper></card-steper>
    <!-- 카테고리 수정 -->
    <category-form></category-form>
    <!-- 카드 제목 -->
    <v-card class="my-6" elevation="7" shaped>
      <v-form v-model="valid">
        <v-card-text>
          <v-text-field ref="titleinput" label="카드 제목" :clearable="editState" :readonly="!editState" v-model="cardTitle"
            prepend-icon="mdi-format-title" :rules="titleRules">
          </v-text-field>
          <!-- 카드 메모 -->
          <v-textarea ref="desInput" label="메모" v-model="cardDescription"
          :rules="descriptionRules" prepend-icon="mdi-content-paste"
            :clearable="editState" :readonly="!editState">
          </v-textarea>
        </v-card-text>
        <!-- 카드 색 변경 -->
        <v-card-subtitle v-if="editState">
          <v-btn outlined color="indigo darken-1" dark @click="showColorpicker=!showColorpicker">카드 색 변경</v-btn>
        </v-card-subtitle>
        <!-- 카드 색 선택창 -->
        <v-row v-if="showColorpicker" justify="center" align="center" class="ma-1">
          <v-card>
            <v-color-picker style="max-width: 500px" v-model="color" hide-canvas></v-color-picker>
          </v-card>
        </v-row>
        <v-card-actions v-if="editState">
          <v-spacer></v-spacer>
          <v-btn :disabled="!valid || isInput" @click.prevent="onUpdateCard" text class="indigo darken-1 ma-2" dark>
            저장
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import {bus} from '../../../utils/bus'
import {mapActions, mapState} from 'vuex';
import FormMixin from '../../mixin/FormMixin'
import CardSteper from '../card/CardSteper.vue';
import CategoryForm from './CategoryForm.vue';
export default {
  components: { CategoryForm, CardSteper },
   mixins: [FormMixin],
   props:{
     card:{
       type:Object,
       required:true
     }
   },
   created(){
       this.cardTitle=this.card.title
       this.cardDescription=this.card.description
   },
   computed:{
        ...mapState({editState:state=>state.edit.editState}),
        isInput(){
          return this.card.title === this.cardTitle
        }
        // ...mapMutations(['ChangeState'])
   },
   watch:{
     'editState':function(){
       if(!this.editState){
          this.cardTitle=this.card.title
         this.cardDescription=this.card.description
       }
     }
   },
    data() {
      return {
        showColorpicker: false,
        color: '',
        titleRules: [
          v => !!v || '카드제목은 필수입니다.',
          v => v && v.length < 10 || '카드제목은 10자리 이하로 입력해주세요.'
        ],
        descriptionRules: [
          v => v.length < 50 || '50자리 이하로 입력해주세요.'
        ],
        selectList: [],
        cardTitle: '',
        cardDescription: ''

      }
    },
    methods: {
      ...mapActions(['UPDATELIST','RESET_CATEGORYS']),
      async onUpdateCard() {
        try {
          if(this.isInput) return
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
      },
    }
}
</script>

<style>

</style>