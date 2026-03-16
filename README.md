# Finance-Macro-Flow

## 在本地打开项目

### 1. 克隆仓库
```bash
git clone <your-repo-url>
cd Finance-Macro-Flow
```

### 2. 用编辑器打开
- VS Code:
  ```bash
  code .
  ```
- JetBrains 系列：`File -> Open` 选择项目目录。

### 3. 检查仓库是否有实际代码
如果目录几乎为空（例如只有 `.gitkeep`），先检查是否拉到了正确内容：

```bash
git branch -a
git remote -v
git fetch --all --prune
git status
```

## 常见问题排查

### 情况 A：没有配置远程仓库
`git remote -v` 没有输出，说明当前仓库没有连接远程：

```bash
git remote add origin <your-repo-url>
git fetch origin
```

### 情况 B：代码在其他分支
查看全部分支后切换：

```bash
git branch -a
git checkout <branch-name>
```

### 情况 C：本地是空初始化仓库
如果日志只有初始化提交，说明还没同步到业务代码：

```bash
git log --oneline -n 5
```

## 下一步建议

当你确认了正确的远程和分支后，我可以继续帮你补充：
1. 一键启动脚本（按技术栈生成）。
2. `.env.example` 与本地环境说明。
3. 开发规范（格式化、Lint、测试命令）。
