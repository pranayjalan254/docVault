import { useState } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import { web3auth } from "../../web3auth/Web3modal";
import Modal from "react-modal";
import "./reward.css";

const PaymentForm = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setTransactionDetails(null);
    try {
      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider
      );
      const signer = ethersProvider.getSigner();

      const tx = {
        to: recipientAddress,
        value: ethers.utils.parseEther(amount),
      };

      const transaction = await signer.sendTransaction(tx);
      const receipt = await transaction.wait();

      setTransactionDetails({
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: ethers.utils.formatEther(transaction.value),
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"),
        blockNumber: receipt.blockNumber,
      });

      setModalIsOpen(true);
      setRecipientAddress("");
      setAmount("");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-card">
      <h2>Send Reward</h2>
      <input
        type="text"
        placeholder="Recipient Wallet Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Sending..." : "Send Payment"}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Transaction Details"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Payment Successful</h3>
        {transactionDetails ? (
          <div className="transaction-details">
            <p>
              <strong>Transaction Hash:</strong> {transactionDetails.hash}
            </p>
            <p>
              <strong>From:</strong> {transactionDetails.from}
            </p>
            <p>
              <strong>To:</strong> {transactionDetails.to}
            </p>
            <p>
              <strong>Value:</strong> {transactionDetails.value} ETH
            </p>
            <p>
              <strong>Gas Price:</strong> {transactionDetails.gasPrice} GWEI
            </p>
            <p>
              <strong>Block Number:</strong> {transactionDetails.blockNumber}
            </p>
          </div>
        ) : (
          <p>No transaction details available.</p>
        )}
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default PaymentForm;
