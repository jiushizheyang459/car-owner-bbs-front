<template>
  <div class="information-container">
    <div class="operation-bar">
      <el-button type="primary" @click="openCreateDialog" v-permission="'content:information:add'">
        <el-icon> <Plus /> </el-icon>新建资讯
      </el-button>
    </div>
    <el-row>
      <el-col :span="4" class="timeline-col">
        <div class="timeline-wrapper">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in timelineData"
              :key="index"
              :timestamp="item.date"
              placement="top"
              :type="activeDate === item.date ? 'primary' : undefined"
              @click="scrollToDate(item.date)"
              class="timeline-item"
              :class="{ 'is-active': activeDate === item.date }"
            >
              <div class="timeline-month">{{ item.month }}月</div>
              <div class="timeline-day">{{ item.day }}</div>
              <div class="timeline-weekday">{{ item.weekday }}</div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="news-container" @scroll="handleScroll" ref="containerRef">
          <div class="news-list" ref="newsListRef">
            <div
              v-for="(item, index) in informationList"
              :key="index"
              class="news-item"
              :ref="
                (el) => {
                  if (el) newsItemRefs[`${item.createDate}-${item.createTime}`] = el as HTMLDivElement
                }
              "
              :data-date="item.createDate"
              :data-time="item.createTime"
            >
              <div class="news-time">
                <span class="news-date">{{ formatDisplayDate(item.createDate) }}</span>
                <span class="news-hour">{{ item.createTime }}</span>
              </div>
              <div class="news-title">{{ item.title }}</div>
              <div class="news-content">{{ item.content }}</div>
              <div v-if="item.thumbnail" class="news-image">
                <el-image :src="item.thumbnail" fit="cover" />
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新建资讯对话框 -->
    <el-dialog v-model="dialogVisible" title="新建资讯" width="50%" :before-close="handleClose">
      <el-form :model="newInformation" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newInformation.title" placeholder="请输入资讯标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="newInformation.content" type="textarea" :rows="4" placeholder="请输入资讯内容" />
        </el-form-item>
        <el-form-item label="缩略图">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <img v-if="newInformation.thumbnail" :src="newInformation.thumbnail" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitInformation">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUpdate, onUnmounted, watch } from 'vue'
import { ElIcon, ElMessage } from 'element-plus'
import { Loading, Plus } from '@element-plus/icons-vue'
import useInformationStore from '@/store/information/information.ts'
import { storeToRefs } from 'pinia'
import { uploadImage } from '@/service/information/information.ts'
import { formatDate, getWeekday } from '@/utils/date'

const containerRef = ref<HTMLElement | null>(null)
const newsListRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const newsItemRefs: { [key: string]: HTMLDivElement } = {}

const informationStore = useInformationStore()

informationStore.getInformationListAction()

const { informationList } = storeToRefs(informationStore)

// 新建资讯相关
const dialogVisible = ref(false)
const newInformation = ref({
  title: '',
  content: '',
  thumbnail: ''
})

const openCreateDialog = () => {
  dialogVisible.value = true
  newInformation.value = {
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
    newInformation.value.thumbnail = result.data.data

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

const submitInformation = async () => {
  if (!newInformation.value.title || !newInformation.value.content) {
    ElMessage({
      type: 'warning',
      message: '请填写完整信息'
    })
    return
  }

  try {
    // 调用 store 中的 action 创建资讯
    await informationStore.addInformationAction({
      title: newInformation.value.title,
      content: newInformation.value.content,
      thumbnail: newInformation.value.thumbnail || ''
    })

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

// 在更新前清空引用
onBeforeUpdate(() => {
  Object.keys(newsItemRefs).forEach((key) => delete newsItemRefs[key])
})

// 添加活动日期的响应式引用
const activeDate = ref('')
const isScrolling = ref(false)
let scrollTimeout: number | null = null
let clickedDate: string | null = null // 添加点击日期记录

const scrollToDate = (date: string) => {
  activeDate.value = date
  isScrolling.value = true
  clickedDate = date // 记录被点击的日期

  const articlesOfDate = informationList.value.filter((article) => article.createDate === date)

  const latestArticle = articlesOfDate.sort((a, b) => {
    const timeA = new Date(`${a.createDate} ${a.createTime}`).getTime()
    const timeB = new Date(`${b.createDate} ${b.createTime}`).getTime()
    return timeB - timeA
  })[0]

  if (latestArticle && containerRef.value) {
    const targetElement = newsItemRefs[`${date}-${latestArticle.createTime}`]
    if (targetElement) {
      // 计算目标位置，确保文章在视口中心
      const containerHeight = containerRef.value.clientHeight
      const targetTop = targetElement.offsetTop - containerHeight / 2 + targetElement.offsetHeight / 2

      containerRef.value.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      })

      // 延长滚动锁定时间，确保动画完全结束
      setTimeout(() => {
        isScrolling.value = false
        clickedDate = null // 清除点击记录
      }, 1000) // 增加到1秒，确保滚动完全结束
    }
  }
}

const handleScroll = () => {
  // 如果是点击导致的滚动，且还有点击记录，保持焦点在点击的日期上
  if (isScrolling.value && clickedDate) {
    activeDate.value = clickedDate
    return
  }

  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout)
  }

  scrollTimeout = window.setTimeout(() => {
    if (!containerRef.value || isScrolling.value) return

    const scrollTop = containerRef.value.scrollTop
    const viewportHeight = containerRef.value.clientHeight
    const viewportMiddle = scrollTop + viewportHeight / 2

    const newsItems = Array.from(containerRef.value.getElementsByClassName('news-item')).map(
      (item) => item as HTMLElement
    )

    // 找到最接近视口中心的文章
    let closestItem: HTMLElement | null = null
    let minDistance = Infinity

    for (const item of newsItems) {
      const rect = item.getBoundingClientRect()
      const itemCenter = item.offsetTop + rect.height / 2
      const distance = Math.abs(itemCenter - viewportMiddle)

      if (distance < minDistance) {
        minDistance = distance
        closestItem = item
      }
    }

    // 更新焦点到最接近的文章日期
    if (closestItem) {
      const articleDate = closestItem.getAttribute('data-date')
      if (articleDate) {
        activeDate.value = articleDate
      }
    }
  }, 150) // 略微增加延迟
}

onUnmounted(() => {
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout)
  }
})

// 生成时间轴数据
const generateTimelineData = () => {
  const dates = new Set(informationList.value.map((news) => news.createDate))
  return Array.from(dates)
    .sort()
    .reverse()
    .map((date) => {
      const [year, month, day] = date.split('-')
      const weekday = getWeekday(date)
      return {
        month,
        day,
        weekday,
        date,
        type: ''
      }
    })
}

// 根据文章日期动态生成时间轴
const timelineData = ref(generateTimelineData())

// 监听 informationList 变化，更新时间轴数据
watch(
  informationList,
  () => {
    timelineData.value = generateTimelineData()
  },
  { deep: true }
)

// 格式化日期显示
const formatDisplayDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const weekday = getWeekday(dateStr)
  return `${year}年${month}月${day}日 ${weekday}`
}
</script>

<style scoped lang="less">
.information-container {
  width: 1000px;
  margin: 0 auto;
  position: relative;
  height: calc(100vh - 120px); // 调整高度，减去 header 和操作栏的高度

  .operation-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .timeline-col {
    position: relative;
    height: 100%;
  }

  .timeline-wrapper {
    position: fixed;
    width: inherit;
    max-width: calc(1000px * 4 / 24);
    padding: 20px;
    height: calc(100vh - 120px); // 调整高度，与容器保持一致
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .news-container {
    height: calc(100vh - 120px); // 调整高度，与容器保持一致
    overflow-y: auto;
    padding: 20px;

    .news-list {
      padding-left: 20px;

      .news-item {
        padding: 20px;
        border-bottom: 1px solid #eee;

        .news-time {
          margin-bottom: 10px;
          color: #666;

          .news-date {
            font-size: 14px;
            margin-right: 10px;
          }

          .news-hour {
            font-size: 14px;
            color: #999;
          }
        }

        .news-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .news-content {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .news-image {
          width: 200px;
          height: 120px;
          overflow: hidden;
          border-radius: 4px;

          .el-image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .timeline-item {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      .timeline-month,
      .timeline-day,
      .timeline-weekday {
        color: #409eff;
      }
    }

    &.is-active {
      .timeline-month,
      .timeline-day,
      .timeline-weekday {
        color: #409eff;
      }

      // 确保时间轴项在激活状态下的样式
      &::before {
        background-color: #409eff;
      }
    }
  }

  .timeline-month {
    font-size: 14px;
    color: #666;
    transition: color 0.3s;
  }

  .timeline-day {
    font-size: 24px;
    font-weight: bold;
    margin: 5px 0;
    transition: color 0.3s;
  }

  .timeline-weekday {
    font-size: 12px;
    color: #999;
    transition: color 0.3s;
  }
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
</style>
