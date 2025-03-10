<template>
  <div id="latest-news">
    <div class="title">
      <el-text class="mx-1" size="large" tag="b">最新资讯</el-text>
      <div class="title-button">
        <el-button type="" key="plain" link>
          查看更多
          <img src="@/assets/icon/更多.svg" alt="tooMany" />
        </el-button>
      </div>
    </div>
    <div class="card">
      <el-row :gutter="10" style="margin-bottom: 10px; margin-top: 10px">
        <el-col :span="12">
          <el-card style="max-width: 500px">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="max-width: 500px">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card style="max-width: 500px">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="max-width: 500px">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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
  }
}
</style>
