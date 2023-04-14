// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Token} from "../Token.sol";
import {Test} from "./utils/Test.sol";

contract TokenTest is Test {
    Token token;
    uint256 public constant initialSupply = 100_000;
    event Mint(address indexed dst, uint256 amt);

    function setUp() public override {
        super.setUp();
        token = new Token(100_000);
    }

    function testMint() public {
        token.setEmissionsRecipient(address(this));

        // NOTE: emissionRate 1000, decayRate 5%
        token.configure(1000, 5e16, block.timestamp + 604800 * 5);
        token.setWeeklyPercent(1e16);

        vm.warp(block.timestamp + 86400);
        // decaypercent: 86400 * 5e16 / 604800 = 7.1418571e15
        // lastAmtPerWeek: 1000 * (1e18-decayPercent) / 1e18 = 992
        // amtToMint: 86400 * lastAmtPerWeek / 604800
        uint balanceBefore = token.balanceOf(address(this));
        vm.expectEmit(true, true, false, false);
        emit Mint(address(this), 141);
        token.mintEmission();
        uint balanceAfter = token.balanceOf(address(this));
        assertEq(balanceAfter - balanceBefore, 141);

        vm.warp(block.timestamp + 86400);
        balanceBefore = balanceAfter;
        token.mintEmission();
        balanceAfter = token.balanceOf(address(this));
        assertEq(balanceAfter - balanceBefore, 140);

        vm.warp(block.timestamp + 604800*7);
        balanceBefore = balanceAfter;
        token.mintEmission();
        assertEq(token.balanceOf(address(this)) - balanceBefore, 7019);

        vm.warp(block.timestamp + 604800);
        balanceBefore = balanceAfter;
        token.mintEmission();
        assertEq(token.balanceOf(address(this)) - balanceBefore, 8092);
    }
}
