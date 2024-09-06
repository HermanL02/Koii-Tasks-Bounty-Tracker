const { Connection, PublicKey } = require('@_koii/web3.js');
const base58 = require('bs58');
const rpcUrl = 'https://devnet.koii.network';
const connection = new Connection(rpcUrl, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: true,
  });

  async function main(params) {
    const buffer = Buffer.from([0x01, 0x01]);
  
    let z = base58.encode(buffer)
    console.log(z);
    // return
      let taskKPLAccounts = await connection.getProgramAccounts(
          new PublicKey("KPLTRVs6jA7QTthuJH2cEmyCEskFbSV2xpZw46cganN"),
          {
              // dataSlice:{
              //     length: 10,
              //     offset: 0
              // },
              // encoding: 'base58',
            filters: [{
              memcmp: {
                offset: 0 /* offset where the whitelisted bytes start */,
                bytes: '5S',
              },
            }],
          }
        );
      
      console.log(taskKPLAccounts.map((e) => {return {...e, pubkey:e.pubkey.toBase58()}}));
      // console.log(taskKPLAccounts[3].pubkey.toBase58());
      // console.log(taskKPLAccounts[4].pubkey.toBase58());
      // console.log(compareBuffers(taskKPLAccounts[3].account.data, taskKPLAccounts[4].account.data))
        // console.log(taskKPLAccounts[3].account.data.at(251))
      // console.log(taskKPLAccounts.filter(e=>e.pubkey.toBase58()==="AoXfnUuZZnfVfNgCxgGDycv2xvpyHE3LJWqnjaw51W2"))
      console.log(taskKPLAccounts.length)   
     
  }
  main()