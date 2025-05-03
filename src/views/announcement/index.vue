<template>
  <div class="announcement-container">
    <div class="operation-bar">
      <el-button type="primary" @click="openCreateDialog" v-permission="'content:announcement:add'">
        <el-icon>
          <Plus />
        </el-icon>新建公告
      </el-button>
    </div>
    <div class="card">
      <el-table :data="announcementList" style="width: 100%">
        <el-table-column prop="title" label="公告标题" min-width="200">
          <template #default="{ row }">
            {{ row.title || '暂无标题' }}
          </template>
        </el-table-column>
        <el-table-column prop="creatDate" label="创建时间" min-width="150">
          <template #default="{ row }">
            {{ row.creatDate ? formatDate(row.creatDate) : '暂未设置' }}
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
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openEditDialog(row)"
              v-permission="'content:announcement:update'">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"
              v-permission="'content:announcement:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
          layout="sizes, prev, pager, next, total" :total="announcementTotalCount" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 新建/编辑公告对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑公告' : '新建公告'" width="50%" :before-close="handleClose">
      <el-form :model="announcementForm" label-width="80px">
        <el-form-item label="公告标题">
          <el-input v-model="announcementForm.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="announcementForm.startTime" type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="announcementForm.endTime" type="datetime" placeholder="选择结束时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAnnouncement">确定</el-button>
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
import useAnnouncementStore from '@/store/announcement/announcement'
import type { IAddAnnouncement, IUpdateAnnouncement } from '@/store/announcement/type'
import { formatDate } from '@/utils/date'

//region 分页部分
const currentPage = ref(1)
const pageSize = ref(5)

function handleSizeChange() {
  fetchAnnouncementListData()
}

function handleCurrentChange() {
  fetchAnnouncementListData()
}

function fetchAnnouncementListData() {
  const size = pageSize.value
  const pageNum = currentPage.value
  announcementStore.getAnnouncementListAction(pageNum, size)
}
//endregion

const announcementStore = useAnnouncementStore()
const { announcementList, announcementTotalCount } = storeToRefs(announcementStore)

// 初始化加载数据
fetchAnnouncementListData()

const dialogVisible = ref(false)
const isEdit = ref(false)
const announcementForm = reactive<IAddAnnouncement & { id?: number }>({
  title: '',
  startTime: '',
  endTime: ''
})

const openCreateDialog = () => {
  isEdit.value = false
  dialogVisible.value = true
  Object.assign(announcementForm, {
    title: '',
    startTime: '',
    endTime: ''
  })
}

const openEditDialog = (row: IUpdateAnnouncement) => {
  isEdit.value = true
  dialogVisible.value = true
  Object.assign(announcementForm, {
    id: row.id,
    title: row.title,
    startTime: row.startTime,
    endTime: row.endTime
  })
}

const handleClose = (done: () => void) => {
  ElMessage({
    type: 'info',
    message: '已取消操作'
  })
  done()
}

const submitAnnouncement = async () => {
  if (!announcementForm.title) {
    ElMessage({
      type: 'warning',
      message: '请填写完整信息'
    })
    return
  }

  try {
    if (isEdit.value) {
      await announcementStore.updateAnnouncementAction(announcementForm as IUpdateAnnouncement)
    } else {
      await announcementStore.addAnnouncementAction(announcementForm)
    }

    ElMessage({
      type: 'success',
      message: isEdit.value ? '更新成功' : '创建成功'
    })
    dialogVisible.value = false
    // 刷新列表
    fetchAnnouncementListData()
  } catch (error) {
    ElMessage({
      type: 'error',
      message: isEdit.value ? '更新失败，请稍后重试' : '创建失败，请稍后重试'
    })
    console.error('操作失败:', error)
  }
}

const handleDelete = (row: IUpdateAnnouncement) => {
  ElMessageBox.confirm('确认删除该公告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await announcementStore.deleteAnnouncementAction([row.id])
      ElMessage.success('删除成功')
      fetchAnnouncementListData()
    } catch (error) {
      ElMessage.error('删除失败，请稍后重试')
      console.error('删除失败:', error)
    }
  })
}
</script>

<style scoped lang="less">
.announcement-container {
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

  .time-info {
    font-size: 14px;
    color: #606266;

    >div {
      line-height: 1.5;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
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
