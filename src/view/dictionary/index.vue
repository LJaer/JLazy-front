<template>
    <Row>
        <Col span="5" class-name="left">
          <div>12313</div>
        </Col>
        <Col span="1" class-name="center">
          <Icon class="center-button" type="md-arrow-dropleft" size="30"/>
        </Col>
        <Col span="18" class-name="right">col-113132</Col>
    </Row>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{},
  created(){},
  mounted(){}
}
</script>
<style>
.left,.right{
 background: white;
 height: 800px;
}

.center{
  width: 30px;
  background-color:rgb(240,240,240);
  height: 800px;
  text-align: center;
  color: white;
}

.center-button{
  margin-top: 390px;
  color: black;
  height: 30px;
}
</style>