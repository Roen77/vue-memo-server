<template>
  <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800px">
          <template v-slot:activator="{on}">
              <v-btn v-on="on" outlined color="cyan lighten-4" dark>보드 추가하기</v-btn>
          </template>
          <v-card>
              <v-card-title>
                  <span class="headline">새 보드</span>
              </v-card-title>
              <v-form class="px-3" ref="form">
                  <v-card-text>
                      <v-text-field label="보드 제목" v-model="title" prepend-icon="mdi-format-title" :rules="inputRules"></v-text-field>
                      <v-textarea label="메모" v-model="content" prepend-icon="mdi-content-paste" :rules="inputRules"></v-textarea>
                      <v-col cols="12" lg="6">
                          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                              transition="scale-transition" offset-y min-width="auto">
                              <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="date" label="Picker in menu" prepend-icon="mdi-calendar"
                                      readonly v-bind="attrs" v-on="on"></v-text-field>
                              </template>
                              <v-date-picker v-model="date" no-title scrollable>
                                  <v-spacer></v-spacer>
                                  <v-btn text color="primary" @click="menu = false">
                                      Cancel
                                  </v-btn>
                                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                                      OK
                                  </v-btn>
                              </v-date-picker>
                          </v-menu>
                      </v-col>
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue daren-1" text @click="dialog=false">Close</v-btn>
                      <v-btn clor="green" text outlined @click="submit">Save</v-btn>
                  </v-card-actions>
              </v-form>
          </v-card>
      </v-dialog>
  </v-row>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            title:'',
            content:'',
            date: new Date().toISOString().substr(0, 10),
           menu: false,
           inputRules:[
               v=>v.length>=3 || "최소 3글자 이상 입력해주세요"
           ]
        }
    },
    methods: {
        submit(){
            console.log('전송')
        }
    },


}
</script>

<style>

</style>