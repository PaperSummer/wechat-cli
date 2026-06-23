---
name: wechat-cli
description: Use when the user asks to send/receive WeChat messages, or when the project is wechat-cli — a CLI tool built on @wechatbot/wechatbot SDK for WeChat iLink Bot messaging
---

# wechat-cli

基于 `@wechatbot/wechatbot` SDK 的微信命令行工具，类似 lark-cli 风格。

## 安装

```bash
# 全局安装（推荐，安装后直接 wechat-cli 命令）
npm install -g @spritesensei/wechat-cli

# 或从源码
git clone https://github.com/snowball-dev/wechat-cli.git
cd wechat-cli
npm install
npm link
```

## 登录

```bash
wechat-cli login
# 自动生成二维码图片并打开，手机微信扫码即可
# 凭证自动保存到 ~/.wechat-cli/
```

加 `--force` 可强制重新登录。

## 发消息

必须先收到过对方消息（context token），否则会报 `NO_CONTEXT`。

```bash
# 先收一条消息刷新 context
wechat-cli messages --count 1

# 文本
wechat-cli send <userId> text "内容"

# 图片
wechat-cli send <userId> image ./图片.png

# 视频
wechat-cli send <userId> video ./视频.mp4

# 文件（音频也当文件发）
wechat-cli send <userId> file ./文件.pdf --caption "说明"
```

## 拉取消息

```bash
wechat-cli messages --count 5 --timeout 30
# 长轮询收集，到 count 或超时后自动停止，输出 JSON
```

## 其他命令

```bash
wechat-cli status     # 查看登录状态
wechat-cli logout     # 清除凭证
wechat-cli --help     # 所有命令
wechat-cli <cmd> --help  # 子命令详情
```

## 注意事项

- **context_token：** 需要先收消息才能主动发。`messages --count 1` 先让对方发一条过来
- **会话过期：** `ret=-2` 错误通常表示会话过期或频率限制，重新 login
- **语音：** iLink Bot API 不支持机器人发语音类型消息，音频请当文件发

## 全局选项

所有命令支持 `--pretty` 美化 JSON 输出。
