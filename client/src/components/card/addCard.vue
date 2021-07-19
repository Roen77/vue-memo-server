<template>
<!-- 플롯팅 버튼 -->
    <div>
        <router-link :to="`/board/${$route.params.id}/add`">
            <v-btn link fab color="cyan accent-4" bottom right fixed>
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        </router-link>
    </div>
</template>

<script>
// import {mapActions} from 'vuex';
// import CardForm from '../form/CardForm.vue'
    export default {
        // props:{
        //     BoardId:{
        //         type:Number,
        //         required:true
        //     },
        // },
        // components: { CardForm },
        // data() {
        //     return {
        //         dialog: false
        //     }
        // },
        methods: {
            //   ...mapActions(['FETCHCATEGORYS']),
            // onClose() {
            //     this.dialog=false
            // },
            // onAddCard() {
            //         this.dialog = !this.dialog
            //         // this.onFetchCategory()
            //     },
            // async onFetchCategory() {
            //     try {
            //         await this.FETCHCATEGORYS({
            //             BoardId: this.$route.params.id
            //         })
            //     } catch (error) {
            //         console.log(error)
            //     }
            // },
            },

    }
</script>

<style>

</style>