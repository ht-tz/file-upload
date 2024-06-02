<!--
 * @Author: htz
 * @Date: 2024-05-31 21:57:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-01 17:29:26
 * @Description: 请填写简介
-->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { routeArr } from './route.ts'
import { reactive, ref } from 'vue'
const router = useRouter()

let arr = reactive<any[]>([])

arr = routeArr.map((el) => el)

const menuClick = (obj: any): void => {
  const { path } = obj
  router.push(path)
}
</script>

<template>
  <div class="container">
    <div class="left">
      <div @click="menuClick(item)" v-for="(item, index) in arr" :key="index">
        <div class="item">{{ item.name }}</div>
      </div>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="less" scoped>
#app {
  width: 100vw;
  height: 100vh;
}
.container {
  display: grid;
  grid-template-columns: 200px auto;
  width: 100%;
  height: 100vh;

  .left {
    height: 100%;
    width: 200px;
    border: 1px solid #ccc;
    border-left: none;
    .item {
      cursor: pointer;
      text-align: center;
      &:hover {
        background-color: #7fe8e3;
      }
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      width: 200px;
    }
  }

  .right {
    padding: 20px;
  }
}
</style>
