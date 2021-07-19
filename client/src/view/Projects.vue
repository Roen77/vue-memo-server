<template>
    <div class="project">
        <h1 class="subheading grey--text">검색</h1>
        <v-container>
            <v-row>
                <v-col cols="12" md="12" class="my-4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{on}">
                            <v-btn @click="onCompleteFetchCard" v-on="on" small outlined color="green" class="mr-2" dark>
                                <v-icon left small>mdi-folder</v-icon>
                                <span class="caption text-lowercase">완료된 카드</span>
                            </v-btn>
                        </template>
                        <span>생성한 순</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{on}">
                            <v-btn v-on="on" small outlined color="green" @click="ondisCompleteFetchCard" class="mr-2" dark>
                                <v-icon left small>mdi-folder</v-icon>
                                <span class="caption text-lowercase">진행중인 카드</span>
                            </v-btn>
                        </template>
                        <span>생성한 순</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <template v-if="searchList.length>0">
                <r-scroller></r-scroller>
            </template>
            <template v-else>
                <v-card>
                    <v-card-subtitle>완료/진행중인 카드를 선택해주세요.</v-card-subtitle>
                </v-card>
            </template>
        </v-container>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex';
import RScroller from '../components/search/RScroller.vue'
export default {
  components: {  RScroller },
    created(){
        // 검색 결과 초기화
        if(this.searchList)this.RESET_SEARCH()
    },
    computed:{
        ...mapState(['searchList'])
    },
    methods: {
        ...mapActions(['FETCHSEARCHCARD']),
        ...mapMutations(['RESET_SEARCH']),
        // 완료된 카드 버튼 클릭시, 완료된 카드 가져오기
        onCompleteFetchCard() {
            try {
                this.FETCHSEARCHCARD({
                    routeName: 'cards',
                    complete: "2"
                })
            } catch (error) {
                console.log(error)
            }
        },
         // 진행중인 카드 버튼 클릭시, 진행중인 카드 가져오기
        ondisCompleteFetchCard() {
            try {
                this.FETCHSEARCHCARD({
                    routeName: 'cards',
                    complete: "1"
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>

</style>