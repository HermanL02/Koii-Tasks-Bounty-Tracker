const web3 = require('@_koii/web3.js');
let zkeypair = web3.Keypair.fromSecretKey(new Uint8Array([
  34,
  34,
  20,
  6,
  30,
  83,
  76,
  192,
  17,
  149,
  211,
  5,
  103,
  48,
  116,
  91,
  136,
  236,
  108,
  199,
  106,
  241,
  31,
  219,
  246,
  32,
  168,
  74,
  28,
  247,
  152,
  147
]));

console.log(zkeypair.publicKey.toBase58());