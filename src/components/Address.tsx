import { useEffect, useState } from "react";
import { Contract, getDefaultProvider, isAddress } from "ethers";
const List = () => {
  const [input, setInput] = useState("");
  const [addrs, setAddrs] = useState([]);
  const provider = getDefaultProvider("https://rpc.ankr.com/arbitrum");
  const token = "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9";
  const contract = new Contract(
    token,
    ["function claimableTokens(address)"],
    provider
  );

  useEffect(() => {
    const addresses = input
      .split(",")
      .join("\n")
      .split("\n")
      .filter((x) => isAddress(x));
    if (addresses.length > 0) {
      setAddrs(addresses);
    } else setAddrs([]);
  }, [input]);

  return (
    <div className="flex flex-col items-center gap-8 justify-center m-4">
      <div className="underline bolder text-6xl text-white">
        Arbitrum Airdrop Tool 🪂
      </div>
      <div className="underline bolder text-4xl text-white">
        Check Addresses:
      </div>
      <textarea
        placeholder="Separate by newlines or commas"
        className="w-1/4 h-64 text-center p-4"
        value={input}
        onChange={(res) => {
          console.log(res);
          setInput(res.target.value);
        }}
      />

      <div className="underline bolder text-4xl text-white">Results:</div>
      {addrs.map((x) => {
        return (
          <div className="flex items-center justify-around">
            <div>{x}</div>
            <div>#</div>
          </div>
        );
      })}
    </div>
  );
};

export default List;
