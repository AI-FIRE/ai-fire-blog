<!--
 * @Author: AI Assistant
 * @Date: 2023-07-01
 * @Description: AI对话页面
-->
<template>
 
      <ChatOnce />
    
</template>

<script lang="ts" setup>
// 导入AI对话组件
import ChatOnce from './ai/chatOnce.vue'
</script>

<style lang="less" scoped>
.aichat-page {
  min-height: calc(100vh - 60px);
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
  
  h1 {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 18px;
    opacity: 0.9;
  }
}

.chat-section {
  max-width: 1000px;
  margin: 0 auto;
  min-height: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

// 响应式设计
@media (max-width: 768px) {
  .aichat-page {
    padding: 20px 10px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .chat-section {
    min-height: 70vh;
  }
}
</style>