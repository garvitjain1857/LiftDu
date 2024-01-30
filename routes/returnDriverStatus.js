const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'HTTP://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
let Contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

router.get('/', async function (req, res, next) {
    try {
        const result = await Contract.returnDriverStatus();
        console.log("Driver status retrieved from the smart contract:", result);
        res.send(result);
    } catch (error) {
        console.log("Error while retrieving driver status:", error);
        res.status(500).send("Error while retrieving driver status");
    }
})


module.exports = router;