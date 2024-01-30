const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'http://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
const contract = new ethers.Contract(address, abi, customHttpProvider);

// Replace 'YOUR_PRIVATE_KEY' with the private key of the Ethereum account you want to use for signing
const privateKey = '6b9cf38a760c1b61b3facade6777ec0d3263b1c50b948e48dd1d56107983e7b2';
const wallet = new ethers.Wallet(privateKey, customHttpProvider);
const contractWithSigner = contract.connect(wallet);

router.post('/', async function (req, res, next) {
  try {
    const { driver, user } = req.body;

    if (!driver || !user) {
      return res.status(400).send('Driver and user addresses are required');
    }

    const driverAddress = ethers.utils.getAddress(driver);
    const userAddress = ethers.utils.getAddress(user);

    // Use the contractWithSigner to send the transaction with a valid signer
    const result = await contractWithSigner.finalizeDriver(driverAddress, userAddress);

    return res.send('Finalized the contract!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error finalizing the contract');
  }
});

module.exports = router;
