<template>
    <div>
        <v-card class="text-center ma-3" :style="`background-color:${board.bgcolor}`">
            <v-card-title>
                <div class="subheading">{{board.title}}</div>
                <v-spacer></v-spacer>
                <span v-if="board.description">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="black" dark small v-bind="attrs" v-on="on">
                                mdi-note
                            </v-icon>
                        </template>
                        <span>메모가 있습니다.</span>
                    </v-tooltip>
                </span>
            </v-card-title>
            <v-card-actions>
                <span>
                    <router-link style="color:#fff;" :to="`board/${board.id}`">
                        <v-btn small elevation="1" dark color="primary">
                            <v-icon small left>mdi-message</v-icon>카드 더보기
                        </v-btn>
                    </router-link>
                </span>
                <v-spacer></v-spacer>
                <!-- 보드 수정/보드 삭제 버튼 메뉴 -->
                <v-menu offset-y v-model="showMenu">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn dark icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <!-- 보드 수정 -->
                        <v-list-item>
                            <v-list-item-title>
                                <!-- 보드 수정 팝업 -->
                                <add-board-popup :title="`보드 수정`" :btnTxt="`보드 보기`" :board="board"
                                    @closemenu="showMenu=false"></add-board-popup>
                            </v-list-item-title>
                        </v-list-item>
                        <!-- 보드 삭제-->
                        <v-list-item>
                            <v-list-item-title>
                                <v-btn text @click="confirm=true">
                                    보드 삭제
                                </v-btn>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-card-actions>
        </v-card>
        <!--삭제 알림창 -->
        <alert-con-firm v-model="confirm" @agree="onAgree" @disagree="ondisAgree" :data="`보드 ${board.title}`"></alert-con-firm>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import AlertConFirm from '../common/AlertConFirm.vue';
import AddBoardPopup from './AddBoardPopup.vue';
export default {
    components: {
        AddBoardPopup,
        AlertConFirm
    },
    props: {
        board: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showMenu: false,
            confirm:false
        }
    },
    methods: {
        ...mapActions(['UPDATELIST', 'DELETELIST']),
        // 보드 삭제 동의 후 확인창 닫기
        onAgree() {
            this.onDeleteBoard()
            this.confirm = false

        },
        //보드 삭제 비동의 후 확인창 닫기
        ondisAgree() {
            this.confirm = false
        },
        // 보드 삭제
        onDeleteBoard() {
            this.DELETELIST({
                routeName: 'boards',
                id: this.board.id
            })
        },
    },

}
</script>

<style>

</style>