import { useEffect, useState } from "react";
import { Contract, formatEther, getDefaultProvider, isAddress } from "ethers";
import abi from "../../lib/abis/mc.json";
const List = () => {
  const [input, setInput] = useState("");
  const [addrs, setAddrs] = useState([]);
  const [results, setResults] = useState<string[][]>([]);
  const provider = getDefaultProvider(
    "https://arbitrum.blockpi.network/v1/rpc/public"
  );
  const token = "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9";
  const contract = new Contract(
    token,
    ["function claimableTokens(address)"],
    provider
  );
  const mc = new Contract(
    "0x842eC2c7D803033Edf55E478F461FC547Bc54EB2",
    abi,
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

  const getResults = async () => {
    const calldata = addrs.map((x) => {
      return {
        target: token,
        callData: contract.interface.encodeFunctionData("claimableTokens", [x]),
      };
    });
    const results = await mc.aggregate.staticCall(calldata);
    const formatted = Object.fromEntries(
      addrs.map((x, i) => [x, formatEther(results[1][i])])
    );
    setResults(formatted);
  };

  useEffect(() => {
    if (addrs.length == 0) return;
    getResults();
  }, [addrs]);

  return (
    <div className="flex flex-col items-center gap-6 justify-center">
      <div className="underline bolder text-2xl md:text-4xl text-white">
        Check Addresses:
      </div>
      <textarea
        placeholder="Separate by new lines and/or commas"
        className="w-5/6 md:w-2/5 xl:w-1/3 h-36 text-center p-4 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-700"
        value={input}
        onInput={(res) => {
          setInput(res.currentTarget.value);
        }}
      />

      <div className="underline bolder text-2xl md:text-4xl text-white">
        {addrs.length > 0 ? "Results" : "Detected"}: {addrs.length} Addresses
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full md:w-3/4">
        {Object.entries(results)
          .sort((a, b) => Number(a[1]) - Number(b[1]))
          .map(([x, allo], i) => {
            return (
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={`https://arbiscan.io/address/${x}`}
                className="flex items-center w-full justify-around text-white hover:text-pink-400"
                key={i}
              >
                <div className="underline">
                  {x.slice(0, 4) + `...` + x.slice(x.length - 4, x.length)}
                </div>
                <div className="text-right">{allo} ARB</div>
              </a>
            );
          })}
      </div>
    </div>
  );
};

export default List;
