const web3 = require('@_koii/web3.js');
let z = new web3.PublicKey(  [
  5,  46,  55, 101, 255, 212, 255, 217,
126, 228, 122,  10, 227,  28, 238,  16,
219, 138, 212, 179,  72, 118,  30,  85,
240,  74,  12, 247, 202,  35,  55, 153
]);
z.toBase58();
console.log(z.toBase58());