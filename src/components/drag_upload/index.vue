<template>
  <div class="item">
    <h3>拖拽上传</h3>
    <section class="upload_box" ref="upload">
      <input type="file" ref="fileInput" @change="changeFile" class="upload_inp" />
      <div class="upload_drag">
        <i class="icon"></i>
        <span class="text"
          >将文件拖到此处，或<a href="javascript:;" @click.prevent="clickUpload" class="upload_submit"
            >点击上传</a
          ></span
        >
      </div>
      <div class="upload_mark">正在上传中，请稍等...</div>
    </section>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import api from '@svi/instance.js'

const upload = ref(null)
onMounted(() => {
  // 事件在可拖动的元素或者被选这的文本被拖进有效目标的时候出发-该事件在放置目标触发
  upload.value.addEventListener('dragover', handleDragover)
  // 在元素或者文本元素被放置到有效的目标元素上触发
  upload.value.addEventListener('drop', handleDrop)
  // 事件在用户将元素拖离有效放置目标时触发
  //   upload.value.addEventListener('dragleave', handleDragleave)
  // 事件在用户将元素拖入有效的放置目标中时触发
  //   upload.value.addEventListener('dragenter', handleDragenter)
  // 事件在用户将内容从某个元素拖到其他元素中时触发
  upload.value.addEventListener('paste', handlePaste)
})

const fileInput = ref(null)
const clickUpload = () => {
  fileInput.value.click()
}

const handleFileName = async (file) => {
  debugger
  try {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('filename', file.name)
    let resData = await api.post('/upload_single', formData)
    if (resData.code === 0) {
      alert(`恭喜您，文件上传成功，您可以基于 ${resData.servicePath} 访问该文件~~`)
      return resData.codeText
    }
  } catch (err) {
    alert(`很遗憾，文件上传失败，请您稍后再试~~`)
  } finally {
  }
}
const handleDragover = (e) => {
  e.preventDefault()
}
const changeFile = (e) => {
  debugger
  let target = e.target
  let file = target.files[0]
  handleFileName(file)
}

const handleDrop = (e) => {
  e.preventDefault()
  let dataTransfered = e.dataTransfer
  let files = dataTransfered.files
  handleFileName(files[0])
}

const handlePaste = (e) => {
  e.preventDefault()
  handleFileName(e.clipboardData.files)
}
</script>

<style lang="less" scoped></style>
