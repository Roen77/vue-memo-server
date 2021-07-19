<template>
  <div>
    <v-dialog @click:outside="changeRouter" v-model="dialog" max-width="850px">
      <v-card>
        <v-card-title>
          <span class="headline">새 카드</span>
        </v-card-title>
        <card-form></card-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CardForm from '../components/form/CardForm.vue'
export default {
  components: { CardForm },
  data() {
    return {
      dialog: true,
      confirm:false,
      agree:false
    }
  },
  methods: {
       changeRouter(){
      this.$router.push(`/board/${this.$route.params.id}`)
    },

  },



}
</script>

<style>

</style>