import {request} from './index'
//보드,카드
export const list={
    // 추가
    create({routeName,info}){
        return request.post(`${routeName}`,info)
    },
    // 보드,카드 가져오기
    fetchs(payload){
        return payload.id?request.get(`${payload.routeName}/${payload.id}`): request.get(`${payload.routeName}`)
    },
    // 보드,카드 수정
    update({routeName,id,info}){
        return request.put(`${routeName}/${id}`,info)
    },
    // 보드 삭제
    remove({routeName,id,BoardId}){
        return BoardId?request.delete(`${routeName}/${BoardId}/${id}`) :request.delete(`${routeName}/${id}`)
        // return BoardId?request.delete(`${routeName}/${BoardId}/${id}`) :request.delete(`${routeName}/${id}`)
    },
}

// 카테고리
export const category={
    create({info,BoardId,CardId}){
        return request.post(`categorys/${BoardId}/${CardId}`,info)
    },
    fetchs(payload){
        // return payload.CardId?request.get(`categorys/${payload.BoardId}/${payload.CardId}`):request.get(`categorys/${payload.BoardId}`)
        return request.get(`categorys/${payload.BoardId}`)
    },
    update({CategoryId,BoardId,CardId}){
        // return info.CardId?request.get(`categorys/${info.BoardId}/${info.CardId}`):request.get(`categorys/${info.BoardId}`)
        return request.put(`categorys/${BoardId}/${CardId}`,{CategoryId})
    },
    remove({CategoryId,BoardId,CardId}){
        return request.delete(`categorys/${BoardId}/${CardId}/${CategoryId}`)
    },
    // delete({categoryId,BoardId}){
    //     return request.delete(`categorys/${categoryId}/card/${BoardId}`)
    // },
}
// 검색
export const search={
    fetchs({routeName,complete}){
        return request.get(`${routeName}/status/${complete}`)
    }
}