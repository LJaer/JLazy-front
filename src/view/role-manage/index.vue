<template>
  <div style="padding:5px;background-color:rgb(240, 240, 240);">
    <Row style="padding-top:5px;padding-left:5px;">
      <Button type="primary" @click="showRoleModal(1,null)">添加角色</Button>
      <Button style="margin-left:10px" @click="getRoleList">刷新</Button>
    </Row>
    <br />
    <Row>
      <Table
        border
        highlight-row
        ref="rolePageTable"
        :columns="roleColumns"
        :data="rolePageData"
        height="520"
      >
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="text"
            size="small"
            style="margin-right: 5px; color:#5cadff;"
            @click="showEditRolePer(index)"
          >角色权限</Button>
          <Button
            type="text"
            size="small"
            style="margin-right: 5px; color:#5cadff;"
            @click="showRoleModal(2,index)"
          >编辑</Button>
          <Button type="text" size="small" @click="deleteRole(index)" style="color:#5cadff;">删除</Button>
        </template>
      </Table>
    </Row>
    <Row>
      <Page
        :total="roleList.total"
        show-total
        :page-size="roleList.pageSize"
        :current="roleList.page"
        show-elevator
        show-sizer
        style="margin-top:5px;padding-left:700px;"
        @on-change="roleIndexChange"
        @on-page-size-change="rolePageSizeChange"
      />
    </Row>

    <!-- 新增或编辑角色 -->
    <Modal
      v-model="addOrEditRoleModal"
      :title="addOrEditRoleModalTile"
      :loading="addOrEditRoleModalLoading"
      @on-cancel="clearRoleForm"
      @on-ok="addOrEditRole"
    >
      <Form
        ref="roleForm"
        :model="roleForm"
        :label-width="75"
        :rules="roleFormValidate"
        label-position="left"
      >
        <FormItem label="角色名称" prop="name">
          <Input v-model="roleForm.name" />
        </FormItem>
        <FormItem label="角色code" prop="code">
          <Tooltip placement="right" :max-width="220" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
            <Input v-model="roleForm.code" />
          </Tooltip>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="roleForm.description" />
        </FormItem>
        <FormItem label="状态" prop="isAvailable">
          <i-switch
            size="large"
            v-model="roleForm.isAvailable"
            :true-value="true"
            :false-value="false"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
    </Modal>

    <!-- 角色权限授权 -->
    <Modal
      v-model="editRolePerModal"
      :title="editRolePerModalTile"
      @on-cancel="clearEditRolePerForm"
      @on-ok="updateRolePer"
    >
      <Tree ref="permissionsData" :data="permissionsData" show-checkbox></Tree>
    </Modal>
  </div>
</template>

<script>
import {
  getRolePage,
  saveOrUpdate,
  deleteById,
  updateRolePermission,
  selectCurrentUserPer,
  selectCurrentPerByRoleId
} from "@/api/role";
import { getPerByParentId } from "@/api/permission";
import moment from "moment";
import { truncate } from "fs";

export default {
  components: {},
  props: {},
  data() {
    return {
      permissionsData: [],
      editRolePerModal: false,
      editRolePerModalTile: "",
      updateRolePermissionDTO: {
        roleId: null,
        perIs: []
      },
      //角色分页查询相关
      roleColumns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "角色名称",
          key: "name"
        },
        {
          title: "角色编码",
          key: "code"
        },
        {
          title: "描述",
          key: "description",
          width: "300"
        },
        {
          title: "状态",
          key: "isAvailable",
          render: (h, params) => {
            if (params.row.isAvailable == 1) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "启用"
                  }
                })
              ]);
            } else if (params.row.isAvailable == 0) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "禁用"
                  }
                })
              ]);
            }
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          render: (h, params) => {
            return h(
              "span",
              moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "更新时间",
          key: "updateTime",
          render: (h, params) => {
            return h(
              "span",
              moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        { title: "操作", slot: "action", width: "200" }
      ],
      rolePageData: [],
      //添加角色相关
      addOrEditRoleModal: false,
      addOrEditRoleModalLoading: true,
      addOrEditRoleModalTile: "",
      // 添加或编辑角色数据
      roleForm: {
        id: null,
        name: "",
        code: "",
        isAvailable: true,
        description: ""
      },
      roleFormValidate: {
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        code: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      //分页查询相关
      roleList: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    //获取分页角色
    getRoleList() {
      getRolePage({
        pageNum: this.roleList.pageNum,
        pageSize: this.roleList.pageSize
      }).then(res => {
        let data = res.data.data;
        this.roleList.total = data.total;
        this.rolePageData = res.data.data.records;
      });
    },
    //显示新增或编辑角色弹窗
    showRoleModal(flag, index) {
      this.addOrEditRoleModal = true;
      if (1 === flag) {
        this.addOrEditRoleModalTile = "新增角色";
      } else if (2 === flag) {
        this.addOrEditRoleModalTile = "编辑角色";
        Object.assign(this.roleForm, this.rolePageData[index]);
        this.roleForm.createTime = null;
        this.roleForm.updateTime = null;
      }
    },
    //新增或编辑角色
    addOrEditRole() {
      saveOrUpdate(this.roleForm).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.addOrEditRoleModalLoading = false;
          this.addOrEditRoleModal = false;
          this.clearRoleForm();
          this.getRoleList();
        }
      });
    },
    //清除新增表单数据
    clearRoleForm() {
      this.$refs.roleForm.resetFields();
    },
    //页数改变
    roleIndexChange(index) {
      this.roleList.pageNum = index;
      this.getRoleList();
    },
    //页大小变化
    rolePageSizeChange(index) {
      this.roleList.pageSize = index;
      this.getRoleList();
    },
    //删除角色
    deleteRole(index) {
      deleteById({ id: this.rolePageData[index].id }).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.getRoleList();
        }
      });
    },
    //显示编辑角色权限窗口
    showEditRolePer(index) {
      let userPers;
      //获取当前角色权限
      selectCurrentPerByRoleId({ roleId : this.rolePageData[index].id }).then(res => {
        userPers = res.data.data;
      });
    
      getPerByParentId({ parentId: 0 }).then(res => {
        this.permissionsData = res.data.data;
        this.curUserPerTreeSelect(this.permissionsData,userPers)
        this.editRolePerModalTile = this.rolePageData[0].name;
        this.editRolePerModal = true;
        this.updateRolePermissionDTO.roleId = this.rolePageData[index].id;
      });
    },
    curUserPerTreeSelect(childNodes,userPers){
        //设置当前选中项
        for (var i = 0; i < childNodes.length; i++) {
          //判断是否有子节点
          if(childNodes[i].children.length>0){
            childNodes[i].expand = true;
            this.curUserPerTreeSelect(childNodes[i].children,userPers);
          }else{
            for(var j = 0; j< userPers.length;j++){
              if(userPers[j].id === childNodes[i].id){
                childNodes[i].checked = true;
              }
            }
          }
        }
    },
    clearEditRolePerForm() {
      this.permissionData = [];
    },
    updateRolePer() {
      //获取当前所选的权限
      var perIds = [];
      var checkedNodes = this.$refs.permissionsData.getCheckedNodes();
      for (var i = 0; i < checkedNodes.length; i++) {
        perIds.push(checkedNodes[i].id);
      }
      this.updateRolePermissionDTO.perIds = perIds + "";
      updateRolePermission(this.updateRolePermissionDTO).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.clearEditRolePerForm();
        }
      });
    }
  },
  created() {
    this.getRoleList();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>