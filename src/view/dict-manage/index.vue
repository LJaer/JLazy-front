<template>
  <div>
    <Row>
      <Col span="5" class-name="left">
        <Button @click="showAddDitc" type="primary" icon="md-add">添加字典</Button>
        <tables class="dictlist" ref="tables" v-model="dictlistData" :dictlist="dictlist" />
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
      </Form>
      <div slot="footer">
        <Button type="text" @click="dictModalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitDict">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getDictAll, addDict } from "@/api/dict";
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
      },
      dictlist: [
        { title: "Name", key: "name", sortable: true },
        { title: "Email", key: "email", editable: true },
        { title: "Create-Time", key: "createTime" },
        {
          title: "Handle",
          key: "handle",
          options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?"
                  },
                  on: {
                    "on-ok": () => {
                      vm.$emit("on-delete", params);
                      vm.$emit(
                        "input",
                        params.dictlistData.filter(
                          (item, index) => index !== params.row.initRowIndex
                        )
                      );
                    }
                  }
                },
                [h("Button", "自定义删除")]
              );
            }
          ]
        }
      ],
      dictlistData: [{ title: 1 }]
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
          this.submitLoading = true;
          //插入
          if (this.modalType == 0) {
            // 添加 避免编辑后传入id等数据 记得删除
            delete this.dictForm.id;
            addDict(this.dictForm).then(res => {
              this.submitLoading = false;
              if (res.data.data) {
                this.$Message.success("操作成功");
                // this.getAllDict();
                this.dictModalVisible = false;
              }
            });
          }
          //更新
          else if (this.modalType == 1) {
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
    },
    handleDelete(params) {
      console.log(params);
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