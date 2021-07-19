import {getAuthFromCookie,getUserFromCookie} from '../../utils/cookie'
export default {
    // 쿠키에 저장된 정보를 가져오고,없으면 빈문자열을 저장합니다.
    user:getUserFromCookie() ||'',
    token:getAuthFromCookie() || '',
    //보드
    boards:[],
    // 카드
    cards:[],
    card:{},
    // 카테고리 리스트
    categoryList:[],
    // 검색 리스트
    searchList:[],
    //편집 상태
    edit:{
        // 수정 모드 상태
          editState:false,
          // 카드 수정모드시, 카테고리 추가 상태
          addState:false,
          // 카드 수정모드시, 카테고리 삭제 사애 
          removeState:false
      }


}