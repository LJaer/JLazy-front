<template>
  <div style="height:600px; margin-left:10px">
    <Row class="operation">
      <Button @click="addMenu" type="primary" icon="md-add">添加子节点</Button>
      <Button @click="addTopMenu" icon="md-add" style="margin-left:10px">添加顶部菜单</Button>
      <Button @click="deleteBatch" icon="md-trash" style="margin-left:10px">批量删除</Button>
      <Dropdown @on-click="handleDropdown">
        <Button style="margin-left:10px">
          更多操作
          <Icon type="md-arrow-dropdown"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="refresh">刷新</DropdownItem>
          <DropdownItem name="expandOne">收合所有</DropdownItem>
          <DropdownItem name="expandAll">展开所有</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <i-switch v-model="strict" size="large" style="margin-left:10px">
        <span slot="open">级联</span>
        <span slot="close">单选</span>
      </i-switch>
    </Row>
    <div style="margin-top:20px">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="6">
          <Row>
            <Alert show-icon>
              <span class="select-title">当前选择编辑：{{currentEditPer.name}}</span>
              <a
                v-if="currentEditPer.name != null && currentEditPer.name != ''"
                style="float:right"
                @click="cancelEdit"
              >取消选择</a>
            </Alert>

            <Input
              v-model="searchKey"
              suffix="ios-search"
              @on-change="search"
              placeholder="输入菜单名搜索"
              clearable
            />
          </Row>

          <Row style="margin-top:10px;maxHeight:500px; overflow: auto;">
              <Tree
              ref="permissionsData"
              :data="permissionsData"
              show-checkbox
              :check-strictly="!strict"
              @on-select-change="changeSelect"
            ></Tree>
            
          </Row>
        </Col>
        <!-- 编辑节点 -->
        <Col span="6" style="margin-left:50px;">
          <Form
            ref="perEditForm"
            :model="perEditForm"
            :label-width="85"
            :rules="perEditFormValidate"
            label-position="left"
          >
            <FormItem label="上级节点名称">
              <Input v-model="parentNode.name" disabled style="width:200px" />
            </FormItem>
            <FormItem label="权限名称" prop="name">
              <Input v-model="perEditForm.name" style="width:200px" />
            </FormItem>
            <FormItem label="权限code" prop="code">
              <Tooltip placement="right" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
                <Input v-model="perEditForm.code" style="width:200px" />
              </Tooltip>
            </FormItem>
            <FormItem label="路径" prop="path">
              <Input v-model="perEditForm.path" style="width:200px" />
            </FormItem>
            <FormItem label="排序值" prop="sortOrder">
              <InputNumber :max="1000" :min="0" v-model="perEditForm.sortOrder"></InputNumber>
              <span style="margin-left:5px">值越小越靠前，支持小数</span>
            </FormItem>
            <FormItem label="权限类型" prop="type">
              <Select v-model="perEditForm.type" style="width:200px">
                <Option
                  v-for="item in perTypes"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否启用" prop="isAvailable">
              <i-switch
                size="large"
                v-model="perEditForm.isAvailable"
                :true-value="true"
                :false-value="false"
              >
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
            <FormItem>
              <Button @click="updatePer" type="primary" icon="md-add">保存并修改</Button>
              <Button
                @click="refreshPerEditForm"
                type="primary"
                icon="md-add"
                style="margin-left:10px;"
              >重置</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>

    <!-- 新增节点 -->
    <Modal
      :title="perModalTitle"
      v-model="perModalVisible"
      :width="400"
      :styles="{top: '250px'}"
      @on-cancel="resetPerModalForm"
      @on-ok="addNewPer"
    >
      <Form
        ref="perModalForm"
        :model="perModalForm"
        :label-width="85"
        :rules="perModalFormValidate"
        label-position="left"
      >
        <FormItem label="上级节点名称">
          <div v-if="perModalTitle === '添加顶级菜单'">
            <Input v-model="perModalTitle" disabled style="width:150px" />
          </div>
          <div v-else>
            <Input v-model="currentEditPer.name" disabled style="width:150px" />
          </div>
        </FormItem>
        <FormItem label="权限名称" prop="name">
          <Input v-model="perModalForm.name" style="width:150px" />
        </FormItem>
        <FormItem label="权限code" prop="code">
          <Tooltip placement="right" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
            <Input v-model="perModalForm.code" style="width:150px" />
          </Tooltip>
        </FormItem>
        <FormItem label="路径" prop="path">
          <Input v-model="perModalForm.path" style="width:150px" />
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <InputNumber :max="1000" :min="0" v-model="perModalForm.sortOrder"></InputNumber>
          <span style="margin-left:5px">值越小越靠前，支持小数</span>
        </FormItem>
        <FormItem label="权限类型" prop="type">
          <Select v-model="perModalForm.type" style="width:200px">
            <Option v-for="item in perTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用" prop="isAvailable">
          <i-switch
            size="large"
            v-model="perModalForm.isAvailable"
            :true-value="true"
            :false-value="false"
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
  getPerByParentId,
  getPerTreeByPerName,
  saveOrUpdatePer,
  removeByIds,
  selectPerById
} from "@/api/permission";
export default {
  components: {},
  props: {},
  data() {
    return {
      //菜单类型
      perTypes: [
        {
          value: 1,
          label: "菜单"
        },
        {
          value: 2,
          label: "按钮"
        },
        {
          value: 3,
          label: "接口"
        }
      ],
      searchKey: "",
      strict: true,
      parentNode: {
        name: ""
      },
      currentEditPer: {
        name: "",
        id: null
      },
      permissionsData: [],
      perModalVisible: false,
      perModalTitle: "",
      perModalForm: {
        name: null,
        code: null,
        sortOrder: 1,
        isAvailable: false,
        parentId: null,
        path: null
      },
      perModalFormValidate: {},
      perEditForm: {
        name: null,
        code: null,
        sortOrder: 1,
        isAvailable: false,
        parentId: null,
        path: null
      },
      perEditFormValidate: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    getAllList() {
      getPerByParentId({ parentId: 0 }).then(res => {
        this.permissionsData = res.data.data;
        this.expandOneOrAll(true, this.permissionsData);
      });
    },
    search() {
      if (this.searchKey) {
        getPerTreeByPerName({ name: this.searchKey }).then(res => {
          this.permissionsData = res.data.data;
        });
      } else {
        this.getAllList();
      }
    },

    cancelEdit() {
      let data = this.$refs.permissionsData.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      this.currentEditPer.name = "";
      this.$refs.perEditForm.resetFields();
    },
    addMenu() {
      this.parentNode.id = this.currentEditPer.id;
      if (this.currentEditPer.id == "" || this.currentEditPer.id == null) {
        this.$Message.warning("请先点击选择一个菜单权限节点");
        return;
      }
      this.perModalTitle = "添加子节点";
      this.perModalVisible = true;
    },
    addTopMenu() {
      this.parentNode.name = "顶级菜单";
      this.parentNode.id = 0;
      this.perModalTitle = "添加顶级菜单";
      this.perModalVisible = true;
    },
    changeSelect(selectNodes, curNode) {
      this.currentEditPer.name = curNode.title;
      this.currentEditPer.id = curNode.id;
      this.perEditForm = curNode;
      this.perEditForm.name = curNode.title;
      if (curNode.parentId == 0) {
        this.parentNode.name = "顶级菜单";
        return;
      }
      let params = { id: curNode.id };
      selectPerById(params).then(res => {
        this.parentNode.name = res.data.data.name;
      });
    },
    resetPerModalForm() {
      this.$refs.perModalForm.resetFields();
    },
    addNewPer() {
      this.perModalForm.parentId = this.parentNode.id;
      saveOrUpdatePer(this.perModalForm).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.resetPerModalForm();
          this.getAllList();
        }
      });
    },
    deleteBatch() {
      var ids = [];
      var checkedNodes = this.$refs.permissionsData.getCheckedNodes();
      for (var i = 0; i < checkedNodes.length; i++) {
        ids.push(checkedNodes[i].id);
      }
      removeByIds({ ids: ids + "" }).then(res => {
        if (res.data.data) {
          this.$Message.success("删除成功");
          this.getAllList();
        }
      });
    },
    handleDropdown(name) {
      if (name == "refresh") {
        this.getAllList();
      } else if (name == "expandOne") {
        this.expandOneOrAll(false, this.permissionsData);
      } else if (name == "expandAll") {
        this.expandOneOrAll(true, this.permissionsData);
      }
    },
    //展开或收缩tree
    expandOneOrAll(flag, treeNodes) {
      for (var i = 0; i < treeNodes.length; i++) {
        treeNodes[i].expand = flag;
        if (treeNodes[i].children.length > 0) {
          this.expandOneOrAll(flag, treeNodes[i].children);
        }
      }
    },
    refreshPerEditForm() {
      this.$refs.perEditForm.resetFields();
    },
    updatePer() {
      var params = {};
      Object.assign(params, this.perEditForm);
      params.children = null;
      saveOrUpdatePer(params).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.$refs.perModalForm.resetFields();
          this.$refs.perEditForm.resetFields();
          this.getAllList();
        }
      });
    }
  },
  created() {
    // 计算高度
    let height = document.documentElement.clientHeight;
    this.maxHeight = Number(height - 287) + "px";
    this.getAllList();
  },
  mounted() {}
};
</script>
<style>
</style>