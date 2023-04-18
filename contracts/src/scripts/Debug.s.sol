// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {DSTest} from "../test/utils/DSTest.sol";
import {IERC20} from "../interfaces/IERC20.sol";
import {Investor} from "../Investor.sol";
import {InvestorHelper} from "../InvestorHelper.sol";
import {Pool} from "../Pool.sol";
import {Strategy} from "../Strategy.sol";
import {Multisig} from "../support/Multisig.sol";
import {StrategyHelper, StrategyHelperMulti} from "../StrategyHelper.sol";
import {PositionManager, ERC721TokenReceiver} from "../PositionManager.sol";
import {StrategyCurveV2} from "../strategies/StrategyCurveV2.sol";
import {OracleCurveStable2} from "../oracles/OracleCurveStable2.sol";

import {console} from "../test/utils/console.sol";

contract Debug is DSTest, ERC721TokenReceiver {
    function run() external {
        address usdc = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
        address weth = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
        address poolUsdc = 0x0032F5E1520a66C6E572e96A11fBF54aea26f9bE;
        address investorActor = 0x9D6A853Da8BF51386240Ad1ed19E13C48dF3a2A7;
        address strategyHelper = 0x72f7101371201CeFd43Af026eEf1403652F115EE;
        Investor investor = Investor(0x8accf43Dd31DfCd4919cc7d65912A475BfA60369);
        Multisig multisig = Multisig(payable(0xaB7d6293CE715F12879B9fa7CBaBbFCE3BAc0A5a));

        //vm.startPrank(0x59b670e9fA9D0A427751Af201D676719a970857b); // Local
        address deployer = 0x20dE070F1887f82fcE2bdCf5D6d9874091e6FAe9;
        vm.startPrank(deployer);

        //address(0x7E1Bd1Fd795Aa458A4e5bc1c1371be96a47Dd299).call(abi.encodeWithSignature("earn()"));

        /*
        // DEPLOY NEW STRATEGY
        StrategyCurveV2 s = new StrategyCurveV2(
            strategyHelper,
            0x59bF0545FCa0E5Ad48E13DA269faCD2E8C886Ba4,
            0xF2dDF89C04d702369Ab9eF8399Edb99a76e951Ce,
            1
        );
        //vm.stopPrank();
        //vm.startPrank(0xa5c1c5a67Ba16430547FEA9D608Ef81119bE1876);
        //address(0x97247DE3fe7c5aA718b2be4d454E42de11eAfc6d).call(abi.encodeWithSignature("whitelistAdd(address)", address(s)));
        //address(0x4E5Cf54FdE5E1237e80E87fcbA555d829e1307CE).call(abi.encodeWithSignature("setWhitelist(address)", 0x97247DE3fe7c5aA718b2be4d454E42de11eAfc6d));
        s.file("slippage", 100);
        s.file("exec", investorActor);
        s.file("exec", address(investor));
        vm.stopPrank();
        vm.startPrank(address(multisig));
        //address o = address(new OracleUniswapV2Usdc(0x87425D8812f44726091831a9A109f4bDc3eA34b4, usdc));
        //StrategyHelper(strategyHelper).setOracle(0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8, o);
        uint256 sid = investor.nextStrategy();
        investor.setStrategy(sid, address(s));
        vm.stopPrank();
        vm.startPrank(deployer);
        IERC20(usdc).approve(address(investor), type(uint256).max);
        investor.earn(deployer, poolUsdc, sid, 50e6, 0, "");
        s.earn();
        console.log("value", s.rate(s.totalShares())/1e16);
        investor.earn(deployer, poolUsdc, sid, 10e6, 0, "");
        console.log("value", s.rate(s.totalShares())/1e16);
        investor.earn(deployer, poolUsdc, sid, 10e6, 0, "");
        console.log("value", s.rate(s.totalShares())/1e16);
        vm.warp(block.timestamp+1800);
        s.earn();
        uint256 pid = investor.nextPosition()-2;
        (,,,,,uint256 sha,) = investor.positions(pid);
        investor.edit(pid, 0-int256(sha), 0, "");
        console.log("value", s.rate(s.totalShares())/1e16);
        //*/

        /*
        // UPDATE STRATEGY
        StrategyGMXGLP s = new StrategyGMXGLP(
          address(strategyHelper),
          0xB95DB5B167D75e6d04227CfFFA61069348d271F5,
          0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1,
          0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf,
          weth, usdc
        );
        s.file("slippage", 100);
        s.file("exec", investorActor);
        s.file("exec", address(investor));
        StrategyGMXGLP os = StrategyGMXGLP(investor.strategies(12));
        console.log("value old", os.rate(os.totalShares()));
        vm.stopPrank();
        vm.startPrank(address(multisig));
        investor.setStrategy(12, address(s));
        console.log("value new", s.rate(s.totalShares()));
        //*/

        /*
        address shm = address(new StrategyHelperMulti(address(strategyHelper)));
        vm.stopPrank();
        vm.startPrank(address(multisig));
        StrategyGMXGLP(0x390358DEf53f2316671ed3B13D4F4731618Ff6A3).file("slippage", 200);
        StrategyHelper(strategyHelper).setPath(0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8, weth, 0xb1Ae664e23332eE54e0C029937e26058a08708cC, abi.encode(weth, bytes32(hex"cc65a812ce382ab909a11e434dbf75b34f1cc59d000200000000000000000001")));
        address[] memory assets = new address[](3);
        assets[0] = 0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8;
        assets[1] = weth;
        assets[2] = usdc;
        StrategyHelper(strategyHelper).setPath(0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8, usdc, shm, abi.encode(assets));
        */

        /*
        vm.stopPrank();
        vm.startPrank(0x20dE070F1887f82fcE2bdCf5D6d9874091e6FAe9);
        address(0x5e4d7F61cC608485A2E4F105713D26D58a9D0cF6).call(
            hex"20f11719000000000000000000000000000000000000000000000000000000000000023effffffffffffffffffffffffffffffffffffffffffffffff031d6072012d90f6ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6b88b1000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000032"
        );
        //*/

        /*
        OracleChainlinkETH owst = new OracleChainlinkETH(0xB1552C5e96B312d0Bf8b554186F846C40614a540, 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612);
        sh.setOracle(0x5979D7b546E38E414F7E9822514be443A4800529, address(owst));
        StrategyHelperCurve shc = new StrategyHelperCurve(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);
        {
        address[] memory pathPools = new address[](3);
        uint256[] memory pathCoinIn = new uint256[](3);
        uint256[] memory pathCoinOut = new uint256[](3);
        pathPools[0] = 0x7f90122BF0700F9E7e1F688fe926940E8839F353;
        pathCoinIn[0] = 0;
        pathCoinOut[0] = 1;
        pathPools[1] = 0x960ea3e3C7FB317332d990873d354E18d7645590;
        pathCoinIn[1] = 0;
        pathCoinOut[1] = 2;
        pathPools[2] = 0x6eB2dc694eB516B16Dc9FBc678C60052BbdD7d80;
        pathCoinIn[2] = 0;
        pathCoinOut[2] = 1;
        bytes memory path = abi.encode(pathPools, pathCoinIn, pathCoinOut);
        sh.setPath(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8, 0x5979D7b546E38E414F7E9822514be443A4800529, address(shc), path);
        }
        {
        address[] memory pathPools = new address[](3);
        uint256[] memory pathCoinIn = new uint256[](3);
        uint256[] memory pathCoinOut = new uint256[](3);
        pathPools[0] = 0x6eB2dc694eB516B16Dc9FBc678C60052BbdD7d80;
        pathCoinIn[0] = 1;
        pathCoinOut[0] = 0;
        pathPools[1] = 0x960ea3e3C7FB317332d990873d354E18d7645590;
        pathCoinIn[1] = 2;
        pathCoinOut[1] = 0;
        pathPools[2] = 0x7f90122BF0700F9E7e1F688fe926940E8839F353;
        pathCoinIn[2] = 1;
        pathCoinOut[2] = 0;
        bytes memory path = abi.encode(pathPools, pathCoinIn, pathCoinOut);
        sh.setPath(0x5979D7b546E38E414F7E9822514be443A4800529, 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8, address(shc), path);
        }
        {
        address[] memory pathPools1 = new address[](1);
        uint256[] memory pathCoinIn1 = new uint256[](1);
        uint256[] memory pathCoinOut1 = new uint256[](1);
        pathPools1[0] = 0x6eB2dc694eB516B16Dc9FBc678C60052BbdD7d80;
        pathCoinIn1[0] = 1;
        pathCoinOut1[0] = 0;
        bytes memory path1 = abi.encode(pathPools1, pathCoinIn1, pathCoinOut1);
        sh.setPath(0x5979D7b546E38E414F7E9822514be443A4800529, weth, address(shc), path1);
        }
        StrategyKyber s = new StrategyKyber(
            address(sh),
            0x2B1c7b41f6A8F2b2bc45C3233a5d5FB3cD6dC9A8,
            0xBdEc4a045446F583dc564C0A227FFd475b329bf0,
            0x114DE2aFFc6A335433dbe9D3D51A8F31a5591fdF,
            800
        );
        s.file("exec", investorActor);
        s.file("slippage", 1000);
        //sh.setOracle(0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978, 0xaebDA2c976cfd1eE1977Eac079B4382acb849325);

        IERC20(usdc).approve(address(investor), 1000e6);
        investor.earn(a, poolUsdc, sid, 1000e6, 0, "");
        console.log("value", s.rate(s.totalShares())/1e16);
        */

        /*
        vm.warp(block.timestamp+1);
        (,,,,,uint256 sha,) = investor.positions(investor.nextPosition()-1);
        investor.edit(investor.nextPosition()-1, 0-int256(sha), 0, "");
        */

        /*
        s.file("exec", address(investor));
        StrategyKyber s2 = new StrategyKyber(
            address(sh),
            0x2B1c7b41f6A8F2b2bc45C3233a5d5FB3cD6dC9A8,
            0xBdEc4a045446F583dc564C0A227FFd475b329bf0,
            0x114DE2aFFc6A335433dbe9D3D51A8F31a5591fdF,
            800
        );
        s2.file("exec", address(investor));
        s2.file("exec", address(investorActor));
        investor.setStrategy(sid, address(s2));
        console.log("value s", s.rate(s.totalShares())/1e16);
        console.log("value s2", s2.rate(s2.totalShares())/1e16, s2.totalShares());
        */

        /*
        IERC20(usdc).approve(address(investor), 1000e6);
        investor.earn(deployer, poolUsdc, sid, 1000e6, 0, "");
        (,,,,, uint256 sha,) = investor.positions(investor.nextPosition() - 1);
        console.log("value", s.rate(sha) / 1e16);
        console.log("total", s.rate(s.totalShares()) / 1e16);

        vm.warp(block.timestamp + 1);
        investor.edit(investor.nextPosition() - 1, 0 - int256(sha), 0, "");
        */
    }
}
