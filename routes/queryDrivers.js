const express = require('express');
const IPFS = require('ipfs-api');
const axios = require('axios');
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'http://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
const Contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

const ipfs = new IPFS({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http'
});

const router = express.Router();

// const get = async hash => {
// const URL = "http://127.0.0.1:5001/ipfs/" + hash;
const baseURL = 'http://127.0.0.1:8080/ipfs/';


// const baseURL = 'http://127.0.0.1:5001/ipfs/bafybeic4gops3d3lyrisqku37uio33nvt6fqxvkxihrwlqsuvf76yln4fm/#/QmYdr4ApuWsFtL3rVvJBWjoUXgZxD31UYfoLLSGC3XA32C';

const get = async (hash) => {
  const URL = `${baseURL}/${hash}`;

  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the caller
  }
}

const SphericalLawOfCosines = (lat1, lon1, lat2, lon2) => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const R = 6371e3;
  const d = Math.acos(
    Math.sin(φ1) * Math.sin(φ2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  ) * R;
  return d;
};

const queryDrivers = async (hash, latitude, longitude, seats) => {
  const MDB = await get(hash);
  const keys = Object.keys(MDB);
  const distances = [];

  keys.forEach((key) => {
    const driverProperties = MDB[key];
    const currentDistance = SphericalLawOfCosines(
      driverProperties.latitude,
      driverProperties.longitude,
      latitude,
      longitude
    );
    const finalStringDistance = String(currentDistance) + '|' + key;
    distances.push(finalStringDistance);
  });

  distances.sort();

  distances.forEach((string) => {
    const userAddress = string.split('|')[1];
    const driverSeatAvailability = MDB[userAddress].seats - seats;
    if (driverSeatAvailability < 0) {
      const index = distances.indexOf(string);
      if (index !== -1) {
        distances.splice(index, 1);
      }
    }
  });

  const filteredDistances = distances.map((string) => string.split('|')[1]);
  return filteredDistances;
};

router.post('/', async function (req, res, next) {
  try {
    const { hash, latitude, longitude, seats, address } = req.body;

    const eligibleDrivers = await queryDrivers(hash, latitude, longitude, seats);

    for (let i = 0; i < eligibleDrivers.length; i++) {
      await Contract.addEligibleDriver(address, eligibleDrivers[i]);
    }

    res.send('Success');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

module.exports = router;
