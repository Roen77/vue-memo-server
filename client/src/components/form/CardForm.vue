<template>
    <v-form v-model="valid" class="px-3" ref="form">
        <!-- 카테고리 리스트 -->
       <category-list :label="`추가 카테고리`" :noDataTxt="`추가할 카테고리가 없습니다.`" :categoryList="categoryList" v-model="selectList" @updateInput="onupdateInput"></category-list>
        <!-- 대표 카테 고리 -->
        <!-- 필수 카테고리 선택 알람 메세지 -->
        <v-alert class="caption py-2"
            v-if="selectList.length>0 && representCategory" border="left"
            colored-border color="deep-purple accent-4" elevation="2">
            아래 카테고리 중 대표 카테고리를 선택해주세요
        </v-alert>
        <v-container class="d-flex" v-if="representCategory.type">
            <v-card-title class="pa-0">대표 카테고리</v-card-title>
            <v-chip class="ml-1 font-weight-bold" style="font-size:18px;" text-color="white" color="cyan">
                {{ representCategory.type}}</v-chip>
        </v-container>
        <!-- 내가 선택한 카테고리 리스트 -->
        <category-chip :selectList="selectList" @onRepresent="onRepresent"></category-chip>
      <!-- 카드 제목 -->
        <v-card-text>
            <v-text-field ref="input" label="카드 제목" clearable v-model="title" prepend-icon="mdi-format-title" :rules="titleRules">
            </v-text-field>
            <!-- 카드 메모 -->
            <v-textarea :rules="descriptionRules" label="메모" v-model="description" clearable prepend-icon="mdi-content-paste">
            </v-textarea>
        </v-card-text>
        <!-- 카드 색 변경 -->
        <v-card-subtitle>
            <v-btn outlined color="indigo darken-1" dark @click="showColorpicker=!showColorpicker">카드 색 변경</v-btn>
        </v-card-subtitle>
        <!-- 카드 색 선택창 -->
        <v-row v-if="showColorpicker" justify="center" align="center" class="ma-1">
            <v-card>
                <v-color-picker style="max-width: 500px" v-model="color" hide-canvas></v-color-picker>
            </v-card>
        </v-row>
        <v-card-actions>
            <v-spacer></v-spacer>
            <router-link :to="`/board/${$route.params.id}`"><v-btn link color="blue daren-1" text>닫기</v-btn></router-link>
            <v-btn color="green" :disabled="!valid ||!representCategoryState" text outlined @click="onAddCard">생성</v-btn>
        </v-card-actions>
    </v-form>
</template>

<script>
import FormMixin from '../../mixin/FormMixin'
import {mapActions,mapState,mapMutations} from 'vuex';
import CategoryList from '../Categorys/CategoryList.vue';
import CategoryChip from '../Categorys/CategoryChip.vue';
export default {
  components: { CategoryList, CategoryChip },
       mixins: [FormMixin],
    data() {
        return {
            // 카테고리 리스트
            selectList:[],
            // 대표 카테고리
            representCategory:{},
            title:'',
            description:'',
            color:'',
            showColorpicker:false,
             titleRules: [
                v => !!v || '카드제목은 필수입니다.',
                v => v && v.length<10 || '카드제목은 10자리 이하로 입력해주세요.'
            ],
            descriptionRules:[
                v => v.length<50 || '50자리 이하로 입력해주세요.'
            ]
        }
    },
    created() {
        this.onFetchCategory()
    },
    computed:{
        ...mapState(['categoryList']),
        representCategoryState(){
           return (this.representCategory && this.representCategory.id)?true:false
        }
    },
    methods: {
              ...mapActions(['CREATLIST','FETCHCATEGORYS']),
              ...mapMutations(['RESET_CATEGORYS']),
        async onFetchCategory() {
            try {
                await this.FETCHCATEGORYS({
                    BoardId: this.$route.params.id
                })
            } catch (error) {
                console.log(error)
            }
        },
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
        // categoryReset(){
        //     this.selectList=[]
        //     this.representCategory={}
        // },
        onRepresent(choice){
            this.representCategory=choice
        },
        onupdateInput(value){
            this.selectList=value
        }
    },


}
</script>

<style>

</style>