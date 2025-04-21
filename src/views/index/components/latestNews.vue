<template>
  <div id="latest-news">
    <div class="title">
      <el-text class="mx-1" size="large" tag="b">最新资讯</el-text>
      <div class="title-button">
        <el-button type="" key="plain" link @click="openDetail()"> 查看更多>> </el-button>
      </div>
    </div>
    <div class="card">
      <el-row :gutter="10">
        <el-col :span="12" v-for="(item, index) in newInformationList" :key="index">
          <el-card style="max-width: 500px" class="news-card">
            <template #header>
              <div class="card-header">
                <span>{{ item.title }}</span>
              </div>
            </template>
            <div class="news-content">
              <p class="text item">{{ item.content }}</p>
              <!--              <div class="news-info">-->
              <!--                <span>{{ item.createDate }}</span>-->
              <!--                <span>{{ item.createTime }}</span>-->
              <!--              </div>-->
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import useInformationStore from '@/store/information/information'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const informationStore = useInformationStore()

informationStore.getNewInformationListAction()

const { newInformationList } = storeToRefs(informationStore)

const router = useRouter()

function openDetail() {
  router.push(`/information`)
}
</script>

<style scoped lang="less">
#latest-news {
  margin-top: 20px;

  .title {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-button {
      display: flex;
      align-items: center;

      img {
        height: 30px;
      }
    }
  }

  .card {
    box-sizing: border-box;

    .el-row {
      margin: 0 -5px;
    }

    .el-col {
      padding: 5px;
    }

    .news-card {
      height: 200px;

      .card-header {
        span {
          font-size: 16px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .news-content {
        height: calc(100% - 55px);
        overflow: hidden;

        .text.item {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5;
          margin: 0;
        }
      }
    }
  }
}
</style>
