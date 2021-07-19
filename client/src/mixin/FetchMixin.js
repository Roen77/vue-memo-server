import {mapMutations,mapActions} from 'vuex';
import {bus} from '../../utils/bus'
export default {
    data() {
        return {
            hasError:false,
            errMsg:{},
        }
    },
    created() {
     // 이벤트 버스로 스피너 보여주기
        bus.$emit('start:spinner')
        this.fetchData()
      },
      methods: {
        ...mapActions(['FETCHLISTS']),
        ...mapMutations(['RESETLIST']),
        async fetchData(){
            try {
                // 기존 데이터 초기화
                this.RESETLIST({routeId:this.$route.params.id})
                // 데이터 가져오기
                await this.FETCHLISTS({routeName:this.$route.name,id:this.$route.params?this.$route.params.id:''})
                   // 데이터를 불러온 후 카드 데이터를 보여줍니다.
                    if(this.$route.name ==="cards") this.cardDialog=true
            } catch (error) {
                this.hasError=true
                this.errMsg=error.response
            }
            finally{
                // 이벤트 버스로 스피너 종료하기
                bus.$emit('end:spinner')
            }

        },
      },
  }
  