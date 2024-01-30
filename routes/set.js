const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'http://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
const contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

router.post('/', async function (req, res, next) {
  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).send('Hash is required');
    }

    const result = await contract.set(hash);
    return res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error calling set function');
  }
});

module.exports = router;
