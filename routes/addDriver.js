// car, seats, lat, long, city, state, country, fullname, status: active, not active

const express = require('express');
const IPFS = require('ipfs-api');
const axios = require('axios');
const ethers = require('ethers');
const { abi, address } = require('../smartContractInfo');

const URL = 'HTTP://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
let Contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

const ipfs = new IPFS({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http'
});

const router = express.Router();

// const get = async hash => {
//     const URL = "http://127.0.0.1:5001/ipfs/" + hash;

const baseURL = 'http://127.0.0.1:8080/ipfs/';


// // const baseURL = 'http://127.0.0.1:5001/ipfs/bafybeic4gops3d3lyrisqku37uio33nvt6fqxvkxihrwlqsuvf76yln4fm/#/';
// const baseURL = 'http://127.0.0.1:5001/ipfs/bafybeic4gops3d3lyrisqku37uio33nvt6fqxvkxihrwlqsuvf76yln4fm/#/QmYdr4ApuWsFtL3rVvJBWjoUXgZxD31UYfoLLSGC3XA32C';

const get = async (hash) => {
  const URL = `${baseURL}${hash}`;

  try {
    const response = await axios.get(URL);
    console.log("Response from IPFS:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching data from IPFS:", error);
    throw error;
  }
}

const addDriverToMDB = async (address, longitude, latitude, hash, carName, seats, city, state, country, fullname) => {
    try {
      if (hash === "QmYdr4ApuWsFtL3rVvJBWjoUXgZxD31UYfoLLSGC3XA32C") {
        // Existing hash is empty, create a new object
        let obj = {};
        console.log('empty');
  
        obj[address] = {
          longitude,
          latitude,
          carName,
          seats,
          city,
          state,
          country,
          fullname,
          status: "Active"
        };
  
        let buffer = Buffer.from(JSON.stringify(obj));
  
        return new Promise((resolve, reject) => {
          ipfs.files.add(buffer, async (err, res) => {
            if (err) {
              console.error("Error adding data to IPFS:", err);
              reject(err); // Reject the promise with the error
            } else {
              const hash = await res[0].hash;
              resolve(hash);
            }
          });
        });
  
      } else {
        // Existing hash is not empty, update the data
        const MDB = await get(hash);
  
        MDB[address] = {
          longitude,
          latitude,
          carName,
          seats,
          city,
          state,
          country,
          fullname,
          status: "Active" // Update status based on your application's logic
        };
  
        let buffer = Buffer.from(JSON.stringify(MDB));
  
        return new Promise((resolve, reject) => {
          ipfs.files.add(buffer, async (err, res) => {
            if (err) {
              console.error("Error adding data to IPFS:", err);
              reject(err); // Reject the promise with the error
            } else {
              const hash = await res[0].hash;
              resolve(hash);
            }
          });
        });
      }
    } catch (error) {
      console.error("Error in addDriverToMDB:", error);
      throw error; // Rethrow the error for higher-level error handling
    }
  };
  

  router.post('/', async function (req, res, next) {
    const ADDRESS = req.body.address;
    const LONGITUDE = req.body.longitude;
    const LATITUDE = req.body.latitude;
    // const HASH = req.body.hash;
    const CAR_NAME = req.body.carName;
    const SEATS = req.body.seats;
    const CITY = req.body.city;
    const STATE = req.body.state;
    const COUNTRY = req.body.country;
    const FULL_NAME = req.body.fullname;
    const HASH = await Contract.get();
    console.log("IPFS Hash obtained from the smart contract:", HASH);
  
    addDriverToMDB(ADDRESS, LONGITUDE, LATITUDE, HASH, CAR_NAME, SEATS, CITY, STATE, COUNTRY, FULL_NAME)
      .then(async ipfsHash => {
        // The ipfsHash variable will contain the generated IPFS hash
        console.log("IPFS Hash:", ipfsHash);
  
        // Update the smart contract with the new IPFS hash if required
        await Contract.set(ipfsHash);
  
        // After the smart contract is updated, call get again to retrieve the updated data from IPFS
        const updatedData = await get(ipfsHash);
        console.log("Data retrieved from IPFS:", updatedData); // Add this line to check the entire updatedData object
  
        const userRecord = updatedData[ADDRESS];
        if (userRecord) {
          console.log("Updated data in IPFS for address", ADDRESS, ":", userRecord);
        } else {
          console.log("User data not found for address", ADDRESS);
        }
  
        res.send('We chilling!');
      })
      .catch(error => {
        console.error("Error adding data to IPFS:", error);
        res.status(500).send('An error occurred while adding data to IPFS');
      });
  });
  
  
  
  
module.exports = router;