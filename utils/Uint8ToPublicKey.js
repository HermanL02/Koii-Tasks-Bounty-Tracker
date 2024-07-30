const web3 = require('@_koii/web3.js');
let z = new web3.PublicKey(  [
  12, 246,  51, 140, 149, 124,   5,  37,
  29, 206,  21,  17, 220, 146,  91, 194,
 108,  93, 194, 174, 164,  47, 167, 153,
 121, 164,  57, 229, 222, 152,  89,  72
],);
z.toBase58();
console.log(z.toBase58());