<!--
 * @Author: AI Assistant
 * @Date: 2023-07-01
 * @Description: AI对话组件
-->
<template>
  <div class="ai-chat-container">
    <div class="chat-history">
      <!-- 欢迎消息 -->
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="ai-avatar">
          <i class="iconfont icon-robot"></i>
        </div>
        <div class="message-content">
          <p>你可以向我提问、寻求建议或进行日常交流。</p>
        </div>
      </div>
      
      <!-- 对话历史 -->
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message-item', message.role === 'user' ? 'user-message' : 'ai-message']"
      >
        <div class="avatar">
          <i v-if="message.role === 'user'" class="iconfont icon-user"></i>
          <i v-else class="iconfont icon-robot"></i>
        </div>
        <div class="message-content">
          <div class="content">{{ message.content }}</div>
          <div class="time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      
      <!-- 打字动画 -->
      <div v-if="isTyping" class="message-item ai-message">
        <div class="avatar">
          <i class="iconfont icon-robot"></i>
        </div>
        <div class="message-content typing">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="chat-input-area">
      <textarea
        v-model="inputMessage"
        @keyup.enter.ctrl="sendMessage"
        @keyup.enter.meta="sendMessage"
        placeholder="请输入您的问题...(按Ctrl+Enter发送)"
        maxlength="1000"
        rows="3"
      ></textarea>
      <div class="input-footer">
        <span class="char-count">{{ inputMessage.length }}/1000</span>
        <button 
          class="send-button" 
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isTyping"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import request from '@/utils/request'
import dayjs from 'dayjs'

// 定义消息类型
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// 响应式数据
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isTyping = ref(false)

// 发送消息
const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content || isTyping.value) return
  
  // 添加用户消息
  const userMessage: Message = {
    role: 'user',
    content,
    timestamp: Date.now()
  }
  messages.value.push(userMessage)
  
  // 清空输入框
  inputMessage.value = ''
  
  // 滚动到底部
  scrollToBottom()
  
  // 设置为正在输入状态
  isTyping.value = true
  
  try {
    // 调用AI接口
    const { data }: any = await request.post('/ai/chatFirstPageAi', {
      messages: [
        {
          role: "user",
          content: content
        }
      ]
    })
    
    // 添加AI回复
    const aiMessage: Message = {
      role: 'assistant',
      content: data?.content || '抱歉，我暂时无法回答这个问题。',
      timestamp: Date.now()
    }
    messages.value.push(aiMessage)
  } catch (error) {
    console.error('AI接口调用失败:', error)
    
    // 添加错误消息
    const errorMessage: Message = {
      role: 'assistant',
      content: '抱歉，我现在暂时无法为您提供回答，请稍后再试。',
      timestamp: Date.now()
    }
    messages.value.push(errorMessage)
  } finally {
    // 取消正在输入状态
    isTyping.value = false
    
    // 滚动到底部
    scrollToBottom()
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format('HH:mm:ss')
}

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    const chatHistory = document.querySelector('.chat-history')
    if (chatHistory) {
      chatHistory.scrollTop = chatHistory.scrollHeight
    }
  }, 100)
}
</script>

<style lang="less" scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
}

.welcome-message {
  display: flex;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(106, 170, 121, 0.1);
  border-radius: 12px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  
  &.user-message {
    flex-direction: row-reverse;
    
    .message-content {
      margin-right: 0;
      margin-left: 15px;
      background: #e6f7ff;
      border: 1px solid #91d5ff;
      border-radius: 12px 12px 0 12px;
    }
  }
  
  &.ai-message {
    .message-content {
      background: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 12px 12px 12px 0;
    }
  }
}

.avatar,
.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .iconfont {
    color: #fff;
    font-size: 20px;
  }
}

.ai-avatar {
  background: #52c41a;
}

.user-message .avatar {
  background: #fa8c16;
}

.message-content {
  margin-right: 15px;
  padding: 12px 16px;
  max-width: 70%;
  word-wrap: break-word;
  
  .content {
    line-height: 1.6;
    color: #333;
  }
  
  .time {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
}

.welcome-message .message-content {
  background: none;
  border: none;
  max-width: none;
  margin-right: 0;
  padding: 0 15px;
  
  p {
    margin: 8px 0;
    color: #333;
    line-height: 1.6;
  }
}

/* 打字动画 */
.typing {
  min-width: 80px;
  min-height: 40px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  
  span {
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background: #999;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.chat-input-area {
  padding: 20px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  
  &:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  &::placeholder {
    color: #bfbfbf;
  }
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.send-button {
  padding: 8px 24px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background: #40a9ff;
  }
  
  &:disabled {
    background: #f5f5f5;
    color: #d9d9d9;
    cursor: not-allowed;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-container {
    height: 90vh;
    border-radius: 0;
    box-shadow: none;
  }
  
  .message-content {
    max-width: 85%;
  }
}
</style>