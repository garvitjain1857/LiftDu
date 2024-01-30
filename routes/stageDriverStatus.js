const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'HTTP://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
let Contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

router.post('/', async function (req, res, next) {
    const driverAddress = req.body.address;
    console.log("Driver address received:", driverAddress);

    try {
        result = await Contract.stageDriverStatus(driverAddress);
        console.log("Driver status response:", result);
        res.send(`Driver has been staged`);
    } catch (error) {
        console.error("Error in staging driver:", error);
        res.status(500).send("Error in staging driver");
    }
});

module.exports = router;
