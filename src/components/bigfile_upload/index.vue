<!--
 * @Author: htz
 * @Date: 2024-06-01 20:44:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-02 21:00:40
 * @Description: 文件上传
-->
<template>
  <div class="container">
    <div class="item">
      <h3>大文件上传</h3>
      <section class="upload_box" id="upload7">
        <input type="file" ref="fileInput" @change="fileChange" class="upload_inp" />
        <div class="upload_button_box">
          <button class="upload_button select" @click="uploadFile">上传图片</button>
        </div>
        <div class="upload_progress">
          <div class="value" ref="progress"></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SparkMD5 from 'spark-md5'
import api from '@svi/instance.js'

let fileInput = ref(null)
let fileData = ref(null)
let progress = ref(0)

const uploadFile = () => {
  fileInput.value.click()
}

const changeBuffer = (file) => {
  return new Promise((resolve) => {
    // 文件读取为arrayBuffer对象
    let fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = (e) => {
      let arrayBuffer = e.target.result
      //创建一个arraybuffer md5的一个实例
      let spark = new SparkMD5.ArrayBuffer()
      let subffix = null
      let HASH = null
      // 读取到的内容添加到ArrayBuffer中去
      spark.append(arrayBuffer)
      //计算内容的hash值
      HASH = spark.end()
      //提取文件的后缀名
      subffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]
      resolve({
        arrayBuffer,
        HASH,
        subffix,
        filename: `${HASH}.${subffix}`,
      })
    }
  })
}

const fileChange = async (event: any) => {
  let target = event.target
  let file = target.files[0]
  if (!file) return
  fileData.value = file

  debugger
  // 获取文件的hash
  let already = [],
    data = null,
    { HASH, subffix } = await changeBuffer(file)

  //获取已经上传的文件切片信息
  try {
    data = await api.get('/upload_already', {
      params: {
        HASH,
      },
    })

    if (data.code === 0) {
      //已上传的文件列表
      already = data.fileList
    }
  } catch (error) {}

  /************  实现文件的切片处理 固定数量，固定大小 ************/
  let maxSize = 1024 * 1000
  //文件的总数量
  let count = Math.ceil(file.size / maxSize)
  let index = 0
  let chunks = []
  // 总数超过100 总数就是100
  if (count > 100) {
    maxSize = file.size / 100
    count = 100
  }

  // 切片
  while (index < count) {
    chunks.push({
      file: file.slice(index * maxSize, (index + 1) * maxSize),
      filename: `${HASH}_${index + 1}.${subffix}`,
    })
    index++
  }

  // 上传完毕，
  index = 0
  // 查看文件是否上传完成
  const complete = async () => {
    debugger
    index++
    progress.value.style.width = `${(index / count) * 100}%`
    //切片为完成继续合并
    if (index < count) return
    progress.value.style.width = '100%'
    try {
      console.log(HASH, count)

      let resData = await api.post(
        '/upload_merge',
        {
          HASH,
          count,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      if (resData.code === 0) {
        alert(`恭喜您，文件上传成功，您可以基于 ${resData.servicePath} 访问该文件~~`)
        return
      }
      throw resData.codeText
    } catch (error) {
      alert('切片合并失败，请您稍后再试~~')
    }
  }

  //把每一个切片都上传到服务器中
  chunks.forEach((chunk) => {
    //已经上传的不应在上传
    if (already.length > 0 && already.includes(chunk.filename)) {
      complete()
      return
    }

    let fm = new FormData()
    fm.append('file', chunk.file)
    fm.append('filename', chunk.filename)
    api
      .post('/upload_chunk', fm)
      .then((res) => {
        if (+res.code === 0) {
          complete()
          return
        }
        return Promise.reject(res.codeText)
      })
      .catch(() => {
        alert('当前切片上传失败，请您稍后再试~~')
      })
  })
}
</script>

<style lang="less" scoped></style>
