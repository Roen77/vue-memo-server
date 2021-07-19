
import {saveAuthToCookie,saveUserToCookie,deleteCookie} from '../../utils/cookie'

export default {
    SET_USER(state,data){
        state.user=data.user.nickname
        state.token=data.token
        saveAuthToCookie(data.token)
        saveUserToCookie(data.user.nickname)
    },
    LOGOUT(state){
        state.user=''
        state.token=''
        deleteCookie('memo_auth')
        deleteCookie('memo_user')
    },
    // 보드/카드 가져오기
    SET_LISTS(state,{id,routeName,data}){
        // 카드 단일 데이터 가져오기
        if(routeName === "cards"){
            state.card=data.cards
        }else{
            // id 값이 있다면 해당 보드에 해당되는 카드 데이터 목록들을 가져오고, id 값이 없다면, 해당 보드 데이터 목록들을 가져온다.
            id?state.cards=data.cards: state.boards=data.boards
        }
    },
    //보드/카드 추가 및 수정
    SET_LIST(state, payload) {
        // 보드 추가 및 수정
        if(payload.routeName==="boards"){
            const {board}=payload.data
            if (payload.id) {
                //보드 수정
                const index = state.boards.findIndex(b => b.id === board.id)
                state.boards.splice(index, 1, board)
            } else {
                //보드 추가
                state.boards.unshift(board)
            }
        }
        // 카드 추가 및 수정
        if(payload.routeName==="cards"){
            const {card}=payload.data
            // 카드 수정
            if(payload.id) return
            if (payload.cardState) {
                // 카드 진행중/완료 상태 수정
                    state.card.complete=payload.complete         
            } else {
                //카드 추가
                state.cards.unshift(card)
            }
        }

    },
    // 보드 삭제
    DELETE_LIST(state,{routeName,id}){
        if(routeName==="boards"){
            const index=state.boards.findIndex(board=>board.id === id)
        state.boards.splice(index,1)
        }
    },
    RESETLIST(state,route) {
            if(route.routeId){
                // 카드 데이터 초기화
                if (state.cards.length > 0) {
                    state.cards = []
                return
                }
            }else{
                // 보드 데이터 초기화
                if (state.boards.length > 0) {
                    state.boards = []
                return
                }
            }
    },
    // 카테고리 추가 및 수정
    SET_CATEGORY(state,category){
        // 카테고리 수정
        if(category.updateId){
            state.card.Category=category.choice[0]
        }else{
            // 카테고리 추가
            state.card.CardTypes.push(category)
        }

    },
    SET_CATEGORYS(state,categorys){
        state.categoryList=categorys
    },
    // 카테고리 초기화
    RESET_CATEGORYS(state){
        if(state.categoryList)state.categoryList=[]
    },
    // 카테고리 삭제
    DELETE_CATEGORYS(state,choiceCategory){
        const index= state.card.CardTypes.findIndex(category=>category.id == choiceCategory.id)
        state.card.CardTypes.splice(index,1)

    },
    SET_SEARCH(state,cards){
        state.searchList=cards
    },
    // 검색 정보 초기화
    RESET_SEARCH(state){
        state.searchList=[]
    },
    // 편집모드 상태 수정
    ChangeState(state,{editState,value}){
        state.edit[editState]=value
    }
}