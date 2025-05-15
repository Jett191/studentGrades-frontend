<template>
  <vxe-modal title="查看文件" resize show-zoom height="95vh" width="60%" v-model="showPreview" class="preview-overlay" @click="closePreview" >
    <div style="height: 100%; display: flex; flex-direction: column;">
      <iframe width="100%" height="100%" class="preview-frame" :src="previewUrl"></iframe>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <el-button type="primary" class="close-button" @click="closePreview">关闭</el-button>
      </div>
    </div>
  </vxe-modal>
</template>

<script>
export default {
  name: "kkFileViewName",
  data() {
    return {
      showPreview: false,
      previewUrl: null,
    }
  },
  methods: {
    handleOpen(row) {
      this.showPreview = true;
      this.previewUrl = '';
      let originUrl = 'http://127.0.0.1:8080/profile/upload/' + row.name.split('/').pop();
      let latin1Url = encodeURIComponent(originUrl).replace(/%[0-9A-F]{2}/g, match => String.fromCharCode(parseInt(match.substring(1), 16)));
      let encodedUrl = btoa(latin1Url);
      this.previewUrl = 'http://127.0.0.1:8012/onlinePreview?url=' + encodeURIComponent(encodedUrl) + '&officePreviewType=pdf';
    },
    closePreview() {
      this.showPreview = false;
      // 可以在这里重置 previewUrl，以便下次打开时重新加载
      this.previewUrl = '';
    },
  }
}
</script>

<style scoped>

</style>
