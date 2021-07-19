<template>
  <v-row justify="center">
    <v-dialog
        :value="value"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          {{data}} 을/를 삭제하시겠습니까??
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('disagree')"
          >
            닫기
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('agree')"
          >
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    props:{
        value:{
            type:Boolean,
            required:true
        },
        data:{
            type:String || Number,
            required:true
        }
    }

}
</script>

<style>

</style>