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
    <div className="flex flex-col items-center gap-6 justify-center m-4">
      <div className="underline bolder text-4xl text-white text-center">
        <span className="text-5xl">Arbitrum</span> <br />
        Airdrop Tool 🪂
      </div>
      <div className="underline bolder text-4xl text-white">
        Check Addresses:
      </div>
      <textarea
        placeholder="Separate by newlines or commas"
        className="w-3/4 md:w-2/5 xl:w-1/2 h-36 text-center p-4"
        value={input}
        onInput={(res) => {
          setInput(res.currentTarget.value);
        }}
      />

      <div className="underline bolder text-4xl text-white">
        {addrs.length > 0 ? "Results" : "Detected"}: {addrs.length} Addresses
      </div>
      {Object.entries(results).map(([x, allo], i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-around text-white w-full"
          >
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`https://arbiscan.io/address/${x}`}
              className="underline hover:text-pink-400"
            >
              {x.slice(0, 4) + `...` + x.slice(x.length - 4, x.length)}
            </a>
            <div className="text-right">{allo} ARB</div>
          </div>
        );
      })}
    </div>
  );
};

export default List;
