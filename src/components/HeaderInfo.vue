<template>
  <div class="header-info">
    <div class="operation">
      <span>
        <el-icon>
          <Message />
        </el-icon>
      </span>
      <span @click="handleNotificationClick">
        <span class="dot" v-if="notificationStore.unreadCount > 0"></span>
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
          <el-avatar :size="30" shape="circle" :src="userInfo?.avatar || defaultAvatar"></el-avatar>
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
  <notification-list v-model="notificationDialogVisible" />
</template>

<script setup lang="ts">
import { ChatDotRound, CircleClose, InfoFilled, Message, Search, Unlock } from '@element-plus/icons-vue'
import { accountLogoutRequest } from '@/service/login/logout.ts'
import { localCache } from '@/utils/cache.ts'
import router from '@/router'
import { LOGIN_TOKEN, USER_INFO, MENUS } from '@/global/constants.ts'
import { ref, onMounted, computed, watch, reactive, onUnmounted } from 'vue'
import type { IUserInfo } from '@/store/login/type'
import type { IUpdatePassword } from '@/store/user/type'
import useUserStore from '@/store/user/user.ts'
import useNotificationStore from '@/store/notification/notification.ts'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import UpdatePasswordDialog from './UpdatePasswordDialog.vue'
import NotificationList from './NotificationList.vue'
import { Client } from '@stomp/stompjs'

// WebSocket相关
const stompClient = ref<Client | null>(null)

// 设置为未登录状态的默认值
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' // 空字符串会使用Element Plus的默认头像
const userInfo = ref<IUserInfo | null>(null)

// 获取用户store
const userStore = useUserStore()
const notificationStore = useNotificationStore()
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
  initWebSocket()
  // 获取初始未读通知数
  if (isLoggedIn.value) {
    notificationStore.getUnreadCountAction()
  }
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

// 通知对话框
const notificationDialogVisible = ref(false)

// 处理通知图标点击
function handleNotificationClick() {
  notificationDialogVisible.value = true
}

// 初始化WebSocket连接
const initWebSocket = () => {
  const token = localCache.getCache(LOGIN_TOKEN)
  if (!token || !userInfo.value) return

  // 如果已经有连接，先断开
  disconnectWebSocket()

  try {
    console.log('正在初始化WebSocket连接...')

    const client = new Client({
      brokerURL: `ws://${window.location.host}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log('WebSocket debug:', str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    })

    client.onConnect = () => {
      console.log('WebSocket连接成功, 用户ID:', userInfo.value?.id)

      // 订阅用户通知
      client.subscribe(`/user/${userInfo.value?.id}/notification`, (message) => {
        try {
          const notification = JSON.parse(message.body)
        } catch (error) {
          console.error('解析通知消息失败:', error)
        }
      })

      // 订阅未读通知数
      client.subscribe(`/user/${userInfo.value?.id}/unread-count`, (message) => {
        try {
          const count = parseInt(message.body)
          if (!isNaN(count)) {
            notificationStore.updateUnreadCount(count)
          }
        } catch (error) {
          console.error('处理未读数量失败:', error)
        }
      })
    }

    client.onStompError = (frame) => {
      console.error('STOMP协议错误:', frame)
    }

    console.log('激活WebSocket连接...')
    client.activate()
    stompClient.value = client
  } catch (error) {
    console.error('初始化WebSocket失败:', error)
  }
}

// 断开WebSocket连接
const disconnectWebSocket = () => {
  if (stompClient.value) {
    stompClient.value.deactivate()
    stompClient.value = null
  }
}

// 监听登录状态变化
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    initWebSocket()
    notificationStore.getUnreadCountAction()
  } else {
    disconnectWebSocket()
    notificationStore.updateUnreadCount(0)
  }
})

// 组件卸载时断开连接
onUnmounted(() => {
  disconnectWebSocket()
})
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
      display: inline-block;
      white-space: nowrap;
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

// 强制设置头像为圆形
:deep(.el-avatar) {
  border-radius: 50% !important;
  overflow: hidden;
}
</style>
