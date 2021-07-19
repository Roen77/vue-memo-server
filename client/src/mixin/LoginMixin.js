import FormMixin from '../mixin/FormMixin'
export default {
    mixins: [FormMixin],
    data() {
        return {
            email: '',
            password: '',
             // 이메일은 필수이고, 30자리 이하로 입력할 수 있도록 규칙을 정해줍니다.
            emailRules: [
                v => !!v || '이메일은 필수입니다.',
                v => /.+@.+/.test(v) || '이메일 양식으로 입력해주세요',
                v => v && v.length<=20 || '이메일은 20자리 이하로 입력해주세요',
            ],
             // 비밀번호 필수 입력 및 최소8자리 이상 작성되고 숫자와 특수문자를 포함하도록 규칙을 정해줍니다.
            passwordRules: [
                v => !!v || '비밀번호는 필수입니다.',
               v => v && v.length >= 8 && v.length<=20 || '비밀번호는 최소 8자리 이상 20자리 이하로 입력해주세요',
                v=> /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(v) ||'비밀번호는 최소 숫자와 특수문자가 포함되어야 합니다.'
            ],
        }
    },

}