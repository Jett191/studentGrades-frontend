<template>
  <div class="image-preview-wrapper">
    <div ref="qrcode"></div>
    <div class="download_class">
      <el-link style="color: #1C56BA" :href="downloadUrl" :download="filename">下载二维码</el-link>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';

export default {
  name: "ImagePreviewBase64",
  data() {
    return {
      downloadUrl: '',
      filename: 'qrcode.png',
    };
  },

  props: {
    content: {
      type: String,
      required: true
    }
  },
  watch: {
    // 监听 content 的变化
    content(newContent) {
      this.generateQRCode(newContent);
    }
  },
  methods: {
    generateQRCode(content) {
      if (this.$refs.qrcode) {
        // 清除旧的二维码
        this.$refs.qrcode.innerHTML = '';

        // 生成新的二维码
        const qrcode = new QRCode(this.$refs.qrcode, {
          text: content, // 二维码内容
          width: 80,
          height: 80,
          colorDark: '#000000', // 黑色模块（默认暗色）
          colorLight: '#ffffff', // 白色背景（默认亮色）
        });

        // 将生成的二维码转为DataURL
        const canvas = this.$refs.qrcode.querySelector('canvas');
        const dataUrl = canvas.toDataURL('image/png');

        console.log(dataUrl, 'adsssssssssssssss')
        // 构造下载链接
        this.downloadUrl = dataUrl;
      }
    },
  },
  mounted() {
    this.generateQRCode(this.content);
  }
};
</script>

<style scoped>
.download_class {
  width: 100%; /* 可以根据需要调整宽度 */
  display: flex;
  justify-content: center; /* 水平居中 */
  padding-top: 5px; /* 间距 */
}

.image-preview-wrapper {
  display: flex;
  flex-direction: column; /* 设置为垂直排列 */
  align-items: center; /* 垂直居中 */
}
</style>
