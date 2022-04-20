<template>
  <div class="appeal">
    <div class="achievement-search">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="marbotom">
            <span>学生手机号</span>
          </div>
          <el-input
            clearable
            v-model.trim="studentPhone"
            placeholder="请输入"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <div class="marbotom">
            <span>学生ID</span>
          </div>
          <el-input
            clearable
            v-model.trim="studentId"
            placeholder="请输入"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <div class="marbotom">
            <span>支付金额</span>
          </div>
          <el-input
            clearable
            v-model.trim="paymentMoney"
            placeholder="请输入"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <div class="marbotom">
            <span>支付时间：</span>
          </div>
          <el-date-picker
            v-model="paymentTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="marbotom">
            <span>课程名称</span>
          </div>
          <el-input
            clearable
            v-model.trim="appealProjectName"
            placeholder="请输入"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <div class="marbotom">
            <span>课程ID</span>
          </div>
          <el-input
            clearable
            v-model.trim="appealProjectId"
            placeholder="请输入"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <div class="marbotom">
            <span>订单号</span>
          </div>
          <el-input
            clearable
            v-model.trim="appealOrderId"
            placeholder="请输入"
          ></el-input>
        </el-col>
        <el-col :span="6" class="serach-button">
          <el-button @click="resoleveBtn">重置</el-button>
          <el-button
            class="btn-search"
            type="primary"
            @click="searchTable"
            color="#fc5b08"
            style="color: white"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div class="achievement-tabel">
      <el-table :data="roleTable.rows" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100" fixed />
        <el-table-column prop="orderId" label="订单号" width="250" />
        <el-table-column prop="commodityName" label="课程名称" width="200" />
        <el-table-column prop="commodityId" label="课程ID" width="180" />
        <el-table-column prop="staffName" label="业绩归属人" width="180" />
        <el-table-column prop="channelId" label="订单渠道" />
        <el-table-column prop="userName" label="学生姓名" width="170" />
        <el-table-column prop="mobile" label="学生手机号" width="180" />
        <el-table-column prop="userId" label="学生ID" width="120" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click.prevent="showOrderDialog(scope.row)"
            >
              业绩申诉
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next,sizes,jumper"
        :total="roleTable.total"
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        class="table-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="业绩申诉"
    width="570"
    :before-close="handleClose"
  >
    <div class="text">
      <span class="dialog-label">订单号：</span>
      {{ currentOrder.orderId }}
    </div>
    <div class="text">
      <span class="dialog-label">课程名称：</span>
      {{ currentOrder.commodityName }}
    </div>
    <div class="text">
      <span class="dialog-label">课程ID：</span>
      {{ currentOrder.commodityId }}
    </div>
    <div class="text">
      <span class="dialog-label">学生手机号：</span>
      {{ currentOrder.mobile }}
    </div>
    <div class="text">
      <span class="dialog-label">学生ID：</span>
      {{ currentOrder.userId }}
    </div>
    <div class="text">
      <span class="dialog-label">当前归属：</span>
      {{ currentOrder.staffName }}
    </div>
    <div class="text">
      <span class="dialog-label">申请调整归属：</span>
      {{ currentOrder.orderId }}
    </div>
    <div class="text">
      <span class="dialog-label">上传凭证</span>
      {{ currentOrder.orderId }}
    </div>
    <el-upload
      ref="uploadRef"
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :auto-upload="false"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-change="onFileChange"
    >
      <el-icon><plus /></el-icon>
    </el-upload>

    <el-dialog v-model="isProviewImage">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >提交</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "@/store";
import { amtResp } from "@/service/achievement/system";
import { ElMessage } from "element-plus";
import {
  getOssSign,
  uploadImage,
  uploadImageHandle
} from "@/service/achievement/system/index";
const OSS = require("ali-oss");
export default defineComponent({
  name: "detalis",
  components: {},
  setup() {
    const store = useStore();
    onMounted(() => {
      let myDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
      let endVar = myDate.toJSON().split("T").join(" ").substr(0, 10);
      let starVar = myDate.toJSON().split("T").join(" ").substr(0, 7);
      console.log("当前时间", starVar);
      let arrsDate = [`${starVar}-01`, endVar];
      paymentTime.value = arrsDate;
    });
    // 申诉订单弹窗显示状态
    const dialogVisible = ref(true);
    let currentOrder = reactive<Record<string, any>>({});
    // 上传图片相关
    const fileList = ref<Record<string, string>[]>([]);
    const isProviewImage = ref(false);
    const uploadRef = ref(null);
    const dialogImageUrl = ref('');
    const onFileChange = async (file: any) => {
      console.log(file);
      // try {
      //   const { data, code } = await getOssSign();
      //   if (code === "1") {
      //     console.log(data);
      //     const formData = new FormData();
      //     formData.append("key", data.dir + file.uid + "_" + file.name); // 存储在oss的文件路径
      //     formData.append("dir", data.dir); // 存储在oss的文件路径
      //     formData.append("accessid", data.accessid); // accessKeyId
      //     formData.append("policy", data.policy); // policy
      //     formData.append("signature", data.signature); // 签名

      //     // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
      //     formData.append("file", file.raw);
      //     // uploadImage({
      //     //   host: "https://" + data.host,
      //     //   data: formData
      //     // });
      //     const { data, code } = await uploadImageHandle(formData);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }

      const formData = new FormData();
      // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
      formData.append("file", file.raw);
      const { data, code } = await uploadImageHandle(formData);
      if (code === "1") {
        fileList.value.push({ name: data.originName, url: data.url });
      }
    };
    const handleRemove = (data: { url: string }) => {
      fileList.value.splice(fileList.value.findIndex(item => item.url === data.url), 1)
    };
    const handlePictureCardPreview = (data: any) => {
      isProviewImage.value = true
      dialogImageUrl.value = data.url
      console.log(data);
    };

    // 搜索组件相关
    const studentPhone = ref("");
    const studentId = ref("");
    const paymentMoney = ref("");
    const paymentTime = ref<any>([]);
    const appealProjectName = ref("");
    const appealProjectId = ref("");
    const appealOrderId = ref("");
    // 搜索事件
    const searchTable = () => {
      if (!studentPhone.value.length && !appealOrderId.value.length) {
        return ElMessage({
          message: "学生手机号或订单号不能为空",
          type: "error"
        });
      }
      store.dispatch("achievement/getAppealPerformance", {
        beginDate: "2022-04-15",
        commodityId: null,
        commodityName: null,
        endDate: "2022-04-15",
        maxMoney: 3.01,
        minMoney: 0.01,
        mobile: "17600059053",
        orderId: null,
        pageNo: currentPage.value,
        pageSize: pageSize.value,
        userId: 6178597
      });
    };
    // 重置事件
    const resoleveBtn = () => {};
    // 表格相关
    let roleTable = computed(
      () => (store.state.achievement as any)[`appealPerformance`]
    );
    // 切换分页
    const currentPage = ref(1);
    const pageSize = ref(20);
    const handleSizeChange = (val: number) => {
      searchTable();
    };
    // 切换分页每页条数
    const handleCurrentChange = (val: number) => {
      console.log(`current page: ${val}`);
      currentPage.value = val;
      searchTable();
    };
    const indexMethod = (index: number) => {
      // return index * pageSize.value + 1;
    };
    // 显示订单弹窗
    const showOrderDialog = (data: Record<string, any>) => {
      Object.assign(currentOrder, data);
      dialogVisible.value = true;
    };
    return {
      roleTable,
      handleCurrentChange,
      handleSizeChange,
      currentPage,
      pageSize,
      studentId,
      studentPhone,
      paymentMoney,
      paymentTime,
      appealProjectName,
      appealProjectId,
      appealOrderId,
      resoleveBtn,
      searchTable,
      indexMethod,
      dialogVisible,
      showOrderDialog,
      currentOrder,
      fileList,
      isProviewImage,
      uploadRef,
      onFileChange,
      handleRemove,
      handlePictureCardPreview,
      dialogImageUrl
    };
  }
});
</script>

<style lang="less">
.appeal {
  .achievement-search {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    .el-range-editor.el-input__inner {
      width: 100%;
    }
    .el-input {
      width: 100%;
    }
    .el-row {
      margin-bottom: 0px;
      .el-col {
        margin-bottom: 20px;
      }
    }
    .el-select {
      width: 100%;
    }
    .marbotom {
      margin-bottom: 6px;
      color: #858ebd;
    }
    .serach-button {
      margin-top: 23px;
      text-align: right;
      .btn-search {
        margin-right: 10px;
      }
      .el-button {
        width: 130px;
        margin-right: 10px;
        border: 1px solid #bbc1dd;
      }
    }
    .search-desc {
      padding-top: 24px;
      line-height: 40px;
      font-size: 14px;
      color: #4f61fe;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .achievement-tabel {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 15px;

    .hover-table {
      cursor: pointer;
      color: #92a0ff;
    }
    .header {
      display: flex;
      justify-content: right;
      align-items: baseline;
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
    }
    .table-title {
      flex: 1;
      font-weight: bold;
      color: #3a3f63;
      font-size: 14px;
    }
    .mar-right {
      margin-right: 20px;
    }
  }
  .table-pagination {
    text-align: right;
    margin-top: 20px;
    .btn-prev {
      text-align: center;
    }
  }
  .el-pagination .btn-next .el-icon {
    display: contents !important;
  }
  .el-pagination .btn-prev .el-icon {
    display: contents !important;
  }
  .el-pagination.is-background .el-pager li,
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev {
    background-color: #ffffff;
    border: 1px solid #bbc1dd;
    color: #6a74a5;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #bbc1dd;
    color: #ffffff;
  }
  .el-pagination__jump {
    margin-left: 0;
  }
  .el-pagination {
    --el-pagination-hover-color: #6a74a5;
  }
}
.text {
  margin-bottom: 22px;
  .dialog-label {
    font-size: 14px;
    color: #858ebd;
  }

}
</style>
