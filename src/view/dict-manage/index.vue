<template>
  <div>
    <Row>
      <Col span="9" class-name="left">
        <Input
          search
          enter-button
          placeholder="请输入字典名称"
          v-model="queryVagueName"
          @on-search="queryByVagueName"
          style="width:300px; float:left;"
        />
        <Button @click="showAddDict" type="primary" icon="md-add" style="margin-left:10px;">添加字典</Button>
        <Table :columns="dictlist" :data="dictlistData" style="margin-top: 10px;" height="700">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="showEditDcit(index)"
            >修改</Button>
            <Button type="error" size="small" @click="delDict(index)">删除</Button>
          </template>
        </Table>
      </Col>
      <Col span="1" class-name="center">
        <Icon class="center-button" type="md-arrow-dropleft" size="30" />
      </Col>
      <Col span="14" class-name="right">col-113132</Col>
    </Row>

    <!-- 添加或更新字典 -->
    <Modal
      :title="dictModalTitle"
      v-model="dictModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '300px'}"
    >
      <Form ref="dictForm" :model="dictForm" :label-width="75" :rules="dictFormValidate">
        <FormItem label="字典名称" prop="name">
          <Input v-model="dictForm.name" />
        </FormItem>
        <FormItem label="字典code" prop="code">
          <Tooltip placement="right" :max-width="220" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
            <Input v-model="dictForm.code" />
          </Tooltip>
        </FormItem>
        <FormItem label="备注" prop="description">
          <Input v-model="dictForm.description" />
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <InputNumber :max="1000" :min="0" v-model="dictForm.sortOrder"></InputNumber>
          <span style="margin-left:5px">值越小越靠前，支持小数</span>
        </FormItem>
        <FormItem label="是否启用" prop="isAvailable">
          <i-switch size="large" v-model="dictForm.isAvailable" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="dictModalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitDict">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getDictAll,
  saveOrUpdateDict,
  queryByVagueName,
  deleteById
} from "@/api/dict";
import Tables from "_c/tables";

export default {
  components: {
    Tables
  },
  props: {},
  data() {
    return {
      submitLoading: false, // 添加或编辑提交状态
      modalType: 0, // 添加或编辑标识
      dictModalTitle: "",
      dictModalVisible: false,
      queryVagueName: "", //字典表模糊查询条件
      dictEditTitle: "", // 编辑标题
      dictEditVisible: false, // 添加或编辑显示
      dictForm: {
        id: null,
        name: "",
        code: "",
        description: "",
        sortOrder: 0,
        isAvailable: 1
      },
      dictFormValidate: {
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        code: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      dictlist: [
        { title: "名称", key: "name", sortable: true },
        { title: "编码", key: "code" },
        { title: "描述", key: "description" },
        { title: "操作", width: 150, slot: "action" }
      ],
      dictlistData: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    showAddDict() {
      this.modalType = 0;
      this.$refs.dictForm.resetFields();
      this.dictModalTitle = "添加字典";
      this.dictModalVisible = true;
    },
    showEditDcit(index) {
      this.modalType = 1;
      this.$refs.dictForm.resetFields();
      this.dictModalTitle = "编辑字典";
      this.dictModalVisible = true;
      this.dictForm = this.dictlistData[index];
    },
    handelSubmitDict() {
      this.$refs.dictForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          //插入
          if (this.modalType == 0) {
            // 添加 避免编辑后传入id等数据 记得删除
            delete this.dictForm.id;
            saveOrUpdateDict(this.dictForm).then(res => {
              this.submitLoading = false;
              if (res.data.data) {
                this.$Message.success("操作成功");
                this.refreshDictListDate();
                this.dictModalVisible = false;
              }
            });
          }
          //更新
          else if (this.modalType == 1) {
            // 编辑
            saveOrUpdateDict(this.dictForm).then(res => {
              this.submitLoading = false;
              console.log(res);
              if (res.data.data) {
                this.$Message.success("操作成功");
                this.refreshDictListDate();
                this.dictModalVisible = false;
              }
            });
          }
        }
      });
    },
    handleDelete(params) {
      console.log(params);
    },
    refreshDictListDate() {
      getDictAll().then(request => {
        this.dictlistData = request.data.data;
      });
    },
    /**
     * 根据字典名称查询
     */
    queryByVagueName() {
      queryByVagueName({ name: this.queryVagueName }).then(request => {
        this.dictlistData = request.data.data;
      });
    },
    /**
     * 根据id删除字典
     */
    delDict(index) {
      deleteById({ id: this.dictlistData[index].id }).then(res => {
        if (res.data.data) {
          this.$Message.success("操作成功");
          this.refreshDictListDate();
        }
      });
    }
  },
  created() {
    this.refreshDictListDate();
  },
  mounted() {}
};
</script>
<style lang="less">
@import "./dictManage.less";
</style>