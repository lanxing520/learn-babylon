<template>
  <div class="read-excel">
    <input type="file" class="m-b" accept=".xlsx, .xls" @change="handleFileUpload" />

    <table class="table" v-if="excelData.length">
      <thead>
        <tr>
          <th v-for="(header,i) in Object.values(excelData[0])" :key="i">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr v-for="(row, index) in excelData.slice(1)" :key="index">
          <td v-for="(value, i) in Object.values(row)" :key="i">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { readExcelFile } from '@/utils/readExcel.ts'
import { ref } from 'vue'
const emit = defineEmits(['file-upload'])
const excelData = ref<any>([])
const handleFileUpload = async (event: any) => {
  if (!event?.target?.files?.[0]) return
  const file = event.target.files[0]

  try {
    excelData.value = await readExcelFile(file)
    emit('file-upload', excelData.value)
  } catch (error) {
    console.error('解析Excel失败:', error)
    alert('文件解析失败，请检查文件格式')
  }
}
</script>
<style lang="scss" scoped>
.read-excel {
  height: 450px;

  .m-b{
    margin-bottom: 1rem;
  }

  table,
  th,
  td {
    border: 1px solid;
  }

  table {
    width: 100%;

    height: 400px;
    margin: 0 auto;
    display: block;
    overflow-x: auto;
    border-spacing: 0;
    border-collapse: collapse;
  }

  tbody {
    white-space: nowrap;
  }

  // th,
  // td {
  //   padding: 5px 10px;
  //   border-top-width: 0;
  //   border-left-width: 0;
  // }

  th {
    position: sticky;
    top: 0;
    background: #fff;
    vertical-align: bottom;
  }

  // th:last-child,
  // td:last-child {
  //   border-right-width: 0;
  // }

  // tr:last-child td {
  //   border-bottom-width: 0;
  // }
}
</style>
