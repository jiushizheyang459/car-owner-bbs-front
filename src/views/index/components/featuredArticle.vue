<template>
  <div id="article">
    <el-row :gutter="10">
      <el-col class="featured-article" :span="16">
        <div class="featured-article-title">
          <el-text class="mx-1" size="large" tag="b">精选文章</el-text>
          <div class="featured-article-title-button">
            <el-button type="" key="plain" link>
              查看更多
              <img src="@/assets/icon/更多.svg" alt="tooMany" />
            </el-button>
          </div>
        </div>
        <div class="card">
          <el-row>
            <el-col style="margin-bottom: 10px; margin-top: 10px" v-for="item in lists">
              <el-card class="box-card">
                <el-row>
                  <el-col class="article-img" :span="5">
                    <el-image style="width: 100px; height: 100px" :src="item.img" fit="fill" />
                  </el-col>
                  <el-col :span="19">
                    <el-col>
                      <el-row class="article-title">
                        <el-text class="mx-1" size="large" tag="b">{{ item.title }}</el-text>
                      </el-row>
                      <el-row class="article-author">
                        <el-text class="mx-1" size="large" tag="b">{{ item.author }}</el-text>
                      </el-row>
                      <el-row class="article-content">
                        <el-text class="mx-1" size="large" tag="b">{{ item.content }}</el-text>
                      </el-row>
                    </el-col>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col class="new-article" :span="8">
        <el-card>
          <div class="title">
            <el-text class="mx-1" size="large" tag="b">最新文章</el-text>
            <el-divider />
            <el-row>
              <el-col>
                <div class="title">
                  <el-text class="mx-1" size="large" tag="b">为什么需要贝贝</el-text>
                </div>
                <el-row>
                  <el-col :span="6">
                    <el-image></el-image>
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
const url = 'src/assets/avatar/beibei.png'

const lists = [
  { img: 'src/assets/avatar/beibei.png', title: '泥嚎', author: '贝贝', content: '贝贝是猪娃娃' },
  { img: 'src/assets/avatar/beibei.png', title: '泥嚎', author: '贝贝', content: '贝贝是猪娃娃' },
  { img: 'src/assets/avatar/beibei.png', title: '泥嚎', author: '贝贝', content: '贝贝是猪娃娃' },
  { img: 'src/assets/avatar/beibei.png', title: '泥嚎', author: '贝贝', content: '贝贝是猪娃娃' }
]
</script>

<style scoped lang="less">
#article {
  margin-top: 20px;
  .featured-article-title {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .featured-article-title-button {
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
      width: 100%;
    }
  }
}
</style>
