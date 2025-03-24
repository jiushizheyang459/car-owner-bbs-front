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
            <el-col style="margin-top: 10px" v-for="item in lists1">
              <el-card
                class="box-card"
                shadow="hover"
                :body-style="{ padding: '0', height: '100%' }"
              >
                <el-row style="height: 100%">
                  <el-col class="article-img" :span="5">
                    <el-image style="height: 100%; width: 100%" :src="item.img" fit="cover" />
                  </el-col>
                  <el-col :span="19" class="content-wrapper">
                    <el-row class="article-body" justify="space-between">
                      <el-col>
                        <div
                          style="display: flex; align-items: center; justify-content: flex-start"
                        >
                          <el-avatar size="small" :src="item.avater" />
                          <el-text class="mx-1 author-text" size="large" tag="b">{{
                            item.author
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
      <el-col class="new-article" :span="8">
        <el-card>
          <div class="title">
            <el-text class="mx-1" size="large" tag="b">最新文章</el-text>
            <el-divider />
            <el-row>
              <el-col style="margin-bottom: 15px; margin-top: 1px" v-for="item in lists2">
                <div class="title">
                  <el-text class="mx-1" size="large" tag="b">{{ item.title }}</el-text>
                </div>
                <el-row style="margin-top: 10px" type="flex" justify="space-between" align="middle">
                  <el-col :span="18">
                    <div style="display: flex; align-items: center">
                      <el-avatar size="small" :src="item.avater" />
                      <span style="font-size: 12px">{{ item.author }}</span>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div style="display: flex; align-items: center; justify-content: flex-end">
                      <el-image
                        style="width: 24px; height: 24px"
                        src="src/assets/icon/点赞.svg"
                        fit="fill"
                      />
                      <span style="font-size: 12px">{{ item.favour }}</span>
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
const lists1 = [
  {
    img: 'src/assets/avatar/beibei.png',
    avater: 'src/assets/avatar/beibei.png',
    title: '泥嚎',
    author: '贝贝',
    content:
      '贝贝是猪娃娃，这是一个客观事实，为什么呢，因为贝贝是个猪娃娃，吃了睡睡了吃，一天不是种草就是八屎，你说这不是猪娃娃是啥，大家心里都清楚这个事情，但是没人给她说这个事情，所以她一直觉得好的，还特别特别的能花钱'
  },
  {
    img: 'src/assets/avatar/beibei.png',
    avater: 'src/assets/avatar/beibei.png',
    title: '泥嚎',
    author: '贝贝',
    content: '贝贝是猪娃娃'
  },
  {
    img: 'src/assets/avatar/beibei.png',
    avater: 'src/assets/avatar/beibei.png',
    title: '泥嚎',
    author: '贝贝',
    content: '贝贝是猪娃娃'
  },
  {
    img: 'src/assets/avatar/beibei.png',
    avater: 'src/assets/avatar/beibei.png',
    title: '泥嚎',
    author: '贝贝',
    content: '贝贝是猪娃娃'
  }
]

const lists2 = [
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  },
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  },
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  },
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  },
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  },
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  },
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  },
  {
    avater: 'src/assets/avatar/beibei.png',
    title: '盐官gai上的霸王花是谁？',
    author: '贝贝',
    favour: 13
  }
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
      height: 140px;
      width: 100%;

      .article-img {
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

        .article-body {
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
            -webkit-line-clamp: 3; /* 固定显示3行 */
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.5em;
            max-height: 4.5em; /* 3行的高度 = 行高 × 行数 */
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .new-article {
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
