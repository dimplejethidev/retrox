import { ethers } from "ethers"
import { deployed_address } from '../contract_config.js';

const IPFS_REGEX = /ipfs:[/]{2}[0-9a-zA-Z]{46}/g

//function to convert uri from contract to URL which can be called to get JSON metadata
function uriToURL(uri) {
  return `https://ipfs.infura.io/ipfs/${uri.slice(7)}`
}

export async function getBadgeHolderVotes(id) {
  console.log(id);

  const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

  const retroAddress = deployed_address
  const retroABI = [
    "function getBadgeHolderVotes(uint256 roundNum, uint256 nominationNum, address badgeHolder) public view returns (uint256)",
    "function getRoundData(uint256 roundNum) public view returns(string memory, uint256, uint256, uint256, uint256)",
    "function getNominationData(uint256 roundNum, uint256 nominationNum) public view returns (string memory, address, uint256)"
  ]
  const retroContract = new ethers.Contract(retroAddress, retroABI, provider);
  const nominationNum = (await retroContract.getRoundData(id))[3].toNumber();
  const round = await retroContract.getRoundData(id);

  // check that ipfs URI is formatted properly
  const match = round[0].match(IPFS_REGEX);

  const url = uriToURL(round[0]);
  const res = await fetch(url);

  let body;
  try {
    body = await res.json()
  } catch (error) {
    console.error(error)
  }

  console.log(body);

  let nominations = [];
  let badgeHolderVotes = []
  for (let i = 0; i < nominationNum; i++) {
      badgeHolderVotes.push({});
      for (let j = 0; j < body.badgeholders.length; j++) {
        let badgeHolderAddress = body.badgeholders[j].address;
        let badgeHolderTwitter = body.badgeholders[j].twitter;
        let badgeHolderVote = await retroContract.getBadgeHolderVotes(id, i, badgeHolderAddress);
        badgeHolderVotes[i][badgeHolderTwitter] = badgeHolderVote.toNumber();
      }
  }
  console.log("badgeholder votes", badgeHolderVotes);
  return badgeHolderVotes;
}