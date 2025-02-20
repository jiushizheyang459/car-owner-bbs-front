<template>
  <div class="carousel">
    <el-carousel height="380px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small justify-center" text="2xl">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
  <div class="card">
    <div class="creator">
      <div class="creator-header">
        <div class="creator-title">
          <img src="@/assets/icon/creator.svg" alt="creator" />
          <span>晚上好！</span>
        </div>
        <div class="creator-checkIn">
          <img src="@/assets/icon/calendar.svg" alt="" />
          <el-button type="primary">签到</el-button>
        </div>
      </div>
      <div class="creator-body">
        <el-row gutter="{20}">
          <el-col class="creator-text">
            <span>读书破万卷，下笔如有神</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="message"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.content-top {
  background-color: #515151;
}
.carousel {
  width: 700px;
  flex-shrink: 0;
  margin-right: 10px;
  box-shadow: 0 1px 5px #ddd;
}
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 370px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.card {
  width: 300px;
  .creator {
    height: 100px;
    box-shadow: 0 1px 5px #ddd;
    background-color: #fff;
    border-radius: 2px;
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
      .creator-text {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        margin: 20px 0;
      }
    }
  }
  .message {
    margin-top: 10px;
    height: 190px;
    box-shadow: 0 1px 5px #ddd;
    background-color: #fff;
    border-radius: 2px;
    padding: 20px;
  }
}
</style>
