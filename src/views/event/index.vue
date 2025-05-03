<template>
  <div class="event-container">
    <div class="event-page">
      <!-- 顶部操作栏和筛选栏合并 -->
      <div class="top-bar">
        <div class="filter-bar">
          <el-select v-model="categoryValue" placeholder="不限类型" class="filter-item">
            <el-option label="不限类型" value="" />
            <el-option label="赛车比赛" value="赛车比赛" />
            <el-option label="旅行活动" value="旅行活动" />
            <el-option label="交友聚会" value="交友聚会" />
          </el-select>

          <el-select v-model="cityValue" placeholder="不限城市" class="filter-item">
            <el-option label="不限城市" value="" />
            <el-option label="线上" value="线上" />
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
          </el-select>

          <el-checkbox v-model="myEvents">我的</el-checkbox>
        </div>

        <div class="operation-bar">
          <el-button type="primary" @click="openCreateDialog" v-permission="'content:event:add'">
            <el-icon> <Plus /> </el-icon>新建活动
          </el-button>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="event-list">
        <el-row :gutter="20">
          <el-col v-for="event in eventList" :key="event.id" :span="6">
            <el-card class="event-card" :body-style="{ padding: '0px' }">
              <img :src="event.thumbnail" class="event-image" />
              <div class="event-content">
                <h3>{{ event.title }}</h3>
                <div class="event-info">
                  <span>
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    {{ event.eventTime }}
                  </span>
                  <span>
                    <el-icon>
                      <Location />
                    </el-icon>
                    {{ event.venue }}
                  </span>
                  <span>
                    <el-icon>
                      <PieChart />
                    </el-icon>
                    {{ event.type }}
                  </span>
                  <span>
                    <el-icon>
                      <Edit />
                    </el-icon>
                    {{ event.startTime + '-' + event.endTime }}
                  </span>
                  <el-tag :type="event.status === '已结束' ? 'info' : 'primary'" class="status-tag">
                    {{ event.status }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[8, 16, 32]"
            layout="sizes, prev, pager, next, total"
            :total="eventTotalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="新建活动" width="50%" :before-close="handleClose">
      <el-form :model="newEvent" :rules="rules" ref="eventFormRef" label-width="80px">
        <el-form-item label="活动类型">
          <el-select v-model="newEvent.type" placeholder="不限类型" class="dialog-filter-item">
            <el-option label="不限类型" value="" />
            <el-option label="赛车比赛" value="赛车比赛" />
            <el-option label="旅行活动" value="旅行活动" />
            <el-option label="交友聚会" value="交友聚会" />
          </el-select>
        </el-form-item>
        <el-form-item label="举办地区">
          <el-select v-model="newEvent.venue" placeholder="不限城市" class="dialog-filter-item">
            <el-option label="不限城市" value="" />
            <el-option label="线上" value="线上" />
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
          </el-select>
        </el-form-item>
        <el-form-item label="报名时间" prop="startTime">
          <el-date-picker
            v-model="newEvent.startTime"
            type="datetime"
            placeholder="开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 180px; margin-right: 10px"
          />
          <span style="margin-right: 8px">-</span>
          <el-date-picker
            v-model="newEvent.endTime"
            type="datetime"
            placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="活动时间" prop="eventTime">
          <el-date-picker
            v-model="newEvent.eventTime"
            type="datetime"
            placeholder="活动时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="newEvent.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="newEvent.content" type="textarea" :rows="4" placeholder="请输入活动内容" />
        </el-form-item>
        <el-form-item label="缩略图">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <img v-if="newEvent.thumbnail" :src="newEvent.thumbnail" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEvent">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Location, Link, Plus } from '@element-plus/icons-vue'
import { ElIcon, ElMessage } from 'element-plus'
import useEventStore from '@/store/event/event.ts'
import { storeToRefs } from 'pinia'

const categoryValue = ref('')
const cityValue = ref('')
const myEvents = ref(false)

const currentPage = ref(1)
const pageSize = ref(8)

function handleSizeChange() {
  fetchEventListData()
}
function handleCurrentChange() {
  fetchEventListData()
}

function fetchEventListData() {
  const size = pageSize.value
  const pageNum = currentPage.value
  const info = { size, pageNum }
  eventStore.getEventListAction(info)
}

const eventStore = useEventStore()

fetchEventListData()

const { eventList, eventTotalCount } = storeToRefs(eventStore)

const dialogVisible = ref(false)
const newEvent = ref({
  type: '',
  venue: '',
  startTime: '',
  endTime: '',
  eventTime: '',
  title: '',
  content: '',
  thumbnail: ''
})

const eventFormRef = ref()

// 自定义校验规则
const validateTimeRange = (rule: any, value: any, callback: any) => {
  if (newEvent.value.startTime && newEvent.value.endTime) {
    const startTime = new Date(newEvent.value.startTime).getTime()
    const endTime = new Date(newEvent.value.endTime).getTime()

    if (startTime >= endTime) {
      callback(new Error('开始时间必须早于结束时间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const rules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
  startTime: [
    { required: true, message: '请选择报名时间', trigger: 'change' },
    { validator: validateTimeRange, trigger: 'change' }
  ]
}

const openCreateDialog = () => {
  dialogVisible.value = true
  newEvent.value = {
    type: '',
    venue: '',
    startTime: '',
    endTime: '',
    eventTime: '',
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
    newEvent.value.thumbnail = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

const submitEvent = async () => {
  if (!eventFormRef.value) return

  await eventFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 将日期时间字符串转换为时间戳
        const startTime = newEvent.value.startTime ? new Date(newEvent.value.startTime).getTime() : 0
        const endTime = newEvent.value.endTime ? new Date(newEvent.value.endTime).getTime() : 0

        // 调用 store 中的 action 创建资讯
        await eventStore.addEventAction({
          title: newEvent.value.title,
          content: newEvent.value.content,
          thumbnail: newEvent.value.thumbnail || '',
          startTime: startTime,
          endTime: endTime,
          eventTime: newEvent.value.eventTime,
          type: newEvent.value.type,
          venue: newEvent.value.venue
        })

        // 使用当前的分页参数刷新列表
        fetchEventListData()

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
    } else {
      ElMessage({
        type: 'warning',
        message: '请填写完整信息'
      })
      return false
    }
  })
}
</script>

<style scoped lang="less">
.event-container {
  display: flex;
  justify-content: center;
  width: 100%;

  .event-page {
    width: 1000px;
    padding: 20px;

    .top-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      gap: 15px;

      .filter-item {
        width: 150px;
      }
    }

    .operation-bar {
      display: flex;
      justify-content: flex-end;
    }

    .event-list {
      .el-row {
        margin: 0 !important;
      }

      .event-card {
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s;
        height: 330px;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }

        .event-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }

        .event-content {
          padding: 14px;
          height: 120px;
          display: flex;
          flex-direction: column;

          h3 {
            margin: 0;
            font-size: 16px;
            color: #333;
            margin-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .event-info {
            font-size: 13px;
            color: #666;
            display: flex;
            flex-direction: column;
            gap: 8px;

            span {
              display: flex;
              align-items: center;
              gap: 5px;
            }

            .el-icon {
              font-size: 14px;
            }
          }

          .status-tag {
            margin-top: auto;
            font-size: 13px;
            padding: 0 12px;
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }
  }

  .dialog-filter-item {
    width: 110px;
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

  .pagination {
    margin-bottom: 20px;
  }
}
</style>
