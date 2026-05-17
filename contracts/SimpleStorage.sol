// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    event DataChanged(uint256 newValue);
    // 新增转账事件
    event TransferSent(address indexed to, uint256 amount);

    function set(uint256 x) public {
        storedData = x;
        emit DataChanged(x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
    

    /**
     * @dev 发送 ETH 到指定地址，使用 call 方式以提高健壮性并避免 gas 限制问题
     * @param to 接收地址
     * @param amount 发送金额
     */
    function send(address payable to, uint256 amount) public {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient balance");

        // 使用 call 代替 transfer/send，以兼容更多合约并避免 2300 gas 限制
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");

        emit TransferSent(to, amount);
    }

    // 添加 receive 函数以允许合约接收 ETH，否则无法向此合约充值从而无法发送
    receive() external payable {}
}
