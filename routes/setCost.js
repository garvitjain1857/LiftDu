const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'http://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
const contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

router.post('/', async function (req, res, next) {
  try {
    const { address, amount } = req.body;

    if (!address || !amount) {
      return res.status(400).send('Address and amount are required');
    }

    // Perform input validation on address and amount if necessary

    const result = await contract.setCost(address, amount);
    return res.send('Set cost successfully!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error setting the cost');
  }
});

module.exports = router;
