<template>
  <div class="draft-container">
    <div class="draft-header">
      <h2>我的草稿箱</h2>
      <p>共 {{ draftTotalCount }} 篇草稿</p>
    </div>
    <div class="draft-list">
      <el-table :data="draftList" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="scope">
            <div class="title-cell" @click="openEditor(scope.row)">
              {{ scope.row.title || '无标题' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" width="120">
          <template #default="scope">
            <div v-if="scope.row.thumbnail" class="thumbnail-cell" @click="showPreview(scope.row.thumbnail)">
              <img :src="scope.row.thumbnail" alt="缩略图" />
              <div class="preview-hint">点击查看大图</div>
            </div>
            <span v-else>暂无缩略图</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容预览" min-width="300">
          <template #default="scope">
            <div class="content-preview">{{ stripHtml(scope.row.content) || '暂无内容' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'warning'">
              {{ scope.row.status === 0 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isComment" label="评论" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isComment === 1 ? 'primary' : 'info'">
              {{ scope.row.isComment === 1 ? '允许' : '禁止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditor(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteDraft(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        layout="sizes, prev, pager, next, total"
        :total="draftTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" title="缩略图预览" width="50%" :show-close="true">
      <div class="preview-container">
        <img :src="currentPreviewImage" alt="大图预览" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useArticleStore from '@/store/article/article.ts'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { stripHtml } from '@/utils/htmlUtils'

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)

function handleSizeChange() {
  fetchDraftListData()
}

function handleCurrentChange() {
  fetchDraftListData()
}

function fetchDraftListData() {
  const size = pageSize.value
  const pageNum = currentPage.value
  const info = { size, pageNum }
  articleStore.getDraftArticleListAction(info)
}

// 获取草稿列表数据
const articleStore = useArticleStore()
const { draftList, draftTotalCount } = storeToRefs(articleStore)

// 初始化加载数据
onMounted(() => {
  fetchDraftListData()
})

// 路由相关
const router = useRouter()

function openEditor(draft: any) {
  router.push({
    path: '/article/editor',
    query: { id: draft.id }
  })
}

function deleteDraft(draft: any) {
  ElMessageBox.confirm('确定要删除这篇草稿吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 调用删除文章的API
      const success = await articleStore.deleteArticleAction([draft.id])
      if (success) {
        // 重新加载数据
        fetchDraftListData()
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 图片预览相关
const previewVisible = ref(false)
const currentPreviewImage = ref('')

const showPreview = (imageUrl: string) => {
  currentPreviewImage.value = imageUrl
  previewVisible.value = true
}
</script>

<style scoped lang="less">
.draft-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 5px #ddd;
  padding: 20px;
}

.draft-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  h2 {
    font-size: 20px;
    font-weight: 600;
  }

  p {
    color: #909399;
  }
}

.draft-list {
  margin-bottom: 20px;
}

.title-cell {
  cursor: pointer;
  color: #1296db;

  &:hover {
    text-decoration: underline;
  }
}

.content-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}

.pagination {
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

  img {
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
</style>
