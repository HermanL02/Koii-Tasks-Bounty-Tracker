const web3 = require('@_koii/web3.js');
let zkeypair = web3.Keypair.fromSecretKey(new Uint8Array([]));

console.log(zkeypair.publicKey.toBase58());