<template>
  <div class="header-info">
    <div class="operation">
      <span>
        <el-icon>
          <Message />
        </el-icon>
      </span>
      <span>
        <span class="dot"></span>
        <el-icon>
          <ChatDotRound />
        </el-icon>
      </span>
      <span>
        <el-icon>
          <Search />
        </el-icon>
      </span>
    </div>
    <div class="info">
      <el-dropdown>
        <span class="user-info">
          <el-avatar :size="30" :src="userInfo?.avatar || defaultAvatar"></el-avatar>
          <span class="name">{{ userInfo?.nickName || '未登录' }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleExitClick">
              <el-icon>
                <CircleClose />
              </el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-icon>
                <InfoFilled />
              </el-icon>
              <span>个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon>
                <Unlock />
              </el-icon>
              <span>修改密码</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChatDotRound,
  CircleClose,
  InfoFilled,
  Message,
  Search,
  Unlock
} from '@element-plus/icons-vue'
import { accountLogoutRequest } from '@/service/login/logout.ts'
import { localCache } from '@/utils/cache.ts'
import router from '@/router'
import { LOGIN_TOKEN, MENUS, USERINFO } from '@/global/constants.ts'
import { computed, ref } from 'vue'
import type { IUserInfoVo } from '@/store/login/type'

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 从本地缓存获取用户信息
const userInfo = computed(() => {
  return localCache.getCache(USERINFO) as IUserInfoVo
})

function handleExitClick() {
  //向服务器发送退出登录的请求
  accountLogoutRequest()
    .then(() => {
      //删除本地token
      localCache.removeCache(LOGIN_TOKEN)
      //删除本地用户信息
      localCache.removeCache(USERINFO)
      //删除本地动态菜单
      localCache.removeCache(MENUS)
      //跳回到login页面
      router.push('/login')
    })
    .catch((err) => {
      console.error('Logout failed:', err)
    })
}
</script>

<style lang="less" scoped>
.header-info {
  display: flex;
  align-items: center;
}

.operation {
  display: inline-flex;
  margin-right: 20px;

  span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 35px;

    &:hover {
      background: #f2f2f2;
    }

    i {
      font-size: 20px;
    }

    .dot {
      position: absolute;
      top: 3px;
      right: 3px;
      z-index: 10;
      width: 6px;
      height: 6px;
      background: red;
      border-radius: 100%;
    }
  }
}

.main[data-v-9e929bdd] {
  color: unset;
}

.info {
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;

    .name {
      margin-left: 5px;
    }
  }
}

.info {
  :global(.el-dropdown-menu__item) {
    line-height: 36px !important;
    padding: 6px 22px;
  }
}

:focus-visible {
  outline: none;
}
</style>
