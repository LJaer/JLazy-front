<template>
  <div style="height:600px; margin-left:10px">
    <Row>
      <Col span="2">
        <Button @click="newDepartment(1)" type="primary" icon="md-add">添加部门</Button>
      </Col>
      <Col span="3">
        <Button @click type="primary" icon="md-add" style="margin-left:15px;">添加一级部门</Button>
      </Col>
      <Col span="2">
        <Button @click type="primary" icon="md-add" style="margin-left:5px;">批量删除</Button>
      </Col>
      <Col span="2">
        <Button @click="getDepList" type="primary" icon="md-add" style="margin-left:20px;">刷新</Button>
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
            @on-search="queryByName"
            style="width:300px; float:left;"
          />
        </Row>
        <Row style="margin-top:10px">
          <Tree :data="departmentData" show-checkbox multiple @on-select-change="selectDepartment"></Tree>
        </Row>
      </Col>
      <Col span="14">新增或编辑部门</Col>
    </Row>

    <!-- 新增部门 -->
    <Modal
      :title="departmentModalTitle"
      v-model="departmentModalVisible"
      :width="500"
      :styles="{top: '250px'}"
    >
      <Form
        ref="departmentForm"
        :model="departmentForm"
        :label-width="75"
        :rules="departmentFormValidate"
        label-position="left"
      >
        <FormItem label="部门名称" prop="name">
          <Input v-model="departmentForm.name" />
        </FormItem>
        <FormItem label="部门code" prop="code">
          <Tooltip placement="right" :max-width="220" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
            <Input v-model="departmentForm.code" />
          </Tooltip>
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <InputNumber :max="1000" :min="0" v-model="departmentForm.sortOrder"></InputNumber>
          <span style="margin-left:5px">值越小越靠前，支持小数</span>
        </FormItem>
        <FormItem label="是否启用" prop="isAvailable">
          <i-switch
            size="large"
            v-model="departmentForm.isAvailable"
            :true-value="1"
            :false-value="0"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getDepByParentId,getDepByDepName } from "@/api/department";
export default {
  components: {},
  props: {},
  data() {
    return {
      //查询tree 部门名称
      queryDepartmentName: null,
      departmentData: [
        
      ],
      //当前选择的部门
      curSelectDepartment:null,
      //新增部门
      departmentModalTitle:'',
      departmentModalVisible:false,
      departmentForm:{
        parentId:null,
        name:null,
        code:null,
        sortOrder:null,
        isAvailable:null
      },
      departmentFormValidate:{
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        code: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
      getDepList(){
          getDepByParentId({parentId:0}).then(res=>{
             this.departmentData = res.data.data;
          })
      },
      queryByName(){
        getDepByDepName({name:this.queryDepartmentName}).then(res=>{
          this.departmentData = res.data.data;
        })
      },
      //展示新增部门弹窗
      newDepartment(flag){
      
        //新增子部门
        if(flag===1){
          if(this.curSelectDepartment===null){
            this.$Message.error("请先点击选择一个部门");
            return;
          }
          this.departmentModalTitle='新增子部门';
          this.departmentModalVisible=true;
        }else if(flag===2){
          this.departmentModalTitle='新增一级部门';
        }
      },
      selectDepartment(selectNodes,curNode){
        this.curSelectDepartment=curNode;
        this.departmentForm.id=curNode.id;
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