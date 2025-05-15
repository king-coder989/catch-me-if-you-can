import { ethers } from "ethers";

// Replace this with your actual deployed contract address
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

// ABI: must match the deployed smart contract functions
const ABI = [
  "function recordWin(uint256 score) external",
  "function getMyScore() external view returns (uint256)",
  "function getScore(address player) external view returns (uint256)"
];

// Connect to the contract
export async function connectToContract() {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
}

// Call this after player wins a stage
export async function recordMindScore(score) {
  const contract = await connectToContract();
  const tx = await contract.recordWin(score);
  await tx.wait(); // wait for confirmation
  console.log("Score recorded!");
}

// Call this to show player's score on the screen
export async function fetchMyMindScore() {
  const contract = await connectToContract();
  const score = await contract.getMyScore();
  return score.toString();
}
