<template>
          <v-col v-if="card" cols="12" md="4" lg="3">
            <v-card class="ma-3">
              <v-list-item >
                <!-- 카드 카테고리 -->
                <v-list-item-avatar v-if="card.Category" :color="card.bgcolor" class="mt-n7 elevation-5" width="60" height="60">
                  <v-icon v-if="!card.Category.imagetype" elevation="10" dark large>
                    {{card.Category.icon}}</v-icon>
                  <v-img v-else :src="card.Category.icon" alt="카테고리 아이콘"> 
                   </v-img> 
                </v-list-item-avatar>
                <!-- 카드 내용 -->
                <v-list-item-content>
                  <div class="text-right">카드</div>
                  <v-list-item-title class="headline mb-1 text-right">{{card.title}}</v-list-item-title>
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <!-- 카드 버튼 -->
              <v-card-actions>
                <router-link :to="`/card/${card.id}`">
                  <v-btn color="secondary" >카드 보기</v-btn>
                </router-link>
                <v-spacer></v-spacer>
                <v-icon v-if="card.complete" color="primary">mdi-check-circle</v-icon>
              </v-card-actions>
            </v-card>
          </v-col>
</template>

<script>

export default {
    props:{
        card:{
            type:Object,
            required:true
        }
    },
    data() {
      return {
        dialog:false
      }
    },
  

}
</script>

<style>

</style>