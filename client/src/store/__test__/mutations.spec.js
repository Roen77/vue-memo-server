import mutations from '../mutations.js'


describe('store/mutations.js', () => {
  test('사용자 정보(닉네임)과 토큰값을 초기화합니다.',async ()=>{
    const state = {
        user:'roen',
        token:'12345!'
      }
     mutations.LOGOUT(state)
     expect(state.user).toBe('')
     expect(state.token).toBe('')
  })
  test('편집모드를 수정모드 상태로 전환할시, 편집 상태인지 확인합니다.',()=>{
      const state={
          edit:{
              editState:false
          }
      }
      mutations.ChangeState(state,{editState:'editState',value:true})
      expect(state.edit.editState).toBe(true)
  })
})
