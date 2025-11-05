<template>
  <div class="company-news-page">
    <h1>公司新闻</h1>
    <p>这里是公司新闻页面内容。你可以添加新闻列表、文章等。</p>
    <el-card shadow="hover">
      <template #header>
        <span>最新新闻</span>
      </template>
      <el-table :data="newsList" style="width: 100%;">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="author" label="作者" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 模拟新闻数据
const newsList = ref([
  { title: '公司年度会议通知', date: '2025-11-05', author: 'admin' },
  { title: '新产品发布', date: '2025-11-04', author: 'marketing' },
]);
</script>

<style scoped>
.company-news-page {
  padding: 20px;
}
</style>
