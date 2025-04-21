<template>
  <div class="friendly-container">
    <div class="operation-bar">
      <el-button type="primary" @click="openCreateDialog">
        <el-icon> <Plus /> </el-icon>新建链接
      </el-button>
    </div>
    <div class="card">
      <el-table :data="linkList" style="width: 100%">
        <el-table-column prop="name" label="网站名称" min-width="120">
          <template #default="{ row }">
            <div class="link-name">
              <el-image v-if="row.logo" :src="row.logo" class="link-logo" fit="cover" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="网站链接" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" :href="row.url" target="_blank">{{ row.url }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="网站描述" min-width="300">
          <template #default="{ row }">
            <el-tooltip :content="row.description" placement="top" :show-after="500">
              <div class="description-text">{{ row.description }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新建链接对话框 -->
    <el-dialog v-model="dialogVisible" title="新建友情链接" width="50%" :before-close="handleClose">
      <el-form :model="newLink" label-width="80px">
        <el-form-item label="友链名称">
          <el-input v-model="newLink.name" placeholder="请输入友情链接名称" />
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="newLink.url" placeholder="请输入网址" />
        </el-form-item>
        <el-form-item label="友链介绍">
          <el-input
            v-model="newLink.description"
            type="textarea"
            :rows="4"
            placeholder="请输入友情链接介绍"
          />
        </el-form-item>
        <el-form-item label="友链logo">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <img v-if="newLink.logo" :src="newLink.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitLink">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElIcon, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import useLinkStore from '@/store/link/link.ts'
import { uploadImage } from '@/service/information/information.ts'

const linkStore = useLinkStore()
const { linkList } = storeToRefs(linkStore)

// 初始化加载数据
linkStore.getLinkListAction()

const dialogVisible = ref(false)
const newLink = ref({
  name: '',
  logo: '',
  description: '',
  url: ''
})

const openCreateDialog = () => {
  dialogVisible.value = true
  newLink.value = {
    name: '',
    logo: '',
    description: '',
    url: ''
  }
}

const handleClose = (done: () => void) => {
  ElMessage({
    type: 'info',
    message: '已取消创建'
  })
  done()
}

const handleImageChange = async (file: any) => {
  try {
    // 显示上传中提示
    ElMessage({
      type: 'info',
      message: '图片上传中...'
    })

    // 调用上传图片的服务函数
    const result = await uploadImage(file.raw)

    // 假设后端返回的图片URL在 result.data.data 中
    newLink.value.logo = result.data.data

    ElMessage({
      type: 'success',
      message: '图片上传成功'
    })
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage({
      type: 'error',
      message: '图片上传失败，请重试'
    })
  }
}

const submitLink = async () => {
  if (!newLink.value.name || !newLink.value.url) {
    ElMessage({
      type: 'warning',
      message: '请填写完整信息'
    })
    return
  }

  try {
    // 调用 store 中的 action 创建资讯
    await linkStore.addLinkAction({
      name: newLink.value.name,
      logo: newLink.value.logo || '',
      url: newLink.value.url,
      description: newLink.value.description
    })

    ElMessage({
      type: 'success',
      message: '创建成功'
    })
    dialogVisible.value = false
    // 刷新列表
    linkStore.getLinkListAction()
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '创建失败，请稍后重试'
    })
    console.error('创建资讯失败:', error)
  }
}

interface LinkItem {
  name: string
  logo: string
  url: string
  description: string
}

// 删除链接
const handleDelete = (row: LinkItem) => {
  ElMessageBox.confirm('确认删除该友情链接吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 调用删除API
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped lang="less">
.friendly-container {
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

  .link-name {
    display: flex;
    align-items: center;
    gap: 10px;

    .link-logo {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }
  }

  .description-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
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
