# Solidity 快速参考

## 📝 合约模板

### 基础合约
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // 状态变量
    uint256 public value;
    
    // 事件
    event ValueChanged(uint256 newValue);
    
    // 构造函数
    constructor(uint256 _initialValue) {
        value = _initialValue;
    }
    
    // 修改状态的函数
    function setValue(uint256 _newValue) public {
        value = _newValue;
        emit ValueChanged(_newValue);
    }
    
    // 只读函数
    function getValue() public view returns (uint256) {
        return value;
    }
}
```

## 🔑 关键概念

### 可见性修饰符
- `public` - 任何人都可以调用
- `private` - 仅合约内部可调用
- `internal` - 合约及继承合约可调用
- `external` - 仅外部可调用

### 函数修饰符
- `view` - 只读,不修改状态
- `pure` - 不读取也不修改状态
- `payable` - 可以接收以太币

### 常用类型
- `uint256` - 无符号整数
- `address` - 以太坊地址
- `string` - 字符串
- `bool` - 布尔值
- `bytes32` - 固定大小字节数组
- `mapping` - 键值对映射

## 💰 常用模式

### 拥有者模式
```solidity
address public owner;

constructor() {
    owner = msg.sender;
}

modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

function restrictedFunction() public onlyOwner {
    // 只有拥有者可以调用
}
```

### 提现模式
```solidity
function withdraw() public onlyOwner {
    payable(owner).transfer(address(this).balance);
}
```

## 🛠️ 常用命令

```bash
# 编译
npx hardhat compile

# 测试
npx hardhat test

# 清理
npx hardhat clean

# 控制台
npx hardhat console

# 部署
npx hardhat run scripts/deploy.js
```

## ⚡ VSCode 快捷键

- `Ctrl+Shift+P` - 命令面板
- `Ctrl+S` - 保存并格式化
- `F12` - 跳转到定义
- `Ctrl+Space` - 代码补全
- `Alt+Shift+F` - 格式化代码

## 🔗 有用链接

- [Solidity 文档](https://docs.soliditylang.org/)
- [Hardhat 教程](https://hardhat.org/tutorial/)
- [OpenZeppelin](https://openzeppelin.com/contracts/)
- [Remix IDE](https://remix.ethereum.org/) - 在线编译器
