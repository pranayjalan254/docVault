// parse.jsx
export async function loadData({ walletAddress, course, date }) {
  const stdData = {
    WALLET_ADDRESS: walletAddress,
    COURSE: course,
    DATE: date,
  };
  return [stdData.WALLET_ADDRESS, stdData.COURSE, stdData.DATE];
}
// parse.jsx
export async function loadEncryptedData({ ciphertext, dataToEncryptHash }) {
  const metadata = {
    CIPHERTEXT: ciphertext,
    DATA_TO_ENCRYPT_HASH: dataToEncryptHash,
  };
  return [metadata.CIPHERTEXT, metadata.DATA_TO_ENCRYPT_HASH];
}
