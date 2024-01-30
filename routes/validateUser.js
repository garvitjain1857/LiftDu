const express = require('express');
const IPFS = require('ipfs-api');
const axios = require('axios');

const ipfs = new IPFS({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http'
});

// const router = express.Router();

// const get = async (hash) => {
//   const URL = 'http://127.0.0.1:8080/ipfs/' + hash;
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
    console.log(error);
    throw error; // Re-throw the error to be caught at a higher level
  }
}

const validateUser = async (address, hash) => {
  try {
    const MDB = await get(hash);

    // Add console logs to inspect the retrieved data
    console.log("Data retrieved from IPFS:", MDB);
    console.log("Address being validated:", address);

    if (MDB[address] === undefined) {
      console.log('User data not found for address:', address);
      return 'Passenger';
    } else {
      const status = MDB[address].status.toLowerCase(); // Convert to lowercase
      if (status === 'active') {
        console.log('User is a driver:', MDB[address]);
        return 'Driver';
      } else if (status === 'not active') {
        console.log('User is a passenger:', MDB[address]);
        return 'Passenger';
      } else {
        console.log('Invalid status:', MDB[address].status);
        return 'Unknown'; // Handle unexpected status values
      }
    }
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to be caught at a higher level
  }
};


router.post('/', async function (req, res, next) {
  const ADDRESS = req.body.address;
  const HASH = req.body.hash;

  // Add console logs to debug input data
  console.log("Received validation request for address:", ADDRESS, "with IPFS hash:", HASH);

  try {
    const result = await validateUser(ADDRESS, HASH);

    // Add console logs to see the validation result
    console.log("Validation result:", result);

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
