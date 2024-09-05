import "./money.css";

const Money = () => {
  return (
    <div className="money-card">
      <h3 className="money-title">Add Test Sepolia ETH</h3>
      <div className="money-steps">
      <h4>1. Go to your profile and get your wallet address.</h4>
        <h4>
          2. Go to{" "} 
          <a 
            href="https://www.sepoliafaucet.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sepolia Faucet
          </a>
          .
        </h4>
        
        <h4>
          3. Paste the wallet address on the website and click on "Get Tokens".
        </h4>
        <h4>4. Follow the steps for attestation.</h4>
      </div>
    </div>
  );
};

export default Money;
