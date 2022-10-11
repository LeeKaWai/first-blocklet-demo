<template>
  <el-form :inline="true" :model="searchForm" class="demo-form-inline">
  
    <el-form-item label="数据来源">
      <el-select v-model="searchForm.method" placeholder="请选择数据来源">
        <el-option label="页面抓取" value="1" />
        <el-option label="API接口" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="账号">
      <el-input v-model="searchForm.a" placeholder="请输入账号"/>
    </el-form-item>
  
        <el-form-item label="第几页">
      <el-input v-model="searchForm.p" placeholder="请输入页码" />
    </el-form-item>
    <el-form-item label="每页数量">
      <el-input v-model="searchForm.offset" placeholder="请输入每页数量" />
    </el-form-item>
     

    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>


  <el-table v-if="searchForm.method === '1'" :data="tableData" border style="width: 100%">
    <el-table-column prop="TxnHash" label="Txn Hash"  />
    <el-table-column prop="Method" label="Method"/>
    <el-table-column prop="Block" label="Block" />
    <el-table-column prop="Age" label="Age" />
    <el-table-column prop="From" label="From" />
    <el-table-column prop="To" label="To" />
    <el-table-column prop="Value" label="Value" />
    <el-table-column prop="TxnFee" label="TxnFee" />
  </el-table>

  <el-table v-if="searchForm.method === '2'"  :data="tableData" border style="width: 100%">
    <el-table-column prop="hash" label="Txn Hash"  />
    <el-table-column prop="blockNumber" label="blockNumber"  />
    <el-table-column prop="timeStamp" label="timeStamp"/>
    <el-table-column prop="from" label="from" />
    <el-table-column prop="to" label="to" />
    <el-table-column prop="value" label="value" />
    <el-table-column prop="gas" label="gas" />
    <el-table-column prop="gasPrice" label="gasPrice" />
  </el-table>

</template> 

<script lang="ts" setup>
import { reactive,ref } from 'vue'
import axios from 'axios'
const tableData = ref<[]>([]);

const searchForm = reactive({
  method:"1",
  a: '0xeb2a81e229b68c1c22b6683275c00945f9872d90',
  p: 1,
  offset: 50
})

const onSubmit =  () => {
  tableData.value=[];
  const uri= searchForm.method==="1" ? '/api/txs':'/api/txs/api'
  axios.get(uri,{
    params: searchForm
  }).then(res=>{
    if(res.status === 200) {
      tableData.value = res.data.result
      debugger;
    }
  })

      
 
}
</script>
