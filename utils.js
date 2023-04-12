import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import {
  chain,
  configureChains,
  createClient,
  useSigner as wagmiUseSigner,
  useProvider as wagmiUseProvider,
  useAccount,
  useNetwork,
} from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import Icon from "./components/icon";

export const ONE = ethers.utils.parseUnits("1");
export const YEAR = 365 * 24 * 60 * 60;
export const DEAD_ADDRESS = "0x00000000000000000000000000000000DeaDBeef";
export const DEFAULT_CHAIN_ID = 42161;
export const DEFAULT_NETWORK_NAME = "arbitrum";
export const DONUT_COLORS = {
  0: "#df8418",
  1: "#eda959",
  2: "#f5cea0",
  3: "#fcf3e7",
  4: "#fcf3e7",
  5: "#fcf3e7",
};

export const ADDRESSES = {
  arbitrum: {
    investor: "0x8accf43Dd31DfCd4919cc7d65912A475BfA60369",
    investorHelper: "0x6f456005A7CfBF0228Ca98358f60E6AE1d347E18",
    positionManager: "0x5e4d7F61cC608485A2E4F105713D26D58a9D0cF6",
    liquidityMining: "0xE1ab63006e0fa0434a0e9665483B64F83eA9E04a",
  },
  "arbitrum-rinkeby": {
    investor: "0x057c7a9627eff1d7054cde31015bcd1ede9a612d",
    investorHelper: "0x60923cf52f5ac7ce145bd3a5b34de02632fa4f50",
    positionManager: "0x54978E353C057aa6e3011cF819fBe08200814477",
  },
  localhost: {
    investor: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    investorHelper: "0x959922be3caee4b8cd9a407cc3ac1c251c2007b1",
    positionManager: "0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae",
    liquidityMining: "0x68b1d87f95878fe05b998f19b66f4baba5de1aed",
  },
};

export const EXPLORER_URLS = {
  arbitrum: "arbiscan.io",
  "arbitrum-rinkeby": "testnet.arbiscan.io",
  localhost: "arbiscan.io",
};

export const assets = {
  arbitrum: {
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": {
      name: "Circle USD Coin",
      symbol: "USDC",
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
      icon: "/assets/usdc.svg",
    },
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      decimals: 18,
      icon: "/assets/eth.svg",
    },
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": {
      name: "Wrapped BTC",
      symbol: "WBTC",
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      decimals: 18,
      icon: "/assets/wbtc.svg",
    },
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": {
      name: "Tether USD",
      symbol: "USDT",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimals: 6,
      icon: "/assets/usdt.svg",
    },
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": {
      name: "Dai",
      symbol: "DAI",
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      decimals: 18,
      icon: "/assets/dai.svg",
    },
    "0x539bdE0d7Dbd336b79148AA742883198BBF60342": {
      name: "Magic",
      symbol: "MAGIC",
      address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
      decimals: 18,
      icon: "/assets/magic.png",
    },
    "0xa684cd057951541187f288294a1e1C2646aA2d24": {
      name: "Vesta",
      symbol: "VSTA",
      address: "0xa684cd057951541187f288294a1e1C2646aA2d24",
      decimals: 18,
      icon: "/assets/vsta.png",
    },
    "0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8": {
      name: "Grail",
      symbol: "GRAIL",
      address: "0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8",
      decimals: 18,
      icon: "/assets/grail.svg",
    },
  },
  "arbitrum-rinkeby": {},
  localhost: {
    "0x5FbDB2315678afecb367f032d93F642f64180aa3": {
      name: "Circle USD Coin",
      symbol: "USDC",
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      decimals: 6,
      icon: "/assets/usdc.svg",
    },
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512": {
      name: "Ether",
      symbol: "ETH",
      address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      decimals: 18,
      icon: "/assets/eth.svg",
    },
  },
};

export const tokens = {
  Other: {
    name: "Other",
    description: "A mix of smaller amounts of other tokens.",
  },
  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": {
    name: "USDC",
    description:
      "USDC is a fully collateralized US dollar stablecoin. USDC is issued by regulated financial institutions, backed by fully reserved assets, redeemable on a 1:1 basis for US dollars.",
  },
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": {
    name: "WETH",
    description:
      "The native currency that flows within the Ethereum economy is called Ether (ETH). Ether is typically used to pay for transaction fees called Gas, and it is the base currency of the network.",
  },
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": {
    name: "WBTC",
    description:
      "Wrapped Bitcoin (WBTC) is the first ERC20 token backed 1:1 with Bitcoin. Completely transparent. 100% verifiable. Community led.",
  },
  "0x5979D7b546E38E414F7E9822514be443A4800529": {
    name: "stETH",
    description:
      "Lido’s Staked Ethereum, also known as stETH, is a digital asset representing ETH staked with Lido Finance, combining staking rewards with the value of the initial deposit. ",
  },
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": {
    name: "DAI",
    description:
      "Dai is a stable, decentralized currency that does not discriminate. Any individual or business can realize the advantages of digital money.",
  },
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": {
    name: "USDT",
    description:
      "Tether is a stablecoin pegged to the US Dollar. A stablecoin is a type of cryptocurrency whose value is pegged to another fiat currency like the US Dollar or to a commodity like Gold.Tether is the first stablecoin to be created and it is the most popular stablecoin used in the ecosystem.",
  },
  "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a": {
    name: "GMX",
    description:
      "GMX is the utility and governance token of the GMX decentralized spot and perpetual exchange that supports low swap fees, zero price impact trades and up to 30x leverage. Staked GMX earns escrowed GMX and 30% of platform fees in the form of ETH.",
  },
  "0x1622bF67e6e5747b81866fE0b85178a93C7F86e3": {
    name: "UMAMI",
    description:
      "UMAMI is the protocol's governance and fee-generating token. It has a fixed Max Supply of 1,000,000 and can be staked for a share of Umami's protocol revenues. ",
  },
  "0x539bdE0d7Dbd336b79148AA742883198BBF60342": {
    name: "MAGIC",
    description:
      "Treasure is the decentralized gaming ecosystem bringing games and players together through MAGIC.",
  },
  "0xa684cd057951541187f288294a1e1C2646aA2d24": {
    name: "VSTA",
    description:
      "Vesta Finance allows you to borrow collateralized stablecoin VST against supported crypto assets with low interest rate.",
  },
  "0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8": {
    name: "GRAIL",
    description:
      "Camelot is an innovative and highly flexible DEX built to support the Arbitrum ecosystem. Community driven and capital efficient.",
  },
};

export const pools = {
  arbitrum: [
    {
      asset: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      address: "0x0032F5E1520a66C6E572e96A11fBF54aea26f9bE",
      slug: "usdc-v1",
    },
  ],
  "arbitrum-rinkeby": [],
  localhost: [
    {
      asset: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
      slug: "usdc-v1",
    },
    {
      asset: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
      slug: "eth-v1",
    },
  ],
};

export const strategies = {
  arbitrum: [
    {
      name: "jUSDC",
      protocol: "JonesDAO",
      icon: "/protocols/jonesdao.png",
      address: "0xeF22614C3BDeA15b42434eb5F481D722D7e904dB",
      index: 20,
      apy: { type: "defillama", id: "dde58f35-2d08-4789-a641-1225b72c3147" },
      description:
        "Mints JonesDAO jUSDC (USDC is lent to jGLP vault for extra leverage), collecting rewards. Because of the one day lock on withdrawals, only 10% of this farm's funds are available for withdrawal at a time, refilled daily.",
      slug: "jones-jusdc",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 100,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
    {
      name: "plvGLP",
      protocol: "PlutusDAO",
      icon: "/protocols/plutusdao.png",
      address: "0x0d47CF8633c4F4A8733BE5a4fcC9e4Be8B1c628D",
      index: 21,
      apy: { type: "plutus", id: "plvglp" },
      description:
        "Mints GMX GLP, then mints plvGLP with it, then deposits that in Plutus's PLS farm for extra yield.",
      slug: "plutus-plvglp",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 38.8,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
        {
          ratio: 29.9,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 18.2,
          address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        },
        {
          ratio: 13.1,
          address: "Other",
        },
      ],
    },
    {
      name: "GLP",
      protocol: "GMX",
      icon: "/protocols/gmx.png",
      address: "0x70116D50c89FC060203d1fA50374CF1B816Bd0f5",
      index: 12,
      apy: { type: "defillama", id: "825688c0-c694-4a6b-8497-177e425b7348" },
      description:
        "Uses USDC to mint GMX GLP and stakes it for ETH fees and esGMX rewards, compounding over time. This mean you will have ~50% exposure to BTC and ETH.",
      slug: "gmx-glp",
      assets: [
        {
          ratio: 38.8,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
        {
          ratio: 29.9,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 18.2,
          address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        },
        {
          ratio: 13.1,
          address: "Other",
        },
      ],
    },
    {
      name: "VLP",
      protocol: "Vela",
      icon: "/protocols/vela.png",
      address: "0x82bE2F89460581F20A4964Fd91c3376d9952a9FF",
      index: 24,
      apy: { type: "vela", id: "vlp" },
      description: "Uses USDC to mint Vela VLP earning protocol trading fees.",
      slug: "vela-vlp",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 100,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
    {
      name: "MLP",
      protocol: "Mycelium",
      icon: "/protocols/mycelium.svg",
      address: "0x8D8627f0bb5A73035678289E5692766EDce341eA",
      index: 25,
      apy: { type: "defillama", id: "2ed078af-3994-4383-9587-eeea297eff78" },
      description:
        "Uses USDC to mint Mycelium MLP and stakes it for ETH fees and esMYC rewards, compounding over time. This mean you will have ~50% exposure to BTC and ETH.",
      slug: "mycelium-mlp",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 30.8,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
        {
          ratio: 25.6,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 18.8,
          address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        },
        {
          ratio: 16.4,
          address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        },
        {
          ratio: 8.4,
          address: "Other",
        },
      ],
    },
    {
      name: "ETH/USDC",
      protocol: "TraderJoe",
      icon: "/protocols/traderjoe.png",
      address: "0xCE0488a9FfD70156d8914C02D95fA320DbBE93Ab",
      index: 22,
      apy: {
        type: "traderjoe",
        id: "0x7ec3717f70894f6d9ba0be00774610394ce006ee",
      },
      description:
        "Invests funds into TraderJoe's V2 ETH/USDC LP pool. Fees are then auto-compounded into more LP tokens",
      slug: "traderjoe-eth-usdc",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 50,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
    {
      name: "MAGIC/ETH",
      protocol: "TraderJoe",
      icon: "/protocols/traderjoe.png",
      address: "0xbA8A58Fd6fbc9fAcB8BCf349C94B87717a4BC00f",
      index: 23,
      apy: {
        type: "traderjoe",
        id: "0xa51ee8b744e6cc1f2ac12b9eeaae8deb27619c6b",
      },
      description:
        "Invests funds into TraderJoe's V2 MAGIC/ETH LP pool. Fees are then auto-compounded into more LP tokens",
      slug: "traderjoe-magic-eth",
      slippage: 150,
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 50,
          address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
        },
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
      ],
    },
    {
      name: "wstETH/ETH",
      protocol: "Balancer",
      icon: "/protocols/balancer.svg",
      address: "0x9FA6CaCcE3f868E56Bdab9be85b0a90e2568104d",
      index: 13,
      apy: { type: "defillama", id: "7b61340c-ac6d-4f30-8bf4-0abe83da5b6d" },
      description:
        "Mints balancer LP tokens and stakes them in the reward gauge. Collects trading fees and autocompounds rewards.",
      slug: "bal-wsteth-eth",
      isNew: true,
      assets: [
        {
          ratio: 50,
          address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        },
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
      ],
    },
    {
      name: "WBTC/ETH/USDC",
      protocol: "Balancer",
      icon: "/protocols/balancer.svg",
      address: "0x390358DEf53f2316671ed3B13D4F4731618Ff6A3",
      index: 14,
      apy: { type: "defillama", id: "872bc9c7-5c79-479b-a654-e72b74e4c810" },
      description:
        "Mints balancer LP tokens and stakes them in the reward gauge. Collects trading fees and autocompounds rewards.",
      slug: "bal-wbtc-weth-usdc",
      isNew: true,
      assets: [
        {
          ratio: 33,
          address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        },
        {
          ratio: 33,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 33,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
    {
      name: "VSTA/ETH",
      protocol: "Balancer",
      icon: "/protocols/balancer.svg",
      address: "0xc45a107f742B7dA6E9e48c5cc29ead668AF295F7",
      index: 26,
      apy: { type: "defillama", id: "9a349ffb-302f-41a5-b660-1bac00449d66" },
      description:
        "Mints balancer LP tokens and stakes them in the reward gauge. Collects trading fees and autocompounds rewards.",
      slug: "bal-vsta-eth",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 50,
          address: "0xa684cd057951541187f288294a1e1C2646aA2d24",
        },
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
      ],
    },
    {
      name: "WBTC/ETH/USDT",
      protocol: "Curve",
      icon: "/protocols/curve.svg",
      address: "0x6d98F80D9Cfb549264B4B7deD12426eb6Ea47800",
      index: 16,
      slippage: 150,
      apy: { type: "defillama", id: "429bbfd9-1496-4871-9406-b64f3d05f38d" },
      description:
        "Mints curve TriCrypto LP tokens and stakes them in the reward gauge. Collects trading fees and autocompounds rewards.",
      slug: "crv-wbtc-weth-usdt",
      isNew: true,
      assets: [
        {
          ratio: 33,
          address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        },
        {
          ratio: 33,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 33,
          address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        },
      ],
    },
    {
      name: "ETH/USDC",
      protocol: "Camelot",
      icon: "/protocols/camelot.svg",
      address: "0x91308b8d5e2352C7953D88A55D1012D68bF1EfD0",
      index: 27,
      apy: { type: "defillama", id: "4606a6d6-445d-4338-81bf-e96c38196bcb" },
      description:
        "Invests funds into Camelot's LP pool and stakes it in the NFTPool for GRAIL rewards. Rewards are then auto-compounded into more LP tokens",
      slug: "camelot-eth-usdc",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 50,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
    {
      name: "GRAIL/USDC",
      protocol: "Camelot",
      icon: "/protocols/camelot.svg",
      address: "0x32403558E7E386b79bB68bb942523e8c0A018B63",
      index: 28,
      apy: { type: "defillama", id: "a2904e71-f8c3-4e63-9126-d346e1ec732c" },
      description:
        "Invests funds into Camelot's LP pool and stakes it in the NFTPool for GRAIL rewards. Rewards are then auto-compounded into more LP tokens",
      slug: "camelot-grail-usdc",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 50,
          address: "0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8",
        },
        {
          ratio: 50,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
    {
      name: "stETH/ETH",
      protocol: "KyberSwap",
      icon: "/protocols/kyberswap.png",
      address: "0xcF03B33851F088d58E921d8aB5D60Dc1c3238758",
      index: 18,
      apy: { type: "defillama", id: "5f1e249f-1ac4-48a3-8cba-f13be346cd99" },
      description:
        "Invests funds into KyberSwap's stETH/ETH LP pool and stakes it in their active farm for rewards. Rewards are then auto-compounded into more LP tokens",
      slug: "kyber-steth-eth",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 50,
          address: "0x5979D7b546E38E414F7E9822514be443A4800529",
        },
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
      ],
    },
    {
      name: "ETH/USDC",
      protocol: "SushiSwap",
      icon: "/protocols/sushiswap.png",
      address: "0x05CBD8C4F171247aa8F4dE87b3d9e09883beD511",
      index: 4,
      apy: { type: "defillama", id: "78609c6a-5e49-4a9f-9b34-90f0a1e5f7fd" },
      description:
        "Invests funds into SushiSwap's ETH/USDC LP pool and stakes it in the Onsen menu for Sushi rewards. Rewards are then auto-compounded into more LP tokens",
      slug: "sushi-eth-usdc",
      assets: [
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 50,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
    {
      name: "ETH/USDT",
      protocol: "SushiSwap",
      icon: "/protocols/sushiswap.png",
      address: "0xFE280C65c328524132205cDd360781484D981e42",
      index: 5,
      apy: { type: "defillama", id: "abe3c385-bde7-4350-9f35-2f574ad592d6" },
      description:
        "Invests funds into SushiSwap's WETH/USDT LP pool and stakes it in the Onsen menu for Sushi rewards. Rewards are then auto-compounded into more LP tokens",
      slug: "sushi-eth-usdt",
      assets: [
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 50,
          address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        },
      ],
    },
    {
      name: "ETH/USDC 0.05%",
      protocol: "Uniswap V3",
      icon: "/protocols/uniswap.svg",
      address: "0xd170cFfd7501bEc329B0c90427f06C9156845Be4",
      index: 17,
      apy: {
        type: "uniswapv3",
        id: "0xd170cFfd7501bEc329B0c90427f06C9156845Be4",
      },
      description:
        "Invests funds into Uniswap V3's ETH/USDC LP pool. Trading fees are then auto-compounded into more LP liquidity",
      slug: "univ3-eth-usdc-005-l",
      isNew: true,
      hidden: true,
      assets: [
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
        {
          ratio: 50,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
      ],
    },
  ],
  "arbitrum-rinkeby": [],
  localhost: [
    {
      name: "Apy",
      protocol: "AcmeFi",
      icon: "/protocols/sushiswap.png",
      index: 0,
      slippage: 150,
      address: "0x7a2088a1bfc9d81c55368ae168c2c02570cb814f",
      apy: { type: "defillama", id: "825688c0-c694-4a6b-8497-177e425b7348" },
      description: "High APY farm, should double your deposit every day.",
      slug: "acmefi-apy",
      assets: [
        {
          ratio: 50,
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
        {
          ratio: 50,
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        },
      ],
    },
  ],
};

const whitelist = [
  "0x055b29979f6bc27669ebd54182588fef12ffbfc0",
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x20de070f1887f82fce2bdcf5d6d9874091e6fae9",
  "0x4877809ac00cfdc0b81eaed6f715189983a41b7e",
  "0x4877809ac00cfdc0b81eaed6f715189983a41b7e",
  "0xb7bad2b26a25d26d1f9cc35d5bc4e691fd6b661c",
  "0x8f3093416640d0e4ef12cd9e9be9115d6dff6c6e",
  "0x91ac2388b45a39d81abba1ea1b4e4c737a0f5f7c",
  "0x3e6ee6934e0978bc46b91be1e51eafd0489602dd",
  "0xd195741803c3bcbc4f709d59ba369da1bd355fa3",
  "0xe06ccadfdb73899955d62f14acdc1c0616647972",
  "0xe47f7c30289153ae3fccc4ffd9e6ed4bd18cae6f",
  "0xb3a94e75e6acf3ff25c9aff0e3bfd172d9fcb23d",
  "0xacca8a9545f8c4775350db1c4480c45e2befc019",
  "0xc31f32680ccb81932ddc06b4507863508113506e",
  "0xf2445b5688cda8e18afe4db89d3c6eee54b66a65",
  "0x30e25eaa01f60acf52470ccfc57cad3e245b43c9",
  "0x52ea2469ded50c080574a637ab6dafe4214eb46b",
  "0xc741e8d3dbde1255e2961df114ccc66075c5a6d5",
  "0x9a925fb79f42e3a03291aa97e6b8e38325eb3c33",
  "0xe9b03b9efe6bff4b05ad8c22a1ead469be12027b",
  "0xd48dd9be2fd21a415bd80aaa1864d4b809b70799",
  "0x83ec7ec8284d833a486ce2c8122475667eb5bc59",
  "0x3a18da831ebd8860e81130d25342db3481ee06c1",
  "0xf9817265692d4b3fef2a6db65b528b1570486285",
  "0x418019acc4a1bb843fbc234053fd180baa8b0286",
  "0x3ac850d2a07522bcb26d0f774b8b8f82e4ed964f",
  "0xaca277ae214f8e2f16af0bf7ba0a47563ea554ed",
  "0x877bcf27e3a0a517aa5522e574a79dff36727b37",
  "0xb06155ef02be60758cfd0303fb181d510b2e2051",
  "0x6af53620d9d8673dd42d3267619d78277251bdb1",
  "0x95d591fa62edb98a5abe8e5ca90091f73a4489b2",
  "0x418019acc4a1bb843fbc234053fd180baa8b0286",
  "0xc5c096a642bab3a435485f4e1864df179670d4ca",
  "0xdb23905e09bc6934204991f02729392a11eed8f8",
  "0x4b35859d950c5a542438914d6853ef781da6fa3f",
  "0xc95543b855075766136bf1e5e69fa35e97592bb3",
  "0x55f1fc00cab60de906ed428501578b4bd4b3a020",
  "0x3d78aac4d84bc23aeefd338a16cb9df8d8b40606",
  "0xa946c445bf7f1675309fcd3a968da4da4e3a107a",
  "0x22bd8c518fe4c79112c2cc1ac664297941cded5d",
  "0xe5964fd10170c8291cf97552284d995a006e67ae",
  "0x3948422f8998189c64928d5468a49ae63ce7e3d6",
  "0x55f1fc00cab60de906ed428501578b4bd4b3a020",
  "0x66da66490bed51458ef5c38300c197d2f37dcec4",
  "0x5881d9bfff787c8655a9b7f3484ae1a6f7a966e8",
  "0x1601fb95ff463c16c6b36d6bdf3dc79dfe5fd591",
  "0x5dbe676bf1d7c57907792453c2bc8d75b818af56",
  "0x43c49bf8d2ab82e4f1746b9ed4e1f6648753683b",
  "0xae7dd2f1aaaca4b5b5bd68f26500431bfe7fa8e6",
  "0x5fa9b5b9cde9a7d7f27e61522da3b2dd728e1ab4",
  "0x9292dfbFFd0923B35498B79e60A89c4b0e324F24",
  "0x4877809ac00cfdc0b81eaed6f715189983a41b7e",
  "0x9cf5dec27768855d478152128851ebde74f6a3ed",
  "0x11d67fa925877813b744abc0917900c2b1d6eb81",
  "0xb6af0e59e41f75552af00138a9f62acaef2b6254",
  "0x0a1288758fc891ba1793037765b31407500efa0a",
  "0xc9c24deb8faa6cc15696d08d17329fc1ba01de5c",
  "0x1d522bd33cdd1f60be71b0b7b2efe4e9f20a5263",
  "0xa2917120c698fb5f2a03e3fd3524bda85a3eaef6",
  "0xaba218e127ca4d471440eb54f0bde32177025a4e",
  "0xec44af907bd3774339f2a93e5a007de59fe5ba32",
  "0x333f6637004d398f1097c9f035cff3cf42e77282",
  "0xd8e745b07bc7fb767fb08fffd6271ba5271cedad",
  "0xb1a66d986453d1c5674b1333c41d4dec6daa2640",
  "0x542a889db38220c8fde30f62da0146daf9b166b3",
  "0x9a8bdbe5bb0b63312e5af863aa66dcbc9d7ec4fd",
  "0x3df2174b74a13ddc4bc3b1cdabadd13a04bf9e72",
  "0x65e1e9dd2fd13cc6a556e4d0d6acb01fb251014b",
  "0x53b128fdb8b5541a01c05af3d057609ba0468c58",
  "0x2e4c4ca65fd9381c7c9e674a2d33f73a8463d652",
  "0xad5f33d0a8cc65af473a86b8d590281b94d08009",
  "0x9562d77222c2a6870989b15b55e15d9493b41668",
  "0x03005ed1efb87244e316c71193a707dc849f5964",
  "0x42be65310a59e2b61cfb3ec8dc14880f5aa882dd",
  "0xe48356abf9712b85cce1a9794311ce6fac6d2a0e",
  "0xd9c13329f77a4ffec0682649180f8f2181c64450",
  "0x1289b59d69dbafa8b97d0643d2bf04e8a01f9839",
  "0x582048f5ce820e81b740e8297a1a741853985a9d",
  "0x8a40f60548482ea1e918c10597f3c327c3ed5a39",
  "0xc4735b87dfb6c7cc3651677651e4bf139b27cc59",
  "0xc4735b87dfb6c7cc3651677651e4bf139b27cc59",
  "0x3028e8434cddd7c13e0309fc894f1a18e821352f",
  "0x90552ca53592dfa96c887400ddab964b2824ff02",
  "0x0b588d3d0ceb3d9c52aaee7b760439ae4c330fdf",
  "0x47a26e02b774665475362c4f93d681614c126a08",
  "0x0321e89a7b9484f47e8ccd4daf97ee8066783c04",
  "0xb6395525819a4a3d74be262d1a9d0c7adfadac00",
  "0xfcd9d39115747fb3a2b3e3375f30c84ba5f8a372",
  "0x62223bb2a4781c9512e5b78cef1655d1d9cd216d",
  "0xdd29d1c8ac8a6ce3070cc29103227ad8afc09550",
  "0xd46f07a728228dd2c61e929499ce8abaf85e86c0",
  "0x54914f8bb055565e1447c4a1739124c95ba9b141",
  "0xabf228a632fe4340e18d76b89e6fd79352290b5b",
  "0x679112ab7230a5e119e57ce6c8213ac6f288f2f0",
  "0x3f57b19e454ceade4a600d48b83112c681d392c7",
  "0x8b5a29917e8995bb015098fba2026ac5ddf3b95c",
  "0xf1fdf446fe91f57d63638eecbe0db7e34e8956aa",
  "0x2c3c3341ff36084610569b6021226def1b7e827f",
  "0xb0fad87dd10fa7256dd3621001d98881be1c26da",
  "0xab678725ea857a69b1733747879decc4f8b4e52c",
  "0xcc0f0fa146087cec743a41f8452c062f5e02bb23",
  "0x2d4a35b2815ad3db89a468c0b09f31e710a47a91",
  "0xd84e1da8221eb16d1f56c720e006f98e3fde617b",
  "0x08df65a5a9c110c2103c0c3cb4a05affa44ccd9c",
  "0xee3b83c084267f65c78312315d6c015446d23538",
  "0x36a6f6f423778a71fbd635081f4ee44ff15b9d6a",
  "0x591a504497d037a39abc4274aba2a0f838724c0c",
  "0x83bcdb9962352f30b8d780b90f969ac434f624ec",
  "0x20bc83ed9b48b1aeedfd9789f268ebd4e1f22445",
  "0x974dfa71acebbe6855a8c219c0b553dad84ba338",
  "0x480b45a3b974e7ecefaf2481ec12ccc03b20b706",
  "0xcdf33a991b66811cd25a42b7887fceac776cf0c8",
  "0x2d277d02ed64e9388d2710d090ebac8b92344197",
  "0x549287e6465428408dac7c5fb0c106dbff1efe85",
  "0x99aacdb295c6d6fae1d5c0f01a469430cf58e021",
  "0x0365566ef442e63ea7e6905afde6bb749c845fa6",
  "0x02aacef93e540e6142f57a2b70c09c8b09789a1d",
  "0x6efe0641979d13e59b84d5b65aa4fca5500acea2",
  "0xc7040bc6f1e91ba39cf1ca030325f7f9544437c2",
  "0xd6d7c1c2ade9bbb59a39ff2697724af7b0ea65c0",
  "0x5fdd97c6b27050b30390113927f8119649e09d57",
  "0x14152b9f77c31450f8999f99201c646c8bc6474f",
  "0x1fc550e98ad3021e32c47a84019f77a0792c60b7",
  "0x99222201f28e82c399f1bc41c046c7e4501bd1a0",
  "0x2968eeaf2124155df04dae9dbf95322e21a86621",
  "0xecff34c282c48095bb00af2cae746f236f5523a8",
  "0xa3567f4b7a31271a184b4fc232ed5f7eeae78a93",
  "0x8b0062a08b6c238935f5f12c83dbcfbbd4b84ff4",
  "0x97a0e5872b47f31321fcaed57d293058bfa9c338",
  "0x37a3ec923e7283cafab484b3ac15fccb804f596f",
  "0x0ead01d3d2ed336d12ca73e245d2acd09c964eb8",
  "0x909eff31f8755defae2bb74c226454ad56f97a21",
  "0x3ffc0798104e28aaa7b8d4f05c6193035d2916e3",
  "0x6591c24a7f7d3b37527487a457b2f467936dfe59",
  "0xe6b06cf6f3a9027abdc1dcd97a2c562856b2ef99",
  "0xf3e5c9824f59cf847df86726cb8025e30db06e8f",
  "0x287b479f2f3cb0d0727a674ddf59ad2d3e421d56",
  "0xa5afabc74d9e40903862d9994e6f5c8c33f9980f",
  "0x7f010192d9398a1059f6449f1611fd9cc87d70b4",
  "0x04be358ff3caf8d18451a96f6dea1518988fbb23",
  "0x299667e0b886bc54b74c6229730c2aa6082c9af3",
  "0xa60aadf62907bf06dd714781d44bbd4c2d783259",
  "0x122edefc9a3a02f4f7c4caf41ad29d9c900d0528",
  "0xce76ebf1c9fb4a4bde0b4256c3814ca5cb938914",
  "0x7fec9ed4fd76621ba8bff928dc4ae2c3c8afac82",
  "0x68b13274716e2c20b79accbfca620eab4576bd6c",
  "0x8d53f794fe814e634375bcb0a77056d38b14c6e2",
  "0x372b8c8b1a809149f0964c13a22b9b11da637526",
  "0x28cf3c605216a841b1e3b77aad0c82d760ed7a00",
  "0x00752887e510c0418acd1b5f3dda14cc733f30d3",
  "0x5cb9457dc0c50e946ff099fbeaff96afdb49cd30",
  "0x1aa530f8e7a98e90672d4193326d354f7632497a",
  "0x1d48267a3484a3ea5cd7a6650b23337607a6e5e8",
  "0xfad00e987b5617bb06ce91a6f78914db74152a77",
  "0xb957dccaa1ccfb1eb78b495b499801d591d8a403",
  "0xf7f1f47ec265f64cc5f569ff87da572a5ab51fa6",
  "0xe00b84525b71ef52014e59f633c97530cb278e09",
  "0x1ce1763f704e641141d1537ba130bd60e57751de",
  "0x01fae1cf90d9db2a8702bab06a21ce94012b30aa",
  "0x005a75e089206f1c5b788a16a5dd54cbf6dd5b9a",
  "0x7c8787ec009e8a4f234c5feb055a8557cf0305b4",
  "0xfb4caa1acbb9ca7ddbcd176c53ea748d2fdcb204",
  "0x39032520c46c965f0995dafaf2a26c1c12546690",
  "0xb8a00502ef006459777bc8537a486b71c1de86b8",
  "0x96aa7e4ba857087cf3b529012edfe5a96f0412d6",
  "0x1d3ab981ac3ab27b35e4abaaa0a4de1c48b04c52",
  "0xdf4cdd2ab79b487edabd3fb9781c57e4897daeae",
  "0x7ec80880f782159ae8ba44ffb5c2f5db7f67a99d",
  "0x41c6beb49d2d471c1f6889c800c6ae92c6d1abb3",
  "0xab41044b70e75a58147630ef8a475cf49ebfe7c5",
  "0x5b89457500a276be1256788B1d478581d8A555Ad",
];

export const rpcUrl =
  process.env.NEXT_PUBLIC_RODEO_RPC_URL_ARBITRUM ||
  "https://arb1.arbitrum.io/rpc";

export const rpcUrls = {
  42161: { http: rpcUrl },
  421611: { http: "https://rinkeby.arbitrum.io/rpc" },
  1337: { http: "http://localhost:8545" },
};

if (global.window) {
  window.ethers = ethers;
  window.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
}

export const { chains, provider } = configureChains(
  [
    chain.arbitrum,
    ...(global.window && window.location.hostname === "localhost"
      ? [chain.arbitrumRinkeby, chain.localhost]
      : []),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => rpcUrls[chain.id],
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Rodeo",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export function atom(initial = null) {
  let value = initial;
  let listeners = [];
  let listen = (fn) => {
    listeners.push(fn);
    return () => listeners.splice(listeners.indexOf(fn), 1);
  };
  let set = (v) => {
    value = v;
    listeners.forEach((fn) => fn());
  };
  return { get: () => value, set, listen };
}

export function useAtom(a) {
  let [value, setValue] = useState(a.get());
  useEffect(() => {
    let fn = () => setValue(a.get());
    return a.listen(fn);
  }, []);
  return [value, a.set];
}

export const parseUnits = ethers.utils.parseUnits;
export const formatUnits = ethers.utils.formatUnits;

export function bnMin(a, b) {
  return a.lt(b) ? a : b;
}

export function bnMax(a, b) {
  return a.gt(b) ? a : b;
}

export function useSigner() {
  const { data: signer } = wagmiUseSigner();
  return signer;
}
export const useProvider = wagmiUseProvider;

export function useWeb3() {
  const provider = useProvider();
  const signer = wagmiUseSigner();
  const signerOrProvider =
    signer.isSuccess && !signer.isFetching && signer.data
      ? signer.data
      : provider;
  let { address, status: walletStatus } = useAccount();
  const { chain } = useNetwork();
  const networkName = chain?.network || DEFAULT_NETWORK_NAME;
  const chainId = chain?.id || DEFAULT_CHAIN_ID;
  const contracts = getContracts(signerOrProvider, networkName);

  if (global.window && window.localStorage.getItem("mockAddress")) {
    address = window.localStorage.getItem("mockAddress");
  }

  return {
    provider: provider,
    signer: signerOrProvider,
    address: address || DEAD_ADDRESS,
    walletStatus,
    chainId,
    networkName,
    contracts,
  };
}

export function getContracts(signer, networkName) {
  const addresses = ADDRESSES[networkName];
  if (!signer) return null;
  if (!addresses) return null;
  return {
    investor: new ethers.Contract(
      addresses.investor,
      [
        "error Unauthorized()",
        "error TransferFailed()",
        "error InsufficientAllowance()",
        "error InsufficientAmountForRepay()",
        "error InvalidPool()",
        "error InvalidStrategy()",
        "error PositionNotLiquidatable()",
        "error Undercollateralized()",
        "error OverMaxBorrowFactor()",
        "function nextPosition() view returns (uint)",
        "function positions(uint) view returns (address, address, uint, uint, uint, uint, uint)",
      ],
      signer
    ),
    investorHelper: new ethers.Contract(
      addresses.investorHelper,
      [
        "function peekPools(address[]) view returns (uint[], uint[], uint[], uint[], uint[], uint[])",
        "function peekPosition(uint) view returns (address, uint, uint, uint, uint, uint, uint, uint, uint)",
      ],
      signer
    ),
    positionManager: new ethers.Contract(
      addresses.positionManager,
      [
        "error WaitBeforeSelling()",
        "error InsufficientShares()",
        "error InsufficientBorrow()",
        "error CantBorrowAndDivest()",
        "error OverMaxBorrowFactor()",
        "error PositionNotLiquidatable()",
        "error InsufficientAmountForRepay()",
        "function ownerOf(uint) view returns (address)",
        "function tokenURI(uint) view returns (string)",
        "function mint(address, address, uint, uint, uint, bytes)",
        "function edit(uint, int, int, bytes)",
        "function burn(uint)",
      ],
      signer
    ),
    asset: (address) => {
      return new ethers.Contract(
        address,
        [
          "function totalSupply() view returns (uint)",
          "function balanceOf(address) view returns (uint)",
          "function allowance(address, address) view returns (uint)",
          "function approve(address, uint)",
        ],
        signer
      );
    },
    pool: (address) =>
      new ethers.Contract(
        address,
        [
          "function oracle() view returns (address)",
          "function borrowMin() view returns (uint)",
          "function mint(uint, address)",
          "function burn(uint, address)",
        ],
        signer
      ),
  };
}

export async function runTransaction(
  callPromise,
  progressContent,
  successContent,
  showExplorer = true,
  networkName
) {
  try {
    const tx = await callPromise;
    toast.dismiss();
    toast.info(<div>{progressContent}</div>, {
      position: "bottom-center",
      autoClose: false,
    });
    const receipt = await tx.wait();

    toast.dismiss();
    toast.success(
      <div>
        {successContent}
        <br />
        {showExplorer ? (
          <a
            href={`https://${EXPLORER_URLS[networkName]}/tx/${receipt.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View in block explorer <Icon name="external-link" small />
          </a>
        ) : null}
      </div>,
      { position: "bottom-center", autoClose: showExplorer ? 10000 : 5000 }
    );
  } catch (err) {
    console.error("runTransaction:", err);
    toast.dismiss();
    throw err;
  }
}

export function formatHealthClassName(health) {
  if (health.eq(ONE)) return "text-green";
  if (health.lt(parseUnits("1.1", 18))) return "text-red";
  if (health.lt(parseUnits("1.5", 18))) return "text-yellow";
  return "text-green";
}

export function formatError(e) {
  const message =
    e?.data?.message ||
    e?.error?.data?.originalError?.message ||
    e.message ||
    String(e);
  if (message.includes("ERC20: transfer amount exceeds balance")) {
    return "Farm token balance too low for the moment";
  }
  if (message.includes("User denied transaction signature")) {
    return "You cancelled the transaction";
  }
  if (message.includes("user rejected transaction")) {
    return "You cancelled the transaction";
  }
  if (message.includes("cooldown duration not yet passed")) {
    return "Vela VLP on cooldown, wait 15 minutes and try again";
  }
  if (message.includes("MlpManager: cooldown duration not yet passed")) {
    return "Mycelium MLP on cooldown, wait 15 minutes and try again";
  }
  if (message.includes("GlpManager: cooldown duration")) {
    return "GMX GLP on cooldown, wait 15 minutes and try again";
  }
  if (message.includes("Too little received")) {
    return "Slippage not high enough";
  }
  if (e?.error?.data?.data === "0xe273b446") {
    return "Borrow below minimum";
  }
  if (e?.error?.data?.data === "0xebb5bbef") {
    return "Not enough value withdrawn for borrow repay";
  }
  if (message.includes("cannot estimate gas; transaction")) {
    return `${e.error.data.message} (${e.error.data.data}) from:${e.transaction.from} data:${e.transaction.data}`;
  }
  return message;
}

export function formatNumber(amount, decimals = 18, decimalsShown = 2) {
  if (typeof amount !== "number") {
    amount = parseFloat(ethers.utils.formatUnits(amount, decimals));
  }
  return Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: decimalsShown,
    maximumFractionDigits: decimalsShown,
  }).format(amount);
}

export function formatAddress(address) {
  return address.slice(0, 6) + "…" + address.slice(-4);
}

export function formatDate(date) {
  if (date instanceof ethers.BigNumber) {
    date = date.toNumber() * 1000;
  }
  const d = new Date(date);
  if (d.getTime() === 0) return "N/A";
  const pad = (s) => ("0" + s).slice(-2);
  return [
    d.getFullYear() + "-",
    pad(d.getMonth() + 1) + "-",
    pad(d.getDate()) + " ",
    pad(d.getHours()) + ":",
    pad(d.getMinutes()),
  ].join("");
}

export function formatChartDate(date) {
  return `${date.getDate()}\
    ${date.toLocaleString("default", { month: "short" })}\
    ${date.getFullYear()}\
    ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}
    `;
}

export async function tokensOfOwner(provider, tokenAddress, account) {
  const network = await provider.getNetwork();
  try {
    if (network.chainId === 42161) {
      const res = await (
        await fetch(
          process.env.NEXT_PUBLIC_RODEO_RPC_URL_ARBITRUM +
            `/getNFTs?owner=${account}&contractAddresses%5B%5D=${tokenAddress}`
        )
      ).json();
      return res.ownedNfts.map((n) => n.title.slice(1));
    }
  } catch (e) {
    console.error("failed to fetch nfts using alchemy, defaulting to rpc", e);
  }
  const token = await new ethers.Contract(
    tokenAddress,
    [
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ],
    provider
  );

  const sentLogs = await token.queryFilter(
    token.filters.Transfer(account, null, null)
  );
  const receivedLogs = await token.queryFilter(
    token.filters.Transfer(null, account, null)
  );

  const logs = sentLogs
    .concat(receivedLogs)
    .sort(
      (a, b) =>
        a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex
    );

  const owned = new Set();
  for (const {
    args: { from, to, tokenId },
  } of logs) {
    if (to.toLowerCase() === account.toLowerCase()) {
      owned.add(tokenId.toString());
    } else if ((from.toLowerCase(), account.toLowerCase())) {
      owned.delete(tokenId.toString());
    }
  }
  return Array.from(owned);
}

const atomNetworkName = atom("");
const atomPools = atom([]);
const atomPositionIds = atom([]);
const atomPositions = atom([]);
const atomApys = {};

export function topApy() {
  let highestApy = 0;
  let highestApyKey;
  for (let key of Object.keys(atomApys)) {
    const a = atomApys[key];
    const apy = a.get()?.apy;
    if (apy && apy > highestApy) {
      highestApy = apy;
      highestApyKey = key;
    }
  }
  return {
    apy: highestApy,
    strategy: strategies.arbitrum.find(
      (s) => s.apy.type + s.apy.id === highestApyKey
    ),
  };
}

export function maybeApy(apy) {
  return atomApys[apy.type + apy.id]?.get()?.apy;
}

export function useNetworkName(provider) {
  const [networkName, setNetworkName] = useAtom(atomNetworkName);
  useEffect(() => {
    (async () => {
      if (!provider) return;
      const network = await provider.getNetwork();
      setNetworkName(network.name);
    })();
  }, [provider]);
  return networkName;
}

export function usePools() {
  const { networkName, contracts } = useWeb3();
  const [data, setData] = useAtom(atomPools);

  async function fetchData() {
    if (!contracts) return;
    const addresses = pools[networkName].map((p) => p.address);
    const data = await contracts.investorHelper.peekPools(addresses);
    setData(
      pools[networkName].map((p, i) => ({
        info: p,
        data: {
          index: data[0][i],
          share: data[1][i],
          supply: data[2][i],
          borrow: data[3][i],
          rate: data[4][i],
          price: data[5][i],
        },
      }))
    );
  }

  useEffect(() => {
    fetchData();
  }, [networkName]);

  return { data: data, refetch: fetchData };
}

export function usePositions() {
  const { provider, address, networkName, contracts } = useWeb3();
  const [positionIds, setPositionIds] = useAtom(atomPositionIds);
  const [positions, setPositions] = useAtom(atomPositions);

  async function fetchData() {
    if (!address || !contracts) return;
    const ids = await tokensOfOwner(
      provider,
      contracts.positionManager.address,
      address
    );
    ids.sort((a, b) => parseInt(b) - parseInt(a));

    async function fetchPosition(id) {
      try {
        const values = await contracts.investorHelper.peekPosition(id);
        const strategy = strategies[networkName].find(
          (s) => s.index === values[1].toNumber()
        );
        if (!strategy) return null;
        const pool = pools[networkName].find((p) => p.address === values[0]);
        const asset = assets[networkName][pool.asset];
        const poolContract = contracts.pool(pool.address);
        const priceAdjusted = values[8]
          .mul(ONE)
          .div(parseUnits("1", asset.decimals));

        const p = {
          id: id,
          pool: values[0],
          strategy: values[1].toNumber(),
          shares: values[2],
          sharesAst: values[4]
            .mul(ONE)
            .div(values[8])
            .mul(parseUnits("1", asset.decimals))
            .div(ONE),
          sharesUsd: values[4],
          borrow: values[3],
          borrowAst: values[5],
          borrowUsd: values[5].mul(priceAdjusted).div(ONE),
          amountAst: values[7],
          amountUsd: values[7].mul(priceAdjusted).div(ONE),
          health: values[6],
          assetPrice: values[8],
          strategyInfo: strategy,
          assetInfo: asset,
          poolInfo: pool,
          /*
          svg: JSON.parse(
            atob((await contracts.positionManager.tokenURI(id)).split(",")[1])
          ).image,
          */
        };

        p.profitUsd = p.sharesUsd
          .sub(p.amountUsd)
          .sub(p.borrowUsd)
          .mul(90)
          .div(100);
        p.profitPercent = parseUnits("0");
        if (p.amountUsd.gt("0") && p.sharesUsd.gt("0")) {
          p.profitPercent = p.profitUsd.mul(ONE).div(p.amountUsd);
          p.liquidationUsd = p.borrowUsd.mul(100).div(95);
          p.liquidationPercent = ONE.sub(
            p.liquidationUsd.mul(ONE).div(p.sharesUsd)
          );
          if (p.sharesUsd.gt(0)) {
            p.leverage = p.borrowUsd
              .mul(ONE)
              .div(p.sharesUsd.sub(p.borrowUsd))
              .add(ONE);
          }
        }

        if (strategy.name === "GLP") {
          const glpManager = new ethers.Contract(
            "0x3963ffc9dff443c2a94f21b129d429891e32ec18",
            ["function getAumInUsdg(bool) view returns (uint256)"],
            provider
          );
          const glp = new ethers.Contract(
            "0x4277f8f2c384827b5273592ff7cebd9f2c1ac258",
            ["function totalSupply() view returns (uint256)"],
            provider
          );
          if (window.glpPrice) {
            p.glpPrice = window.glpPrice;
          } else {
            const aumInUsdg = await glpManager.getAumInUsdg(false);
            const totalSupply = await glp.totalSupply();
            p.glpPrice = window.glpPrice = aumInUsdg.mul(ONE).div(totalSupply);
          }
        }

        return p;
      } catch (e) {
        console.error("ERROR FETCHING POSITION", id, e);
        return null;
      }
    }

    setPositionIds(ids);
    setPositions((await Promise.all(ids.map(fetchPosition))).filter((x) => x));
  }
  useEffect(() => {
    fetchData().then(
      () => {},
      (e) => {
        console.error("positions", e);
      }
    );
  }, [networkName, address]);
  return { data: positions, refetch: fetchData };
}

export function useApy(options) {
  const key = options?.type + options?.id;
  atomApys[key] = atomApys[key] || atom(null);
  const [data, setData] = useAtom(atomApys[key]);
  useEffect(() => {
    (async () => {
      if (!options) return;
      const res = await fetch(`/api/apy/${options.type}?id=${options.id}`);
      if (!res.ok) return;
      setData(await res.json());
    })();
  }, [options?.type, options?.id]);
  return data;
}

export async function checkWhitelist(provider, address) {
  if (whitelist.includes(address.toLowerCase())) return;
  const contract = new ethers.Contract(
    "0xBba59A5DD11fc0958F0AB802500c2929AbABB956",
    ["function balanceOf(address) view returns (uint)"],
    provider
  );
  if ((await contract.balanceOf(address)).eq(0)) {
    throw new Error(
      "Beta is only open to Green Horn NFT holders at the moment!"
    );
  }
}

export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function aprToApy(rate) {
  return Math.pow(rate / 365 + 1, 365) - 1;
}

export const logoSquare = `<svg width="48" height="48" viewBox="0 0 164 164" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M139.026 14.158C138.883 14.2299 138.496 14.7327 138.152 15.2643C137.164 16.7728 135.646 18.6836 134.099 20.3214C132.609 21.9018 129.272 26.0107 127.782 28.0796C126.536 29.8323 125.361 31.9299 125.075 32.95C124.946 33.4384 124.788 33.8694 124.717 33.8982C124.659 33.9413 124.072 34.0706 123.413 34.1855C122.353 34.3723 119.732 35.3061 118.543 35.9239C118.314 36.0388 118.07 36.0963 118.013 36.0532C117.942 36.0101 117.712 36.0388 117.497 36.125C117.283 36.2113 116.008 36.4986 114.676 36.7716C112.9 37.1164 112.155 37.3319 111.926 37.5474C111.754 37.7054 111.267 37.9065 110.837 38.0071C109.92 38.1939 107.371 38.941 103.245 40.2196C101.627 40.7225 99.7648 41.2397 99.0916 41.369C97.4587 41.6994 91.0131 43.9119 89.4948 44.6734C88.3489 45.2337 88.1197 45.2911 85.7707 45.5928C83.5505 45.8802 81.3017 46.2968 71.1033 48.2794C69.6996 48.5524 66.8635 48.9978 64.8009 49.2851C61.2916 49.7736 60.8905 49.788 58.4125 49.7161C56.9515 49.673 53.342 49.5725 50.3913 49.4863C47.4406 49.4144 44.0173 49.242 42.7998 49.1271C41.5823 49.0122 39.6629 48.8541 38.5457 48.7679C35.5234 48.5524 34.5351 48.38 31.742 47.6186C26.8003 46.2537 26.0698 46.2393 20.6555 47.4893C18.5356 47.9777 16.5159 48.38 16.1579 48.3944C15.7998 48.3944 14.969 48.2794 14.3101 48.1358C13.021 47.8484 11.9897 47.8772 10.3425 48.2651C8.09365 48.7823 6.8475 49.5725 5.5154 51.3252C4.71328 52.3884 3.85386 53.9975 3.63901 54.8451C3.59603 55.0606 3.23794 55.5778 2.85121 56.0088C1.8772 57.072 1.00346 58.4081 0.588073 59.4425C0.25863 60.2615 0.229983 60.5057 0.201336 63.4078C0.172688 65.1175 0.10107 67.2869 0.0437757 68.2351C-0.0278424 69.4132 -0.0135188 70.2896 0.10107 70.9648C0.344572 72.4015 1.34723 76.5248 1.76261 77.7891C1.94882 78.3781 2.24961 79.6137 2.40717 80.5188C2.57906 81.4239 2.9085 82.9468 3.13768 83.895C3.51009 85.4466 3.56739 85.9926 3.6963 89.2826C3.82521 92.5726 3.86818 93.1042 4.2406 94.5265C4.64166 96.0925 4.64166 96.1069 4.39816 96.9689C4.26924 97.443 3.91115 98.6929 3.62468 99.7417C3.09471 101.667 2.70797 102.644 1.36155 105.374C0.774281 106.552 0.616721 107.026 0.631044 107.529C0.631044 107.888 0.974811 109.31 1.3902 110.689L2.13502 113.204L2.09205 121.579L2.04908 129.941L2.70797 130.774C3.6963 132.01 3.79657 132.225 3.91115 133.317C3.96845 133.863 4.09736 134.581 4.21195 134.898C4.31222 135.214 4.41248 135.716 4.41248 136.018C4.41248 136.765 4.59869 137.053 5.35784 137.498C6.2459 138.03 7.64962 138.302 9.35413 138.288C11.0013 138.274 11.4311 138.159 12.7202 137.397C13.2358 137.11 13.9377 136.78 14.2815 136.679C14.7541 136.535 14.9547 136.377 15.1266 136.033C15.4417 135.343 15.1695 134.553 14.0093 132.829C13.4793 132.039 12.9637 131.105 12.8634 130.745C12.6915 130.113 12.3478 129.711 11.3881 129.05C11.1876 128.907 10.9441 128.547 10.8438 128.26C10.7578 127.958 10.2995 126.953 9.82681 126.004C8.40877 123.174 8.3658 122.973 8.3658 118.878L8.35148 115.359L9.1536 113.563C9.59763 112.571 10.1992 111.02 10.5 110.115C11.2019 107.974 11.3451 107.687 12.1616 106.71C12.8921 105.819 13.9377 104.454 15.5706 102.198C16.3727 101.092 16.8311 100.632 17.8337 99.8997C18.5212 99.3969 19.7101 98.4056 20.4836 97.6872C22.2024 96.1212 23.0189 95.604 23.8496 95.604C24.4226 95.604 24.5085 95.6615 25.2104 96.5235C25.6258 97.0264 26.3563 98.0751 26.829 98.8653L27.6884 100.273L27.674 101.854C27.6597 102.787 27.5595 103.808 27.4305 104.368C27.1011 105.675 27.1154 106.753 27.4878 107.442C27.6454 107.744 27.8316 108.333 27.9032 108.75C28.0035 109.368 28.247 109.799 29.2926 111.25C33.69 117.356 34.6497 118.893 35.6237 121.378C36.5117 123.634 36.6406 124.18 36.6406 125.875C36.6406 127.384 36.8412 127.958 37.5573 128.519C37.9871 128.849 38.5457 129.941 38.9467 131.205C39.3192 132.369 39.6916 132.8 40.6512 133.145C42.0836 133.662 43.96 133.791 46.1086 133.518C47.5266 133.332 48.3144 132.958 48.7441 132.283C48.916 131.995 49.2025 131.794 49.4603 131.722C49.933 131.622 50.3913 131.277 50.3913 131.018C50.3913 130.932 50.1908 130.674 49.9473 130.429C49.7038 130.2 49.2454 129.654 48.916 129.223C48.5865 128.792 48.0136 128.145 47.6555 127.786C47.2831 127.412 46.7674 126.665 46.438 125.99C45.9796 125.056 45.8078 124.812 45.4497 124.711C45.1918 124.64 44.7621 124.266 44.3754 123.792C44.0173 123.361 43.1865 122.384 42.5276 121.623C40.0783 118.792 39.5197 117.815 37.8725 113.304C36.3398 109.152 35.9245 107.529 35.9245 105.618C35.9245 104.325 35.9817 104.023 36.5833 102.198C36.9414 101.107 37.2852 100.201 37.3568 100.201C37.4141 100.201 37.8725 100.403 38.3595 100.647C39.7775 101.351 41.568 101.997 43.8024 102.629C46.3234 103.333 47.3547 103.549 49.6465 103.865C51.9383 104.167 53.1271 104.698 54.5452 106.034C55.1038 106.566 55.6481 106.81 56.264 106.81C56.6937 106.81 56.8226 106.667 57.9542 104.899L58.4842 104.052L61.8502 104.124C65.8035 104.195 66.8062 104.353 72.02 105.675C76.3314 106.767 77.1908 107.069 78.1935 107.902C78.6232 108.261 79.2391 108.678 79.5829 108.836C80.0126 109.023 80.1844 109.181 80.1844 109.396C80.1844 109.842 81.1155 113.462 81.846 115.904C82.4046 117.758 82.4619 118.088 82.333 118.562C82.1181 119.338 82.1468 121.924 82.3903 122.643C82.5049 122.987 82.6338 123.576 82.6768 123.964C82.7197 124.338 82.9346 125.056 83.1494 125.545C83.5505 126.407 83.5505 126.45 83.5362 129.223C83.5075 132.426 83.2497 134.567 82.6195 136.909C82.333 137.958 82.1898 138.834 82.1898 139.495C82.1898 140.371 82.1325 140.587 81.76 141.147C81.2874 141.837 80.9006 142.972 80.9006 143.604C80.9006 143.862 81.0582 144.135 81.3876 144.423C82.0752 145.026 82.1468 145.213 82.4046 146.98C82.5335 147.828 82.7197 148.733 82.82 148.977C83.4359 150.457 86.2004 151.247 89.7383 150.931C92.1017 150.73 92.7892 150.443 94.2359 149.035L95.3961 147.928L95.1383 147.454C94.9808 147.196 94.3935 146.477 93.8062 145.859C92.8895 144.897 92.689 144.581 92.3595 143.618C92.1447 143.015 91.9298 142.397 91.8725 142.268C91.7723 142.052 91.8152 142.038 92.2449 142.167C92.5028 142.239 93.7632 142.44 95.038 142.598L97.3728 142.871L98.2609 142.569C99.2922 142.225 99.8938 141.837 100.023 141.434C100.08 141.276 100.18 141.147 100.266 141.147C100.524 141.147 101.383 140.429 101.383 140.213C101.383 140.027 99.994 138.101 98.9914 136.923C98.7335 136.607 98.5187 136.248 98.5187 136.104C98.5187 135.831 97.7452 134.294 97.4158 133.935C97.3012 133.806 97.1866 133.403 97.1579 133.044C97.1436 132.685 96.9574 132.082 96.7569 131.708C95.7972 129.898 95.7972 129.927 95.6396 127.542C95.5394 126.048 95.5394 124.525 95.6253 123.088C95.7542 121.005 95.7829 120.861 96.2699 119.855C96.5564 119.281 97.029 118.419 97.3298 117.959L97.8741 117.097L97.8312 115.042L97.8025 112.988L98.977 112.428C99.6359 112.112 100.624 111.752 101.169 111.623C103.647 111.034 104.563 110.661 106.182 109.554C107.056 108.965 108.531 107.888 109.476 107.169C110.422 106.451 111.653 105.589 112.198 105.273C113.96 104.253 117.741 101.767 118.901 100.877C119.546 100.374 120.133 99.7848 120.291 99.4975C120.735 98.6067 121.408 96.2937 121.795 94.311C122.525 90.6762 123.642 87.7166 124.86 86.2368C126.622 84.0961 126.922 83.8375 128.212 83.3778C128.899 83.1479 130.174 82.76 131.048 82.5302C132.022 82.2716 132.781 81.9986 132.967 81.8118C133.397 81.3952 135.946 80.9498 137.808 80.9498C139.183 80.9498 139.298 80.9211 140.401 80.3895C141.303 79.9585 141.934 79.4844 143.137 78.3638C145.343 76.3237 146.188 75.7777 147.147 75.7777C147.563 75.7777 148.164 75.8639 148.479 75.9789C149.969 76.5104 154.71 77.2575 155.627 77.1138C156.357 76.9989 157.446 76.5966 157.962 76.2806C158.678 75.8352 159.394 74.9732 159.494 74.456C159.566 74.1255 159.709 73.9675 160.168 73.7663C161.041 73.3928 162.373 72.5164 162.603 72.1429C162.717 71.9705 162.86 71.3671 162.903 70.8211C163.018 69.7005 163.476 67.9621 163.777 67.5167C164.393 66.6547 163.748 65.6778 161.643 64.2554C160.941 63.7813 160.11 63.1636 159.795 62.8762C158.807 61.9855 151.674 53.3653 151.244 52.5464C151.158 52.374 150.986 51.7275 150.857 51.1097C150.556 49.6012 149.11 46.3543 148.207 45.1475C147.821 44.6159 147.061 43.8401 146.531 43.4234C144.369 41.7281 142.936 40.2771 142.263 39.1134C141.69 38.1364 141.618 37.9209 141.747 37.6336C141.833 37.4468 142.492 36.4986 143.223 35.5216C143.953 34.5591 145.357 32.5189 146.36 31.0248C150.399 24.9332 151.058 23.2235 151.602 17.3762C151.846 14.704 151.788 14 151.316 14C150.829 14 150.485 14.5603 149.812 16.5142C148.981 18.9135 148.15 20.7381 147.262 22.1029C146.503 23.2667 143.896 26.3124 141.189 29.1571C140.129 30.2633 138.696 31.7862 138.009 32.5189L136.748 33.8551L135.502 33.6108C134.815 33.4815 133.626 33.3235 132.867 33.2948C132.093 33.2517 131.463 33.1511 131.463 33.0793C131.463 32.8638 132.408 31.0679 134.213 27.821C137.808 21.3559 140.344 15.9683 140.344 14.7758C140.344 14.1724 139.599 13.8132 139.026 14.158Z" fill="black"/>
</svg>`;
