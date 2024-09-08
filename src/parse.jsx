// parse.jsx
export async function loadData({ walletAddress, course, date, contact, add }) {
  const stdData = {
    WALLET_ADDRESS: walletAddress,
    COURSE: course,
    DATE: date,
    CONTACT: contact,
    ADD: add, 
  };
  return [stdData.WALLET_ADDRESS, stdData.COURSE, stdData.DATE, stdData.CONTACT, stdData.ADD];
}
// parse.jsx
export async function loadEncryptedData({ ciphertext, datatoEncryptHash }) {
  const metadata = {
    CIPHERTEXT: ciphertext,
    DATA_TO_ENCRYPT_HASH: datatoEncryptHash,
  };
  return [metadata.CIPHERTEXT, metadata.DATA_TO_ENCRYPT_HASH];
}

export async function insertintotable({ ciphertext, datatoEncryptHash, accessControlConditions }) {
  const metadata = {
    CIPHERTEXT: ciphertext,
    DATA_TO_ENCRYPT_HASH: datatoEncryptHash,
    ACCESS_CONTROL_CONDITIONS: accessControlConditions,
  };
  return [metadata.CIPHERTEXT, metadata.DATA_TO_ENCRYPT_HASH, metadata.ACCESS_CONTROL_CONDITIONS];
}

