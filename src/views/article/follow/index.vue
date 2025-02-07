<template>
  <div class="article-follow">
    <ul>
      <li v-for="item in list" :key="item.id">
        <div @click="openDetail(item)">
          <div class="article-header">
            <img :src="item.img" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <h2 class="article-title">{{ item.title }}</h2>
          <div class="article-content">
            {{ item.content }}
          </div>
        </div>
        <div class="article-actions">
          <div class="left-actions">
            <ul>
              <li @click="toggleFavour(item)">
                <img
                  :src="item.favourFlag ? 'src/assets/icon/点赞.svg' : 'src/assets/icon/favour.svg'"
                  class="action-icon"
                />
                <span :class="item.favourFlag ? 'favourNum' : ''">{{ item.favour }}</span>
              </li>
              <li>
                <img src="@/assets/icon/comment.svg" />
                {{ item.comment }}
              </li>
              <li>
                <img src="@/assets/icon/view.svg" />
                {{ item.viewCount }}
              </li>
            </ul>
          </div>
          <div class="right-actions">
            <ul>
              <li @click="toggleSave(item)">
                <img
                  :src="item.saveFlag ? 'src/assets/icon/收藏.svg' : 'src/assets/icon/save.svg'"
                  class="action-icon"
                />
              </li>
              <li>
                <img src="@/assets/icon/share.svg" />
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const list = ref([
  {
    img: 'src/assets/avatar/beibei.png',
    name: '歹毒贝贝',
    title: '建议周志敏把杨清逸打一顿',
    content:
      '近日，周志敏和杨清逸骂涨，周志敏一怒之下，把贝贝的笔洗摔了。著名教育家，画家，知名穿搭博主、美妆博主，小红书资深用户，微博SVIP会员贝贝女士建议两个人出门都被半挂创死，这样一来杨清逸就再也不敢这么嚣张了',
    id: '1',
    favourFlag: false,
    favour: 88,
    comment: 10,
    viewCount: 10,
    saveFlag: false
  }
])

const toggleFavour = (item: any) => {
  item.favourFlag = !item.favourFlag
  item.favour = item.favour === 88 ? item.favour + 1 : item.favour - 1
}

const toggleSave = (item: any) => {
  item.saveFlag = !item.saveFlag
}

const router = useRouter()
function openDetail(item: any) {
  router.push('/article/detail')
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
      .favourNum {
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
  transform: scale(1.1); /* 图片放大 */
  opacity: 0.7; /* 图片透明度变化 */
}
</style>
