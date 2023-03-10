import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  ONE,
  rpcUrls,
  ADDRESSES,
  strategies,
  pools,
  assets,
  parseUnits,
  formatDate,
  formatNumber,
  formatAddress,
  useWeb3,
} from "../../utils";

const msAddress = "0xaB7d6293CE715F12879B9fa7CBaBbFCE3BAc0A5a";
const data4bytes = {
  "0x3cc38f5c": ["addOwner", "address", "uint256"],
  "0xbfd2b3a3": ["removeOwner", "address", "uint256"],
  "0xe177246e": ["setDelay", "uint256"],
  "0x960bfe04": ["setThreshold", "uint256"],
  "0x4e4d5675": ["setExecuter", "address", "bool"],
  "0xe9ed9b64": ["setProposer", "address", "bool"],
  "0x5c38eb3a": ["setOracle", "address", "address"],
  "0x429725ca": ["setPath", "address", "address", "address", "bytes"],
  "0x29ae8114": ["file", "bytes32", "uint256"],
  "0xfaac4325": ["setStrategy", "uint256", "address"],
  "0xa9059cbb": ["transfer", "address", "uint256"],
};

export default function DashboardMultisig() {
  const { signer } = useWeb3();
  const [data, setData] = useState();
  const [newTarget, setNewTarget] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newParams, setNewParams] = useState("");
  const getContract = () =>
    new ethers.Contract(
      msAddress,
      [
        "function getOwners() view returns (address[])",
        "function getSummary() view returns (uint, uint, uint, uint)",
        "function getPage(uint, uint) view returns (uint[], address[], uint[], bytes[], bool[], uint[])",
        "function add(address, uint256, bytes)",
        "function confirm(uint256, bool)",
        "function cancel(uint256)",
        "function execute(uint256)",
        "event TransactionExecuted(uint256 indexed id, address indexed sender)",
      ],
      signer
    );

  async function onSubmit() {
    try {
      const contract = getContract();
      let data = newParams;
      if (newAction !== "") {
        const p = newAction.split(",");
        const i = new ethers.utils.Interface([
          `function ${p[0]}(${p.slice(1).join(",")})`,
        ]);
        data = i.encodeFunctionData(
          p[0],
          newParams.split(",").map((p) => p.trim())
        );
      }
      const tx = await contract.add(newTarget, newValue, data);
      await tx.wait();
      setNewTarget("");
      setNewValue("");
      setNewAction("");
      setNewParams("");
      fetchData();
    } catch (e) {
      alert(e);
    }
  }

  async function onConfirm(i) {
    const contract = getContract();
    const tx = await contract.confirm(i, false);
    await tx.wait();
    fetchData();
  }

  async function onExecute(i) {
    const contract = getContract();
    const tx = await contract.execute(i);
    await tx.wait();
    fetchData();
  }

  async function onView(i) {
    const contract = getContract();
    const logs = await contract.queryFilter(
      contract.filters.TransactionExecuted(i, null)
    );
    if (logs.length < 1) return alert("Transaction log not found");
    window.open(`https://arbiscan.io/tx/${logs[0].transactionHash}`, "_blank");
  }

  async function fetchData() {
    try {
      const contract = getContract();
      const owners = await contract.getOwners();
      const summary = await contract.getSummary();
      const transactionCount = summary[0].toNumber();
      const transactions = await contract.getPage(
        Math.max(transactionCount - 15, 0),
        transactionCount
      );
      setData({
        transactionCount,
        threshold: summary[1].toNumber(),
        delay: summary[2],
        owners,
        transactions,
      });
    } catch (e) {
      console.error("data", e);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;
  return (
    <div className="container">
      <div className="card mt-4 mb-4">
        <h2 className="title mt-0">Multisig</h2>
        <h3 className="subtitle">Overview</h3>
        <table className="table mb-6">
          <tbody>
            <tr>
              <th>Address</th>
              <td>
                <a
                  href={`https://arbiscan.io/address/${msAddress}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {msAddress}
                </a>
              </td>
            </tr>
            <tr>
              <th>Owners ({data.owners.length})</th>
              <td>
                {data.owners.map((o) => (
                  <div key={o}>
                    <a
                      href={`https://arbiscan.io/address/${o}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {o}
                    </a>
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <th>Threshold</th>
              <td>{data.threshold}</td>
            </tr>
            <tr>
              <th>Transaction Count</th>
              <td>{data.transactionCount}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="subtitle">Transactions</h3>
        <table className="table mb-6">
          <thead>
            <tr>
              <th>Index</th>
              <th>Time</th>
              <th>Target</th>
              <th>Data</th>
              <th>Approvals</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions[0].map((_, j) => {
              const i = data.transactions[0].length - 1 - j;
              const id = data.transactionCount - j;
              const time = new Date(data.transactions[0][i].toNumber() * 1000);
              const target = data.transactions[1][i];
              const confirmations = data.transactions[5][i].toNumber();
              let fn = data.transactions[3][i].slice(0, 10);
              if (data4bytes[fn]) {
                const params = ethers.utils.defaultAbiCoder.decode(
                  data4bytes[fn].slice(1),
                  "0x" + data.transactions[3][i].slice(10)
                );
                fn =
                  data4bytes[fn][0] +
                  "(" +
                  params
                    .map((p) => {
                      if (p.lt && p.lt(1000))
                        return ethers.utils.formatUnits(p, 0);
                      if (p.mul) return ethers.utils.formatUnits(p, 18);
                      const s = String(p);
                      if (s.length > 42) return s.slice(0, 10) + "...";
                      if (s.length === 42 && s.startsWith("0x"))
                        return formatAddress(s);
                      return s;
                    })
                    .join(", ") +
                  ")";
              }
              return (
                <tr key={i}>
                  <td>{id}</td>
                  <td>{formatDate(time)}</td>
                  <td>
                    <a
                      href={`https://arbiscan.io/address/${target}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {formatAddress(target)}
                    </a>
                  </td>
                  <td>{fn}</td>
                  <td>{confirmations}</td>
                  <td>
                    {data.transactions[4][i] ? (
                      <a onClick={() => onView(id - 1)}>Tx</a>
                    ) : confirmations < data.threshold ? (
                      <a onClick={() => onConfirm(id - 1)}>Confirm</a>
                    ) : (
                      <a onClick={() => onExecute(id - 1)}>Execute</a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h3 className="subtitle">New Transaction</h3>
        <label className="label">Target</label>
        <input
          className="input w-100 mb-4"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder="0x1234..."
        />
        <label className="label">Value</label>
        <input
          className="input w-100 mb-4"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="0"
        />
        <label className="label">Action</label>
        <select
          className="input w-100 mb-4"
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
        >
          <option>Other</option>
          {Object.values(data4bytes).map((f) => (
            <option key={f.join(",")} value={f.join(",")}>
              {f[0] + "(" + f.slice(1).join(", ") + ")"}
            </option>
          ))}
        </select>
        <label className="label">Params</label>
        <input
          className="input w-100 mb-4"
          value={newParams}
          onChange={(e) => setNewParams(e.target.value)}
          placeholder="0x1234,8000,1"
        />
        <button className="button" onClick={onSubmit}>
          Add transaction
        </button>
      </div>
    </div>
  );
}
