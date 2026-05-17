# VSCode Solidity 开发配置指南

## ✅ 已完成的配置

### 1. 必需的 VSCode 扩展

请在 VSCode 中安装以下扩展（推荐）：

```
Ctrl+Shift+X → 搜索并安装:
```

- ✅ **Solidity** (Juan Blanco) - `JuanBlanco.solidity`
  - 语法高亮
  - 代码补全
  - 实时编译检查
  - 跳转到定义

- ✅ **Hardhat Solidity** (Nomic Foundation) - `NomicFoundation.hardhat-solidity`
  - Hardhat 框架集成
  - 任务运行器
  - 网络管理

- ✅ **Solidity Visual Developer** (tIntinweb) - `tintinweb.solidity-visual-auditor`
  - UML 图生成
  - 安全审计
  - 合约可视化

---

## 🚀 图形化界面使用方法

### 📝 编译合约

#### 方法 1: 使用快捷键
```
Ctrl+Shift+B → 选择 "Hardhat: Compile"
```

#### 方法 2: 使用命令面板
```
Ctrl+Shift+P → 输入 "Tasks: Run Build Task"
```

#### 方法 3: 使用 Solidity 扩展
```
右键点击 .sol 文件 → "Solidity: Compile Contract"
```

---

### 🧪 运行测试

#### 方法 1: 使用调试器
```
F5 → 选择 "Hardhat: Test"
```

#### 方法 2: 使用任务
```
Ctrl+Shift+P → "Tasks: Run Task" → "Hardhat: Test"
```

#### 方法 3: 终端命令
```bash
npx hardhat test
```

---

### 🐛 调试配置

#### 启动调试会话
1. 打开 `.sol` 文件或测试文件
2. 设置断点（点击行号左侧）
3. 按 `F5` 或点击左侧调试图标
4. 选择调试配置：
   - **Hardhat: Test** - 调试测试
   - **Hardhat: Compile** - 调试编译
   - **Hardhat: Run Script** - 运行自定义脚本

#### 调试功能
- ✅ 断点调试
- ✅ 变量查看
- ✅ 调用堆栈
- ✅ 单步执行

---

### ⌨️ 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Shift+B` | 构建任务（编译） |
| `F5` | 启动调试 |
| `Ctrl+Shift+P` | 命令面板 |
| `F12` | 跳转到定义 |
| `Ctrl+Space` | 代码补全 |
| `Ctrl+S` | 保存（自动格式化） |
| `Ctrl+Shift+F` | 格式化文档 |

---

## 🔧 配置文件说明

### `.vscode/extensions.json`
推荐的 VSCode 扩展列表

### `.vscode/settings.json`
工作区设置：
- 编译器版本
- 代码格式化
- Linter 配置

### `.vscode/launch.json`
调试配置：
- Hardhat 测试
- Hardhat 编译
- 脚本运行

### `.vscode/tasks.json`
任务配置：
- 编译任务
- 测试任务
- 清理任务
- 本地节点

---

## 💡 使用技巧

### 1. 实时错误检查
保存文件时会自动编译并显示错误

### 2. 代码片段
输入 `contract`、`function` 等关键词会触发代码片段

### 3. 快速部署
```
Ctrl+Shift+P → "Hardhat: Deploy"
```

### 4. 切换网络
```
Ctrl+Shift+P → "Hardhat: Change Network"
```

---

## ⚠️ 常见问题

### Q: 扩展不工作？
A: 重新加载窗口：`Ctrl+Shift+P` → "Developer: Reload Window"

### Q: 编译错误？
A: 检查 Solidity 版本是否与 `hardhat.config.js` 一致

### Q: 调试器无法启动？
A: 确保已运行 `npm install` 安装所有依赖

---

## 📚 更多资源

- [VSCode Solidity 扩展文档](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
- [Hardhat VSCode 集成](https://hardhat.org/hardhat-runner/docs/advanced/vscode-tests)
- [Solidity 官方文档](https://docs.soliditylang.org/)