<template>
  <div id="event">
    <el-row :gutter="10">
      <el-col class="featured-event" :span="16">
        <div class="featured-event-title">
          <el-text class="mx-1" size="large" tag="b">精选活动</el-text>
          <div class="featured-event-title-button">
            <el-button type="" key="plain" link @click="openDetail()"> 查看更多>> </el-button>
          </div>
        </div>
        <div class="card">
          <el-row>
            <el-col style="margin-top: 10px" v-for="item in hotEventList" :key="item.id">
              <el-card
                class="box-card"
                shadow="hover"
                :body-style="{ padding: '0', height: '100%' }"
              >
                <el-row style="height: 100%">
                  <el-col class="event-img" :span="5">
                    <el-image style="height: 100%; width: 100%" :src="item.thumbnail" fit="cover" />
                  </el-col>
                  <el-col :span="19" class="content-wrapper">
                    <el-row class="event-body" justify="space-between">
                      <el-col>
                        <div
                          style="display: flex; align-items: center; justify-content: flex-start"
                        >
                          <el-avatar size="small" :src="item.avatar" />
                          <el-text class="mx-1 author-text" size="large" tag="b">{{
                            item.createBy
                          }}</el-text>
                        </div>
                      </el-col>
                      <el-col style="margin-top: 5px">
                        <el-text class="mx-1 title-text" size="large" tag="b">{{
                          item.title
                        }}</el-text>
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
        </div>
      </el-col>
      <el-col class="new-event" :span="8">
        <el-card>
          <div class="title">
            <el-text class="mx-1" size="large" tag="b">最新活动</el-text>
            <el-divider />
            <el-row>
              <el-col
                style="margin-bottom: 15px; margin-top: 1px"
                v-for="item in newEventList"
                :key="item.id"
              >
                <div class="title">
                  <el-text class="mx-1" size="large" tag="b">{{ item.title }}</el-text>
                </div>
                <el-row style="margin-top: 10px" type="flex" justify="space-between" align="middle">
                  <el-col :span="18">
                    <div style="display: flex; align-items: center">
                      <el-avatar size="small" :src="item.avatar" />
                      <span style="font-size: 12px">{{ item.createBy }}</span>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div style="display: flex; align-items: center; justify-content: flex-end">
                      <el-image
                        style="width: 24px; height: 24px"
                        src="src/assets/icon/position.svg"
                        fit="fill"
                      />
                      <span style="font-size: 12px">{{ item.venue }}</span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import useEventStore from '@/store/event/event.ts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const eventStore = useEventStore()

eventStore.getHotEventListAction()
eventStore.getNewEventListAction()

const { hotEventList, newEventList } = storeToRefs(eventStore)

const router = useRouter()

function openDetail() {
  router.push(`/event`)
}
</script>

<style scoped lang="less">
#event {
  margin-top: 20px;

  .featured-event-title {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .featured-event-title-button {
      display: flex;
      align-items: center;

      img {
        height: 30px;
      }
    }
  }

  .card {
    box-sizing: border-box;

    .box-card {
      height: 140px;
      width: 100%;

      .event-img {
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

        .event-body {
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
    }
  }

  .new-event {
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
