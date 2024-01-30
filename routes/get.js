const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'http://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
const contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

router.get('/', async function (req, res, next) {
  try {
    const result = await contract.get();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error calling get function');
  }
});

module.exports = router;
