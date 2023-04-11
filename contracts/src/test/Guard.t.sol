// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Test} from "./utils/Test.sol";
import {Guard} from "../Guard.sol";

contract GuardTest is Test {
    Guard g;
    address str;
    address pol;

    function setUp() public override {
        g = new Guard(address(this));
        str = vm.addr(9);
        g.setStrategy(str, 0.01e18, 5e18, 8e18, 0.025e18);
        g.setStrategyBlacklist(str, vm.addr(8), true);
    }

    function testSetExec() public {
        g.setExec(vm.addr(1), true);
        assertEq(g.exec(vm.addr(1)) ? 1 : 0, 1);
    }

    function testSetFeeRebate() public {
        g.setFeeRebate(1, 2);
        assertEq(g.feeRebateMax(), 1);
        assertEq(g.feeRebateRate(), 2);
    }

    function testToken() public {
        g.setToken(vm.addr(1));
        assertEq(address(g.token()), vm.addr(1));
    }

    function testSetStrategy() public {
        g.setStrategy(vm.addr(1), 1, 2, 3, 4);
        (uint256 a, uint256 b, uint256 c, uint256 d) = g.strategies(vm.addr(1));
        assertEq(a, 1);
        assertEq(b, 2);
        assertEq(c, 3);
        assertEq(d, 4);
    }

    function testSetStrategyPoolBlacklist() public {
        g.setStrategyBlacklist(vm.addr(1), vm.addr(2), true);
        assertEq(g.getStrategyPoolBlacklist(vm.addr(1), vm.addr(2)) ? 1 : 0, 1);
        g.setStrategyBlacklist(vm.addr(1), vm.addr(2), false);
        assertEq(g.getStrategyPoolBlacklist(vm.addr(1), vm.addr(2)) ? 1 : 0, 0);
    }

    function testCheck() public {
        bool ok;
        uint256 need;
        uint256 rebate;

        // Fail on blacklisted pool
        (ok, need, rebate) = g.check(vm.addr(1), str, vm.addr(8), 1e18, 0e18);
        assertEq(ok ? 1 : 0, 0);
        assertEq(need, 0);

        // Fail on access
        (ok, need, rebate) = g.check(vm.addr(1), str, pol, 10e18, 0e18);
        assertEq(ok ? 1 : 0, 0);
        assertEq(need, 0.1e18);

        // Pass access
        (ok, need, rebate) = g.check(vm.addr(2), str, pol, 10e18, 0e18);
        assertEq(ok ? 1 : 0, 1);
        assertEq(need, 0);
        assertEq(rebate, 0.06e18);

        // Pass access, max rebate
        (ok, need, rebate) = g.check(vm.addr(4), str, pol, 10e18, 0e18);
        assertEq(rebate, 0.5e18);

        // Fail on high leverage
        (ok, need, rebate) = g.check(vm.addr(2), str, pol, 11e18, 10e18);
        assertEq(ok ? 1 : 0, 0);
        assertEq(need, 0);

        // Pass on low leverage
        (ok, need, rebate) = g.check(vm.addr(2), str, pol, 10e18, 5e18);
        assertEq(ok ? 1 : 0, 1);
        assertEq(need, 0);

        // Fail on high leverage
        (ok, need, rebate) = g.check(vm.addr(2), str, pol, 10.1e18, 9e18);
        assertEq(ok ? 1 : 0, 0);
        assertEq(need, 0);

        // Fail on leverage but no token
        (ok, need, rebate) = g.check(vm.addr(2), str, pol, 10e18, 8.5e18);
        assertEq(ok ? 1 : 0, 0);
        assertEq(need, 138888888888888880);

        // Pass on high leverage w/ token
        (ok, need, rebate) = g.check(vm.addr(3), str, pol, 10e18, 8.5e18);
        assertEq(ok ? 1 : 0, 1);
        assertEq(need, 138888888888888880);
    }

    function balanceOf(address usr) public returns (uint256) {
        if (usr == vm.addr(4)) {
            return 10000e18;
        }
        if (usr == vm.addr(3)) {
            return 0.14e18;
        }
        if (usr == vm.addr(2)) {
            return 0.12e18;
        }
        return 0;
    }

    fallback() external {}
}
