import "./money.css";

const Money = () => {
  return (
    <div className="money-container">
      <h3 className="money-title">Mint Datil Credits to Decrypt</h3>
      <div className="money-steps">
        <h4>1. Download the metamask extension</h4>
        <h4>2. Go to your profile and get your private key</h4>
        <h4>
          3. Import your web3auth account to metamask to connect with Datil
        </h4>
        <h4>
          2. Go to{" "}
          <a
            href="https://chronicle-yellowstone-faucet.getlit.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lit Faucet
          </a>
          .
        </h4>

        <h4>
          3. Get your wallet address from profile and paste it on the website
          and click on "Claim".
        </h4>
        <h4>
          4. Go to{" "}
          <a
            href="https://explorer.litprotocol.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lit Explorer
          </a>
          .
        </h4>
        <h4>
          5. Connect to Datil network through metamask and mint capacity credits
        </h4>
        <h4>6. Come back to your dashboard and decrypt your certificates.</h4>
      </div>
    </div>
  );
};

export default Money;
