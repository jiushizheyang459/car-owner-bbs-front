<template>
  <el-dialog v-model="dialogVisible" width="30%" :close-on-click-modal="false" :show-close="false">
    <template #header>
      <div class="dialog-header">
        <span class="title">修改密码</span>
      </div>
    </template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import type { IUpdatePassword } from '@/store/user/type'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', form: IUpdatePassword): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const formRef = ref<FormInstance>()
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 4, max: 16, message: '密码长度在4-16个字符之间', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 4, max: 16, message: '密码长度在4-16个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 取消
function handleCancel() {
  dialogVisible.value = false
  resetForm()
}

// 确认
async function handleConfirm() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('confirm', { ...form })
    resetForm()
  } catch (error) {
    ElMessage.error('表单验证失败')
  }
}

// 重置表单
function resetForm() {
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}
</script>

<style lang="less" scoped>
.dialog-header {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  border-bottom: none;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
