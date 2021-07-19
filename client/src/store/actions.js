import {auth} from '../api/auth'
import {list,category,search} from '../api/list'
export default {
    // 회원가입
    async REGISTER({commit},userInfo){
     const {data}= await auth.registerUser(userInfo)
      commit('SET_USER',data)

      return data
    },
    // 로그인
    async LOGIN({commit},userInfo){
      const {data}= await auth.loginUser(userInfo)
      commit('SET_USER',data)

      return data
    },
    // 데이터 가져오기(보드,카드)
    async FETCHLISTS({commit},payload){
        const {data}=await list.fetchs(payload)
        commit(`SET_LISTS`,{id:payload.id,routeName:payload.routeName,data})
        return data
    },
    // 데이터 추가(보드 추가, 카드 추가)
    async CREATLIST({commit},{routeName,info}){
        const {data}=await list.create({routeName,info})
        commit(`SET_LIST`,{data,routeName})
        return data
    },
    // 데이터 수정(보드 수정,카드 수정)
    async UPDATELIST({commit},{routeName,id,info}){
        const {data}=await list.update({routeName,id,info})
        commit(`SET_LIST`,{data,routeName,id,complete:info.complete,cardState:info.cardState})
        return data
    },
    // 데이터 삭제(보드 삭제,카드 삭제)
    async DELETELIST({commit},{routeName,id,BoardId}){
        const {data}=await list.remove({routeName,id,BoardId})
        commit(`DELETE_LIST`,{routeName,id})
        return data
    },
    //카테고리 가져오기
    async FETCHCATEGORYS({commit},info){
        const {data}=await category.fetchs(info)
        commit(`SET_CATEGORYS`,data.categorys)
        return data
    },
    // 카테고리 추가
    async CREATCATEGORY({commit},{BoardId,CardId,info}){
        const {data}=await category.create({BoardId,CardId,info})
        commit(`SET_CATEGORY`,data.category[0])
        return data
    },
    // 카테고리 삭제
    async DELETECATEGORY({commit},{BoardId,CardId,choice}){
        const {data}=await category.remove({BoardId,CardId,CategoryId:choice.id})
        commit(`DELETE_CATEGORYS`,choice)
        return data
    },
    // 카테고리 수정
    async UPDATECATEGORY({commit},{BoardId,CardId,choice}){
        const {data}=await category.update({BoardId,CardId,CategoryId:choice[0].id})
        commit(`SET_CATEGORY`,{updateId:true,choice})
        return data
    },
    // 검색/필터
    async FETCHSEARCHCARD({commit},{routeName,complete}){
        const {data}=await search.fetchs({routeName,complete})
        commit(`SET_SEARCH`,data.cards)
        return data
    },
    

}