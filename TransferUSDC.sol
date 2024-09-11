// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/CCIPReceiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TransferUSDC {
    IERC20 public usdcToken;

    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20(_usdcTokenAddress);
    }
    function transferUsdc(
        uint256 _destinationChainSelector,
        address _receiver,
        uint256 _amount,
        uint256 _gasLimit
    ) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_receiver != address(0), "Receiver address cannot be zero");
        bool success = usdcToken.transfer(_receiver, _amount);
        require(success, "USDC Transfer failed");
        emit UsdcTransferred(_destinationChainSelector, _receiver, _amount, _gasLimit);
    }
    event UsdcTransferred(
        uint256 indexed destinationChainSelector,
        address indexed receiver,
        uint256 amount,
        uint256 gasLimit
    );
}
