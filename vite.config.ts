/*
 * @Author: htz
 * @Date: 2024-05-31 21:38:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-01 11:08:54
 * @Description: 请填写简
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      "@components": fileURLToPath(new URL('./src/components', import.meta.url)),
      "@svi": fileURLToPath(new URL('./src/http', import.meta.url)),
    }
  }

})
