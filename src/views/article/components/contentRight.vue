<template>
  <div class="content-right">
    <div class="creator card">
      <div class="creator-header">
        <div class="creator-title">
          <img src="@/assets/icon/creator.svg" alt="creator" />
          <span>创作中心</span>
        </div>
        <!--        <div class="creator-checkIn">-->
        <!--          <img src="@/assets/icon/calendar.svg" alt="" />-->
        <!--          <el-button type="primary">签到</el-button>-->
        <!--        </div>-->
      </div>
      <div class="creator-body">
        <el-row :gutter="20">
          <el-col :span="12" v-for="(item, index) in creatorItems" :key="index">
            <div
              class="creator-item"
              :class="{ 'first-item': index === 0, 'second-item': index === 1 }"
              @click="handleCreateClick(item)"
            >
              <img :src="item.icon" alt="" />
              <p>{{ item.text }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="creator-footer">
        <el-carousel height="100px" direction="vertical" autoplay indicator-position="none">
          <el-carousel-item v-for="(adv, index) in advertisementList" :key="index">
            <div class="carousel-item">{{ adv.title }}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="suggested-follows card">
      <div class="follows-header">
        <div class="follows-title">
          <img src="@/assets/icon/follow.svg" alt="" />
          <span>推荐关注</span>
        </div>
      </div>
      <div class="follows-body">
        <el-row :gutter="15">
          <el-col :span="24" v-for="user in recommendedUsers" :key="user.id">
            <div class="follows-item">
              <img :src="user.avatar" alt="" />
              <div class="follows-content">
                <div class="follows-head">{{ user.nickName }}</div>
                <div class="follows-detail">你可能感兴趣</div>
              </div>
              <el-button
                class="follows-button"
                :class="{ 'is-followed': followStatus[user.id] }"
                type="text"
                @click="handleFollowClick(user.id)"
              >
                <img
                  :src="
                    followStatus[user.id]
                      ? 'src/assets/icon/reduction.svg'
                      : 'src/assets/icon/add.svg'
                  "
                  alt=""
                />
                <span>{{ followStatus[user.id] ? '已关注' : '关注' }}</span>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useFollowStore from '@/store/follows/follows.ts'
import { storeToRefs } from 'pinia'
import useAdvStore from '@/store/advertisement/advertisement.ts'

// 定义创作中心的数据
const creatorItems = ref([
  {
    icon: 'src/assets/icon/create.svg',
    text: '写文章'
  },
  {
    icon: 'src/assets/icon/edit.svg',
    text: '草稿箱'
  }
])

// 获取推荐关注的数据
const followStore = useFollowStore()
const advStore = useAdvStore()
followStore.getRecommendedUsersAction()
advStore.getAdvertisementAction()
const { recommendedUsers, followStatus } = storeToRefs(followStore)
const { advertisementList } = storeToRefs(advStore)

const router = useRouter()

const handleCreateClick = (item: any) => {
  if (item.text === '写文章') {
    router.push('/article/editor')
  }
}

const handleFollowClick = async (userId: number) => {
  await followStore.toggleFollowAction(userId)
}
</script>

<style scoped lang="less">
.content-right {
  width: 300px;
}

.card {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 5px #ddd;
  margin-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.creator {
  padding: 20px;

  .creator-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      height: 22px;
    }

    .creator-title {
      display: flex;
      align-items: center;
      font-size: 18px;
    }

    .creator-checkIn {
      display: flex;
      align-items: center;

      .el-button {
        height: 22px;
      }
    }
  }

  .creator-body {
    .creator-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 14px;
      margin: 20px 0;
      cursor: pointer;

      img {
        display: block;
        margin-bottom: 13px;
        border-radius: 20%;
        width: 40px;
        line-height: 40px;
      }

      p {
        cursor: pointer;
      }

      &.first-item img {
        background: #e0ecff;
      }

      &.second-item img {
        background: #fff2e1;
      }
    }
  }

  .creator-footer {
    background-color: #eeeeee;
    font-size: 12px;
    width: 100%;
    height: 100px;
    border-radius: 2px;
    overflow: hidden;

    .carousel-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0;
      text-align: center;
    }
  }
}

.suggested-follows {
  padding: 15px;

  .follows-header {
    .follows-title {
      display: flex;
      align-items: center;
      font-size: 18px;

      img {
        height: 22px;
      }
    }
  }

  .follows-body {
    .follows-item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      font-size: 12px;
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 2px;
    }

    .follows-content {
      flex: 1;
      margin-left: 5px;
    }

    .follows-button {
      display: flex;
      align-items: center;
      color: #1296db;
      font-size: 15px;

      img {
        height: 20px;
        margin-right: -3px;
      }

      &.is-followed {
        color: #707070;
      }
    }
  }
}
</style>
