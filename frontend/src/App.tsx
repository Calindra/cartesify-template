import { useEffect, useState } from 'react';
import './App.css';
import { Cartesify } from "@calindra/cartesify";
import { Button, Heading } from '@chakra-ui/react';
import { BrowserProvider, Eip1193Provider } from 'ethers';

const fetch = Cartesify.createFetch({
  dappAddress: '0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C',
  endpoints: {
    graphQL: new URL("http://localhost:8080/graphql"),
    inspect: new URL("http://localhost:8080/inspect"),
  },
})

function App() {
  const [result, setResult] = useState<string>("") 
  const [signer, setSigner] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      if (!window.ethereum) {
        alert("Connecting to metamask failed.");
        return
      }

      window.ethereum.request({ method: "eth_requestAccounts" })
      .then(async () => {
        const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
        const signer = await provider.getSigner();
        setSigner(signer);
      })
  
    } catch(error) {
      console.log(error);
      alert("Connecting to metamask failed.");
    }
  }, [])

  const callYourEndpoint = async () => {
    setLoading(true)

    let results;

    const response = await fetch("http://127.0.0.1:8383/your-endpoint", {
      method: "POST",
      headers: {
              "Content-Type": "application/json",
      },
      body: JSON.stringify({example: "Your body"}),
      signer 
    })

    results = await response.json();
    setLoading(false)
    setResult(JSON.stringify(results))
    
  }

  let buttonProps:any = {}
  if(loading) buttonProps.isLoading = true

  return (
    <div className="App">
      <Button {...buttonProps} onClick={callYourEndpoint} colorScheme='blue'>Call Your Endpoint</Button>
      <Heading>{result}</Heading>
    </div>
  );
}

export default App;