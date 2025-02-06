import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import oxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import prettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
const { rules } = pluginVue

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  oxlint.configs['flat/recommended'],
  skipFormatting,

  // 添加 Prettier 配置
  {
    name: 'app/prettier-integration',
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error', // 将 Prettier 问题视为 ESLint 错误
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    },
    settings: {
      ...prettier // 禁用与 Prettier 冲突的规则
    }
  }
]
