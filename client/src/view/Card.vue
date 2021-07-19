<template>
  <div>
    <v-row v-if="!hasError && card" justify="center">
      <v-dialog v-model="cardDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark :color="card.bgcolor">
            <router-link class="mr-3" :to='`/board/${card.BoardId}`'>
              <v-btn @click="resetState" icon class="indigo">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </router-link>
            <v-toolbar-title class="black--text font-weight-bold">내 카드</v-toolbar-title>
            <v-spacer></v-spacer>
            <div v-if="edit.editState">
              <v-btn @click="resetState" class="indigo darken-1 mr-3" dark text>
                수정모드 취소
              </v-btn>
            </div>
          </v-toolbar>
          <!-- container -->
          <v-container>
            <card-edit-form :card="card"></card-edit-form>
          </v-container>
          <!-- 메뉴 -->
          <action-menu @onClickBtn="onClickBtn" :top="menu.top" :bottom="menu.bottom" :right="menu.right"
            :left="menu.left" :direction="menu.direction" :hover="menu.hover" :transition="menu.transition"
            :menus="menu.txts"></action-menu>
        </v-card>
      </v-dialog>
      <!--삭제 알림창 -->
      <alert-con-firm v-model="confirm" @agree="onAgree" @disagree="ondisAgree" :data="`카드 ${card.title}`">
      </alert-con-firm>
    </v-row>
    <div v-else>
      <error-page :errMsg="errMsg"></error-page>
    </div>
  </div>
</template>


<script>
import {mapState,mapMutations, mapActions} from 'vuex';
import ActionMenu from '../components/common/ActionMenu.vue';
import AlertConFirm from '../components/common/AlertConFirm.vue';
import ErrorPage from '../components/common/ErrorPage.vue';
import CardEditForm from '../components/form/CardEditForm.vue';
import FetchMixin from '../mixin/FetchMixin';
  export default {
  components: { ActionMenu,CardEditForm, ErrorPage,AlertConFirm},
    mixins: [FetchMixin],
     computed:{
        ...mapState(['card','edit'])
    },
    data() {
      return {
        cardDialog:false,
        // 알림창 
        confirm:false,
        cardData:'',
        showColorpicker: false,
        // 메뉴
        menu: {
        direction: 'top',
        fling: false,
        hover: false,
        tabs: null,
        top: false,
        right: true,
        bottom: true,
        left: false,
        transition: 'slide-y-reverse-transition',
        txts: [{
        icon: 'mdi-pencil',
        btnTxt: '수정모드',
        color: 'green'

        }, {

        icon: 'mdi-delete',
        btnTxt: '삭제',
        color: 'red'

        }]
        },
        }
    },
  created(){
    this.resetState()
  },
  methods: {
    ...mapActions(['DELETELIST']),
    ...mapMutations(['ChangeState','RESET_CATEGORYS']),
    // 카드편집모드
      onEditCard() {
        this.ChangeState({editState:"editState",value:true})
      },
      // 카드 삭제
      onremoveCard() {
        try {
          this.DELETELIST({routeName:this.$route.name,id:this.card.id,BoardId:this.card.BoardId})
          .then((data)=>{
            data.isNotCard?this.$router.push(`/`):this.$router.push(`/board/${this.card.BoardId}`)

          })
        } catch (error) {
          console.log(error)
        }
      },
      onClickBtn(index) {
        switch (index) {
          //수정모드
          case 0:
            this.onEditCard()
            break;
            //삭제
          case 1:
           this.confirm=true
            break;

          default:
            break;
        }
      },
       // 카드 삭제 동의 후 확인창 닫기
        onAgree() {
            this.onremoveCard()
            this.confirm = false

        },
        //카드 삭제 비동의 후 확인창 닫기
        ondisAgree() {
            this.confirm = false
        },
       //  편집 모드 해제시 모든 상태를 초기화시켜줍니다.
      resetState(){
        console.log('resesetet')
        this.RESET_CATEGORYS()
        let state=["editState","addState","removeState"];
        state.forEach((state)=>{
            if(this.edit[state]){
              this.ChangeState({editState:state,value:false})
            }
        })
      },

  },
  }
</script>

<style>

</style>