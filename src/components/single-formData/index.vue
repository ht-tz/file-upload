<!--
 * @Author: htz
 * @Date: 2024-05-31 21:43:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-01 17:24:31
 * @Description: 单一文件上传
-->
<template>
  <div class="container">
    <div class="item">
      <h3>单一文件上传「FORM-DATA」</h3>
      <section class="upload_box" ref="upload1">
        <!-- accept=".png" 限定上传文件的格式 -->
        <input type="file" ref="avatFile" @change="change" class="upload_inp" accept=".png,.jpg,.jpeg" />
        <div class="upload_button_box">
          <button :disabled="cdisabled" @click="chooseFile" class="upload_button choose">选择文件</button>
          <button :disabled="sdisabled" @click="uploadServer" class="upload_button upload">上传到服务器</button>
        </div>
        <div class="upload_tip" v-if="showTips">只能上传 PNG/JPG/JPEG 格式图片，且大小不能超过2MB</div>
        <div class="file-list">
          <div class="name">{{ fileName }}</div>
          <div class="del" @click="del">移除</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '@svi/instance.js'
let cdisabled = ref(false)
let sdisabled = ref(false)
let showTips = ref(true)
let showList = ref(true)

// input
const avatFile = ref(null)

// 存储文件
let file = reactive({})
let fileName = ref(null)

// 选择文件上传
const chooseFile = (event) => {
  avatFile.value.click()
}

/**
 * @description 上传到服务器
 * @param event
 */
const uploadServer = () => {
  if (!fileName.value) {
    alert('请您先选择要上传的文件！')
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('filename', fileName.value)

  api
    .post('/upload_single', formData)
    .then((res) => {
      if (res.code === 0) {
        alert('文件已经上传成功！', `您可以基于 ${res.servicePath} 访问这个资源`)
        return
      }
      return Promise.reject(res.codeText)
    })
    .catch((err) => {
      alert('文件上传失败，请稍后')
    })
    .finally(() => {
      showList = false
      showTips = true
    })
}

const change = (event) => {
  let target = event.target
  // name 文件名称
  // size 文件大小
  // type 文件类型
  let fileData = target.files[0]
  console.log(fileData)
  if (!fileData) return

  //限制文件上传的大
  if (fileData.size > 2 * 1024 * 1024) {
    alert('上传的文件大小不能超过2kb')
    return
  }
  // 限制文件上传的格式「方案一」
  /* if (!/(PNG|JPG|JPEG)/i.test(file.type)) {
            alert('上传的文件只能是 PNG/JPG/JPEG 格式的~~');
            return;
        } */
  file.value = fileData
  fileName.value = fileData.name
  console.log(file.value, fileName.value)
  showList = true
  showTips = false
  console.log(target)
}

const del = () => {
  file.value = null
  showList = false
  showTips = true
}

const clearhandle = () => {
  file.value = null
  fileName.value = null
}
</script>

<style lang="less" scoped>
.upload_list {
  display: block;
}
.name {
  width: 200px;
  height: 36px;
  text-align: left;
  line-height: 36px;
  border: 1px solid #ccc;
  color: #000;
}
.del {
  width: 64px;
  height: 32px;
  border-radius: 4px;
  background-color: #4de0d2;
  text-align: center;
  line-height: 32px;
  margin-top: 16px;
  cursor: pointer;
}
</style>
