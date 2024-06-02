<!--
 * @Author: htz
 * @Date: 2024-05-31 21:43:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-01 22:13:04
 * @Description: 缩略图文件上传
-->
<template>
  <div class="container">
    <div class="item">
      <h3>单一文件上传「缩略图处理」</h3>
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
        <div class="sut">
          <img :src="sutSrc" alt="" />
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

let sutSrc = ref(null)

// input
const avatFile = ref(null)

// 存储文件
let file = reactive({})
let fileName = ref(null)

// 选择文件上传
const chooseFile = (event) => {
  avatFile.value.click()
}

// 文件转base64
const changeBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (ev) => resolve(ev.target.result)
  })
}

//
const changeBuffer = (file) => {
  return new Promsie((resolve, reject) => {
    let fileReader = new FileReader()
    // 异步读取文件内容，读取为ArrayBBuffer类型
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = (ev) => {
      let buffer = ev.target.result,
        //用于计算MD5的SparkMD5对象
        spark = new SparkMD5.ArrayBuffer(),
        HASH,
        suffix
      // 读取到的文件内容添加到MD%HASH值实例当当中去
      spark.append(buffer)
      // 根据文件内容计算hash
      HASH = spark.end()
      suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]
      resolve({
        buffer,
        HASH,
        suffix,
        filename: `${HASH}.${suffix}`,
      })
    }
  })
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
    .post('/upload_name', formData)
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
      sutSrc.value = null
    })
}

const change = async (event) => {
  let target = event.target
  // name 文件名称
  // size 文件大小
  // type 文件类型
  let fileData = target.files[0]
  if (!fileData) return

  //限制文件上传的大
  if (fileData.size > 2 * 1024 * 1024) {
    alert('上传的文件大小不能超过2kb')
    return
  }
  file.value = fileData
  //缩略图 关键核心
  let Base64 = await changeBase64(fileData)
  sutSrc.value = Base64
  fileName.value = fileData.name
  console.log(file.value, fileName.value)
  showList = true
  showTips = false
  console.log(target)
}

const del = () => {
  file.value = null
  fileName.value = null
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
.sut {
  wdith: 400px;
  height: 400px;
  border: 1px solid #ccc;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
