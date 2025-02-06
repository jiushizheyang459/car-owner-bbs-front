<template>
  <div class="content-right">
    <div class="creator card">
      <div class="creator-header">
        <div class="creator-title">
          <img src="@/assets/icon/creator.svg" alt="creator" />
          <span>创作中心</span>
        </div>
        <div class="creator-checkIn">
          <img src="@/assets/icon/calendar.svg" alt="" />
          <el-button type="primary">签到</el-button>
          <!--          <span>签到</span>-->
        </div>
      </div>
      <div class="creator-body">
        <ul>
          <li>
            <img src="@/assets/icon/create.svg" alt="" />
            <p>写文章</p>
          </li>
          <li>
            <img src="@/assets/icon/edit.svg" alt="" />
            <p>草稿箱</p>
          </li>
        </ul>
      </div>
      <div class="creator-footer">
        <div class="creator-footer-list">
          <ul>
            <li>特斯拉Model3限时抢购风暴！</li>
          </ul>
          <ul>
            <li>Model Y经典版本 即将绝代</li>
          </ul>
          <ul>
            <li>Model Y焕新首发‼ ⚡抢首发版焕新ModelY和首发权益！</li>
          </ul>
          <ul>
            <li>重大消息！🎉Model Y新款震撼上市啦！🚗💨</li>
          </ul>
        </div>
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
        <ul>
          <li v-for="(follow, index) in follows" :key="index">
            <img :src="follow.avatar" alt="" />
            <div class="follows-content">
              <div class="follows-head">{{ follow.name }}</div>
              <div class="follows-detail">你可能感兴趣</div>
            </div>
            <div class="follows-button">
              <img src="@/assets/icon/add.svg" alt="" />
              <span>关注</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义推荐关注的数据
const follows = ref([
  {
    avatar: 'src/assets/avatar/beibei.png',
    name: '猪贝'
  },
  {
    avatar: 'src/assets/avatar/benben.jpg',
    name: '笨笨'
  },
  {
    avatar: 'src/assets/avatar/littleBread.jpeg',
    name: '小面包'
  }
])
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
    ul {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;

      li {
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;

        img {
          display: block;
          margin-bottom: 13px;
          border-radius: 20%;
          width: 40px;
          line-height: 40px;
        }

        &:nth-child(1) img {
          background: #e0ecff;
        }

        &:nth-child(2) img {
          background: #fff2e1;
        }
      }
    }
  }

  .creator-footer {
    background-color: #f9f9fa;
    font-size: 12px;
    width: 100%;
    height: 100px;
    overflow: hidden;

    .creator-footer-list {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      animation: scroll 10s infinite;

      ul {
        margin: 0;
        padding: 0;
        li {
          height: 100px;
          padding: 14px;
          list-style-type: none;
        }
      }
    }

    &:hover .creator-footer-list {
      animation-play-state: paused;
    }
  }
  @keyframes scroll {
    0% {
      transform: translateY(0px);
    }
    25% {
      transform: translateY(-100px);
    }
    50% {
      transform: translateY(-200px);
    }
    75% {
      transform: translateY(-300px);
    }
    100% {
      transform: translateY(-400px);
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
    ul {
      li {
        display: flex;
        align-items: center;
        margin: 10px 0;
        font-size: 12px;
      }
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 10px;
    }

    .follows-content {
      flex: 1;
      margin-left: 5px;
    }

    .follows-button {
      display: flex;
      align-items: center;
      color: #1296db;

      img {
        height: 20px;
        margin-right: -3px;
      }

      span {
        font-size: 15px;
      }
    }
  }
}
</style>
