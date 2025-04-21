<template>
  <div id="content-top">
    <el-card class="right-card">
      <el-carousel height="100%">
        <el-carousel-item v-for="item in advertisementList" :key="item.id">
          <div class="carousel-content">
            <img :src="item.img" :alt="item.title" class="carousel-image" />
            <div class="carousel-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-card>
    <div class="left-card">
      <el-card class="creator">
        <div class="creator-header">
          <div class="creator-title">
            <img src="@/assets/icon/greeting.svg" alt="greeting" />
            <span>{{ greeting }}</span>
          </div>
          <!--          <div class="creator-checkIn">-->
          <!--            <img src="@/assets/icon/calendar.svg" alt="" />-->
          <!--            <el-button type="primary">签到 </el-button>-->
          <!--          </div>-->
        </div>
        <el-divider />
        <div class="creator-body">
          <el-row :gutter="20">
            <el-col class="creator-text">
              <span>买车就上瓜子二手车！</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="message">
        <div class="message-title">
          <img src="@/assets/icon/announcement.svg" alt="announcement" />
          <span>公告</span>
        </div>
        <el-divider />
        <div class="message-content">
          <el-row>
            <el-col v-for="item in announcementList" :key="item.id" :span="24">
              <div class="content-title">
                <div class="message-title">
                  {{ item.title }}
                </div>
                <div class="message-time">
                  {{ item.creatDate }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAnnouncementStore from '@/store/announcement/announcement.ts'
import useAdvStore from '@/store/advertisement/advertisement.ts'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const announcementStore = useAnnouncementStore()
const advStore = useAdvStore()

onMounted(() => {
  announcementStore.getAnnouncementListAction()
  advStore.getAdvertisementAction()
})

const { announcementList } = storeToRefs(announcementStore)
const { advertisementList } = storeToRefs(advStore)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return '早上好！'
  } else if (hour >= 12 && hour < 14) {
    return '中午好！'
  } else if (hour >= 14 && hour < 17) {
    return '下午好！'
  } else if (hour >= 17 && hour < 19) {
    return '傍晚好！'
  } else if (hour >= 19 && hour < 24) {
    return '晚上好！'
  } else {
    return '凌晨好！'
  }
})
</script>

<style scoped lang="less">
#content-top {
  display: flex;
  align-items: stretch;

  .right-card {
    width: 700px;
    flex-shrink: 0;
    margin-right: 10px;
    box-shadow: 0 1px 5px #ddd;
    padding: 0;
    overflow: hidden;
    height: 380px;

    :deep(.el-card__body) {
      padding: 0;
      height: 100%;
    }

    :deep(.el-carousel) {
      height: 100%;
    }

    :deep(.el-carousel__container) {
      height: 100%;
    }

    .carousel-content {
      height: 100%;
      position: relative;

      .carousel-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .carousel-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: #fff;

        h3 {
          margin: 0 0 10px 0;
          font-size: 20px;
        }

        p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }
      }
    }
  }

  .left-card {
    width: 300px;

    //height: 380px;
    .creator {
      height: 150px;
      box-shadow: 0 1px 5px #ddd;
      background-color: #fff;

      .creator-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0;

        .creator-title {
          display: flex;
          align-items: center;

          img {
            height: 22px;
          }

          span {
            margin-left: 5px;
            font-size: 18px;
          }
        }

        .creator-checkIn {
          display: flex;
          align-items: center;

          img {
            height: 22px;
          }

          el-button {
            margin-left: 5px;
            height: 22px;
            line-height: 30px;
            padding: 0 10px;
          }
        }
      }

      .creator-body {
        margin-top: 15px;
      }
    }

    .message {
      margin-top: 10px;
      height: 220px;
      box-shadow: 0 1px 5px #ddd;
      background-color: #fff;

      .message-title {
        display: flex;
        align-items: center;

        img {
          height: 22px;
          margin-right: 5px;
        }

        span {
          font-size: 18px;
        }
      }

      .message-content {
        .content-title {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .message-title {
            margin: 2px 0;
            font-size: 15px;
          }

          .message-time {
            font-size: 15px;
          }
        }
      }
    }
  }
}
</style>
