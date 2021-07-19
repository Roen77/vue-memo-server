<template>
<div>
    <virtual-list class="list"
      :data-key="'id'"
      :data-sources="projects"
      :data-component="itemComponent"
      :estimate-size="20"
      keeps="5"
    />
  </div>
          <!-- v-on:tobottom="onScrollToBottom" -->
</template>

<script>
import SearchItem from './SearchItem.vue'
  import VirtualList from 'vue-virtual-scroll-list'
export default {
    component:{VirtualList},
    data() {
        return {
            itemComponent:SearchItem,
            projects: [
                {
                    title:'aite web',
                    person:'Khaled1',
                    due:'10/10/1987',
                    status:'complete',
                    id:1,
                },
                {
                    title:'bite web',
                    person:'jhaled2',
                    due:'10/10/1987',
                    status:'complete',
                        id:2,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                    status:'complete',
                            id:3,
                },
                {
                    title:'aaite web',
                    person:'ghaled4',
                    due:'10/10/1987',
                    status:'no',
                              id:4,
                },
                {
                    title:'aite web',
                    person:'Khaled1',
                    due:'10/10/1987',
                    status:'complete',
                         id:5,
                },
                {
                    title:'bite web',
                    person:'jhaled2',
                    due:'10/10/1987',
                    status:'complete',
                           id:6,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                    status:'complete',
                           id:7,
                },
                {
                    title:'aaite web',
                    person:'ghaled4',
                    due:'10/10/1987',
                status:'complete',
                           id:8,
                },
                {
                    title:'aite web',
                    person:'Khaled1',
                    due:'10/10/1987',
                   status:'complete',
                           id:9,
                },
                {
                    title:'bite web',
                    person:'jhaled2',
                    due:'10/10/1987',
                   status:'complete',
                           id:10,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                    status:'complete',
                         id:11,
                },
                {
                    title:'aaite web',
                    person:'ghaled4',
                    due:'10/10/1987',
                   status:'complete',
                           id:12,
                },
                {
                    title:'aite web',
                    person:'Khaled1',
                    due:'10/10/1987',
                    status:'complete',
                           id:13,
                },
                {
                    title:'bite web',
                    person:'jhaled2',
                    due:'10/10/1987',
                  status:'complete',
                           id:14,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:15,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:16,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:17,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:18,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:19,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:20,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:21,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:22,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:23,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:24,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:25,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:26,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:27,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:28,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:29,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:30,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:31,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:32,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:33,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:34,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:35,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:36,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:37,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:38,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:39,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:40,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:41,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:42,
                },
                {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:43,
                },
               
            ]
        }
    },
    methods: {
        sortBy(prop) {
            console.log('작동')
            this.projects.sort((a,b)=>a[prop]<b[prop]? -1:1)
        },
         onScrollToBottom () {
      this.items = this.items.concat( {
                    title:'eite web',
                    person:'hhaled3',
                    due:'10/10/1987',
                       status:'complete',
                           id:44,
                },)
    }
  }


}
</script>

<style>
.project.complete{
    border-left:4px solid #3cd1c2;
}
.project.no{
    border-left:4px solid orange;
}
.project.up{
    border-left:4px solid red;
}
.project.yes{
    border-left:4px solid yellow;
}
.list{
    width: 100%;
    height:auto;
    background-color:orange;
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
}
.itmes{
    color:#000;
    background-color:red;
    height: 100px;
}
</style>