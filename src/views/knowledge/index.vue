<template>
  <div class="knowledge-container">
    <div class="operation-bar">
      <el-button type="primary" @click="openCreateDialog"
        ><el-icon> <Plus /> </el-icon>新建知识</el-button
      >
    </div>
    <div class="card">
      <el-row :gutter="10" style="margin-bottom: 10px; margin-top: 10px">
        <el-col :span="12" v-for="item in knowledgeList" :key="item.id" style="margin-bottom: 10px">
          <el-card shadow="hover" :body-style="{ padding: '0', height: '100%' }">
            <el-row>
              <el-col class="knowledge-img" :span="7">
                <el-image style="height: 100%; width: 100%" :src="item.thumbnail" fit="cover" />
              </el-col>
              <el-col :span="17" class="content-wrapper">
                <el-row class="knowledge-body" justify="space-between">
                  <!--                  <el-col>-->
                  <!--                    <div style="display: flex; align-items: center; justify-content: flex-start">-->
                  <!--                      <el-avatar size="small" :src="item.avater" />-->
                  <!--                      <el-text class="mx-1 author-text" size="large" tag="b">{{-->
                  <!--                        item.author-->
                  <!--                      }}</el-text>-->
                  <!--                    </div>-->
                  <!--                  </el-col>-->
                  <el-col style="margin-top: 5px">
                    <el-text class="mx-1 title-text" size="large" tag="b">{{ item.title }}</el-text>
                  </el-col>
                  <el-col style="margin-top: 5px; flex-grow: 1">
                    <el-text class="mx-1 content-text" size="large" tag="p">{{
                      item.content
                    }}</el-text>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[8, 16, 32]"
          layout="sizes, prev, pager, next, total"
          :total="knowledgeTotalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog v-model="dialogVisible" title="新建资讯" width="50%" :before-close="handleClose">
        <el-form :model="newKnowledge" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="newKnowledge.title" placeholder="请输入知识标题" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              v-model="newKnowledge.content"
              type="textarea"
              :rows="4"
              placeholder="请输入知识内容"
            />
          </el-form-item>
          <el-form-item label="缩略图">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleImageChange"
            >
              <img v-if="newKnowledge.thumbnail" :src="newKnowledge.thumbnail" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitKnowledge">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import useKnowledgeStore from '@/store/knowledge/knowledge.ts'
import { storeToRefs } from 'pinia'
import { Plus } from '@element-plus/icons-vue'
import { ElIcon, ElMessage } from 'element-plus'

const currentPage = ref(1)
const pageSize = ref(8)

function handleSizeChange() {
  fetchKnowledgeListData()
}
function handleCurrentChange() {
  fetchKnowledgeListData()
}

function fetchKnowledgeListData() {
  const size = pageSize.value
  const pageNum = currentPage.value
  const info = { size, pageNum }
  knowledgeStore.getKnowledgeListAction(info)
}

const knowledgeStore = useKnowledgeStore()

fetchKnowledgeListData()

const { knowledgeList, knowledgeTotalCount } = storeToRefs(knowledgeStore)

const dialogVisible = ref(false)
const newKnowledge = ref({
  title: '',
  content: '',
  thumbnail: ''
})

const openCreateDialog = () => {
  dialogVisible.value = true
  newKnowledge.value = {
    title: '',
    content: '',
    thumbnail: ''
  }
}

const handleClose = (done: () => void) => {
  ElMessage({
    type: 'info',
    message: '已取消创建'
  })
  done()
}

const handleImageChange = (file: any) => {
  // 这里可以处理图片上传，目前只是简单显示
  const reader = new FileReader()
  reader.onload = (e) => {
    newKnowledge.value.thumbnail = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

const submitKnowledge = async () => {
  if (!newKnowledge.value.title || !newKnowledge.value.content) {
    ElMessage({
      type: 'warning',
      message: '请填写完整信息'
    })
    return
  }

  try {
    // 调用 store 中的 action 创建资讯
    await knowledgeStore.addKnowledgeAction({
      title: newKnowledge.value.title,
      content: newKnowledge.value.content,
      thumbnail: newKnowledge.value.thumbnail || ''
    })

    // 使用当前的分页参数刷新列表
    fetchKnowledgeListData()

    ElMessage({
      type: 'success',
      message: '创建成功'
    })
    dialogVisible.value = false
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '创建失败，请稍后重试'
    })
    console.error('创建资讯失败:', error)
  }
}
</script>

<style scoped lang="less">
.knowledge-container {
  width: 1000px;
  margin: 0 auto;

  .knowledge-img {
    height: 140px;
    padding: 0;
    overflow: hidden;
  }

  .content-wrapper {
    height: 140px;
    padding: 12px;
    flex-direction: column;
    box-sizing: border-box;
    display: flex;

    .knowledge-body {
      height: 100%;
      display: flex;
      justify-content: space-between;

      .author-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .title-text {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .content-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        /* 固定显示3行 */
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5em;
        max-height: 4.5em;
        /* 3行的高度 = 行高 × 行数 */
        margin-bottom: 0;
      }
    }
  }

  .pagination {
    margin-left: 20px;
    margin-bottom: 20px;
  }

  .operation-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
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
}
</style>
