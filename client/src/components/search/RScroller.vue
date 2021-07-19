<template>
   <RecycleScroller
    class="scroller"
    :items="searchList"
    :item-size="150"
    key-field="id"
     page-mode
      v-slot="{ item }"
  > 
  <!-- {{item}} -->
        <router-link :to="`/card/${item.id}`">
              <v-card class="mb-1 pa-1 card" :style="`border:5px solid ${item.bgcolor}`"  height="130">
            <v-row no-gutters class="`pa-3 project" :class="{'complete':item.complete}">
                <v-col  md="6" sm="4">
                    <div class="caption grey--text">
                       카드 이름
                    </div>
                    <div>{{item.title}}</div>
                </v-col>
                <v-col  md="2" sm="4" >
                    <div class="caption grey--text">
                        대표 카테고리
                    </div>
                    <div><v-chip :color="item.bgcolor">{{item.Category.type}}</v-chip></div>
                </v-col>
                <v-col  md="4" sm="4" >
                    <div class="caption grey--text">
                       카드 메모
                    </div>
                    <div class="overline">{{formatDescription(item.description)}}</div>
                </v-col>
            </v-row>
        </v-card>
        </router-link>
  </RecycleScroller>
</template>

<script>
import {mapState} from 'vuex';
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
export default {
    component:{
        RecycleScroller
    },
    computed:{
        ...mapState(['searchList']),
    },
    methods: {
        formatDescription(value) {
            if(value.length>4){
              return  value && String(value).split('').splice(0,5).concat(['.','.','.','.']).join('')
            }else return value
        }
    },

}
</script>

<style>
.scroller {
  height: 100%;
}

</style>