// parse.js
export async function loadData() {
  try {
    const response = await fetch("/data.json");
    const data = await response.json();

    const WALLET_ADDRESS = data.walletaddress;
    const COURSE = data.course;
    const DATE = data.date;

    console.log(`Wallet Address: ${WALLET_ADDRESS}`);
    console.log(`Course: ${COURSE}`);
    console.log(`Date: ${DATE}`);

    return { WALLET_ADDRESS, COURSE, DATE };
  } catch (error) {
    console.error("Error loading data:", error);
    return { WALLET_ADDRESS: null, COURSE: null, DATE: null };
  }
}
