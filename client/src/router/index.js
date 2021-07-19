import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store'
Vue.use(VueRouter);

// 인증 필요
const isAuth=(to,from,next)=>{
    if(to.meta.auth && !store.getters.getUser){
        // 로그인이 필요하기 때문에 login할 수 있는 라우터로 리다이렉트 해준다.
        const loginPath = `/login?rPath=${encodeURIComponent(to.path)}`
        next(loginPath)
        return
      }
      next();
}
// 인증 불필요
const isnotAuth=(to,from,next)=>{
    if(!to.meta.auth && store.getters.getUser){
        // 이미 인증되었거나 인증이 필요없다면 라우터를 진행시킨다.
        next('/')
        return
      }
      next();
}

const router = new VueRouter({
    mode:'history',
    routes:[{
        path:'/',
        component:()=>import('../view/Boards.vue'),
        name:'boards',
        meta:{auth:true},
        beforeEnter:isAuth,
    },
    {
        path:'/login',
        name:'logn',
        component:()=>import('../view/Login.vue'),
        meta:{auth:false},
        beforeEnter:isnotAuth
    },
    {
        path:'/board/:id',
        component:()=>import('../view/Board.vue'),
        name:'boards',
        meta:{auth:true},
        beforeEnter:isAuth,
        children:[{
            path:'add',
            component:()=>import('../view/AddCards.vue'),
        }]
    },
    {
        path:'/card/:id',
        component:()=>import('../view/Card.vue'),
        name:"cards",
        meta:{auth:true},
        beforeEnter:isAuth
    },
    {
        path:'/projects',
        component:()=>import('../view/Projects.vue'),
        meta:{auth:true},
        beforeEnter:isAuth
    },
    {
        path:'*',
        component:()=>import('../view/PageNotFound.vue'),
        meta:{auth:true},
        beforeEnter:isAuth
    },
]
    
})

export default router;
