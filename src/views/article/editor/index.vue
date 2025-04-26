<template>
  <div class="editor-container">
    <div class="editor-header">
      <el-row :gutter="20" align="middle" class="full-width">
        <el-col :span="16">
          <el-input
            v-model="articleTitle"
            placeholder="请输入文章标题"
            class="title-input"
            size="large"
          />
        </el-col>
        <el-col :span="8">
          <div class="thumbnail-upload">
            <el-button type="primary" @click="handleThumbnailUpload"> 上传缩略图 </el-button>
            <div v-if="thumbnail" class="thumbnail-preview" @click="showPreview">
              <img :src="thumbnail" alt="缩略图预览" />
              <div class="preview-hint">点击查看大图</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="editor-toolbar">
      <el-button-group>
        <!-- 加粗 -->
        <el-tooltip content="加粗" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor?.isActive('bold') }"
          >
            <img src="@/assets/icon/edit_icon/bold.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
        <!-- 斜体 -->
        <el-tooltip content="斜体" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor?.isActive('italic') }"
          >
            <img src="@/assets/icon/edit_icon/italics.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
        <!-- 下划线 -->
        <el-tooltip content="下划线" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleUnderline().run()"
            :class="{ 'is-active': editor?.isActive('underline') }"
          >
            <img src="@/assets/icon/edit_icon/underline.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
        <!-- 删除线 -->
        <el-tooltip content="删除线" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor?.isActive('strike') }"
          >
            <img src="@/assets/icon/edit_icon/stripper.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <!-- 标题 -->
      <el-button-group>
        <el-tooltip content="一级标题" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
          >
            H1
          </el-button>
        </el-tooltip>
        <el-tooltip content="二级标题" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
          >
            H2
          </el-button>
        </el-tooltip>
        <el-tooltip content="三级标题" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
          >
            H3
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button-group>
        <!-- 字体颜色 -->
        <el-tooltip content="字体颜色" placement="top">
          <el-color-picker v-model="textColor" show-alpha @change="setTextColor">
            <el-button>
              <img src="@/assets/icon/edit_icon/fontColor.svg" class="icon-btn" />
            </el-button>
          </el-color-picker>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button-group>
        <!-- 插入图片 -->
        <el-tooltip content="插入图片" placement="top">
          <el-button @click="handleImageUpload">
            <img src="@/assets/icon/edit_icon/insertImage.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
        <!-- 插入链接 -->
        <el-tooltip content="插入链接" placement="top">
          <el-button @click="handleInsertLink">
            <img src="@/assets/icon/edit_icon/links.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
        <!-- 插入引用 -->
        <el-tooltip content="插入引用" placement="top">
          <el-button
            @click="editor?.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor?.isActive('quote') }"
          >
            <img src="@/assets/icon/edit_icon/quote.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
        <!-- 插入分割线 -->
        <el-tooltip content="插入分割线" placement="top">
          <el-button @click="editor?.chain().focus().setHorizontalRule().run()">
            <img src="@/assets/icon/edit_icon/divisionLine.svg" class="icon-btn" />
          </el-button>
        </el-tooltip>
      </el-button-group>
    </div>

    <div class="editor-content">
      <editor-content :editor="editor" />
    </div>

    <div class="editor-footer">
      <el-button type="primary" @click="handleSubmit">发布文章</el-button>
      <el-button @click="handleSaveDraft">保存草稿</el-button>
    </div>

    <!-- 插入链接的对话框 -->
    <el-dialog v-model="linkDialogVisible" title="插入链接" width="30%">
      <el-form :model="linkForm">
        <el-form-item label="链接文本">
          <el-input v-model="linkForm.text" placeholder="请输入链接显示的文本" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="linkForm.url" placeholder="请输入链接地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="linkDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInsertLink">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" title="缩略图预览" width="50%" :show-close="true">
      <div class="preview-container">
        <img :src="thumbnail" alt="大图预览" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useRouter, useRoute } from 'vue-router'
import useArticleStore from '@/store/article/article'
import useUploadStore from '@/store/upload/upload'
import { ElMessage } from 'element-plus'
import type { IAddArticleDto } from '@/store/article/type'

const router = useRouter()
const route = useRoute()
const articleStore = useArticleStore()
const uploadStore = useUploadStore()

const articleTitle = ref('')
const textColor = ref('')
const linkDialogVisible = ref(false)
const linkForm = ref({
  text: '',
  url: ''
})
const articleId = ref<number | null>(null)
const thumbnail = ref('')
const previewVisible = ref(false)

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
      blockquote: {
        HTMLAttributes: {
          class: 'quote-block'
        }
      }
    }),
    Underline,
    TextStyle,
    Color,
    Image,
    Link.configure({
      openOnClick: true,
      validate: (href) => /^(https?:)?\/\//.test(href),
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'editor-link'
      }
    }),
    Placeholder.configure({
      placeholder: '开始写作吧...',
      showOnlyWhenEditable: true,
      emptyNodeClass: 'is-empty',
      emptyEditorClass: 'is-editor-empty',
      showOnlyCurrent: false,
      includeChildren: false
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
    }
  }
})

// 设置文字颜色
const setTextColor = (color: string | null) => {
  if (!color) {
    console.warn('未选择颜色或颜色被清空')
    return
  }
  editor.value?.chain().focus().setColor(color).run()
}

// 处理图片上传
const handleImageUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        ElMessage({
          type: 'info',
          message: '图片上传中...'
        })
        const imageUrl = await uploadStore.uploadImageAction(file)
        if (imageUrl) {
          editor.value?.chain().focus().setImage({ src: imageUrl }).run()
          ElMessage({
            type: 'success',
            message: '图片上传成功'
          })
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '图片上传失败，请重试'
        })
      }
    }
  }
  input.click()
}

// 处理插入链接
const handleInsertLink = () => {
  linkDialogVisible.value = true
}

// 确认插入链接
const confirmInsertLink = () => {
  if (linkForm.value.url) {
    const { from, to } = editor.value?.state.selection || {}

    // 确保 from 和 to 不是 undefined
    const safeFrom = from ?? 0
    const safeTo = to ?? safeFrom // 避免 undefined，默认等于 safeFrom

    const text =
      linkForm.value.text ||
      editor.value?.state.doc.textBetween(safeFrom, safeTo, '') ||
      linkForm.value.url

    // 确保链接以 http:// 或 https:// 开头
    let url = linkForm.value.url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    editor.value
      ?.chain()
      .focus()
      .insertContent(text)
      .setTextSelection({ from: safeFrom, to: safeFrom + text.length }) // 使用安全值
      .setLink({
        href: url,
        target: '_blank'
      })
      .run()
  }
  linkDialogVisible.value = false
  linkForm.value = { text: '', url: '' }
}

// 处理缩略图上传
const handleThumbnailUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        ElMessage({
          type: 'info',
          message: '图片上传中...'
        })
        const imageUrl = await uploadStore.uploadImageAction(file)
        if (imageUrl) {
          thumbnail.value = imageUrl
          ElMessage({
            type: 'success',
            message: '缩略图上传成功'
          })
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '缩略图上传失败，请重试'
        })
      }
    }
  }
  input.click()
}

// 组件挂载时检查是否有文章ID参数，如果有则查询文章详情
onMounted(async () => {
  // 从query参数中获取文章ID
  const id = route.query.id
  if (id) {
    articleId.value = Number(id)
    await fetchArticleDetail()
  }
})

// 获取文章详情
const fetchArticleDetail = async () => {
  if (!articleId.value) {
    ElMessage.error('文章ID为空，无法获取文章详情')
    return
  }

  try {
    await articleStore.getArticleDetailAction(articleId.value)
    const articleDetail = articleStore.articleDetail

    if (articleDetail) {
      // 回填文章标题
      articleTitle.value = articleDetail.title

      // 回填文章内容
      if (editor.value && articleDetail.content) {
        editor.value.commands.setContent(articleDetail.content)
      }

      // 回填缩略图
      if (articleDetail.thumbnail) {
        thumbnail.value = articleDetail.thumbnail
      }
    } else {
      ElMessage.error('未获取到文章详情数据')
    }
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

// 组件销毁时清理编辑器
onBeforeUnmount(() => {
  editor.value?.destroy()
})

const handleSubmit = async () => {
  if (!articleTitle.value) {
    ElMessage.warning('请输入文章标题')
    return
  }

  const content = editor.value?.getHTML()
  if (!content || content === '<p></p>') {
    ElMessage.warning('请输入文章内容')
    return
  }

  const articleData: IAddArticleDto = {
    title: articleTitle.value,
    content: content,
    summary: content.replace(/<[^>]+>/g, '').slice(0, 200), // 提取纯文本作为摘要
    categoryId: 1, // 默认分类
    thumbnail: thumbnail.value, // 使用上传的缩略图URL
    isTop: 0,
    status: 0, // 0表示发布
    isComment: 1 // 默认允许评论
  }

  let success = false
  if (articleId.value) {
    // 如果有文章ID，说明是从草稿箱跳转过来的，调用更新文章接口
    articleData.id = articleId.value // 添加文章ID
    success = await articleStore.updateArticleAction(articleData)
  } else {
    // 否则调用新增文章接口
    success = await articleStore.addArticleAction(articleData)
  }

  if (success) {
    router.push('/article/draft')
  }
}

const handleSaveDraft = async () => {
  if (!articleTitle.value) {
    ElMessage.warning('请输入文章标题')
    return
  }

  const content = editor.value?.getHTML()
  // 如果内容为空或只有空段落，则传递空字符串而不是null
  const finalContent = !content || content === '<p></p>' ? '' : content

  const articleData: IAddArticleDto = {
    title: articleTitle.value,
    content: finalContent,
    summary: finalContent ? finalContent.replace(/<[^>]+>/g, '').slice(0, 200) : '', // 提取纯文本作为摘要
    categoryId: 1, // 默认分类
    thumbnail: thumbnail.value, // 使用上传的缩略图URL
    isTop: 0,
    status: 1, // 1表示草稿
    isComment: 1 // 默认允许评论
  }

  let success = false
  if (articleId.value) {
    // 如果有文章ID，说明是从草稿箱跳转过来的，调用更新文章接口
    articleData.id = articleId.value // 添加文章ID
    success = await articleStore.updateArticleAction(articleData)
  } else {
    // 否则调用新增草稿接口
    success = await articleStore.addDraftArticleAction(articleData)
  }

  if (success) {
    router.push('/article/draft')
  }
}

const showPreview = () => {
  previewVisible.value = true
}
</script>

<style scoped lang="less">
.editor-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 5px #ddd;
  padding: 20px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.editor-header {
  .full-width {
    width: 100%;
    margin: 0;
  }

  .title-input {
    font-size: 24px;
    width: 100%;
  }

  .thumbnail-upload {
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: flex-end;
  }

  .thumbnail-preview {
    width: 120px;
    height: 72px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      .preview-hint {
        opacity: 1;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-hint {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-size: 14px;
    }
  }
}

.editor-toolbar {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  align-items: center;

  .icon-btn {
    width: 20px;
    height: 20px;
  }

  .el-button {
    &.is-active {
      background-color: #ecf5ff;
      color: #409eff;
    }
  }
}

.editor-content {
  flex: 1;

  :deep(.ProseMirror) {
    min-height: 400px;
    padding: 20px;

    &:focus {
      outline: none;
    }

    p.is-empty:first-child::before {
      content: '开始写作吧...';
      float: left;
      color: #aaa;
      pointer-events: none;
      height: 0;
      font-style: italic;
      position: absolute;
    }

    // 斜体样式
    em {
      font-style: italic;
    }

    // 引用样式
    blockquote.quote-block {
      border-left: 4px solid #409eff;
      margin: 1em 0;
      padding: 0.5em 1em;
      background-color: rgba(64, 158, 255, 0.1);
      border-radius: 4px;

      p {
        margin: 0;
        color: #666;
        font-style: italic;
      }
    }

    // 链接样式
    a.editor-link {
      color: #409eff !important;
      text-decoration: none;
      cursor: pointer;
      padding: 0 2px;
      border-radius: 2px;
      background-color: rgba(64, 158, 255, 0.1);
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(64, 158, 255, 0.2);
        text-decoration: underline;
      }
    }

    hr {
      border: none;
      border-top: 2px solid #eee;
      margin: 2em 0;
    }

    // 标题样式
    h1 {
      font-size: 2em;
      margin: 1em 0 0.5em;
    }

    h2 {
      font-size: 1.5em;
      margin: 1em 0 0.5em;
    }

    h3 {
      font-size: 1.17em;
      margin: 1em 0 0.5em;
    }
  }
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .preview-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }
}
</style>
