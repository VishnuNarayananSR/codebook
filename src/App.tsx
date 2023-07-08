import React, { useEffect, useState } from "react";
import { initService, build } from "./bundler";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  useEffect(() => {
    initService();
  }, []);
  const onClick = async () => {
    try {
      const bundleCode = await build();
      setCode(bundleCode.outputFiles[0].text);
    } catch (err) {
      if (err instanceof Error) setCode(err.message);
    }
  };

  return (
    <div>
      <div>
        <textarea
          cols={100}
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <br />
        <button onClick={onClick}>Submit</button>
        <pre>{code}</pre>
      </div>
    </div>
  );
};

export default App;
