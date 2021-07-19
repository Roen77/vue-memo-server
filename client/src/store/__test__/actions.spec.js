import actions from '../actions.js'
import mutations from '../mutations.js'
import state from '../state.js'
import { request } from '../../api/index.js'


describe('store/actions.js', () => {
    let commit;
    let dispatch;
  beforeEach(() => {
      commit=(name,payload)=>{
          mutations[name](state,payload)
      }
      dispatch=(name,payload)=>{
          const context={
              state,
              commit,
              dispatch
          }
          return actions[name](context,payload)
      }
  })

  test('회원가입 시,사용자의 정보(닉네임)와 토큰값을 저장했는지 확인합니다.',async ()=>{
      const res={
         data:{
            user:{
                nickname:"roen",
            },
            token:'12345!!'
         }
      }
      request.post=jest.fn().mockResolvedValue(res)
     await dispatch('REGISTER')
     expect(state.user).toEqual(res.data.user.nickname)
     expect(state.token).toEqual(res.data.token)
  })

  test('로그인 시,사용자의 정보(닉네임)와 토큰값을 저장했는지 확인합니다.',async ()=>{
      const res={
        data:{
            user:{
                nickname:"roen",
            },
            token:'12345!!'
        }
      }
      request.post=jest.fn().mockResolvedValue(res)
    await dispatch('LOGIN')
    expect(state.user).toEqual(res.data.user.nickname)
    expect(state.token).toEqual(res.data.token)
  })

  test('보드/카드 데이터를 잘 가져온 경우, 보드/카드 데이터를 확인합니다.', async ()=>{
    const res={
      data:{
        cards:['card1','card2','card3'],
        boards:['board1','board2','board3']
      }
    }
  
    request.get=jest.fn().mockResolvedValue(res)
    // 보드 데이터
    await dispatch('FETCHLISTS',{routeName:'boards'})
    expect(state.boards).toEqual(res.data.boards)
    // 보드에 있는 카드 데이터
    await dispatch('FETCHLISTS',{routeName:'boards',id:1})
    expect(state.cards).toEqual(res.data.cards)
    // 카드 단일 데이터
    await dispatch('FETCHLISTS',{routeName:'cards'})
    expect(state.card).toEqual(res.data.cards)
  })
  test('보드/카드 데이터를 추가할 시, 기존 보드/카드 데이터 목록의 가장 앞쪽으로 데이터가 추가됩니다.',async ()=>{
    const res={
         data:{
           board:{
            UserId:1,
            bgcolor:"#FF006EAD",
            createdAt:"2021-06-27T13:09:13.643Z",
            description:"sdf",
            id:1,
            title:"sdf",
           },
           card:{
            BoardId:21,
            CardTypes:['샘플카테고리'],
            Category:Object,
            CategoryId:1,
            UserId:1,
            bgcolor:"#FFF8E1",
            complete:false,
            createdAt:"2021-06-27T13:11:10.992Z",
            description:"샘플 카드 내용 입니다",
            id:33,
            title:"샘플카드..",
           }
         }
    }
    request.post=jest.fn().mockResolvedValue(res)
    // 보드
    await dispatch('CREATLIST',{routeName:"boards"})
    expect(state.boards[0]).toEqual(res.data.board)
    // 카드
    await dispatch('CREATLIST',{routeName:"cards"})
    expect(state.cards[0]).toEqual(res.data.card)

  })
  test('내가 삭제할 보드 데이터를 보드 목록에서 삭제합니다.',async ()=>{
    const res={
      data:{
        boards:[{
          id:2,
          title:'title name',
          bgcolor:'#888888'
        }]
      }
    }
    request.get=jest.fn().mockResolvedValue(res)
    await dispatch('FETCHLISTS',{routeName:'boards'})

    request.delete=jest.fn().mockResolvedValue(res)
    await dispatch('DELETELIST',{routeName:'boards',id:2})

    expect(state.boards.length).toBe(0)
  })



})
