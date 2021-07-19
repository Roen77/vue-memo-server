<template>
  <div>
    <div v-if="!hasError && cards">
      <div>
        <h1 class="subheading grey--text">카드</h1>
        <v-container>
          <v-row no-gutters>
            <card-list v-for="card in cards" :key="card.id" :card="card"></card-list>
          </v-row>
        </v-container>
      </div>
      <router-link :to="`/board/${$route.params.id}/add`">
        <v-btn link fab color="cyan accent-4" bottom right fixed>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </router-link>
      <router-view></router-view>
    </div>
    <div v-if="hasError">
      <error-page :errMsg="errMsg"></error-page>
    </div>
  </div>
</template>

<script>
import { mapState} from 'vuex';
import CardList from '../components/card/CardList.vue'
import FetchMixin from '../mixin/FetchMixin';
import ErrorPage from '../components/common/ErrorPage.vue';
export default {
  components: {CardList, ErrorPage},
  mixins: [FetchMixin],
    computed:{
        ...mapState(['cards'])
    },



}
</script>

<style>

</style>