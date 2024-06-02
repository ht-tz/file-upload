<!--
 * @Author: htz
 * @Date: 2024-06-01 20:43:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-02 11:12:35
 * @Description: 多文件上传 
-->
<template>
  <div class="item">
    <h3>多文件上传</h3>
    <section class="upload_box" id="upload5">
      <input @change="fileChange" ref="fileInput" multiple type="file" class="upload_inp" />
      <div class="upload_button_box">
        <button @click="selectFile" class="upload_button select">选择文件</button>
        <button @click="uploadServer" class="upload_button upload">上传到服务器</button>
      </div>
      <ul class="upload_list">
        <li class="list-item" v-for="(item, index) in fileList" :key="index">
          <span class="name">{{ item.name }}</span>
          <span class="size">{{ item.progress || 0 }} </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import api from '@svi/instance.js'
import { ref } from 'vue'
let fileList = ref([])

const fileInput = ref<HTMLInputElement>()

const selectFile = () => {
  fileInput.value?.click()
}

const fileChange = (e: Event) => {
  let target = e.target
  let file = target.files[0]
  fileList.value.push(file)
  console.log(fileList.value)
}

const uploadServer = () => {
  if (fileList.value.length === 0) {
    alert('请先选择要上传的文件！')
    return
  }

  fileList.value.map((item) => {
    let formData = new FormData()

    formData.append('file', item)
    let filename = item.name
    formData.append('filename', filename)
    return api
      .post('/upload_single', formData, {
        onUploadProgress: (progressEvent: Event) => {
          let complete = (((progressEvent.loaded / progressEvent.total) * 100) | 0) + '%'
          item.progress = complete
          console.log(complete)
        },
      })
      .then((res: any) => {
        if (res.code === 0) {
          console.log(`${filename}上传成功！`)
          return
        }
        return Promise.reject(res)
      })
  })

  Promise.all(fileList.value)
    .then((res) => {
      alert('all files upload success')
    })
    .catch((err) => {
      alert('some files upload fail')
    })
    .finally(() => {
    })
}
</script>

<style lang="less" scoped>
.upload_list {
  display: block;
}
.list-item {
  width: 300px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;

  .name {
    font-weight: 300;
    color: aquamarine;
  }
}
</style>
