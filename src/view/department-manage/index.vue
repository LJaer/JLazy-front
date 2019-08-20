<template>
  <div style="height:600px; margin-left:10px">
    <Row>
      <Col span="2">
        <Button @click="newDepartmentShow(1)" type="primary" icon="md-add">添加部门</Button>
      </Col>
      <Col span="3">
        <Button
          @click="newDepartmentShow(2)"
          type="primary"
          icon="md-add"
          style="margin-left:15px;"
        >添加一级部门</Button>
      </Col>
      <Col span="2">
        <Button @click="batchDelete" type="primary" icon="md-add" style="margin-left:5px;">批量删除</Button>
      </Col>
      <Col span="2">
        <Button @click="getDepList" type="primary" icon="md-add" style="margin-left:20px;">刷新</Button>
      </Col>
    </Row>
    <Row style="margin-top:20px">
      <Col span="6">
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
          <Tree
            ref="departmentData"
            :data="departmentData"
            show-checkbox
            @on-select-change="selectDepartment"
          ></Tree>
        </Row>
      </Col>
      <Col span="5">
        <Form
          ref="departmentEditForm"
          :model="departmentEditForm"
          :label-width="85"
          :rules="departmentEditFormValidate"
          label-position="left"
        >
          <div v-if="addFirstDepFlag !== true">
            <FormItem label="上级部门名称">
              <Input v-model="departmentEditForm.upDepartTitle" disabled style="width:150px" />
            </FormItem>
          </div>
          <FormItem label="部门名称" prop="name">
            <Input v-model="departmentEditForm.name" style="width:150px" />
          </FormItem>
          <FormItem label="部门code" prop="code">
            <Tooltip placement="right" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
              <Input v-model="departmentEditForm.code" style="width:150px" />
            </Tooltip>
          </FormItem>
          <FormItem label="排序值" prop="sortOrder">
            <InputNumber :max="1000" :min="0" v-model="departmentEditForm.sortOrder"></InputNumber>
            <span style="margin-left:5px">值越小越靠前，支持小数</span>
          </FormItem>
          <FormItem label="是否启用" prop="isAvailable">
            <i-switch
              size="large"
              v-model="departmentEditForm.isAvailable"
              :true-value="true"
              :false-value="false"
            >
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否为父节点" prop="isParent">
            <i-switch
              size="large"
              v-model="departmentEditForm.isParent"
              :true-value="true"
              :false-value="false"
            >
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem>
            <Button @click="updateDep" type="primary" icon="md-add">保存并修改</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>

    <!-- 新增部门 -->
    <Modal
      :title="departmentModalTitle"
      v-model="departmentModalVisible"
      :width="400"
      :styles="{top: '250px'}"
      @on-cancel="refreshDepForm"
      @on-ok="saveNewDep"
    >
      <Form
        ref="departmentForm"
        :model="departmentForm"
        :label-width="85"
        :rules="departmentFormValidate"
        label-position="left"
      >
        <div v-if="addFirstDepFlag !== true">
          <FormItem label="上级部门名称">
            <Input v-model="curSelectDepartment.title" disabled style="width:150px" />
          </FormItem>
        </div>
        <FormItem label="部门名称" prop="name">
          <Input v-model="departmentForm.name" style="width:150px" />
        </FormItem>
        <FormItem label="部门code" prop="code">
          <Tooltip placement="right" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
            <Input v-model="departmentForm.code" style="width:150px" />
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
import {
  getDepByParentId,
  getDepByDepName,
  saveOrUpdateDept,
  removeByIds,
  selectById
} from "@/api/department";
export default {
  components: {},
  props: {},
  data() {
    return {
      //查询tree 部门名称
      queryDepartmentName: null,
      departmentData: [],
      //当前选择的部门
      curSelectDepartment: {
        title: ""
      },
      //新增部门
      departmentModalTitle: "",
      departmentModalVisible: false,
      departmentForm: {
        parentId: null,
        name: null,
        code: null,
        sortOrder: null,
        isAvailable: null
      },
      departmentFormValidate: {
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        code: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      //是否添加的为一级部门
      addFirstDepFlag: false,
      //编辑部门
      departmentEditForm: {
        id: null,
        parentId: null,
        name: null,
        code: null,
        sortOrder: null,
        isAvailable: true,
        upDepartTitle: null,
        isParent: false
      },
      departmentEditFormValidate: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    getDepList() {
      getDepByParentId({ parentId: 0 }).then(res => {
        this.departmentData = res.data.data;
      });
    },
    queryByName() {
      getDepByDepName({ name: this.queryDepartmentName }).then(res => {
        this.departmentData = res.data.data;
      });
    },
    //展示新增部门弹窗
    newDepartmentShow(flag) {
      this.departmentModalVisible = true;
      //新增子部门
      if (flag === 1) {
        if (this.curSelectDepartment === null) {
          this.$Message.error("请先点击选择一个部门");
          return;
        }
        this.departmentModalTitle = "新增子部门";

        this.departmentForm.id = null;
        this.departmentForm.parentId = this.curSelectDepartment.id;
      } else if (flag === 2) {
        this.departmentModalTitle = "新增一级部门";
        this.addFirstDepFlag = true;
        this.departmentForm.parentId = 0;
      }
    },
    selectDepartment(selectNodes, curNode) {
      this.departmentForm.id = curNode.id;
      this.departmentEditForm.id = curNode.id;
      this.departmentEditForm.parentId = curNode.parentId;
      this.departmentEditForm.name = curNode.title;
      this.departmentEditForm.code = curNode.code;
      this.departmentEditForm.sortOrder = curNode.sortOrder;
      this.departmentEditForm.isAvailable = curNode.isAvailable;
      this.departmentEditForm.isParent = curNode.isParent;
      if (this.departmentEditForm.parentId === 0) {
        this.departmentEditForm.upDepartTitle = "一级部门";
      } else {
        selectById({ id: this.curNode.parentId }).then(res => {
          this.departmentEditForm.upDepartTitle = res.data.data.name;
        });
      }
    },
    //刷新新增部门表单
    refreshDepForm() {
      this.$refs.departmentForm.resetFields();
    },
    //新增部门
    saveNewDep() {
      saveOrUpdateDept(this.departmentForm).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.refreshDepForm();
          this.getDepList();
        }
      });
    },
    //修改部门
    updateDep() {
      saveOrUpdateDept(this.departmentEditForm).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.$refs.departmentForm.resetFields();
          this.$refs.departmentEditForm.resetFields();
          this.getDepList();
        }
      });
    },
    //批量删除
    batchDelete() {
      var ids = [];
      var checkedNodes = this.$refs.departmentData.getCheckedNodes();
      for (var i = 0; i < checkedNodes.length; i++) {
        ids.push(checkedNodes[i].id);
      }
      removeByIds({ ids: ids + "" }).then(res => {
        if (res.data.data) {
          this.$Message.success("删除成功");
          this.getDepList();
        }
      });
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