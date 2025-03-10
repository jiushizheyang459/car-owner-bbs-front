<template>
  <div id="content-top">
    <el-card class="right-card">
      <el-carousel height="340px">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 class="small justify-center" text="2xl">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-card>
    <div class="left-card">
      <el-card class="creator">
        <div class="creator-header">
          <div class="creator-title">
            <img src="@/assets/icon/creator.svg" alt="creator" />
            <span>晚上好！</span>
          </div>
          <div class="creator-checkIn">
            <img src="@/assets/icon/calendar.svg" alt="" />
            <el-button type="primary">签到 </el-button>
          </div>
        </div>
        <el-divider />
        <div class="creator-body">
          <el-row gutter="{20}">
            <el-col class="creator-text">
              <span>读书破万卷，下笔如有神</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="message">
        <div class="message-title">
          <img src="@/assets/icon/create.svg" alt="message" />
          <span>公告</span>
        </div>
        <el-divider />
        <div class="message-content">
          <el-row>
            <el-col v-for="item in messageList" :key="item.id" :span="24">
              <div class="content-title" @click="openDetail(item)">
                <div class="message-title">
                  {{ item.title }}
                </div>
                <div class="message-time">
                  {{ item.time }}
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
const messageList = [
  { id: 1, title: '为什么要开发这个平台', time: '2025-2-1' },
  { id: 2, title: '新功能上线了！！！', time: '2025-2-2' }
]
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
    el-carousel {
    }

    .demonstration {
      color: var(--el-text-color-secondary);
    }

    .el-carousel__item h3 {
      color: #475669;
      opacity: 0.75;
      line-height: 150px;
      margin: 0;
      text-align: center;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
      background-color: #d3dce6;
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
