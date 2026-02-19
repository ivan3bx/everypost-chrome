import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
  configureVueProject,
} from '@vue/eslint-config-typescript'
import globals from 'globals'

// Allow plain <script> blocks in .vue files (without lang="ts")
configureVueProject({ scriptLangs: ['ts', 'js'] })

export default defineConfigWithVueTs(
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.webextensions,
      },
    },
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  {
    files: ['tests/unit/**/*.spec.{j,t}s?(x)', '**/__tests__/*.{j,t}s?(x)'],
    languageOptions: {
      globals: globals.jest,
    },
  },
)
