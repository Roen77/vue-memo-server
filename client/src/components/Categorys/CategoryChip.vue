<template>
    <div>
        <v-chip v-for="(choice,index) in selectList" :key="index" @click="$emit('onRepresent',choice)"
            text-color="white" color="pink" :close="edit.editState && edit.removeState"
            @click:close="onChipClose(choice,index)" class="ma-1 c_chip">
            <v-icon v-if="!choice.imagetype" left>{{choice.icon}}</v-icon>
            <v-avatar class="mr-1" v-else><img :src="choice.icon" alt=""></v-avatar>
            {{choice.type}}
        </v-chip>
        <v-alert class="mt-1 alert_msg card" v-if="errmsg && edit.editState" outlined border="right" color="red" dense
            elevation="2" type="warning">{{errmsg}}</v-alert>
    </div>
</template>

<script>
import {bus} from '../../../utils/bus'
import {mapState,mapActions} from 'vuex'
export default {
    props:{
        selectList:{
            type:Array,
            required:true
        },
    },
    data() {
        return {
            errmsg:'',
        }
    },
    computed:{
        ...mapState(['card','edit']),
    },
    methods: {
        ...mapActions(['DELETECATEGORY']),
        onChipClose(choice) {
                try {
                    if (choice.id === this.card.Category.id) {
                        this.errmsg = `현재 등록된 대표 카테고리 ${this.card.Category.type}은/는 삭제 할 수 없습니다`
                        return
                    }
                    this.DELETECATEGORY({
                            BoardId: this.card.BoardId,
                            CardId: this.card.id,
                            choice
                        })
                        .then((data) => {
                            bus.$emit('start:alert', data.msg)
                            this.errmsg = ''
                        })
                } catch (error) {
                    console.error(error)
                    this.errmsg=error.response.data.msg
                }
            }
        }
}
</script>

<style>
 .alert_msg.card{width: 50%; font-size: 13px; padding: 3px;}
</style>