<!--
 * @Author: AI Assistant
 * @Date: 2023-07-01
 * @Description: 单次对话组件 - 支持对话和回答两种模式
-->
<template>
  <div class="ai-chat-once-container">
    <!-- 第一次握手对话框 -->
    <div v-if="showHandshakeDialog" class="handshake-dialog-overlay">
      <div class="handshake-dialog">
        <h3>请输入作者名称</h3>
        <p class="dialog-description">请输入作者名字的全英文小写</p>
        
        <div class="input-wrapper">
          <input
            v-model="authorName"
            type="text"
            placeholder="作者名称（全英文小写）"
            @keyup.enter="validateAndSubmit"
          />
          <p v-if="authorNameError" class="error-message">{{ authorNameError }}</p>
        </div>
        
        <div class="dialog-actions">
          <button @click="showHandshakeDialog = false" class="cancel-button">取消</button>
          <button @click="validateAndSubmit" class="confirm-button">确定</button>
        </div>
      </div>
    </div>
    <!-- 对话模式 -->
    <div v-if="mode === 'chat'" class="mode-container">
      <div class="input-section">
        <textarea
          v-model="userInput"
          @keyup.enter.ctrl="handleSend"
          @keyup.enter.meta="handleSend"
          placeholder="请输入您的问题..."
          maxlength="1000"
          rows="4"
        ></textarea>
        <div class="char-count">{{ userInput.length }}/1000</div>
        <!-- 快捷问题按钮 -->
        <div class="quick-questions">
          <button @click="handleFirstHandshake" class="quick-question-button first-handshake-button">
            第一次握手
          </button>
          <button 
            v-for="(button, index) in quickButtons" 
            :key="index"
            class="quick-question-button"
            @click="fillQuestion(button.message)"
          >
            {{ button.buttonname }}
          </button>
        </div>
      </div>
      
      <button 
        class="action-button send-button"
        @click="handleSend"
        :disabled="!userInput.trim()"
      >
        <i class="iconfont icon-send"></i>
      </button>
    </div>
    
    <!-- 回答模式 -->
    <div v-else-if="mode === 'answer'" class="mode-container">
      
      <div class="answer-section">
        <!-- 用户问题 -->
        <div class="user-question">
          <div class="question-label">您的问题：</div>
          <div class="question-content">{{ userInput }}</div>
        </div>
        
        <!-- AI回答 -->
        <div class="ai-answer">
          <div class="answer-label">AI回答：</div>
          <div class="answer-content">
            <div v-if="isStreaming" class="streaming-content">
              {{ streamingContent }}
              <span class="cursor">|</span>
            </div>
            <div v-else class="completed-content">
              {{ aiAnswer }}
            </div>
          </div>
        </div>
      </div>
      
      <button 
        class="action-button back-button"
        @click="resetChat"
      >
        <i class="iconfont icon-back"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import request from '@/utils/request'
import { quickButtons } from './init'

// 定义模式类型
type Mode = 'chat' | 'answer'

// 响应式数据
const mode = ref<Mode>('chat')
const userInput = ref('')
const aiAnswer = ref('')
const streamingContent = ref('')
const isStreaming = ref(false)

// 发送问题
const handleSend = async () => {
  const input = userInput.value.trim()
  if (!input) return
  
  // 切换到回答模式
  mode.value = 'answer'
  isStreaming.value = true
  streamingContent.value = ''
  aiAnswer.value = ''
  
  try {
    // 调用AI接口获取流式回答
    await getStreamingAnswer(input)
  } catch (error: any) {
    console.error('AI接口调用失败:', error)
    if(error.message!=undefined){
      aiAnswer.value = error.message
    }else{
      aiAnswer.value = '抱歉，我现在暂时无法为您提供回答，请稍后再试。'
    }
  } finally {
    isStreaming.value = false
  }
}

// 模拟流式回答（实际项目中可替换为真实的流式API）
const getStreamingAnswer = async (question: string) => {
  // 首先尝试调用API获取完整回答
  try {
    const { data }: any = await request.post('/ai/chatFirstPageAi', {
      messages: [
        {
          role: "user",
          content: question
        }
      ],validateId: authorName.value
    })
    
    const fullAnswer = data?.content || '抱歉，我暂时无法回答这个问题。'
    
    // 模拟流式输出
    return new Promise<void>((resolve) => {
      let index = 0
      const interval = setInterval(() => {
        if (index < fullAnswer.length) {
          streamingContent.value += fullAnswer[index]
          index++
        } else {
          clearInterval(interval)
          aiAnswer.value = fullAnswer
          resolve()
        }
      }, 30) // 每个字符30ms，模拟打字效果
    })
  } catch (error) {
    throw error
  }
}

// 重置对话，返回聊天模式
const resetChat = () => {
  mode.value = 'chat'
  userInput.value = ''
  aiAnswer.value = ''
  streamingContent.value = ''
  isStreaming.value = false
}

// 填充问题到输入框
const fillQuestion = (message: string) => {
  userInput.value = message
}

// 处理第一次握手
const showHandshakeDialog = ref(false)
const authorName = ref('')
const authorNameError = ref('')

const handleFirstHandshake = () => {
  // 重置输入和错误信息
  authorName.value = ''
  authorNameError.value = ''
  // 显示输入对话框
  showHandshakeDialog.value = true
}

const validateAndSubmit = () => {
  // 验证输入是否为全英文小写
  const lowercasePattern = /^[a-z]+$/;
  
  if (!authorName.value.trim()) {
    authorNameError.value = '请输入作者名称'
    return
  }
  
  if (!lowercasePattern.test(authorName.value)) {
    authorNameError.value = '作者名称必须是全英文小写'
    return
  }
  
  // 验证通过，构建消息
  const handshakeMessage = `与作者${authorName.value}进行第一次握手，请建立连接并通知他好好工作`
  userInput.value = handshakeMessage
  
  // 关闭对话框
  showHandshakeDialog.value = false
}
</script>

<style lang="less" scoped>
.ai-chat-once-container {
  /* 固定大小 */
  width: 480px;
  height: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
}

.mode-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  position: relative;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.ai-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
  
  .iconfont {
    color: #fff;
    font-size: 24px;
  }
}

.avatar-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.avatar-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 输入区域 */
.input-section {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    
    textarea {
      width: 100%;
      min-height: 120px; /* 设置最小高度 */
      padding: 16px;
      border: 2px solid #f0f0f0;
      border-radius: 8px;
      resize: none;
      font-size: 14px;
      line-height: 1.6;
      outline: none;
      transition: all 0.3s;
      font-family: inherit;
      color: #333; /* 明确设置文本颜色 */
      background: white; /* 明确设置背景颜色 */
      
      &:focus {
        border-color: #52c41a;
        box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.1);
      }
      
      &::placeholder {
        color: #999;
      }
    }
    
    .char-count {
      position: absolute;
      bottom: 40px; /* 调整字符计数位置，为按钮腾出空间 */
      right: 16px;
      font-size: 12px;
      color: #999;
      background: rgba(255, 255, 255, 0.9);
      padding: 2px 6px;
      border-radius: 10px;
      z-index: 1;
    }
  }
  
  /* 快捷问题按钮样式 */
  .quick-questions {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  
  .quick-question-button {
      padding: 6px 12px; /* 减小按钮大小 */
      border: 1px solid #52c41a; /* 科技绿色边框 */
      border-radius: 16px; /* 减小圆角 */
      background: #f6ffed; /* 科技绿色背景 */
      color: #52c41a; /* 科技绿色文字 */
      font-size: 12px; /* 减小字体大小 */
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      
      /* 第一次握手按钮特殊样式 */
      &.first-handshake-button {
        border: 1px solid #ff7a45; /* 橘黄色边框 */
        background: #fff7e6; /* 橘黄色背景 */
        color: #ff7a45; /* 橘黄色文字 */
        
        &:hover {
          background: linear-gradient(135deg, #ff7a45, #ffac38); /* 橘黄色渐变 */
          border-color: #ff7a45;
          color: #fff;
          box-shadow: 0 2px 8px rgba(255, 122, 69, 0.3);
        }
      }
    
    &:hover {
      background: linear-gradient(135deg, #52c41a, #73d13d); /* 科技绿色渐变 */
      color: #fff;
      border-color: #52c41a;
      transform: translateY(-1px); /* 减小上移距离 */
      box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.5s;
    }
    
    &:hover::after {
      left: 100%;
    }
  }

/* 回答区域 */
.answer-section {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
}

.user-question,
.ai-answer {
  margin-bottom: 16px;
}

.question-label,
.answer-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.question-content {
  background: #f7f7f7;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.answer-content {
  background: #f6ffed;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #b7eb8f;
  min-height: 80px;
  position: relative;
}

.streaming-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333 !important;
  white-space: pre-wrap;
  word-break: break-word;
}

.completed-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333 !important;
  white-space: pre-wrap;
  word-break: break-word;
}

.cursor {
  animation: blink 1s infinite;
  color: #52c41a;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* 操作按钮 */
.action-button {
  position: absolute;
  bottom: 20px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.send-button {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: #fff;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  }
  
  &:disabled {
    background: #f5f5f5;
    color: #d9d9d9;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.back-button {
  background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
  color: #fff;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(250, 173, 20, 0.4);
  }
}

/* 确保按钮图标正确显示 */
.icon-send::before {
  content: "→";
  font-size: 20px;
}

.icon-back::before {
  content: "←";
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-once-container {
    width: 100%;
    max-width: 100%;
    height: 360px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin: 0;
  }
  
  .mode-container {
    padding: 16px;
    min-height: 360px;
  }
  
  .input-section {
    margin-bottom: 16px;
    
    textarea {
      font-size: 14px;
      padding: 12px;
      min-height: 100px;
    }
    
    .char-count {
      bottom: 35px;
      right: 12px;
    }
  }
  
  .quick-questions {
    gap: 10px;
    margin-top: 10px;
  }
  
  .quick-question-button {
    padding: 5px 10px;
    font-size: 11px;
    
    &:hover {
      transform: translateY(-1px);
    }
  }

  .char-count {
    font-size: 12px;
    right: 12px;
    bottom: 12px;
  }
  
  .answer-section {
    margin-bottom: 60px;
    max-height: 220px;
  }
  
  .user-question,
  .ai-answer {
    margin-bottom: 16px;
  }
  
  .question-label,
  .answer-label {
    font-size: 13px;
    margin-bottom: 8px;
  }
  
  .question-content {
    font-size: 14px;
    padding: 10px;
  }
  
  .streaming-content,
  .completed-content {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .action-button {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}

/* 小屏幕手机优化 */
@media (max-width: 400px) {
  .ai-chat-once-container {
    height: 340px;
  }
  
  .mode-container {
    padding: 14px;
    min-height: 340px;
  }
  
  .action-button {
    bottom: 12px;
    right: 12px;
    width: 44px;
    height: 44px;
  }
}

/* 第一次握手对话框样式 */
.handshake-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.handshake-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: dialogFadeIn 0.3s ease-out;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.handshake-dialog h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.dialog-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
}

.input-wrapper {
  margin-bottom: 20px;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  outline: none;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  border-color: #52c41a;
  box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.1);
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin: 8px 0 0 0;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-button,
.confirm-button {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.cancel-button {
  background: #f5f5f5;
  color: #333;
}

.cancel-button:hover {
  background: #e8e8e8;
}

.confirm-button {
  background: #52c41a;
  color: white;
}

.confirm-button:hover {
  background: #73d13d;
}

/* 移动端对话框适配 */
@media (max-width: 768px) {
  .handshake-dialog {
    width: 85%;
    padding: 20px;
  }
  
  .handshake-dialog h3 {
    font-size: 16px;
  }
  
  .dialog-actions {
    justify-content: space-between;
  }
  
  .cancel-button,
  .confirm-button {
    flex: 1;
    padding: 10px 16px;
  }
}
</style>