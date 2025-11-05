<template>
  <div class="industry-dynamics-page">
    <h1>行业动态</h1>
    <p>这里是行业动态页面内容。你可以添加行业新闻列表、趋势分析等。</p>
    <el-card shadow="hover">
      <template #header>
        <span>最新行业动态</span>
      </template>
      <el-table :data="industryList" style="width: 100%;">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="source" label="来源" />
        <el-table-column prop="summary" label="摘要" width="200">
          <template #default="{ row }">
            {{ row.summary.substring(0, 50) }}...
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 模拟行业动态数据
const industryList = ref([
  { title: '2025年AI行业发展趋势', date: '2025-11-05', source: 'TechCrunch', summary: '人工智能技术将继续推动行业创新，预计市场规模将超过万亿美元。' },
  { title: '区块链在金融领域的应用', date: '2025-11-04', source: 'CoinDesk', summary: '区块链技术正重塑全球金融体系，提高交易透明度和效率。' },
  { title: '绿色能源转型加速', date: '2025-11-03', source: 'Reuters', summary: '各国政府加大对可再生能源的投资，以应对气候变化挑战。' },
]);
</script>

<style scoped>
.industry-dynamics-page {
  padding: 20px;
}
</style>
