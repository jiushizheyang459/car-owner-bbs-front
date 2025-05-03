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
          <span class="name">{{ nickName }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleExitClick" v-if="isLoggedIn">
              <el-icon>
                <CircleClose />
              </el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
            <el-dropdown-item @click="handleLoginClick" v-else>
              <el-icon>
                <CircleClose />
              </el-icon>
              <span>登录</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleUserInfoClick" v-if="isLoggedIn">
              <el-icon>
                <InfoFilled />
              </el-icon>
              <span>个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="isLoggedIn" @click="handleUpdatePasswordClick">
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

  <update-password-dialog v-model:visible="updatePasswordDialogVisible" @confirm="handleUpdatePasswordConfirm" />
</template>

<script setup lang="ts">
import { ChatDotRound, CircleClose, InfoFilled, Message, Search, Unlock } from '@element-plus/icons-vue'
import { accountLogoutRequest } from '@/service/login/logout.ts'
import { localCache } from '@/utils/cache.ts'
import router from '@/router'
import { LOGIN_TOKEN, USER_INFO, MENUS } from '@/global/constants.ts'
import { ref, onMounted, computed, watch, reactive } from 'vue'
import type { IUserInfo } from '@/store/login/type'
import type { IUpdatePassword } from '@/store/user/type'
import useUserStore from '@/store/user/user.ts'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import UpdatePasswordDialog from './UpdatePasswordDialog.vue'

// 设置为未登录状态的默认值
const defaultAvatar = '' // 空字符串会使用Element Plus的默认头像
const userInfo = ref<IUserInfo | null>(null)

// 获取用户store
const userStore = useUserStore()
const { userInfo: storeUserInfo } = storeToRefs(userStore)

// 监听store中的userInfo变化
watch(
  storeUserInfo,
  (newVal) => {
    if (newVal) {
      userInfo.value = newVal
      localCache.setCache(USER_INFO, newVal)
    }
  },
  { immediate: true }
)

// 组件挂载时从localCache中获取用户信息
onMounted(() => {
  userInfo.value = localCache.getCache(USER_INFO)
})

// 判断用户是否登录
const isLoggedIn = computed(() => {
  return !!userInfo.value && !!localCache.getCache(LOGIN_TOKEN)
})

// 获取昵称
const nickName = computed(() => {
  return isLoggedIn.value ? userInfo.value?.nickName : '未登录'
})

function handleExitClick() {
  //向服务器发送退出登录的请求
  accountLogoutRequest()
    .then(() => {
      //删除本地token
      localCache.removeCache(LOGIN_TOKEN)
      localCache.removeCache(USER_INFO)
      localCache.removeCache(MENUS)
      //跳回到login页面
      router.push('/login')
    })
    .catch((err) => {
      console.error('Logout failed:', err)
    })
}

function handleUserInfoClick() {
  router.push('/user/userinfo')
}

function handleLoginClick() {
  router.push('/login')
}

// 修改密码对话框相关
const updatePasswordDialogVisible = ref(false)

// 点击修改密码按钮
function handleUpdatePasswordClick() {
  updatePasswordDialogVisible.value = true
}

// 确认修改密码
async function handleUpdatePasswordConfirm(form: IUpdatePassword) {
  try {
    await userStore.updatePasswordAction(form)
    ElMessage.success('密码修改成功')
    updatePasswordDialogVisible.value = false
  } catch (error) {
    ElMessage.error('密码修改失败')
  }
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
