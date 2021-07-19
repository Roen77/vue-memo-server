<template>
    <v-stepper  class="card_step my-2 " v-model=" stepState" alt-labels>
        <v-stepper-header height="100px" >
            <template v-for="n in steps">
                <v-stepper-step class="pa-2" color="pink accent-2" :key="`step${n.step}`" :editable="edit.editState" :step="n.step" @click="changeStep(n.step)">
                    {{n.state}}
                </v-stepper-step>
                <v-divider v-if="n.step===1" :key="n.step"></v-divider>
            </template>
        </v-stepper-header>
    </v-stepper>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default {
    data() {
        return {
            steps: [{
                step: 1,
                state: '진행중'
            }, {
                step: 2,
                state: '완료'
            }],
            complete: false,
            stepState: 1,
        }
    },
    computed: {
        ...mapState(['card', 'edit']),
        currentState(){
           return this.card.complete?2:1;
        }

    },
    created(){
        this.stepState=this.currentState
    },
    methods: {
        ...mapActions(['UPDATELIST']),
        changeStep(step) {
            try {
                // 편집모드 가 아니면 리턴해줍니다.
                if (!this.edit.editState) return
                if (step === 1) {
                    this.complete = false
                } else {
                    this.complete = true
                }
                const info = {
                    complete: this.complete,
                    cardState: true
                }
                this.UPDATELIST({
                    routeName: this.$route.name,
                    id: this.card.id,
                    info
                })
            } catch (error) {
                console.log(error)
            }

        },
    },

}
</script>

<style>
@media only screen and (max-width: 959px){
     .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
    display: block  !important;
}
}


</style>