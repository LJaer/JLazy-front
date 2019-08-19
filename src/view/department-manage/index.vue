<template>
  <div style="height:600px; margin-left:10px">
    <Row>
      <Col span="2">
        <Button @click type="primary" icon="md-add">添加字典</Button>
      </Col>
      <Col span="2">
        <Button @click type="primary" icon="md-add" style>添加一级部门</Button>
      </Col>
      <Col span="2">
        <Button @click type="primary" icon="md-add" style="margin-left:15px;">批量删除</Button>
      </Col>
      <Col span="2">
        <Button @click type="primary" icon="md-add" style="margin-left:5px;">刷新</Button>
      </Col>
    </Row>
    <Row style="margin-top:10px">
      <Col span="10">
        <Row>
          <Input
            search
            enter-button
            placeholder="输入部门名搜索"
            v-model="queryDepartmentName"
            @on-search
            style="width:300px; float:left;"
          />
        </Row>
        <Row style="margin-top:10px">
          <Tree :data="departmentData" show-checkbox multiple></Tree>
        </Row>
      </Col>
      <Col span="14">新增或编辑部门</Col>
    </Row>
  </div>
</template>

<script>
import { getDepByParentId } from "@/api/department";
export default {
  components: {},
  props: {},
  data() {
    return {
      //查询tree 部门名称
      queryDepartmentName: null,
      departmentData: [
        
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
      getDepList(){
          getDepByParentId({parentId:0}).then(res=>{
             this.departmentData = res.data.data;
          })
      }
  },
  created() {
      this.getDepList();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>