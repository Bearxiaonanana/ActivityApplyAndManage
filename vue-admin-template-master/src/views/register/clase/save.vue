<template>
  <div class="app-container">
    添加班级
    <el-form label-width="120px">
      <el-form-item label="班级名称">
        <el-input v-model="clase.name" :rows="10" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="addClase">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import claseApi from '@/api/register/clase'

export default {
  data() {
    return {
      clase: {
        name: ''
      },
      saveBtnDisabled: false // 保存按钮是否禁用,
    }
  },
  created() { // 页面渲染之前执行
    this.init()
  },
  methods: {
    // 添加讲师的方法
    addClase() {
      claseApi.addClase(this.clase)
        .then(response => {
          // 添加成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // 回到列表页面 路由跳转
          this.$router.push({ path: '../clase/list' })
        })
    }

  }
}
</script>
