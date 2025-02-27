<template>
  <div id="wiki">
    <div class="title">
      <el-text class="mx-1" size="large" tag="b">百科</el-text>
      <div class="title-button">
        <el-button type="primary" text="primary" link>
          查看更多
          <img src="@/assets/icon/更多.svg" alt="tooMany" />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
#wiki {
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
}
</style>