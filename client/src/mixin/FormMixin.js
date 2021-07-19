export default {
  data(){
    return {
      errmsg:'',
      valid: true,
    }
  },
    mounted(){
      //   내가 지정한 인풋 태그 요소에 포커스되도록 구현
      if(!this.$refs.input) return
      setTimeout(()=>{
            this.$refs.input.focus()
       },200)
      },
    methods: {
      // 유효성 검사 확인
       validate () {
        this.$refs.form.validate()
      },
      // 입력폼 초기화
      reset () {
        this.$refs.form.reset()
      },
      // 입력폼 유효성 검사 초기화
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
}
