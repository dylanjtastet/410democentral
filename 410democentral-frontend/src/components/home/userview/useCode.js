import {useState, useEffect} from 'react';

export default function useCode(id, setLogs) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  // setInput is never used
  // eslint-disable-next-line
  const [input, setInput] = useState("");
  const [parameters, setParameters] = useState({});
  const [updateFlag, setUpdateFlag] = useState(false);

  useEffect(() => {
    if (id === "") return;
    let sampleURL = new URL(process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BACKEND_PORT + "/"+"sample");
    sampleURL.searchParams.append("id", id);
    fetch(sampleURL, {credentials:"include"})
    .then(res => res.json())
    .then(data => {
      setCode(data.code);
      setName(data.name);
      setLogs([]);
      // Uncomment / modify if / when input added to backend
      // setInput(data.input);
      if (input === "array") {
        setParameters({start_size: 50, end_size: 100000, num_steps: 20});
      } else {
        setParameters({});
      }
    })
  }, [id, input, updateFlag]);

  return {
    "name" : name,
    "parameters" : parameters,
    "setParameters" : setParameters,
    "input" : input,
    "code" : code,
    "setCode" : setCode,
    "pullFromServer" : () => {setUpdateFlag(!updateFlag)}
  };
}
