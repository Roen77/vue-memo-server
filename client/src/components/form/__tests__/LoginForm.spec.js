import {createLocalVue,shallowMount} from '@vue/test-utils';
import LoginForm from '../../form/LoginForm.vue'
import Vuetify from 'vuetify'

describe("LoginForm.vue",()=>{
    const localVue = createLocalVue()
     let vuetify
     beforeEach(() => {
        vuetify = new Vuetify()
      })

      test('이메일/비밀번호 데이터가 유효하지 않은 경우,버튼이 비활성화됩니다.',()=>{
      const wrapper= shallowMount(LoginForm,{
        localVue,
        vuetify,
        data(){
          return{
            valid:false
            }
         }
       })
      const btn=wrapper.find('#login_btn');
      expect(btn.attributes('disabled')).toBeTruthy();

    })
})
