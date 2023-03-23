import { useEffect, useState } from "react";
const List = () => {
  const [input, setInput] = useState("");
  return (
    <div className="flex flex-col items-center gap-8 justify-center m-4">
      <div className="underline bolder text-6xl text-white">
        Arbitrum Airdrop Tool 🪂
      </div>
      <div className="underline bolder text-4xl text-white">
        Check Addresses:
      </div>
      <textarea
        value={input}
        onChange={(res) => {
          console.log(res);
          setInput(res.target.value);
        }}
      />
    </div>
  );
};

export default List;
