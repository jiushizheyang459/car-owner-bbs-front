<template>
  <div class="user-info-container">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <div class="avatar-container">
        <div class="avatar-wrapper" @click="showPreview(userInfo?.avatar)">
          <el-avatar :size="100" :src="userInfo?.avatar" />
          <div class="preview-hint">查看大图</div>
        </div>
      </div>
      <div class="user-detail">
        <h2 class="user-name">
          {{ userInfo?.nickName }}
          <el-button class="edit-button" type="primary" icon="EditPen" size="small" plain @click="showEditModal">
            编辑资料
          </el-button>
        </h2>
        <div class="user-stats">
          <div class="stat-item">
            <el-icon>
              <Message />
            </el-icon>
            <span>邮箱：{{ userInfo?.email || '未设置' }}</span>
          </div>
          <div class="stat-item">
            <el-icon>
              <User />
            </el-icon>
            <span>性别：{{ genderText }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" class="user-tabs">
      <el-tab-pane label="个人信息" name="info">
        <div class="info-card">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>基本信息</h3>
              </div>
            </template>
            <el-row :gutter="20" class="info-row">
              <el-col :span="12">
                <div class="info-item">
                  <span class="info-label">用户名：</span>
                  <span class="info-value">{{ userInfo?.userName }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="info-item">
                  <span class="info-label">昵称：</span>
                  <span class="info-value">{{ userInfo?.nickName }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="info-row">
              <el-col :span="12">
                <div class="info-item">
                  <span class="info-label">性别：</span>
                  <span class="info-value">{{ genderText }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="info-item">
                  <span class="info-label">邮箱：</span>
                  <span class="info-value">{{ userInfo?.email || '未设置' }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="info-row">
              <el-col :span="12">
                <div class="info-item">
                  <span class="info-label">手机号：</span>
                  <span class="info-value">{{ userInfo?.phoneNumber || '未设置' }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="info-item">
                  <span class="info-label">角色：</span>
                  <span class="info-value">{{ userInfo?.roleName }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的收藏" name="saves">
        <div class="saves-container">
          <el-empty v-if="saveList.length === 0" description="暂无收藏内容" />
          <div v-else>
            <div v-for="article in saveList" :key="article.articleId" class="save-item">
              <el-card shadow="hover" class="save-card">
                <div class="save-header">
                  <h3 class="save-title">{{ article.articleTitle }}</h3>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    plain
                    @click="handleCancelSave(article.articleId)"
                  >
                    取消收藏
                  </el-button>
                </div>

                <div class="save-content">
                  <div v-if="article.articleThumbnail" class="save-image">
                    <el-image :src="article.articleThumbnail" fit="cover" />
                  </div>
                  <div class="save-text">
                    <p class="content-preview">{{ stripHtml(article.articleContent, 100) }}</p>

                    <div class="save-meta">
                      <div class="article-author">
                        <el-avatar :size="24" :src="article.avatar"></el-avatar>
                        <span class="author-name">{{ article.nickName }}</span>
                      </div>
                      <div class="save-footer">
                        <span class="save-date">{{ formatDate(article.createTime) }}</span>
                        <span class="save-views"
                          ><el-icon>
                            <View />
                          </el-icon>
                          {{ article.viewCount }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>

            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20]"
                layout="sizes, prev, pager, next, total"
                :total="saveTotalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的关注" name="follows">
        <div class="follows-container">
          <el-empty v-if="followList.length === 0" description="暂无关注用户" />
          <el-row v-else :gutter="20">
            <el-col v-for="follow in followList" :key="follow.id" :xs="24" :sm="12" :md="8" :lg="6">
              <el-card shadow="hover" class="follow-card">
                <div class="follow-info">
                  <el-avatar :size="50" :src="follow.followedAvatar" />
                  <div class="follow-detail">
                    <div class="follow-name">{{ follow.followedUser }}</div>
                    <div class="follow-date">关注于：{{ formatDate(follow.createTime) }}</div>
                  </div>
                </div>
                <div class="follow-actions">
                  <el-button type="danger" size="small" @click="handleUnfollow(follow.followedId)" plain>
                    取消关注
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑用户信息模态框 -->
    <el-dialog v-model="editModalVisible" title="编辑个人信息" width="500px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editModalVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateUserInfo">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 头像预览弹窗 -->
    <el-dialog v-model="previewVisible" title="头像预览" width="50%" :show-close="true">
      <div class="preview-container">
        <img :src="currentPreviewImage" alt="头像预览" class="preview-image" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <!--          <el-button @click="previewVisible = false">关闭</el-button>-->
          <el-button type="primary" @click="handleChangeAvatar">更换头像</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 头像上传对话框 -->
    <el-dialog v-model="uploadVisible" title="更换头像" width="400px">
      <div class="upload-container">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleAvatarUpload"
        >
          <img v-if="tempAvatarUrl" :src="tempAvatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <div class="upload-tip">支持 jpg、png 格式，大小不超过 2MB</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAvatarChange" :disabled="!tempAvatarUrl"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import useUserStore from '@/store/user/user.ts'
import { storeToRefs } from 'pinia'
import useSaveStore from '@/store/save/save'
import useFollowStore from '@/store/follows/follows'
import useUploadStore from '@/store/upload/upload'
import { stripHtml } from '@/utils/htmlUtils.ts'
import { formatDate } from '@/utils/date'
import { Message, User, View, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getUserInfo, updateUserInfo } from '@/service/user/user'
import type { IUpdateUserInfo } from '@/store/user/type'
import { LOGIN_TOKEN, USER_INFO, MENUS } from '@/global/constants.ts'
import { localCache } from '@/utils/cache.ts'

// 激活的标签
const activeTab = ref('info')

// 获取用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 获取收藏文章相关
const saveStore = useSaveStore()
const { saveList, saveTotalCount } = storeToRefs(saveStore)
const currentPage = ref(1)
const pageSize = ref(5)

// 加载收藏文章
function fetchSavedArticles() {
  saveStore.getSaveListAction(currentPage.value, pageSize.value)
}

// 初始加载收藏文章
fetchSavedArticles()

// 获取关注用户相关
const followStore = useFollowStore()
followStore.getFollowAction()
const { followList } = storeToRefs(followStore)

// 处理收藏分页变化
function handleSizeChange(size: number) {
  pageSize.value = size
  fetchSavedArticles()
}

function handleCurrentChange(page: number) {
  currentPage.value = page
  fetchSavedArticles()
}

// 取消收藏
async function handleCancelSave(articleId: number) {
  const success = await saveStore.deleteSaveAction(articleId)
  if (success) {
    fetchSavedArticles()
  }
}

// 取消关注
async function handleUnfollow(userId: number) {
  const success = await followStore.toggleFollowAction(userId)
  if (success) {
    // 不需要再次获取关注列表，因为toggleFollowAction已经更新了本地状态
    // 如果仍有问题，可以取消下面的注释
    // await followStore.getFollowAction()
  }
}

// 获取性别文本
const genderText = computed(() => {
  if (!userInfo.value) return ''
  return userInfo.value.sex === 0 ? '男' : userInfo.value.sex === 1 ? '女' : '保密'
})

const editModalVisible = ref(false)
const editFormRef = ref<FormInstance>()

const editForm = reactive<IUpdateUserInfo>({
  id: 0,
  userName: '',
  nickName: '',
  email: '',
  phoneNumber: '',
  sex: 1,
  avatar: ''
})

const editRules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 6 到 12 个字符', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
})

// 显示编辑模态框
const showEditModal = () => {
  if (!userInfo.value) {
    ElMessage.warning('用户信息未加载完成，请稍后再试')
    return
  }

  // 回填表单数据
  editForm.id = userInfo.value.id
  editForm.userName = userInfo.value.userName
  editForm.nickName = userInfo.value.nickName
  editForm.email = userInfo.value.email
  editForm.phoneNumber = userInfo.value.phoneNumber
  editForm.sex = userInfo.value.sex
  editForm.avatar = userInfo.value.avatar

  editModalVisible.value = true
}

// 更新用户信息
const handleUpdateUserInfo = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await updateUserInfo(editForm)
        if (res.data.code === 200) {
          ElMessage.success('更新成功')
          editModalVisible.value = false
          // 更新store中的用户信息
          userStore.updateUserInfoAction(editForm)
          // 重新获取用户信息
          await userStore.getUserInfoAction()
        }
      } catch (error) {
        console.error('更新用户信息失败:', error)
        ElMessage.error('更新失败')
      }
    }
  })
}

// 头像预览相关
const previewVisible = ref(false)
const currentPreviewImage = ref('')
const uploadVisible = ref(false)
const tempAvatarUrl = ref('')
const uploadStore = useUploadStore()

// 显示头像预览
const showPreview = (imageUrl: string | undefined) => {
  if (!imageUrl) {
    ElMessage.warning('暂无头像')
    return
  }
  currentPreviewImage.value = imageUrl
  previewVisible.value = true
}

// 处理更换头像
const handleChangeAvatar = () => {
  previewVisible.value = false
  uploadVisible.value = true
  tempAvatarUrl.value = ''
}

// 上传前校验
const beforeAvatarUpload = (file: File) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarUpload = async (options: any) => {
  const { file } = options
  try {
    const imageUrl = await uploadStore.uploadImageAction(file)
    if (imageUrl) {
      tempAvatarUrl.value = imageUrl
    }
  } catch (error) {
    console.error('上传头像失败:', error)
  }
}

// 确认更换头像
const confirmAvatarChange = async () => {
  if (!tempAvatarUrl.value || !userInfo.value) return

  try {
    const updateData = {
      ...userInfo.value,
      avatar: tempAvatarUrl.value
    }
    const res = await updateUserInfo(updateData)
    if (res.data.code === 200) {
      ElMessage.success('头像更新成功')
      uploadVisible.value = false
      // 更新store中的用户信息
      userStore.updateUserInfoAction(updateData)
      // 更新localCache中的用户信息
      localCache.setCache(USER_INFO, updateData)
      // 重新获取用户信息
      await userStore.getUserInfoAction()
    }
  } catch (error) {
    console.error('更新头像失败:', error)
    ElMessage.error('更新头像失败')
  }
}

// 初始化加载数据
onMounted(async () => {
  // 确保获取最新的用户信息
  await userStore.getUserInfoAction()
  // 不再需要单独的fetchUserInfo调用
})
</script>

<style scoped lang="less">
.user-info-container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}

.user-header {
  display: flex;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .avatar-container {
    margin-right: 30px;
    position: relative;

    .avatar-wrapper {
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        .preview-hint {
          opacity: 1;
        }
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
        font-size: 14px;
        border-radius: 50%;
      }
    }
  }

  .user-detail {
    flex: 1;

    .user-name {
      margin-top: 5px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;

      .edit-button {
        margin-left: 15px;
      }
    }

    .user-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      .stat-item {
        display: flex;
        align-items: center;
        color: #606266;

        .el-icon {
          margin-right: 5px;
        }
      }
    }
  }
}

.user-tabs {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.info-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .info-item {
    .info-label {
      color: #909399;
      margin-right: 10px;
    }

    .info-value {
      color: #303133;
    }
  }
}

.saves-container {
  .save-item {
    margin-bottom: 15px;

    .save-card {
      overflow: hidden;
      transition: box-shadow 0.3s;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }

    .save-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .save-title {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .save-content {
      display: flex;
      margin-top: 5px;

      .save-image {
        width: 120px;
        height: 80px;
        margin-right: 15px;
        overflow: hidden;
        border-radius: 4px;

        .el-image {
          width: 100%;
          height: 100%;
        }
      }

      .save-text {
        flex: 1;

        .content-preview {
          margin: 0 0 12px;
          color: #606266;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .save-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .article-author {
            display: flex;
            align-items: center;

            .el-avatar {
              margin-right: 5px;
            }

            .author-name {
              font-size: 13px;
              color: #606266;
            }
          }

          .save-footer {
            display: flex;
            color: #909399;
            font-size: 13px;
            gap: 15px;

            .save-views {
              display: flex;
              align-items: center;

              .el-icon {
                margin-right: 4px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}

.follows-container {
  .follow-card {
    margin-bottom: 15px;

    .follow-info {
      display: flex;
      margin-bottom: 15px;

      .follow-detail {
        margin-left: 10px;

        .follow-name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .follow-date {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .follow-actions {
      display: flex;
      justify-content: flex-end;
    }
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

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  .avatar-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
  }

  .upload-tip {
    margin-top: 10px;
    color: #909399;
    font-size: 12px;
  }
}
</style>
