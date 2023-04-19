// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IERC20} from "./interfaces/IERC20.sol";
import {Strategy} from "./Strategy.sol";
import {IGammaUniProxy} from "./interfaces/IGammaUniProxy.sol";
import {IGammaHypervisor} from "./interfaces/IGammaHypervisor.sol";

contract StrategyGamma is Strategy {

    string public name;
    IGammaUniProxy public immutable uniProxy;
    IGammaHypervisor public immutable hypervisor;
    IERC20 public immutable token0;
    IERC20 public immutable token1;

    uint256[4] minAmounts = [0, 0, 0, 0];

    constructor(address _strategyHelper, address _uniProxy, address _hypervisor) Strategy(_strategyHelper) {
        uniProxy = IGammaUniProxy(_uniProxy);
        hypervisor = IGammaHypervisor(_hypervisor);
        token0 = IERC20(hypervisor.token0());
        token1 = IERC20(hypervisor.token1());
        name = string(abi.encodePacked("Gamma ", token0.symbol(), "/", token1.symbol()));
    }

    function _rate(uint256 sha) internal view override returns (uint256) {
        return 0;
    }

    function _mint(address ast, uint256 amt, bytes calldata dat) internal override returns (uint256) {

        earn();
        pull(IERC20(ast), msg.sender, amt);

        uint256 slp = getSlippage(dat);
        uint128 tma = 0;//pool.positions(getPositionID());

        uint256 haf = amt / 2;
        IERC20(ast).approve(address(strategyHelper), amt);
        uint256 amt0 = strategyHelper.swap(ast, address(token0), haf, slp, address(this));
        uint256 amt1 = strategyHelper.swap(ast, address(token1), amt-haf, slp, address(this));

        uint256 liq = uniProxy.deposit(amt0, amt1, address(this), address(hypervisor), minAmounts);
        return tma == 0 ? liq : liq * totalShares / tma;
    }

    function _burn(address ast, uint256 amt, bytes calldata dat) internal override returns (uint256) {
        earn();
        uint256 slp = getSlippage(dat);
        uint128 tma = 0;//pool.positions(getPositionID());
        uint128 liq = uint128(amt) * tma / uint128(totalShares);

        if (liq > 0) hypervisor.withdraw(liq, address(this), address(this), minAmounts);

        uint256 bal0 = token0.balanceOf(address(this));
        uint256 bal1 = token1.balanceOf(address(this));
        token0.approve(address(strategyHelper), bal0);
        token1.approve(address(strategyHelper), bal1);
        uint256 amt0 = strategyHelper.swap(address(token0), ast, bal0, slp, msg.sender);
        uint256 amt1 = strategyHelper.swap(address(token1), ast, bal1, slp, msg.sender);
        return amt0 + amt1;
    }

    function _earn() internal override {

    }

    function _exit(address str) internal override {
//        (uint128 liquidity,,,,) = pool.positions(getPositionID());
//        if (liquidity > 0) pool.burn(minTick, maxTick, liquidity);
//        pool.collect(address(this), minTick, maxTick, type(uint128).max, type(uint128).max);
//        push(token0, str, token0.balanceOf(address(this)));
//        push(token1, str, token1.balanceOf(address(this)));

        hypervisor.withdraw(totalShares, str, str, minAmounts);
    }

    function _move(address) internal override {
        _earn();
    }

}
