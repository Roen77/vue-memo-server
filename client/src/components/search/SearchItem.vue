<template>
  <div>
        <v-card  height="100" class="mb-1">
            <v-row :class="`pa-3 project ${source.status}`">
                <v-col cols="12" md="6">
                    <div class="caption grey--text">
                        Person
                    </div>
                    <div>{{source.person}}</div>
                </v-col>
                <v-col cols="12" md="2">
                    <div class="caption grey--text">
                        Due By
                    </div>
                    <div>{{source.due}}</div>
                </v-col>
                <v-col cols="12" md="4">
                    <div class="caption grey--text">
                       {{source.id}}
                    </div>
                    <div>{{source.title}}</div>
                </v-col>
            </v-row>
        </v-card>
  </div>
</template>

<script>
export default {
    props:{
            source: { // here is: {uid: 'unique_1', text: 'abc'}
            type: Object,
            required:true
        },
    }


}
</script>

<style>

</style>