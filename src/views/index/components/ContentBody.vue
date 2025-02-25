<template>
  <div id="content-body">
    <div class="content-title">
      <el-text class="mx-1" size="large" tag="b">精选文章</el-text>
      <div class="title-button">
        <el-button type="primary" text="primary" link>
          查看更多
          <img src="@/assets/icon/更多.svg" alt="tooMany" />
        </el-button>
      </div>
    </div>
    <div class="content-card">
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <el-card style="max-width: 480px">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="max-width: 480px">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <el-card style="max-width: 480px">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="max-width: 480px">
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

<script setup lang="ts">
</script>

<style scoped lang="less">
#content-body {
  margin-top: 20px;
  .content-title {
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
  .content-card {
    padding: 10px;
  }
}
</style>
