# wechat-cli

基于 `@wechatbot/wechatbot` SDK 的微信命令行工具，类似 lark-cli 风格。

```bash
npm install -g @spritesensei/wechat-cli
wechat-cli --help
```

---

## 安装

```bash
# 全局安装（推荐）
npm install -g @spritesensei/wechat-cli

# 或从源码
git clone https://github.com/snowball-dev/wechat-cli.git
cd wechat-cli
npm install
npm link
```

## AI Agent Skill

wechat-cli 提供 AI Agent Skill，支持 Claude Code、Cursor、Windsurf、Gemini CLI 等 70+ AI 工具安装后通过 `/wechat-cli` 调出用法。

skill 源文件在项目的 `skills/wechat-cli/SKILL.md`，可通过 npm 包分发安装。

### 安装 Agent Skill

```bash
# 全局安装（推荐，本机所有对话可用）
npx skills add @spritesensei/wechat-cli -g

# 项目级安装（仅该项目目录下可用）
npx skills add @spritesensei/wechat-cli
```

`skills` CLI 的两种模式：

| 模式 | 安装位置 | 作用范围 |
|------|---------|---------|
| 默认（不加 `-g`） | `项目目录/.agents/skills/` | 仅该项目 |
| `-g`（全局） | `~/.agents/skills/` | 本机所有会话 |

安装后，在对话中输入 `/wechat-cli` 即可获取使用指南。

## 使用

### 登录（只需一次）

```bash
wechat-cli login
# 生成二维码 PNG → 自动打开图片 → 手机微信扫码
# 凭证自动保存到 ~/.wechat-cli/
```

加 `--force` 强制重新登录（已有凭证时）。

### 发消息

```bash
# 文本
wechat-cli send <用户ID> text "你好"

# 图片
wechat-cli send <用户ID> image ./照片.png

# 视频
wechat-cli send <用户ID> video ./视频.mp4

# 文件（音频也当文件发）
wechat-cli send <用户ID> file ./文档.pdf
```

可选的 `--caption "说明文字"` 参数。

**注意：** 必须先收到过对方消息才能主动发（SDK 需要 context_token）。如果遇到 `NO_CONTEXT` 错误，先跑：

```bash
wechat-cli messages --count 1
# 让对方发一条消息过来 → context 缓存 → 之后就能发了
```

### 拉取消息

```bash
wechat-cli messages --count 5
# 启动长轮询，收集到 5 条消息后自动停止
# --timeout 60 超时（秒），超时未收满也返回已收集的
```

默认输出 JSON，`--pretty` 美化。

### 其他

```bash
wechat-cli status          # 查看登录状态
wechat-cli logout          # 清除凭证
wechat-cli --help          # 查看所有命令
wechat-cli <命令> --help   # 查看子命令帮助
```

## 目录结构

```
wechat-cli/
├── bin/wechat-cli.js       # 入口
├── src/main.js              # Commander 配置
├── src/core/bot.js          # createBot 工厂
├── src/commands/
│   ├── login.js             # 登录
│   ├── send.js              # 发送（text/image/video/file）
│   ├── messages.js          # 拉取消息
│   ├── status.js            # 状态查询
│   └── logout.js            # 登出
├── src/utils/
│   ├── output.js            # JSON 格式化输出
│   └── qr.js                # 二维码生成
├── skills/
│   └── wechat-cli/
│       └── SKILL.md         # AI Agent Skill
├── package.json
└── README.md
```

## 常见问题

**Q: 发消息报 `NO_CONTEXT`？**
A: 先 `wechat-cli messages --count 1`，让对方发条消息过来，刷新 context token。

**Q: 凭证存在哪里？**
A: `~/.wechat-cli/credentials.json`。SDK 默认是 `~/.wechatbot/`，可以复制过去复用。

**Q: 语音消息？**
A: iLink Bot API 不支持机器人发语音类型消息。音频当文件发：`send <uid> file ./audio.wav`。

**Q: 报 `ret=-2` 错误？**
A: 通常是会话过期或频率限制。重新 `login` 即可。

## License

MIT
