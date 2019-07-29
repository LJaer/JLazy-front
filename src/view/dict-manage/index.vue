<template>
  <div>
    <Row>
      <Col span="5" class-name="left">
        <Col>
          <Button @click="showAddDitc" type="primary" icon="md-add">添加字典</Button>
        </Col>
        <Col>
          <Row>
            <input placeholder="输入搜索字典" />
          </Row>
          <Row>查询</Row>
        </Col>
      </Col>
      <Col span="1" class-name="center">
        <Icon class="center-button" type="md-arrow-dropleft" size="30" />
      </Col>
      <Col span="18" class-name="right">col-113132</Col>
    </Row>

    <!-- 添加字典 -->
    <Modal
      :title="dictModalTitle"
      v-model="dictModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '300px'}"
    >
      <Form ref="dictForm" :model="dictForm" :label-width="75" :rules="dictFormValidate">
        <FormItem label="字典名称" prop="title">
          <Input v-model="dictForm.title" />
        </FormItem>
        <FormItem label="字典类型" prop="type">
          <Tooltip placement="right" :max-width="220" transfer content="建议英文名且需唯一 非开发人员谨慎修改">
            <Input v-model="dictForm.type" />
          </Tooltip>
        </FormItem>
        <FormItem label="备注" prop="description">
          <Input v-model="dictForm.description" />
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <InputNumber :max="1000" :min="0" v-model="dictForm.sortOrder"></InputNumber>
          <span style="margin-left:5px">值越小越靠前，支持小数</span>
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
import { getDictAll,addDict } from "@/api/dict";

export default {
  components: {},
  props: {},
  data() {
    return {
      submitLoading: false, // 添加或编辑提交状态
      modalType: 0, // 添加或编辑标识
      dictModalTitle: "",
      dictModalVisible: false,
      dictForm: {
        title: "",
        type: "",
        description: "",
        sortOrder: 0
      },
      dictFormValidate: {
        // 表单验证规则
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        type: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    showAddDitc() {
      this.modalType = 0;
      this.dictModalTitle = "添加字典";
      this.$refs.dictForm.resetFields();
      this.dictModalVisible = true;
    },
    handelSubmitDict() {
      this.$refs.dictForm.validate(valid => {
        if (valid) {
          console.log("添加字典")
          this.submitLoading = true;
          if (this.modalType == 0) {
            // 添加 避免编辑后传入id等数据 记得删除
            delete this.dictForm.id;
            console.log("添加字典1")
            console.log(this.dictForm)
            console.log(this.dictForm.sortOrder)
            addDict(this.dictForm).then(res => {
              this.submitLoading = false;
              console.log("添加字典2")
              if (res.success) {
                this.$Message.success("操作成功");
                this.getAllDict();
                this.dictModalVisible = false;
              }
            });
          } else if (this.modalType == 1) {
            // 编辑
            editDict(this.dictForm).then(res => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("操作成功");
                this.getAllDict();
                this.dictModalVisible = false;
              }
            });
          }
        }
      });
    }
  },
  created() {
    getDictAll().then(request => {
      //console.log(response.data.status)
      console.log(request.data.data);
    });
  },
  mounted() {}
};
</script>
<style lang="less">
@import "./dictManage.less";
</style>