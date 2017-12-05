<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
		<el-table-column type="selection"width="55"></el-table-column>
		
		
		<!--<el-table-column prop="date" label="日期"  width="180"> </el-table-column>-->
		
     <el-table-column align="center" label="序号" width="65" sortable>
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
			
      <el-table-column width="180px" align="center" label="用户名">
        <template scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="邮箱">
        <template scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="性别">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.sex}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="密码">
        <template scope="scope">
          <span>{{scope.row.password}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="用户名">
          <el-input type="text" placeholder="请输入用户名" v-model.trim="temp.username"></el-input>
        </el-form-item>

        <el-form-item label="性别">
					<input type="radio" name="sex" label="1"/>男
					<input type="radio" name="sex" label="2"/>女
					<input type="radio" name="sex" label="3"/>保密
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input type="text" placeholder="请输入邮箱" v-model.trim="temp.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号码">
          <el-input type="text" placeholder="请输入手机号码" v-model.trim="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :autosize="{minRows:2,maxRows:4}" placeholder="请输入内容" v-model.trim="temp.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList,AddUser,UpdataUser,DeleteUser } from '@/api/user'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'
export default {
  name: 'table_demo',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        username: '',
        password: '888888',
        sex: '',
        email: '',
        phone: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogTitle: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        console.log(response.data)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    timeFilter(time) {
      if (!time[0]) {
        this.listQuery.start = undefined
        this.listQuery.end = undefined
        return
      }
      this.listQuery.start = parseInt(+time[0] / 1000)
      this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加用户'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = '修改用户'
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm('你确定要删除该数据么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = { userId: row.id }
        DeleteUser(data)
          .then((result) => {
            if (!result.error_code) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            }
            this.getList()
          }, () => {
            console.log('操作失败')
          })
      })
    },
    update() {
      if (this.temp.id) {
        UpdataUser(this.temp)
          .then((result) => {
            if (!result.error_code) {
              this.dialogFormVisible = false
              this.getList()
            }
          }, () => {
            console.log('操作失败')
          })
      } else {
        AddUser(this.temp)
          .then((result) => {
            if (!result.error_code) {
              this.dialogFormVisible = false
              this.getList()
            }
          }, () => {
            console.log('操作失败')
          })
      }
    },
    resetTemp() {
      this.temp = {
        username: '',
        password: '888888',
        sex: '',
        email: '',
        phone: '',
        remark: ''
      }
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = ['时间', '地区', '类型', '标题', '重要性']
        const filterVal = ['timestamp', 'province', 'type', 'title', 'importance']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, 'table数据')
      })
    }
  }
}
</script>
