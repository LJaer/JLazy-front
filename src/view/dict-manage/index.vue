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
        <Table
          :columns="dictlist"
          :data="dictlistData"
          style="margin-top: 10px;"
          height="700"
          @on-row-click="changeCurSelectDict"
          :row-class-name="dictRowClassName"
        >
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="text"
              size="small"
              style="margin-right: 5px; color:#5cadff;"
              @click="showEditDict(index)"
            >修改</Button>
            <Button type="text" size="small" @click="delDict(index)" style="color:#5cadff;">删除</Button>
          </template>
        </Table>
      </Col>

      <Col span="1" class-name="center">
        <Icon class="center-button" type="md-arrow-dropleft" size="30" />
      </Col>

      <!-- 字典数据 -->
      <Col span="14" class-name="right">
        <Form
          ref="searchForm"
          :model="searchForm"
          inline
          :label-width="60"
          class="search-form"
          onsubmit="return false;"
          style=" margin-top: 10px; height: 45px;"
        >
          <Form-item label="数据名称" prop="name">
            <Input
              type="text"
              v-model="searchForm.name"
              placeholder="请输入"
              clearable
              style="width: 100px"
              @on-enter="refreshDictDataListDate"
            />
          </Form-item>
          <Form-item label="状态" prop="isAvailable">
            <Select
              v-model="searchForm.isAvailable"
              placeholder="请选择"
              clearable
              style="width: 200px"
              @on-change="refreshDictDataListDate"
            >
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="refreshDictDataListDate" type="primary" icon="ios-search">搜索</Button>
            <Button @click="dictDataSearchReset" type="primary" style="margin-left:10px">重置</Button>
          </Form-item>
        </Form>

        <Row class="dictDataOperation">
          <Button @click="addDictData" type="primary" icon="md-add">添加数据</Button>
          <Button @click type="error" icon="md-trash" style="margin-left:10px">批量删除</Button>
          <Button @click type="primary" icon="md-refresh" style="margin-left:10px">刷新数据</Button>
        </Row>

        <Row>
          <Table
            :columns="dictDataList"
            :data="dictDataListData"
            style="margin-top: 10px;"
            height="650"
          >
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="text"
                size="small"
                style="margin-right: 5px;color:#5cadff;"
                @click="showEditDict(index)"
              >修改</Button>
              <Button type="text" size="small" style="color:#5cadff;" @click="alert('删除')">删除</Button>
            </template>
          </Table>
        </Row>
        <Row>
          <Page
            :total="searchForm.total"
            show-total
            :page-size="searchForm.pageSize"
            :current="searchForm.page"
            show-elevator
            show-sizer
            style="margin-top:5px;padding-left:300px;"
            @on-change="dictDataPageIndexChange"
            @on-page-size-change="dictDataPageSizeChange"
          />
        </Row>
      </Col>
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
  deleteById,
  getPageByCondition
} from "@/api/dict";
import Tables from "_c/tables";
import moment from "moment";

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
        { title: "操作", width: 150, slot: "action", width: "130" }
      ],
      dictlistData: [],
      dictDataList: [
        { title: "序号", key: "index", width: "70", type: "index" },
        { title: "数据名称", key: "name" },
        { title: "数据编码", key: "code" },
        { title: "描述", key: "description" },
        { title: "排序值", key: "sortOrder", sortable: true, width: "90" },
        {
          title: "状态",
          key: "isAvailable",
          render: (h, params) => {
            if (params.row.isAvailable == 1) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "正常启用"
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
          },
          width: "150"
        },
        { title: "操作", width: 150, slot: "action" }
      ],
      dictDataListData: [],
      // 字典数据查询参数
      searchForm: {
        name: "",
        isAvailable: "",
        page: 1,
        pageSize: 10,
        total: 0
      },
      // 当前选中的Dict
      curSelectDict:{
        index: -1
      } 
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
    showEditDict(index) {
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
    refreshDictDataListDate() {
      getPageByCondition(this.searchForm).then(request => {
        this.dictDataListData = request.data.data.records;
        this.searchForm.total = request.data.data.total;
        this.searchForm.page = request.data.data.current;
        this.searchForm.pageSize = request.data.data.size;
      });
    },
    dictDataSearchReset() {
      this.$refs.searchForm.resetFields();
      refreshDictDataListDate();
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
    },
    // 页数改变
    dictDataPageIndexChange(index) {
      this.searchForm.page = index;
      this.refreshDictDataListDate();
    },
    // 页面大小改变
    dictDataPageSizeChange(size) {
      this.searchForm.pageSize = size;
      this.refreshDictDataListDate();
    },
    // 字典数据新增
    dictdataAdd() {
      his.modalType = 0;
      this.$refs.dictForm.resetFields();
      this.dictModalTitle = "添加字典 消息类型(message_type) 的数据";
      this.dictModalVisible = true;
    },
    addDictData() {
      alert("1231");
    },
    // 当前选中的dict
    changeCurSelectDict(data,index){
      data.index=this.curSelectDict.index;
      this.curSelectDict=data;
      if(index === this.curSelectDict.index){
        this.curSelectDict.index=-1;
        this.searchForm.dictId=null;
      }else{
        this.curSelectDict.index=index;
        this.searchForm.dictId=data.id;
      }
      
      this.refreshDictDataListDate();
    },
    dictRowClassName(row,index){
      if(this.curSelectDict.index===-1){
        return '';
      }
      if (index === this.curSelectDict.index) {
                    return 'dict-row-table-select-row';
                }
                return '';
    }	
  },
  created() {
    this.refreshDictListDate();
    this.refreshDictDataListDate();
  },
  mounted() {}
};
</script>
<style lang="less">
@import "./dictManage.less";
</style>