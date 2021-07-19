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
        <div v-if="edit.editState">
            <!-- 카테고리 추가 -->
            <v-btn type="button" class="my-1" text small @click="addchangeState" rounded outlined color="info">원하시는
                카테고리가 없나요??
            </v-btn>
            <!-- 카테고리 삭제 -->
            <v-btn type="button" class="my-1" @click="removechangeState" text small rounded outlined color="info">카테고리를
                삭제하고
                싶으신가요??</v-btn>
            <v-card v-if="edit.addState && edit.editState">
                <!-- 카테고리 추가 폼 -->
                <v-card-text>
                    <v-form @submit.prevent="onAddCategory" v-model="category.validcategory">
                        <v-text-field label="카테고리 이름" v-model="category.input"
                            prepend-icon="mdi-emoticon-outline" :rules="category.categoryRules" clearable>
                        </v-text-field>
                        <v-file-input v-model="files" 
                         accept="image/png, image/jpeg, image/bmp"
                        show-size counter label="아이콘 이미지"></v-file-input>
                        <v-btn type="submit" name="submit" :disabled="fileInvalid || !category.validcategory"
                            color="green" text outlined>추가</v-btn>
                        <v-alert class="mt-3" v-if="category.errmsg" border="left" color="red" dense text type="error">
                            {{category.errmsg}}
                        </v-alert>
                    </v-form>
                </v-card-text>
            </v-card>
        </div>
    </v-card>
</template>

<script>
import {mapActions,mapMutations,mapState} from 'vuex'
import CategoryChip from '../Categorys/CategoryChip.vue'
import CategoryList from '../Categorys/CategoryList.vue'
export default {
  components: { CategoryChip, CategoryList },
  computed: {
      ...mapState(['card', 'edit', 'categoryList']),
      fileInvalid() {
          return (this.files && this.files.length === 0) || !this.files
      },
      //대표카테고리 제외하고 보여줄 카테고리
      Categorys() {
          return this.card.CardTypes && this.card.CardTypes.filter(category => category.id !== this.card.Category.id)
      },
      categoryEditState(){
          return  this.categoryList.length>0 && this.categoryList[0] !==null
      }
  },
  data() {
      return {
          state: {
              initState: true,
              addCategoryState: false,
              removeCategoryState: false
          },
          files: [],
          category: {
              isEdit:true,
              label: '',
              noDataTxt: '',
              validcategory: true,
              select:'',
              input: "",
              categoryRules: [
                  v => v && v.length<10 || '카테고리는 10자이하로 입력해주세요.'
              ],
              errmsg:''
          },
      }
  },
  created(){
      if(this.categoryList) this.RESET_CATEGORYS()
      console.log(this.categoryList,'dddddddfsfd')
  },
  methods: {
      ...mapActions(['CREATCATEGORY', 'UPDATECATEGORY']),
      ...mapMutations(['ChangeState','SET_CATEGORYS','RESET_CATEGORYS']),
    //   카테고리 추가
      async onAddCategory() {
          try {
              if (this.category.input.trim().length < 0) {
                  this.category.errmsg = "카테고리 이름을 입력해주세요"
                  return
              }            
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
              this.category.errmsg = error.response.data.msg
          } finally {
              // 입력폼에 작성된 데이터 초기화
              this.categoryReset()
          }

      },
    //   카테고리 수정
      async onupdateCategory() {
          try {
              this.UPDATECATEGORY({
                  BoardId: this.card.BoardId,
                  CardId: this.card.id,
                  choice: this.categoryList
              })
          } catch (error) {
              this.category.errmsg = error.response.data.msg
          }
      },
    //   카테고리 입력폼 초기화
      categoryReset() {
          this.category.input = ''
          this.files = []
      },
    // 카테고리 추가 편집 모드 상태
      addchangeState() {
          let value;
          this.edit.addState ? value = false : value = true;
          this.ChangeState({
              editState: "addState",
              value
          })
      },
    //   카테고리 삭제 편집 모드 상태
      removechangeState() {
          let value;
          this.edit.removeState ? value = false : value = true;
          this.ChangeState({
              editState: "removeState",
              value
          })
      },
      onupdateInput(value) {
          this.SET_CATEGORYS([value])
      }
  },

}
</script>

<style>

</style>