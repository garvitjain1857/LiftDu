// car, seats, lat, long, city, state, country, fullname, status: active, not active

const express = require('express');
const IPFS = require('ipfs-api');
const axios = require('axios');

const ipfs = new IPFS({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http'
  });

const router = express.Router();

// const get = async hash => {
//     const URL = "http://127.0.0.1:5001/ipfs/" + hash;
const baseURL = 'http://127.0.0.1:8080/ipfs/';


// const baseURL = 'http://127.0.0.1:5001/ipfs/bafybeic4gops3d3lyrisqku37uio33nvt6fqxvkxihrwlqsuvf76yln4fm/#/QmYdr4ApuWsFtL3rVvJBWjoUXgZxD31UYfoLLSGC3XA32C';

const get = async (hash) => {
  const URL = `${baseURL}/${hash}`;

    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}


const getDriverData = async (address, hash) => {
    const MDB = await get(hash);
    return MDB[address];
}

router.post('/', async function (req, res, next) {
    const ADDRESS = req.body.address;
    const HASH = req.body.hash;
    
    await getDriverData(ADDRESS, HASH).then(result => {
        console.log(result);
        // const JSONOBject = JSON.stringify(result);
        res.send(result);
    })

})

module.exports = router;