<!--
 * @Author: Shaoli
 * @Date: 2025-01-08 22:35:28
 * @LastEditors: AI Assistant
 * @LastEditTime: 2025-07-01
 * @Description: 滚动式酷炫个人网站展示首页
-->
<template>
  <div class="scroll-showcase">
    <!-- 第一部分：简介区域 - 影片背景 -->
    <section class="section hero-section">
      <div class="video-container">
        <video autoplay muted loop playsinline class="hero-video">
          <!-- 这里使用视频占位符，实际项目中需要替换为真实的视频URL -->
          <!-- 可以使用背景视频或视频元素 -->
          <source src="~/assets/movie/index.mp4" type="video/mp4" />
          <!-- 视频加载失败时显示渐变背景 -->
          <div class="fallback-bg"></div>
        </video>
        <div class="video-overlay"></div>
      </div>
      
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="highlight">智心一梦</span>
        </h1>
        <p class="hero-subtitle">
          探索AI技术的无限可能
        </p>
        <div class="hero-description">
          <p>这是一个专注于AI技术分享和交流的平台，</p>
          <p>在这里你可以找到最新的AI资讯、技术文章和学习资源。</p>
        </div>
        <div class="scroll-indicator">
          <!-- <span>向下滚动探索</span> -->
          <div class="indicator-arrow"></div>
        </div>
      </div>
    </section>

    <!-- 第二部分：AI对话区域 -->
    <section class="section ai-chat-section">
      <div class="section-header">
        <h2>智能对话助手</h2>
        <p>与AI助手进行实时交流，获取智能回答</p>
      </div>
      
      <div class="chat-content">
        <ChatOnce />
      </div>
    </section>

    <!-- 第三部分：博客入口区域 -->
    <section class="section blog-section">
      <div class="section-header">
        <h2>技术博客</h2>
        <p>探索最新的AI技术文章和教程</p>
      </div>
      
      <div class="blog-content">
        <div class="blog-preview">
          <div class="blog-card">
            <div class="blog-icon">
              <i class="iconfont icon-article"></i>
            </div>
            <h3>AI技术前沿</h3>
            <p>探索人工智能领域的最新研究成果和技术突破</p>
          </div>
          
          <div class="blog-card">
            <div class="blog-icon">
              <i class="iconfont icon-code"></i>
            </div>
            <h3>实战教程</h3>
            <p>从入门到精通的AI编程实践和项目案例</p>
          </div>
          
          <div class="blog-card">
            <div class="blog-icon">
              <i class="iconfont icon-thought"></i>
            </div>
            <h3>行业洞察</h3>
            <p>AI在各个行业的应用案例和未来发展趋势</p>
          </div>
        </div>
        
        <button class="enter-blog-button" @click="goToHome">
          进入博客
          <i class="iconfont icon-arrow-right"></i>
        </button>
      </div>
    </section>

    <!-- 第四部分：AI资讯区域 -->
    <section class="section ai-news-section">
      <div class="section-header">
        <h2>AI资讯</h2>
        <p>了解人工智能领域的最新动态和趋势</p>
      </div>
      
      <div class="news-content">
        <div class="news-grid">
          <div class="news-card">
            <div class="news-date">2025-06-30</div>
            <h3>大型语言模型的未来发展</h3>
            <p>探索大语言模型的技术演进和应用前景</p>
          </div>
          
          <div class="news-card">
            <div class="news-date">2025-06-28</div>
            <h3>生成式AI在创意领域的应用</h3>
            <p>AI如何改变设计、音乐和文学创作的方式</p>
          </div>
          
          <div class="news-card">
            <div class="news-date">2025-06-25</div>
            <h3>AI伦理与隐私保护</h3>
            <p>探讨人工智能发展中的伦理问题和隐私保护挑战</p>
          </div>
        </div>
        
        <button class="more-news-button">
          查看更多资讯
          <i class="iconfont icon-arrow-right"></i>
        </button>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; 2025 智心一梦 - AI技术分享平台</p>
        <div class="social-links">
          <a href="#" class="social-link"><i class="iconfont icon-git"></i></a>
          <a href="#" class="social-link"><i class="iconfont icon-email"></i></a>
          <a href="#" class="social-link"><i class="iconfont icon-wx"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
import ChatOnce from './ai/chatOnce.vue'

// 禁用默认布局
definePageMeta({
  layout: false
})

const router = useRouter()

// 响应式数据
const scrollY = ref(0)

// 跳转到home页面
const goToHome = () => {
  router.push('/home')
}

// 查看更多资讯
const viewMoreNews = () => {
  // 这里可以添加跳转到资讯页面的逻辑
  console.log('查看更多资讯')
}

// 监听滚动事件
onMounted(() => {
  const handleScroll = () => {
    scrollY.value = window.scrollY
  }
  
  window.addEventListener('scroll', handleScroll)
  
  // 清理函数
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="less" scoped>
/* 全局样式 */
.scroll-showcase {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  scroll-behavior: smooth;
}

.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 60px 20px;
  box-sizing: border-box;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.section-header p {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

/* 第一部分：影片背景区域 */
.hero-section {
  position: relative;
  overflow: hidden;
  color: white;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保视频比例为16:9 */
  aspect-ratio: 16 / 9;
  min-height: 100%;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
  z-index: 1;
}

.fallback-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 20px;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1.1;
  letter-spacing: -2px;
}

.highlight {
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-subtitle {
  font-size: 1.8rem;
  font-weight: 300;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 60px;
  opacity: 0.85;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1.5s ease-in-out;
}

.scroll-indicator span {
  font-size: 1rem;
  margin-bottom: 10px;
  opacity: 0.8;
}

.indicator-arrow {
  width: 20px;
  height: 30px;
  border: 2px solid white;
  border-radius: 10px;
  position: relative;
  animation: bounce 2s infinite;
}

.indicator-arrow::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 第二部分：AI对话区域 */
.ai-chat-section {
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  padding: 80px 20px;
}

.ai-chat-section .section-header {
  margin-bottom: 40px;
  z-index: 1;
}

.ai-chat-section .section-header h2 {
  color: #333;
}

.chat-content {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .ai-chat-section {
    padding: 60px 15px;
  }
  
  .ai-chat-section .section-header {
    margin-bottom: 30px;
  }
  
  .ai-chat-section .section-header h2 {
    font-size: 2rem;
  }
  
  .ai-chat-section .section-header p {
    font-size: 1rem;
    padding: 0 10px;
  }
  
  .chat-content {
    width: 100%;
    max-width: none;
    padding: 0 10px;
  }
}

/* 第三部分：博客入口区域 */
.blog-section {
  background: white;
}

.blog-section .section-header h2 {
  color: #333;
}

.blog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
}

.blog-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
  width: 100%;
}

.blog-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border-color: #eaeaea;
}

.blog-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 28px;
}

.blog-card h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #333;
}

.blog-card p {
  color: #666;
  line-height: 1.6;
}

.enter-blog-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.enter-blog-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* 第四部分：AI资讯区域 */
.ai-news-section {
  background: #f0f2f5;
}

.ai-news-section .section-header h2 {
  color: #333;
}

.news-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
  width: 100%;
}

.news-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border-left: 4px solid transparent;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border-left-color: #667eea;
}

.news-date {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 12px;
}

.news-card h3 {
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
}

.news-card p {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

.more-news-button {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.more-news-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* 页脚 */
.site-footer {
  background: #333;
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .blog-preview,
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section {
    padding: 40px 20px;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .blog-preview,
  .news-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .blog-card,
  .news-card {
    padding: 20px;
  }
  
  .enter-blog-button,
  .more-news-button {
    padding: 14px 30px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .section {
    padding: 30px 15px;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
  }
  
  .blog-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
  
  .blog-card h3,
  .news-card h3 {
    font-size: 1.2rem;
  }
}

/* 确保图标字体正确显示 */
.icon-article::before {
  content: "📝";
}

.icon-code::before {
  content: "💻";
}

.icon-thought::before {
  content: "💡";
}

.icon-arrow-right::before {
  content: "→";
}
</style>
