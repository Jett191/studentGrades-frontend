<template>
  <vxe-modal title="查看文件" resize show-zoom height="95vh" width="60%" v-model="showPreview" class="preview-overlay" @close="closePreview">
    <div style="height: 100%; display: flex; flex-direction: column;">
      <iframe width="100%" height="100%" class="preview-frame" :src="previewUrl" @load="iframeLoaded"></iframe>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <el-button type="primary" class="close-button" @click="closePreview">关闭</el-button>
      </div>
    </div>
  </vxe-modal>
</template>

<script>
export default {
  name: "kkFileView",
  data() {
    return {
      showPreview: false,
      previewUrl: null,
    }
  },
  methods: {
    handleOpen(row) {
      this.$modal.loading("正在打开文件，请稍后...");

      this.showPreview = true;
      // this.previewUrl = '';

      // 使用 row.fileName 如果存在，否则使用 row.name
      const fileName = row.fileName || row.name;

      let originUrl = 'http://127.0.0.1:8080' + fileName;
      let latin1Url = encodeURIComponent(originUrl).replace(/%[0-9A-F]{2}/g, match => String.fromCharCode(parseInt(match.substring(1), 16)));
      let encodedUrl = btoa(latin1Url);
      this.previewUrl = 'http://127.0.0.1:8012/onlinePreview?url=' + encodeURIComponent(encodedUrl) + '&officePreviewType=pdf';
    },
    iframeLoaded() {
      this.$modal.closeLoading();
    },
    closePreview() {
      // 可以在这里重置 previewUrl，以便下次打开时重新加载
      this.previewUrl = '';
      this.showPreview = false;

    },
  }
}
</script>

<style scoped>
</style>
