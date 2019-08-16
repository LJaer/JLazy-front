<template>
  <div style="padding:5px;background-color:rgb(240, 240, 240);height:650px">
    <Row>
      <Form
        ref="pageQueryParams"
        :model="pageQueryParams"
        inline
        :label-width="100"
        label-position="right"
        class="search-form"
        style="margin-top: 10px; height: 100px;"
      >
        <Row>
          <Form-item label="用户名称" prop="username">
            <Input
              type="text"
              v-model="pageQueryParams.username"
              placeholder="请输入用户名"
              clearable
              style="width: 150px"
              @on-enter
            />
          </Form-item>
          <Form-item label="部门" prop="department">
            <Select
              v-model="pageQueryParams.department"
              placeholder="请选择"
              clearable
              style="width: 100px"
              @on-change
            >
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form-item>

          <Form-item label="手机号" prop="mobile">
            <Input
              type="text"
              v-model="pageQueryParams.mobile"
              placeholder="请输入手机号"
              clearable
              style="width: 150px"
              @on-enter
            />
          </Form-item>

          <Form-item label="邮箱" prop="email">
            <Input
              type="text"
              v-model="pageQueryParams.email"
              placeholder="请输入邮箱"
              clearable
              style="width: 150px"
              @on-enter
            />
          </Form-item>

          <Form-item label="性别" prop="sex">
            <Select
              v-model="pageQueryParams.sex"
              placeholder="请选择"
              clearable
              style="width: 100px"
              @on-change
            >
              <Option value="1">男</Option>
              <Option value="2">女</Option>
            </Select>
          </Form-item>

          <Form-item label="状态" prop="enabled">
            <Select
              v-model="pageQueryParams.enabled"
              placeholder="请选择"
              clearable
              style="width: 100px"
              @on-change
            >
              <Option value="1">启用</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form-item>
        </Row>

        <Row>
          <Form-item label="创建时间" prop="createTime">
            <DatePicker
              type="daterange"
              format="yyyy-MM-dd"
              placeholder
              style="width: 190px"
              separator=" 至 "
              @on-change="searchTimeChange"
              v-model="searchTime"
            ></DatePicker>
          </Form-item>

          <Form-item style="margin-left:-85px;" class="br">
            <Button @click="getUserPageData" type="primary" icon="ios-search">搜索</Button>
            <Button @click="resetPageQueryParams" type="primary" style="margin-left:10px">重置</Button>
            <Button @click="addOrEditUser(1)" type="primary" style="margin-left:10px">新增用户</Button>
          </Form-item>
        </Row>
      </Form>
    </Row>
    <Row>
      <Table
        border
        highlight-row
        ref="userPageTable"
        :columns="userPageColumns"
        :data="userPageData"
        height="520"
      >
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="text"
            size="small"
            style="margin-right: 5px; color:#5cadff;"
            @click="addOrEditUser(2,index)"
          >编辑</Button>
          <Button type="text" size="small" style="margin-right: 5px; color:#5cadff;" @click>重置密码</Button>
          <Button type="text" size="small" @click="deleteUser(index)" style="color:#5cadff;">删除</Button>
        </template>
      </Table>
    </Row>

    <!-- 添加或更新字典 -->
    <Modal
      :title="userModalTitle"
      v-model="userModalVisible"
      :width="500"
      :styles="{top: '250px'}"
      @on-ok="userFormOk"
      @on-cancel="clearUserForm"
    >
      <Form
        ref="userForm"
        :model="userForm"
        :label-width="60"
        :rules="userFormValidate"
        label-position="left"
        inline
      >
        <FormItem label="用户名" prop="username">
          <Input v-model="userForm.username" style="width:150px" />
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="userForm.mobile" style="width:150px" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="userForm.email" style="width:150px" />
        </FormItem>
        <FormItem label="地址" prop="address">
          <Input v-model="userForm.address" style="width:150px" />
        </FormItem>
        <FormItem label="头像" prop="avatar">
          <Input v-model="userForm.avatar" style="width:150px" />
        </FormItem>
        <FormItem label="备注" prop="description">
          <Input v-model="userForm.description" style="width:300px" />
        </FormItem>
        <FormItem label="部门" prop="departmentId">
          <Input v-model="userForm.departmentId" style="width:150px" />
        </FormItem>
        <br />
        <FormItem label="性别" prop="sex">
          <i-switch size="large" v-model="userForm.sex" :true-value="1" :false-value="2">
            <span slot="open">男</span>
            <span slot="close">女</span>
          </i-switch>
        </FormItem>
        <FormItem label="是否可用" prop="enabled">
          <i-switch size="large" v-model="userForm.enabled" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>

        <FormItem label="是否过期" prop="accountNonExpired">
          <i-switch
            size="large"
            v-model="userForm.accountNonExpired"
            :true-value="1"
            :false-value="0"
          >
            <span slot="open">未过期</span>
            <span slot="close">已过期</span>
          </i-switch>
        </FormItem>

        <FormItem label="是否锁定" prop="accountNonLocked">
          <i-switch
            size="large"
            v-model="userForm.accountNonLocked"
            :true-value="1"
            :false-value="0"
          >
            <span slot="open">未锁定</span>
            <span slot="close">锁定</span>
          </i-switch>
        </FormItem>

        <FormItem label="证书是否过期" prop="credentialsNonExpired" :label-width="90">
          <i-switch
            size="large"
            v-model="userForm.credentialsNonExpired"
            :true-value="1"
            :false-value="0"
          >
            <span slot="open">未过期</span>
            <span slot="close">过期</span>
          </i-switch>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  getByPageQueryDTO,
  createNewUser,
  deleteById,
  updateUser
} from "@/api/user";
import { start } from "repl";
export default {
  components: {},
  props: {},
  data() {
    return {
      //分页查询参数
      searchTime: "",
      pageQueryParams: {
        username: null,
        mobile: null,
        email: null,
        sex: null,
        enabled: null,
        pageNum: 1,
        pageSize: 10,
        createTimeStart: null,
        createTimeEnd: null
      },
      userPageColumns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "备注",
          key: "description"
        },
        {
          title: "性别",
          key: "sex",
          render: (h, params) => {
            if (params.row.sex == 1) {
              return h("div", "男");
            } else if (params.row.sex == 2) {
              return h("div", "女");
            }
          }
        },
        {
          title: "部门",
          key: "department"
        },
        {
          title: "最后登录时间",
          key: "lastLoginTime"
        },
        {
          title: "状态",
          key: "enabled",
          render: (h, params) => {
            if (params.row.enabled == 1) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "启用"
                  }
                })
              ]);
            } else if (params.row.enabled == 0) {
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
        { title: "操作", slot: "action", width: "200" }
      ],
      userPageData: [],
      //新增或编辑user
      userModalTitle: "",
      userModalVisible: false,
      userForm: {
        username: "",
        mobile: "",
        email: "",
        address: "",
        avatar: "",
        description: "",
        departmentId: "",
        sex: 1,
        enabled: 1,
        accountNonExpired: 1,
        accountNonLocked: 1,
        credentialsNonExpired: 1
      },
      userFormValidate: {
        // 表单验证规则
        username: [{ required: true, message: "不能为空", trigger: "blur" }],
        phone: [{ required: true, message: "不能为空", trigger: "blur" }],
        email: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    //获取用户分页数据
    getUserPageData() {
      getByPageQueryDTO(this.pageQueryParams).then(res => {
        this.userPageData = res.data.data.records;
        //console.log(res);
      });
    },
    //搜索日期改变
    searchTimeChange(date) {
      this.pageQueryParams.createTimeStart = date[0];
      this.pageQueryParams.createTimeEnd = ndate[1];
    },
    //重置查询条件
    resetPageQueryParams() {
      this.$refs.pageQueryParams.resetFields();
      //由于时间控件，需要手动重置
      this.searchTime = "";
    },
    //显示新增用户界面
    addOrEditUser(flag, index) {
      this.userModalVisible = true;
      if (1 === flag) {
        this.userModalTitle = "新增用户";
      } else if (2 === flag) {
        this.userModalTitle = "编辑用户";
        Object.assign(this.userForm, this.userPageData[index]);
        this.userForm.createTime = null;
        this.userForm.updateTime = null;
      }
    },
    //新增或编辑用户提交
    userFormOk() {
      if (this.userForm.id === null) {
        //创建新用户
        createNewUser(this.userForm).then(res => {
          //弹窗显示
          let password = res.data.data.password;
          this.clearUserForm();
          alert("用户密码为：" + password);
        });
      }else{
        //更新用户
        updateUser(this.userForm).then(res => {
          if(res.data.data){
            this.$Message.success("操作成功");
            this.getUserPageData();
          }
        })
      }
    },
    //新增用户取消
    clearUserForm() {
      this.$refs.userForm.resetFields();
    },
    //删除用户
    deleteUser(index) {
      console.log(this.userPageData[index].id);
      deleteById({ id: this.userPageData[index].id }).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.getUserPageData();
        }
      });
    }
  },
  created() {
    this.getUserPageData();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>