<template>
  <div class="pane-account">
    <el-form
      :model="account"
      label-width="60px"
      size="large"
      :rules="accountRules"
      status-icon
      ref="formRef"
    >
      <el-form-item label="帐号" prop="userName">
        <el-input v-model="account.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="account.password" show-password />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormRules, ElForm } from 'element-plus'
import useLoginStore from '@/store/login/login.ts'
import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache.ts'

const CACHE_USERNAME = 'userName'
const CACHE_PASSWORD = 'password'

// 定义account数据
const account = reactive<IAccount>({
  userName: localCache.getCache(CACHE_USERNAME) ?? '',
  password: localCache.getCache(CACHE_PASSWORD) ?? ''
})

const accountRules = reactive<FormRules<RuleForm>>({
  userName: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 2, max: 10, message: '必须是2到10位的长度', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^[a-z0-9]{4,20}$/, message: '必须是4到20位的字母或数字组成', trigger: 'blur' }
  ]
})

const formRef = ref<InstanceType<typeof ElForm>>()
const loginStore = useLoginStore()

function loginAction(isRemPwd: boolean) {
  formRef.value?.validate((valid) => {
    if (valid) {
      //获取用户输入的账号和密码
      const userName = account.userName
      const password = account.password

      // 向服务器发送网络请求(携带账号和密码)
      loginStore.loginAccountAction({ userName, password }).then(() => {
        //判断是否需要记住密码
        if (isRemPwd) {
          localCache.setCache(CACHE_USERNAME, userName)
          localCache.setCache(CACHE_PASSWORD, password)
        } else {
          localCache.removeCache(CACHE_USERNAME)
          localCache.removeCache(CACHE_PASSWORD)
        }
      })
    } else {
      ElMessage.error('Oops, 请输入正确的格式！')
    }
  })
}

defineExpose({
  loginAction
})
</script>

<style scoped></style>
