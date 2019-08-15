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
              <Option value="1">可用</Option>
              <Option value="0">不可用</Option>
            </Select>
          </Form-item>
        </Row>

        <Row>
          <Form-item label="创建开始时间" prop="createTimeStart">
            <Input
              type="text"
              v-model="pageQueryParams.createTimeStart"
              placeholder="请输入创建开始时间"
              clearable
              style="width: 150px"
              @on-enter
            />
          </Form-item>

          <Form-item label="创建结束时间" prop="createTimeEnd">
            <Input
              type="text"
              v-model="pageQueryParams.createTimeEnd"
              placeholder="请输入创建结束时间"
              clearable
              style="width: 150px"
              @on-enter
            />
          </Form-item>

          <Form-item style="margin-left:-85px;" class="br">
            <Button @click="getUserPageData" type="primary" icon="ios-search">搜索</Button>
            <Button @click type="primary" style="margin-left:10px">重置</Button>
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
          <Button type="text" size="small" style="margin-right: 5px; color:#5cadff;" @click>角色权限</Button>
          <Button type="text" size="small" style="margin-right: 5px; color:#5cadff;" @click>编辑</Button>
          <Button type="text" size="small" @click style="color:#5cadff;">删除</Button>
        </template>
      </Table>
    </Row>
  </div>
</template>

<script>
import { getByPageQueryDTO } from "@/api/user";
export default {
  components: {},
  props: {},
  data() {
    return {
      //分页查询参数
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
        }
      ],
      userPageData: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    //获取用户分页数据
    getUserPageData() {
      getByPageQueryDTO(this.pageQueryParams).then(res => {
        this.userPageData = res.data.data.records;
        console.log(res);
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