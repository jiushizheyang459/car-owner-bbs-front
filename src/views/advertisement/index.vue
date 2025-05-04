<template>
  <div class="advertisement-container">
    <div class="operation-bar">
      <el-button type="primary" @click="openCreateDialog" v-permission="'content:advertisement:add'">
        <el-icon> <Plus /> </el-icon>新建广告
      </el-button>
    </div>
    <div class="card">
      <el-table :data="advertisementList" style="width: 100%">
        <el-table-column prop="title" label="广告标题" min-width="120">
          <template #default="{ row }">
            {{ row.title || '暂无标题' }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="广告内容" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.content || '暂无内容'" placement="top" :show-after="500">
              <div class="content-text">{{ row.content || '暂无内容' }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="img" label="广告图片" min-width="120">
          <template #default="{ row }">
            <div v-if="row.img" class="thumbnail-cell" @click="showPreview(row.img)">
              <el-image :src="row.img" class="advertisement-image" fit="cover" />
              <div class="preview-hint">点击查看大图</div>
            </div>
            <span v-else>暂无广告图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="广告优先级" width="100">
          <template #default="{ row }">
            {{ row.priority || '暂无广告优先级' }}
          </template>
        </el-table-column>
        <el-table-column prop="link" label="跳转链接" min-width="200">
          <template #default="{ row }">
            <el-link v-if="row.link" type="primary" :href="row.link" target="_blank">{{ row.link }}</el-link>
            <span v-else>暂无跳转链接</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.description || '暂无描述'" placement="top" :show-after="500">
              <div class="content-text">{{ row.description || '暂无描述' }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="200">
          <template #default="{ row }">
            <div class="time-info">
              <div>开始：{{ row.startTime ? formatDate(row.startTime) : '暂未设置' }}</div>
              <div>结束：{{ row.endTime ? formatDate(row.endTime) : '暂未设置' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'info'">
              {{ row.status === 0 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="openEditDialog(row)"
              v-permission="'content:advertisement:update'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              v-permission="'content:advertisement:delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="sizes, prev, pager, next, total"
          :total="advertisementTotalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新建/编辑广告对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑广告' : '新建广告'"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="advertisementForm" label-width="80px">
        <el-form-item label="广告标题">
          <el-input v-model="advertisementForm.title" placeholder="请输入广告标题" />
        </el-form-item>
        <el-form-item label="广告内容">
          <el-input v-model="advertisementForm.content" type="textarea" :rows="4" placeholder="请输入广告内容" />
        </el-form-item>
        <el-form-item label="优先等级">
          <el-input v-model="advertisementForm.priority" placeholder="请输入广告优先级（越小越靠前）" />
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="advertisementForm.link" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="广告图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <img v-if="advertisementForm.img" :src="advertisementForm.img" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="advertisementForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="advertisementForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="advertisementForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdvertisement">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" title="广告图片预览" width="50%" :show-close="true">
      <div class="preview-container">
        <img :src="currentPreviewImage" alt="大图预览" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElIcon, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import useAdvertisementStore from '@/store/advertisement/advertisement'
import useUploadStore from '@/store/upload/upload'
import type { IAddAdvertisement, IUpdateAdvertisement } from '@/store/advertisement/type'
import { formatDate } from '@/utils/date'

//region 分页部分
const currentPage = ref(1)
const pageSize = ref(5)

function handleSizeChange() {
  fetchAdvertisementListData()
}

function handleCurrentChange() {
  fetchAdvertisementListData()
}

function fetchAdvertisementListData() {
  const size = pageSize.value
  const pageNum = currentPage.value
  advertisementStore.getAdvertisementListAction(pageNum, size)
}
//endregion

const advertisementStore = useAdvertisementStore()
const uploadStore = useUploadStore()
const { advertisementList, advertisementTotalCount } = storeToRefs(advertisementStore)

// 初始化加载数据
fetchAdvertisementListData()

const dialogVisible = ref(false)
const isEdit = ref(false)
const advertisementForm = reactive<IAddAdvertisement & { id?: number }>({
  title: '',
  content: '',
  img: '',
  priority: 10,
  link: '',
  startTime: '',
  endTime: '',
  status: 1
})

const openCreateDialog = () => {
  isEdit.value = false
  dialogVisible.value = true
  Object.assign(advertisementForm, {
    title: '',
    content: '',
    img: '',
    priority: '',
    link: '',
    startTime: '',
    endTime: '',
    status: 0
  })
}

const openEditDialog = (row: IUpdateAdvertisement) => {
  isEdit.value = true
  dialogVisible.value = true
  Object.assign(advertisementForm, {
    id: row.id,
    title: row.title,
    content: row.content,
    img: row.img,
    priority: row.priority,
    link: row.link,
    startTime: row.startTime,
    endTime: row.endTime,
    status: row.status
  })
}

const handleClose = (done: () => void) => {
  ElMessage({
    type: 'info',
    message: '已取消操作'
  })
  done()
}

const handleImageChange = async (file: any) => {
  try {
    ElMessage({
      type: 'info',
      message: '图片上传中...'
    })

    const imageUrl = await uploadStore.uploadImageAction(file.raw)
    if (imageUrl) {
      advertisementForm.img = imageUrl
      ElMessage({
        type: 'success',
        message: '图片上传成功'
      })
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '图片上传失败，请重试'
    })
  }
}

const submitAdvertisement = async () => {
  if (!advertisementForm.title) {
    ElMessage({
      type: 'warning',
      message: '请填写广告标题'
    })
    return
  }

  try {
    if (isEdit.value) {
      await advertisementStore.updateAdvertisementAction(advertisementForm as IUpdateAdvertisement)
    } else {
      await advertisementStore.addAdvertisementAction(advertisementForm)
    }

    ElMessage({
      type: 'success',
      message: isEdit.value ? '更新成功' : '创建成功'
    })
    dialogVisible.value = false
    // 刷新列表
    fetchAdvertisementListData()
  } catch (error) {
    ElMessage({
      type: 'error',
      message: isEdit.value ? '更新失败，请稍后重试' : '创建失败，请稍后重试'
    })
    console.error('操作失败:', error)
  }
}

const handleDelete = (row: IUpdateAdvertisement) => {
  ElMessageBox.confirm('确认删除该广告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await advertisementStore.deleteAdvertisementAction([row.id])
      ElMessage.success('删除成功')
      fetchAdvertisementListData()
    } catch (error) {
      ElMessage.error('删除失败，请稍后重试')
      console.error('删除失败:', error)
    }
  })
}

// 图片预览相关
const previewVisible = ref(false)
const currentPreviewImage = ref('')

const showPreview = (img: string) => {
  currentPreviewImage.value = img
  previewVisible.value = true
}
</script>

<style scoped lang="less">
.advertisement-container {
  width: 1000px;
  margin: 0 auto;

  .operation-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .card {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .content-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }

  .advertisement-image {
    width: 100px;
    height: 60px;
    border-radius: 4px;
  }

  // 上传组件样式
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
    object-fit: cover;
  }

  .pagination {
    //margin-bottom: 20px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .thumbnail-cell {
    width: 100px;
    height: 60px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      .preview-hint {
        opacity: 1;
      }
    }

    .advertisement-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-hint {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-size: 12px;
    }
  }

  .time-info {
    font-size: 14px;
    color: #606266;

    > div {
      line-height: 1.5;
    }
  }

  .preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .preview-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }
  }
}

:deep(.el-table) {
  .el-table__row {
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>
