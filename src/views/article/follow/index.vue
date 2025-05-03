<template>
  <div class="article-follow">
    <ul>
      <li v-for="item in articleList" :key="item.id">
        <div class="article-header">
          <img :src="item.avatar" alt="" />
          <span>{{ item.nickName }}</span>
        </div>
        <h2 class="article-title" @click="openDetail(item)">{{ item.title }}</h2>
        <div class="article-content">
          {{ stripHtml(item.content, 100) }}
        </div>
        <div class="article-actions">
          <div class="left-actions">
            <ul>
              <li @click="toggleLike(item)">
                <img
                  :src="item.likeFlag ? 'src/assets/icon/like-fill.svg' : 'src/assets/icon/like.svg'"
                  class="action-icon"
                />
                <span :class="item.likeFlag ? 'likeNum' : ''">{{ item.likeCount }}</span>
              </li>
              <li>
                <img src="../../../assets/icon/comment.svg" />
                {{ item.commentCount }}
              </li>
              <li>
                <img src="../../../assets/icon/view.svg" />
                {{ item.viewCount }}
              </li>
            </ul>
          </div>
          <div class="right-actions">
            <ul>
              <li @click="toggleSave(item)">
                <img
                  :src="item.saveFlag ? 'src/assets/icon/save-fill.svg' : 'src/assets/icon/save.svg'"
                  class="action-icon"
                />
              </li>
              <!--              <li>-->
              <!--                <img src="@/assets/icon/share.svg" />-->
              <!--              </li>-->
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        layout="sizes, prev, pager, next, total"
        :total="articleTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useArticleStore from '@/store/article/article.ts'
import { storeToRefs } from 'pinia'
import useLikeStore from '@/store/like/like.ts'
import useSaveStore from '@/store/save/save.ts'
import { stripHtml } from '@/utils/htmlUtils'

const currentPage = ref(1)
const pageSize = ref(5)

function handleSizeChange() {
  fetchArticleListData()
}
function handleCurrentChange() {
  fetchArticleListData()
}

function fetchArticleListData() {
  const size = pageSize.value
  const pageNum = currentPage.value
  const info = { size, pageNum }
  articleStore.getFollowingArticleListAction(info)
}

const articleStore = useArticleStore()
const likeStore = useLikeStore()
const saveStore = useSaveStore()

fetchArticleListData()
const { articleList, articleTotalCount } = storeToRefs(articleStore)
const { likeStatus, likeCounts } = storeToRefs(likeStore)

onMounted(() => {
  articleList.value.forEach((article) => {
    likeStore.getLikeStatusAction(article.id)
    likeStore.getLikeCountAction(article.id)
  })
})

const toggleLike = async (item: any) => {
  await likeStore.toggleLikeAction(item.id)
  // 更新文章列表中的点赞状态和数量
  item.likeFlag = likeStatus.value[item.id]
  item.likeCount = likeCounts.value[item.id]
}

const toggleSave = async (item: any) => {
  if (item.saveFlag) {
    // 如果已经收藏，则取消收藏
    const success = await saveStore.deleteSaveAction(item.id)
    if (success) {
      item.saveFlag = false
    }
  } else {
    // 如果未收藏，则添加收藏
    const success = await saveStore.addSaveAction(item.id)
    if (success) {
      item.saveFlag = true
    }
  }
}

const router = useRouter()
function openDetail(item: any) {
  router.push(`/article/detail/${item.id}`)
}
</script>

<style scoped lang="less">
.article-follow {
  display: flex;
  flex-wrap: wrap;

  > ul {
    width: 100%;
    padding: 20px;

    > li {
      border-bottom: 1px solid #eee;
      padding: 10px 0;
    }
  }
}

.article-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 2px;
  }

  span {
    font-size: 16px;
    font-weight: 600;
    margin-left: 5px;
  }
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 40px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #1296db;
  }
}

/*多行省略*/
.article-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 15px;
  line-height: 26px;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}

.left-actions {
  display: flex;

  ul {
    display: flex;

    li {
      display: flex;
      align-items: center;
      margin-right: 25px;
      color: #515151;
      cursor: pointer;

      img {
        height: 20px;
      }

      .likeNum {
        color: #1296db;
      }
    }
  }
}

.right-actions {
  display: flex;

  ul {
    display: flex;

    li {
      display: flex;
      align-items: center;
      margin-right: 25px;
      color: #515151;
      cursor: pointer;

      img {
        height: 20px;
      }
    }
  }
}

/* 为图片添加动态效果 */
.action-icon {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

/* 鼠标悬停时进行缩放 */
.article-actions li:hover .action-icon {
  transform: scale(1.1);
  /* 图片放大 */
  opacity: 0.7;
  /* 图片透明度变化 */
}

.pagination {
  margin-left: 20px;
  margin-bottom: 20px;
}
</style>
