# Solidity Smart Contract Project

## 📦 需要的 VSCode 扩展

请在 VSCode 中安装以下扩展以获得最佳的 Solidity 开发体验:

### 核心扩展
1. **Solidity** (by Juan Blanco) - 提供语法高亮、代码补全和编译功能
2. **Hardhat Solidity** (by Nomic Foundation) - Hardhat 框架支持,更好的错误提示
3. **Solidity Visual Developer** (by tIntinweb) - 可视化工具和安全审计辅助

### 安装方法
- 打开 VSCode
- 点击左侧扩展图标 (Ctrl+Shift+X)
- 搜索上述扩展名称并安装
- 或者直接在命令行运行: `code --install-extension JuanBlanco.solidity`

## 🛠️ 开发环境设置

### 1. 安装 Node.js 和 npm
```bash
# 检查是否已安装
node --version
npm --version
```

### 2. 安装 Solidity 编译器 (solc)
```bash
npm install -g solc
```

### 3. 安装 Hardhat (推荐)
```bash
npm install --save-dev hardhat
npx hardhat init
```

### 4. 安装 Solhint (代码检查工具)
```bash
npm install -g solhint
```

## 📁 项目结构
```
Solidity/
├── contracts/          # Solidity 智能合约文件
│   └── SimpleStorage.sol
├── scripts/           # 部署脚本
├── test/              # 测试文件
├── .vscode/           # VSCode 配置
│   ├── extensions.json
│   └── settings.json
└── package.json
```

## 🚀 快速开始

1. 在 `contracts/` 目录创建 `.sol` 文件
2. VSCode 会自动提供语法高亮和智能提示
3. 按 `Ctrl+Shift+P` → "Solidity: Change Workspace Compiler version" 选择编译器版本
4. 编写合约后,可以使用 Hardhat 进行编译和测试

## 💡 常用快捷键
- `Ctrl+Shift+P` → "Solidity: Compile Contract" - 编译当前合约
- `Ctrl+Shift+P` → "Solidity: Show AST" - 显示抽象语法树
- `F12` - 跳转到定义
- `Ctrl+Space` - 代码补全

## 🔗 有用资源
- [Solidity 官方文档](https://docs.soliditylang.org/)
- [Hardhat 教程](https://hardhat.org/tutorial/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
