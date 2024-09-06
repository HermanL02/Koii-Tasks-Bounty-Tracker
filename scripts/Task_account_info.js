
const { PublicKey, Connection } = require('@_koi/web3.js');
// const fs = require('fs');
const config = require('config');
const axios = require('axios');
require('dotenv').config();
const webhookUrl = process.env.WEBHOOK_URL;
const connection = new Connection("https://testnet.koii.network","confirmed");

const programPublicKey = new PublicKey('6GbwkdtaTUjxJfGEgYxnDsqdCz36zRqbYpfNfyhnAqg1');

async function getProgramAccountData() {
  try {
    const accountInfo = await connection.getParsedAccountInfo(programPublicKey);
 
    if (accountInfo.value) {

        const buffer = accountInfo.value.data;
        
        let dataString = buffer.toString('utf8');
             
  
    
        const data = JSON.parse(dataString);  
        console.log(data);

    } else {
      console.log('No data found for this account.');
    }
  } catch (error) {
    console.error('Error fetching account data:', error);
  }
}

getProgramAccountData();