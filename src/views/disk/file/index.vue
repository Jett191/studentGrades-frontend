<template>
  <div class="app-containers">
    <div style="display: flex; color: #666">

      <div style="width: 200px; text-align: center; border-right: 1px solid #ddd; min-height: calc(100vh - 164px)">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="文件名称" prop="name" style="font-weight: 600">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入文件名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 第一部分 -->
        <div style="padding: 10px 0;">
          <!--          <div class="category" :class="{'category-active' : category === '全部文件' }" style="padding: 10px 0" @click="load">-->
          <!--            <i style="margin-right: 5px"></i>-->
          <!--            <span>{{ '全部文件' }}</span>-->
          <!--          </div>-->
          <!--          <div class="category" :class="{'category-active' : category === '图片' }" @click="loadImage" style="padding: 10px 0">-->
          <!--            <i class="el-icon-picture-outline" style="margin-right: 5px"></i>-->
          <!--            <span>{{ '图片' }}</span>-->
          <!--          </div>-->
          <!--          <div class="category" :class="{'category-active' : category === '文档' }" @click="loadWd" style="padding: 10px 0">-->
          <!--            <i class="vxe-icon-file-txt" style="margin-right: 5px"></i>-->
          <!--            <span>{{ '文档' }}</span>-->
          <!--          </div>-->
          <!--          <div class="category" :class="{'category-active' : category === '视频' }" @click="loadMp4" style="padding: 10px 0">-->
          <!--            <i class="el-icon-video-play" style="margin-right: 5px"></i>-->
          <!--            <span>{{ '视频' }}</span>-->
          <!--          </div>-->
          <!--          <div class="category" :class="{'category-active' : category === '压缩' }" @click="loadZip" style="padding: 10px 0">-->
          <!--            <i class="el-icon-box" style="margin-right: 5px"></i>-->
          <!--            <span>{{ '压缩' }}</span>-->
          <!--          </div>-->
        </div>
        <!-- 第二部分-->
        <!--        <div style="border-top: 1px solid #ddd; text-align: center; padding-top: 10px">-->
        <!--          <div style="padding: 10px 0; display: flex; justify-content: center" class="category"-->
        <!--               :class="{ 'category-active' : category === 'share'}">-->
        <!--            <div style="width: 90px; text-align: left">-->
        <!--              <i class="el-icon-share" style="margin-right: 5px"></i>-->
        <!--              <span>我的分享</span>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div style="padding: 10px 0; display: flex; justify-content: center" class="category"-->
        <!--               :class="{ 'category-active' : category === 'trash'}">-->
        <!--            <div style="width: 90px; text-align: left">-->
        <!--              <i class="el-icon-delete" style="margin-right: 5px"></i>-->
        <!--              <span>回收站</span>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->

      </div>

      <div style="flex: 1">
        <div>
          <div style="padding: 15px; border-bottom: 1px solid #ffffff">
            <!--            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">-->
            <!--              <el-form-item label="文件名称" prop="name" style="font-weight: 600">-->
            <!--                <el-input-->
            <!--                  v-model="queryParams.name"-->
            <!--                  placeholder="请输入文件名称"-->
            <!--                  clearable-->
            <!--                  @keyup.enter.native="handleQuery"-->
            <!--                />-->
            <!--              </el-form-item>-->
            <!--              <el-form-item>-->
            <!--                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
            <!--                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
            <!--              </el-form-item>-->
            <!--            </el-form>-->
            <!--            <br>-->
            <el-button type="primary" v-if="category === '全部文件' && userId === 1" @click="addFolder" >新建文件夹</el-button>
            <el-button type="primary" v-if="category === '全部文件'" @click="fileUpload">上传文件</el-button>
            <el-button type="danger" @click="handleDelete" >批量删除</el-button>
            <el-button type="primary" v-if="nowFilesId !== 0" @click="directory">回到根目录</el-button>
            <!--            <el-button type="primary" v-if="category === '全部文件' && userId === 1" @click="addFolder" >新建文件夹</el-button>-->
            <!--            <el-button type="primary" v-if="category === '全部文件' && nowFilesId !== 0" @click="fileUpload">上传文件</el-button>-->
            <!--            <el-button type="danger" v-if="nowFilesId !== 0" @click="handleDelete" >批量删除</el-button>-->
            <!--            <el-button type="primary" v-if="nowFilesId !== 0" @click="directory">回到根目录</el-button>-->
          </div>
        </div>

        <!--        <div style="padding: 15px">-->
        <!--          <span>全部文件 <i class="el-icon-arrow-right"></i></span>-->
        <!--        </div>-->

        <div>
          <el-table height="70vh" stripe :data="tableData" :stripe="false" :border="false"
                    :header-cell-style="{fontWeight:'bold',color: '#666'}"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="文件名称">
              <template slot-scope="scope">
                <div v-if="scope.row.unSave">
                  <i style="color: #409EFF" :class="getFileIcon(scope.row.type)"></i>
                  <el-input size="mini" style="width: 300px; margin-right: 5px" v-model="scope.row.name"></el-input>
                  <el-button type="primary" size="mini" @click="save(scope.row)">确定</el-button>
                  <el-button type="danger" size="mini" @click="cancel(scope.row)">取消</el-button>
                </div>

                <div v-else-if="scope.row.update"> <!-- 修改文件(文件夹)名称 -->
                  <i style="color: #409EFF" :class="getFileIcon(scope.row.type)"></i>
                  <el-input size="mini" style="width: 300px; margin-right: 5px" v-model="scope.row.name"></el-input>
                  <el-button type="primary" size="mini" @click="updateFile(scope.row)">确定</el-button>
                  <el-button type="danger" size="mini" @click="cancel(scope.row)">取消</el-button>
                </div>

                <div style="display: flex" v-else @mouseenter="scope.row.optShow = true"
                     @mouseleave="scope.row.optShow = false">
                  <div style="cursor: pointer; flex: 1" @click="handleDblClick(scope.row)">
                    <i style="color: #409EFF; font-size: 17px" :class="getFileIcon(scope.row.type)"></i>
                    <span v-if="!scope.row.unSave" style="margin-left: 5px;">{{ scope.row.name }}</span>
                  </div>
                  <!--                  <div style="color: #409EFF; font-size: 14px" v-if="scope.row.optShow">-->
                  <div style="color: #409EFF; font-size: 16px">
                    <!--                    <el-tooltip content="分享" effect="light" :open-delay="500">-->
                    <!--                      <i class="el-icon-share" style="margin-right: 10px; cursor: pointer"></i>-->
                    <!--                    </el-tooltip>-->
                    <el-tooltip content="下载" effect="light" :open-delay="500">
                      <i class="el-icon-download" @click="handleDownload(scope.row)" v-if="scope.row.folder === '否'"
                         style="margin-right: 10px; cursor: pointer"></i>
                    </el-tooltip>
                    <el-tooltip content="删除" effect="light" :open-delay="500">
                      <i class="el-icon-delete" @click="handleDelete(scope.row)"
                         style="margin-right: 10px; cursor: pointer"></i>
                    </el-tooltip>
                    <el-tooltip content="重命名" effect="light" :open-delay="500">
                      <i class="vxe-icon-edit" @click="rename(scope.row)" v-if="scope.row.folder === '是'"
                         style="margin-right: 10px; cursor: pointer"></i>
                    </el-tooltip>
                    <!--                    <el-tooltip content="复制" effect="light" :open-delay="500">-->
                    <!--                      <i class="el-icon-document-copy" style="cursor: pointer"></i>-->
                    <!--                    </el-tooltip>-->
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" prop="updateTime"/>
            <el-table-column prop="size" label="文件大小"></el-table-column>
          </el-table>
        </div>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="load"
          />

      </div>
    </div>

    <vxe-modal title="文件上传" v-model="fjShangChuan" width="25%" showFooter show-zoom resize @close="fjClose">
      <el-upload
        align="center"
        class="upload-demo"
        multiple
        :action="uploadFileUrl"
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        :limit="20"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :headers="headers"
        ref="fileUpload"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          请上传
          <template> 大小不超过 <b style="color: #f56c6c">{{ 300 }}MB</b></template>
          <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
          的文件
        </div>
      </el-upload>

      <div slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
        <el-button v-if="allFilesUploaded === false" size="mini" type="primary" @click=fjClose>关 闭
        </el-button>
        <el-button v-if="allFilesUploaded === true" size="mini" type="primary" @click=fjClose>上传完成, 关闭
        </el-button>
      </div>

    </vxe-modal>

    <!-- 预览组件 -->
    <kk-file-view ref="preview"></kk-file-view>
  </div>
</template>

<script>

import {
  addFiles,
  addFolder,
  delFiles,
  listFiles,
  listImageFiles,
  listMp4Files,
  listWdFiles, listZipFiles,
  updateFiles
} from "@/api/disk/files";
import {getToken} from "@/utils/auth";
import KkFileView from "@/views/components/KKFileView/kkFileView";

export default {
  components: {KkFileView},
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      userId : this.$store.state.user.id,
      fjShangChuan: false, //附件上传弹窗
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传文件服务器地址
      fileList: [],
      headers: {Authorization: "Bearer " + getToken()},
      number: 0,
      uploadList: [],
      fileType: ["doc", "docx", "xls", "xlsx", "ppt", "txt", "pdf", "zip", "jpg", "png"],
      categoryList: [
        {"text": '全部文件', category: 'all', icon: ''},
        {"text": '图片', category: 'img', icon: 'el-icon-picture-outline'},
        {"text": '文档', category: 'docx', icon: 'vxe-icon-file-txt'},
        // {"text": '视频', category: 'video', icon: 'el-icon-video-play'},
        {"text": '压缩', category: 'zip', icon: 'el-icon-box'},
      ],
      typeList: [
        {text: 'mp3', icon: 'el-icon-mic'},
        {text: 'mp4', icon: 'el-icon-video-play'},
        {text: 'jpg', icon: 'vxe-icon-file-image'},
        {text: 'jpeg', icon: 'vxe-icon-file-image'},
        {text: 'png', icon: 'vxe-icon-file-image'},
        {text: 'pdf', icon: 'vxe-icon-file-pdf'},
        {text: 'docx', icon: 'vxe-icon-file-word'},
        {text: 'txt', icon: 'vxe-icon-file-txt'},
        {text: 'zip', icon: 'vxe-icon-file-zip'},
        {text: 'folder', icon: 'vxe-icon-folder-open'},
      ],
      category: '全部文件',
      tableData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        filesId: null,
        name: null,
        folder: null,
        file: null,
        type: null,
        size: null,
        userId: null,
        deptId: null,
        folderId: null,
        rootFolderId: null,
      },
      // 总条数
      total: 0,
      nowFilesId: 0, //当前所在文件夹的filesId
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      allFilesUploaded: false, // 添加这个来追踪所有文件是否上传完成
    }
  },
  computed: {
    getFileIcon() {
      return (type) => this.typeList.find(v => v.text === type)?.icon || 'el-icon-file';
    }
  },
  created() {
    this.load()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.queryParams.name == null) {
        this.$modal.alertWarning("请先输入要搜索的文件名称");
      }else {
        this.queryParams.pageNum = 1;
        this.getList();
      }
    },
    /** 查询网盘文件列表 */
    getList() {
      this.loading = true;
      this.nowFilesId = null
      this.queryParams.folderId = null
      listFiles(this.queryParams).then(response => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.load();
    },
    load() {
      this.resetForm("queryForm");
      this.nowFilesId = 0
      this.queryParams.folderId = 0
      this.category = '全部文件'
      this.queryParams.type = null
      listFiles(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total;
        this.tableData.forEach(item => {
          this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
        })
      })
    },
    //关闭上传附件弹窗后
    fjClose() {
      this.fjShangChuan = false
      this.fileList = []
      this.allFilesUploaded = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.filesId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    directory() {
      this.resetForm("queryForm");
      this.load();
    },
    loadImage() {
      this.nowFilesId = 0
      this.queryParams.folderId = 0
      this.category = '图片'
      listImageFiles(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total;
        this.tableData.forEach(item => {
          this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
        })
      })
    },
    loadWd() {
      this.nowFilesId = 0
      this.queryParams.folderId = 0
      this.category = '文档'
      listWdFiles(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total;
        this.tableData.forEach(item => {
          this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
        })
      })
    },
    loadMp4() {
      this.nowFilesId = 0
      this.queryParams.folderId = 0
      this.category = '视频'
      this.queryParams.type = 'mp4'
      listMp4Files(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total;
        this.tableData.forEach(item => {
          this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
        })
      })
    },
    loadZip() {
      this.nowFilesId = 0
      this.queryParams.folderId = 0
      this.category = '压缩'
      this.queryParams.type = 'zip'
      listZipFiles(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total;
        this.tableData.forEach(item => {
          this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
        })
      })
    },
    handleDblClick(row) {
      console.log('Double clicked on:', row.filesId);
      if (row.folder === '是') { //是文件夹
        this.nowFilesId = row.filesId
        this.queryParams.folderId = this.nowFilesId
        // 这里可以执行你需要的操作，例如打开文件、编辑文件名等
        this.queryParams.userId = this.$store.state.user.id
        listFiles(this.queryParams).then(res => {
          this.tableData = res.rows
          this.total = res.total;
          this.tableData.forEach(item => {
            this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
          })
          this.queryParams.userId = null
        })

      } else {
        console.log('不是文件夹 是文件')
        this.$refs.preview.handleOpen(row);
      }
    },
    rename(row) {
      this.$set(row, 'update', true)
    },
    updateFile(row) {
      updateFiles(row).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.queryParams.folderId = this.nowFilesId
        // 这里可以执行你需要的操作，例如打开文件、编辑文件名等
        this.queryParams.userId = this.$store.state.user.id
        listFiles(this.queryParams).then(res => {
          this.tableData = res.rows
          this.total = res.total;
          this.tableData.forEach(item => {
            this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
          })
          this.queryParams.userId = null
        })
      });
    },
    // 文件下载处理
    handleDownload(row) {
      const resource = row.file;
      // 默认方法
      this.$download.resource(resource);
    },
    addFolder() {
      this.tableData.unshift({name: '', type: 'folder', unSave: true})    //  unSave 控制输入框是否显示
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const filesId = row.filesId || this.ids;
      this.$modal.confirm('确定删除选中项？').then(function () {
        return delFiles(filesId);
      }).then(() => {
        this.queryParams.folderId = this.nowFilesId
        if (this.category === '图片') {
          this.loadImage()
        } else if (this.category === '文档') {
          this.loadWd();
        } else if (this.category === '视频') {
          this.loadMp4()
        } else if (this.category === '压缩') {
          this.loadZip()
        } else if (this.category === '全部文件') {
          this.queryParams.folderId = this.nowFilesId
          // 这里可以执行你需要的操作，例如打开文件、编辑文件名等
          this.queryParams.userId = this.$store.state.user.id
          listFiles(this.queryParams).then(res => {
            this.tableData = res.rows
            this.total = res.total;
            this.tableData.forEach(item => {
              this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
            })
            this.queryParams.userId = null
          })
        }
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    fileUpload() {
      this.fjShangChuan = true;
    },
    save(row) {  // 上传文件夹的方法 和编辑后保存
      let itemFile = {
        "name": row.name, //文件夹名
        "folder": '是', //是文件夹
        "folderId": this.nowFilesId, //所属文件夹ID
      };
      // 添加数据
      addFolder(itemFile).then(res => {
        this.$message.success("操作成功")
        this.queryParams.folderId = this.nowFilesId
        this.queryParams.userId = this.$store.state.user.id
        // 这里可以执行你需要的操作，例如打开文件、编辑文件名等
        listFiles(this.queryParams).then(res => {
          this.tableData = res.rows
          this.total = res.total;
          this.tableData.forEach(item => {
            this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
          })
          this.queryParams.userId = null
        })
      })
    },
    //取消新增文件或者修改文件夹名按钮
    cancel(row) {
      this.queryParams.folderId = this.nowFilesId
      // 这里可以执行你需要的操作，例如打开文件、编辑文件名等
      this.queryParams.userId = this.$store.state.user.id
      listFiles(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total;
        this.tableData.forEach(item => {
          this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
        })
        this.queryParams.userId = null
      })
    },
    //上传文件之前的钩子
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        const fileName = file.name.split('.');
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
        // 校检文件大小
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        this.$modal.loading("正在上传文件，请稍候...");
        this.number++;
        return true;
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].url + separator;
      }
      return strs !== '' ? strs.substr(0, strs.length - 1) : '';
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError("上传文件失败，请重试");
      this.$modal.closeLoading();
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功
    handleUploadSuccess(res, file) {
      console.log(res, 'dsadasasd')
      let that = this;
      if (res.code === 200) {
        this.uploadList.push({name: res.fileName, url: res.fileName, size: that.formatFileSize(file.size)});
        let itemFile = {
          "name": res.newFileName, //文件名
          "folder": '否', //不是文件夹
          "size": that.formatFileSize(file.size), //文件大小
          "file": res.url,
          "folderId": this.nowFilesId, //所属文件夹ID
        };
        // 添加数据
        addFiles(itemFile).then(resFil => {
          this.queryParams.folderId = this.nowFilesId
          this.queryParams.userId = this.$store.state.user.id
          if (this.category === '全部文件') {
            // 这里可以执行你需要的操作，例如打开文件、编辑文件名等
            listFiles(this.queryParams).then(res => {
              this.tableData = res.rows
              this.total = res.total;
              this.tableData.forEach(item => {
                this.$set(item, 'optShow', false)   // 强制设置每行  加一个 optShow属性
              })
              this.queryParams.userId = null
            })
          }
          // else if (this.category === '图片') {
          //   this.loadImage()
          // }else if (this.category === '文档') {
          //   this.loadWd()
          // }else if (this.category === '视频') {
          //   this.loadMp4()
          // }else if (this.category === '压缩') {
          //   this.loadZip()
          // }
        })
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
      this.allFilesUploaded = true
      this.$modal.msgSuccess("上传成功")
      // this.fjShangChuan = false
      // this.fileList = []
      this.allFilesUploaded = false
    },
    // 显示文件大小为KB, MB, GB, TB
    formatFileSize(size) {
      if (size === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    // 获取文件名称
    getFileName(name) {
      // 如果是url那么取最后的名字 如果不是直接返回
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return name;
      }
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.fileList = this.fileList.map(item => {
          // 使用replace方法去除name中的特定前缀
          item.name = item.name.split('/').pop();
          return item;
        });
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },

  }
}
</script>

<style scoped>
.app-containers {
  padding: 5px;
  position: relative;
}

.category {
  cursor: pointer;
}

.category:hover {
  background-color: #f8f8f8;
  color: #000;
}

.category-active {
  color: #1C56BA;
  font-weight: 600;
}
</style>
