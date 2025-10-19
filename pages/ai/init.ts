// AI助手预设问题按钮配置
export interface ButtonConfig {
  buttonname: string; // 按钮名称
  message: string; // 对应的消息内容
}

export const quickButtons: ButtonConfig[] = [
  {
    buttonname: '你是谁',
    message: '你是谁？能做什么？'
  },
  {
    buttonname: '功能有什么',
    message: '你有哪些功能？'
  },
  {
    buttonname: '调用连接功能',
    message: '帮我调用链接功能，链接到作者，并通知他好好工作'
  }
];