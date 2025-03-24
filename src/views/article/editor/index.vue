<template>
  <div class="editor-container">
    <div class="editor-header">
      <el-input
        v-model="articleTitle"
        placeholder="请输入文章标题"
        class="title-input"
        size="large"
      />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const articleTitle = ref('')
const textColor = ref('')
const linkDialogVisible = ref(false)
const linkForm = ref({
  text: '',
  url: ''
})

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
      // TODO: 实现图片上传到服务器的逻辑
      const url = URL.createObjectURL(file)
      editor.value?.chain().focus().setImage({ src: url }).run()
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

// 组件销毁时清理编辑器
onBeforeUnmount(() => {
  editor.value?.destroy()
})

const handleSubmit = () => {
  const content = editor.value?.getHTML()
  console.log('文章标题:', articleTitle.value)
  console.log('文章内容:', content)
  // TODO: 实现发布文章的逻辑
}

const handleSaveDraft = () => {
  const content = editor.value?.getHTML()
  // TODO: 实现保存草稿的逻辑
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
  .title-input {
    font-size: 24px;
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
</style>
