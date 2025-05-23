import { ethers } from "ethers";


const CONTRACT_ADDRESS = "0x0f5f83841d95697e445b160d3980efe52a8af284";


const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"name": "recordWin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newScore",
				"type": "uint256"
			}
		],
		"name": "WinRecorded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getMyScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "mindScores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
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
