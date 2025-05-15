// 显示文件大小为KB, MB, GB, TB
import {getDept} from "@/api/system/dept";

export function formatFileSize(size) {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 上传失败
export function handleUploadError() {
  this.$modal.msgError("上传文件失败，请重试");
  this.$modal.closeLoading();
}

// 获取文件名原名
export function getFileNames(row) {
  // 从路径中提取文件名
  return row.fileName.split('/').pop(); // 返回文件名部分
}

// 获取当前登录用户的部门详细名称(包含上级名称)
export function getFullDeptLabel(deptId) {
  // 调用 getDept 方法获取部门信息
  return getDept(deptId).then(res => {
    // 如果有上级部门（parentId 存在）
    if (res.data.parentId) {
      // 递归调用 getFullDeptLabel 获取上级部门的完整标签
      return this.getFullDeptLabel(res.data.parentId).then(parentLabel => {
        // 返回上级部门标签和当前部门标签的组合
        return parentLabel + '/' + res.data.deptName;
      });
    } else {
      // 如果没有上级部门，直接返回当前部门的标签
      return res.data.deptName;
    }
  });
}

//获取当前日期
export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1; // 注意月份是从 0 开始的
  let day = today.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

//给一级节点和所有下级节点设置不同的图标
export function renderContent(h, { node, data, store }) {
  const iconClass = node.level === 1 ? 'el-icon-menu' : 'el-icon-document';
  return h('span', {}, [
    h('i', { class: iconClass }),
    h('span', data.label)
  ]);
}

//遍历树形结构并只保留第一级和第二级的数据
export function extractFirstTwoLevels(tree) {
  return tree.map(item => {
    const result = { ...item }; // 复制当前节点的所有属性
    if (item.children && item.children.length > 0) {
      // 如果当前节点有子节点，只保留前两级的子节点
      result.children = item.children.map(child => ({
        ...child, // 复制子节点的所有属性
        children: child.children ? [] : undefined // 移除三级及以下的子节点
      }));
    } else {
      result.children = []; // 如果没有子节点，设置为空数组
    }
    return result;
  });
}
