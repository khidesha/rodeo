// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {DSTest} from "../test/utils/DSTest.sol";
import {IERC20} from "../interfaces/IERC20.sol";
import {console} from "../test/utils/console.sol";
import {Investor} from "../Investor.sol";
import {InvestorActor} from "../InvestorActor.sol";
import {Pool} from "../Pool.sol";
import {Strategy} from "../Strategy.sol";
import {Configurator} from "../support/Configurator.sol";
import {Multisig} from "../support/Multisig.sol";
import {StrategyHelper, StrategyHelperCamelot} from "../StrategyHelper.sol";
import {PartnerProxy} from "../PartnerProxy.sol";
import {LiquidityMining} from "../LiquidityMining.sol";
import {console} from "../test/utils/console.sol";
import {StrategyCurveV2} from "../strategies/StrategyCurveV2.sol";
import {OracleCurveStable2} from "../oracles/OracleCurveStable2.sol";
import {OracleTWAP} from "../oracles/OracleTWAP.sol";

contract Deploy is DSTest {
    function run() external {
        vm.startBroadcast();

        address weth = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
        address usdc = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
        //address wbtc = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f;
        //address usdt = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9;
        //address sushi = 0xd4d42F0b6DEF4CE0383636770eF773390d85c61A;
        //address gmx = 0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a;
        //address umami = 0x1622bF67e6e5747b81866fE0b85178a93C7F86e3;
        //address magic = 0x539bdE0d7Dbd336b79148AA742883198BBF60342;
        //address pls = 0x51318B7D00db7ACc4026C88c3952B66278B6A67F;
        //address vsta = 0xa684cd057951541187f288294a1e1C2646aA2d24;
        //address grail = 0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8;
        //address frax = 0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F;

        Investor investor = Investor(0x8accf43Dd31DfCd4919cc7d65912A475BfA60369);
        address strategyHelper = 0x72f7101371201CeFd43Af026eEf1403652F115EE;
        address investorActor = 0x9D6A853Da8BF51386240Ad1ed19E13C48dF3a2A7;
        address poolUsdc = 0x0032F5E1520a66C6E572e96A11fBF54aea26f9bE;
        //address shss = 0x4cA2a8cC7B1110CF3961D1F4AAB195d3Ab61BF9b;
        //address shv3 = 0xaFF008DD677d2a9fd74D27B26Efc10A8e3f7BDaD;
        //address shb = 0xb1Ae664e23332eE54e0C029937e26058a08708cC;
        //address shc = 0x5C0B2558e38410ee11C942694914F1780F504f82;
        //address shCam = 0x7FC67A688F464538259E3F559dc63F00D64F3c0b;

        Multisig multisig = Multisig(payable(0xaB7d6293CE715F12879B9fa7CBaBbFCE3BAc0A5a));
        address deployer = 0x20dE070F1887f82fcE2bdCf5D6d9874091e6FAe9;
        //address admin = 0x5d52C98D4B2B9725D9a1ea3CcAf44871a34EFB96;
        //address keeper = 0x3b1F14068Fa2AF4B08b578e80834bC031a52363D;

        /*
        InvestorActor ia = new InvestorActor(address(investor));
        ia.file("exec", address(multisig));
        ia.file("exec", address(deployer));
        bytes memory b = abi.encodeWithSignature("file(bytes32,address)", bytes32("exec"), address(ia));
        multisig.add(0x70116D50c89FC060203d1fA50374CF1B816Bd0f5, 0, b);
        multisig.add(0xbA8A58Fd6fbc9fAcB8BCf349C94B87717a4BC00f, 0, b);
        multisig.add(0x390358DEf53f2316671ed3B13D4F4731618Ff6A3, 0, b);
        multisig.add(0x9FA6CaCcE3f868E56Bdab9be85b0a90e2568104d, 0, b);
        multisig.add(0x05CBD8C4F171247aa8F4dE87b3d9e09883beD511, 0, b);
        multisig.add(0xFE280C65c328524132205cDd360781484D981e42, 0, b);
        multisig.add(0xd170cFfd7501bEc329B0c90427f06C9156845Be4, 0, b);
        multisig.add(0xcF03B33851F088d58E921d8aB5D60Dc1c3238758, 0, b);
        multisig.add(0x0d47CF8633c4F4A8733BE5a4fcC9e4Be8B1c628D, 0, b);
        multisig.add(0xeF22614C3BDeA15b42434eb5F481D722D7e904dB, 0, b);
        multisig.add(0xCE0488a9FfD70156d8914C02D95fA320DbBE93Ab, 0, b);
        multisig.add(0xbA8A58Fd6fbc9fAcB8BCf349C94B87717a4BC00f, 0, b);
        multisig.add(0x82bE2F89460581F20A4964Fd91c3376d9952a9FF, 0, b);
        multisig.add(0x8D8627f0bb5A73035678289E5692766EDce341eA, 0, b);
        multisig.add(0xc45a107f742B7dA6E9e48c5cc29ead668AF295F7, 0, b);
        multisig.add(0x91308b8d5e2352C7953D88A55D1012D68bF1EfD0, 0, b);
        multisig.add(0xeB40EA021841d3d6191B76A0056863f52a71b2C5, 0, b);
        multisig.add(address(poolUsdc), 0, abi.encodeWithSignature("file(bytes32,address)", bytes32("exec"), address(ia)));
        multisig.add(address(investor), 0, abi.encodeWithSignature("file(bytes32,address)", bytes32("actor"), address(ia)));
        */


        /*
        StrategyCurveV2 s = new StrategyCurveV2(
            strategyHelper,
            0x59bF0545FCa0E5Ad48E13DA269faCD2E8C886Ba4,
            0xF2dDF89C04d702369Ab9eF8399Edb99a76e951Ce,
            1
        );
        //s.file("slippage", 100);
        s.file("exec", investorActor);
        s.file("exec", address(investor));
        s.file("exec", address(multisig));
        s.file("exec", address(deployer));
        multisig.add(address(investor), 0, abi.encodeWithSignature("setStrategy(uint256,address)", investor.nextStrategy(), address(s)));
        //*/
        //multisig.add(address(strategyHelper), 0, abi.encodeWithSignature("setOracle(address,address)", magic, 0xb7AD108628B8876f68349d4F150f33e97f5DAE03));
        //bytes memory b = abi.encodePacked(magic, weth, usdc);
        //multisig.add(address(strategyHelper), 0, abi.encodeWithSignature("setPath(address,address,address,bytes)", magic, usdc, shss, b));

        /*
        OracleCurveStable2 o = new OracleCurveStable2(strategyHelper, 0x59bF0545FCa0E5Ad48E13DA269faCD2E8C886Ba4, 0);
        OracleTWAP o2 = new OracleTWAP(address(o));
        o2.file("exec", address(multisig));
        o2.file("exec", keeper);
        o2.file("exec", deployer);
        multisig.add(address(strategyHelper), 0, abi.encodeWithSignature("setOracle(address,address)", 0x64343594Ab9b56e99087BfA6F2335Db24c2d1F17, address(o2)));
        */

        /*
        StrategyJonesUsdc s = new StrategyJonesUsdc(
          address(strategyHelper),
          0x5859731D7b7e413A958eA1cDb9020C611b016395,
          0x42EfE3E686808ccA051A49BCDE34C5CbA2EBEfc1
        );
        //s.file("slippage", 100);
        s.file("exec", investorActor);
        s.file("exec", address(investor));
        s.file("exec", address(multisig));
        s.file("exec", address(deployer));
        multisig.add(address(investor), 0, abi.encodeWithSignature("setStrategy(uint256,address)", 20, address(s)));
        //multisig.add(address(investor), 0, abi.encodeWithSignature("setStrategy(uint256,address)", investor.nextStrategy(), address(s)));
        //*/

        /*
        address pls = 0x51318B7D00db7ACc4026C88c3952B66278B6A67F;
        address pool = 0xbFD465E270F8D6bA62b5000cD27D155FB5aE70f0;
        address chainlinkEthUsd = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
        OracleUniswapV3 o = new OracleUniswapV3(pool, weth, chainlinkEthUsd);
        multisig.add(address(strategyHelper), 0, abi.encodeWithSignature("setOracle(address,address)", pls, address(o)));
        multisig.add(address(strategyHelper), 0, abi.encodeWithSignature("setPath(address,address,address,bytes)", pls, weth, shv3, abi.encodePacked(pls, uint24(3000), weth)));
        */

        //StrategyUniswapV3 s = new StrategyUniswapV3(
        //    strategyHelper,
        //    0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443,
        //    1654
        //);
        //s.file("exec", investorActor);
        //s.file("exec", address(investor));
        //s.file("exec", address(configurator));
        //s.file("exec", deployer);
        //uint256 sid = investor.nextStrategy();
        //configurator.setStrategy(address(investor), sid, address(s));

        //StrategyCurveV2 s = new StrategyCurveV2(
        //    strategyHelper,
        //    0x960ea3e3C7FB317332d990873d354E18d7645590,
        //    0x97E2768e8E73511cA874545DC5Ff8067eB19B787,
        //    2
        //);

        //StrategyBalancer s = new StrategyBalancer(
        //    strategyHelper,
        //    0xBA12222222228d8Ba445958a75a0704d566BF2C8,
        //    0xb08E16cFc07C684dAA2f93C70323BAdb2A6CBFd2,
        //    0x64541216bAFFFEec8ea535BB71Fbc927831d0595,
        //    0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8
        //);

        //StrategyBalancerStable s = new StrategyBalancerStable(
        //    strategyHelper,
        //    0xBA12222222228d8Ba445958a75a0704d566BF2C8,
        //    0xb08E16cFc07C684dAA2f93C70323BAdb2A6CBFd2,
        //    0xFB5e6d0c1DfeD2BA000fBC040Ab8DF3615AC329c,
        //    0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
        //);

        //StrategyGMXGLP s = new StrategyGMXGLP(
        //  address(sh),
        //  0xB95DB5B167D75e6d04227CfFFA61069348d271F5,
        //  0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1,
        //  0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf,
        //  weth
        //);

        // SETSTRATEGY Sushiswap
        //StrategySushiswap s = new StrategySushiswap(
        //    address(sh),
        //    0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3,
        //    4
        //);
        //address s = 0xeEb9702F972890fE06F3f6f2A1f7f38C2679E7Aa;
        //IFileable(address(s)).file("exec", investorActor);
        //IFileable(address(s)).file("exec", investor);
        //IFileable(address(s)).file("exec", address(configurator));
        //IFileable(address(s)).file("exec", deployer);
        //configurator.setStrategy(address(investor), 16, address(s));
        //emit log_named_uint("nextStrategy", investor.nextStrategy());
        //investor.setStrategy(investor.nextStrategy(), address(s));
        //IFileable(0xeEb9702F972890fE06F3f6f2A1f7f38C2679E7Aa).file("slippage", 200);

        // SETORACLE UniswapV3
        //address chainlinkEthUsd = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
        //OracleUniswapV3 o = new OracleUniswapV3(pool, weth, chainlinkEthUsd);
        //sh.setOracle(usdt, address(o));
        //sh.setPath(weth, gmx, shv3, abi.encodePacked(weth, uint24(3000), gmx));

        // SETPATH Curce
        //{
        //address[] memory pathPools = new address[](3);
        //uint256[] memory pathCoinIn = new uint256[](3);
        //uint256[] memory pathCoinOut = new uint256[](3);
        //pathPools[0] = 0x7f90122BF0700F9E7e1F688fe926940E8839F353;
        //pathCoinIn[0] = 0;
        //pathCoinOut[0] = 1;
        //pathPools[1] = 0x960ea3e3C7FB317332d990873d354E18d7645590;
        //pathCoinIn[1] = 0;
        //pathCoinOut[1] = 2;
        //pathPools[2] = 0x6eB2dc694eB516B16Dc9FBc678C60052BbdD7d80;
        //pathCoinIn[2] = 0;
        //pathCoinOut[2] = 1;
        //bytes memory path = abi.encode(pathPools, pathCoinIn, pathCoinOut);
        //configurator.setPath(strategyHelper, 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8, 0x5979D7b546E38E414F7E9822514be443A4800529, address(shc), path);
        //}

        // SETPATH CURVE STETH-{USDC/ETH}
        //bytes memory path = hex"000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000030000000000000000000000007f90122bf0700f9e7e1f688fe926940e8839f353000000000000000000000000960ea3e3c7fb317332d990873d354e18d76455900000000000000000000000006eb2dc694eb516b16dc9fbc678c60052bbdd7d8000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001";
        //uint256 id = multisig.add(strategyHelper, 0, abi.encodeWithSignature("setPath(address,address,address,bytes)", 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8, 0x5979D7b546E38E414F7E9822514be443A4800529, shc, path));
        //multisig.execute(id);
        //path = hex"000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000030000000000000000000000006eb2dc694eb516b16dc9fbc678c60052bbdd7d80000000000000000000000000960ea3e3c7fb317332d990873d354e18d76455900000000000000000000000007f90122bf0700f9e7e1f688fe926940e8839f35300000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        //id = multisig.add(strategyHelper, 0, abi.encodeWithSignature("setPath(address,address,address,bytes)", 0x5979D7b546E38E414F7E9822514be443A4800529, 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8, shc, path));
        //multisig.execute(id);
        //path = hex"000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006eb2dc694eb516b16dc9fbc678c60052bbdd7d800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000";
        //id = multisig.add(strategyHelper, 0, abi.encodeWithSignature("setPath(address,address,address,bytes)", 0x5979D7b546E38E414F7E9822514be443A4800529, weth, shc, path));
        //multisig.execute(id);
        //path = hex"000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006eb2dc694eb516b16dc9fbc678c60052bbdd7d800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001";
        //id = multisig.add(strategyHelper, 0, abi.encodeWithSignature("setPath(address,address,address,bytes)", weth, 0x5979D7b546E38E414F7E9822514be443A4800529, shc, path));
        //multisig.execute(id);

        vm.stopBroadcast();
    }
}

/*
//PROTOCOL DEPLOY
uint256 year = 365*24*60*60;
PoolRateModel poolRateModel = new PoolRateModel(85e16, 1e16/year, 3e16/year, 120e16/year);
emit log_named_address("poolRateModel", address(poolRateModel));
Pool usdcPool = new Pool(address(usdc), address(poolRateModel), address(usdcOracle), 10e6, 90e16, 95e16, 1000000e6);
emit log_named_address("pool", address(usdcPool));
Investor investor = new Investor();
emit log_named_address("investor", address(investor));
InvestorActor investorActor = new InvestorActor(address(investor));
emit log_named_address("investorActor", address(investorActor));
usdcPool.file("exec", address(investor));
investor.file("pools", address(usdcPool));
StrategyHelper sh = new StrategyHelper();
emit log_named_address("strategyHelper", address(sh));
sh.setOracle(address(usdc), address(usdcOracle));
InvestorHelper ih = new InvestorHelper(address(investor));
emit log_named_address("investorHelper", address(ih));
PositionManager pm = new PositionManager(address(investor));
emit log_named_address("positionManager", address(pm));
StrategyHelperUniswapV2 shss = new StrategyHelperUniswapV2(0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506);
StrategyHelperUniswapV3 shv3 = new StrategyHelperUniswapV3(0xE592427A0AEce92De3Edee1F18E0157C05861564);*/

/*
// DEPLOY BALANCER FARM
address vault = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;
address gaugeFactory = 0xb08E16cFc07C684dAA2f93C70323BAdb2A6CBFd2;
address pool = 0xFB5e6d0c1DfeD2BA000fBC040Ab8DF3615AC329c;
address shb = 0xb1Ae664e23332eE54e0C029937e26058a08708cC;
address o = 0x198c2CC46a17E023Fa7c76909E4a6858FbC87B71;
//StrategyHelperBalancer shb = new StrategyHelperBalancer(vault);
//OracleBalancerLPStable o = new OracleBalancerLPStable(
//    address(sh),
//    vault,
//    pool
//);
//sh.setOracle(pool, address(o));
//sh.setOracle(0x5979D7b546E38E414F7E9822514be443A4800529, 0x07C5b924399cc23c24a95c8743DE4006a32b7f2a);
//sh.setPath(weth, pool, address(shb), abi.encode(pool, IBalancerPool(pool).getPoolId()));
//sh.setPath(pool, weth, address(shb), abi.encode(weth, IBalancerPool(pool).getPoolId()));
//sh.setPath(0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8, weth, shb, abi.encode(weth, IBalancerPool(0xcC65A812ce382aB909a11E434dbf75B34f1cc59D).getPoolId())); // bal
//sh.setPath(0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60, weth, shb, abi.encode(weth, IBalancerPool(pool).getPoolId())); // ldo
//StrategyBalancerStable s = new StrategyBalancerStable(
//    address(sh),
//    vault,
//    gaugeFactory,
//    pool,
//    weth
//);
//address s = 0xa1d0c80981f35b5Da52D9deA546b93C9943614D6;
//uint256 sid = investor.nextStrategy();
//investor.setStrategy(sid, address(s));
//IFileable(0xa1d0c80981f35b5Da52D9deA546b93C9943614D6).file("exec", investorActor);

// WEIGHTED
//address vault = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;
//address gaugeFactory = 0xb08E16cFc07C684dAA2f93C70323BAdb2A6CBFd2;
//address pool = 0x64541216bAFFFEec8ea535BB71Fbc927831d0595;
//StrategyBalancer s = new StrategyBalancer(
//    address(sh),
//    vault,
//    gaugeFactory,
//    pool,
//    usdc
//);
//address s = 0x8ffC6FfEC753F58fE0a30059028340DDA5e2d889;
//IFileable(s).file("exec", address(investorActor));
//emit log_named_uint("nextStrategy", investor.nextStrategy());
//investor.setStrategy(investor.nextStrategy(), address(s));*/
