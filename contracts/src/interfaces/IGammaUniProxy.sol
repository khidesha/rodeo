// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.17;

interface IGammaUniProxy {

    function deposit(
        uint256,
        uint256,
        address,
        address,
        uint256[4] memory minIn
    ) external returns (uint256);

}