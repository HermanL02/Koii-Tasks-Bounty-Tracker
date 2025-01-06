const  { Connection, PublicKey }=require( '@_koi/web3.js');

async function getTaskBalance(taskId) {
    const connection = new Connection('https://mainnet.koii.network');
    const taskState = await connection.getAccountInfo(new PublicKey(taskId));
    let taskStateJSON = null;
    if (taskState) {
        taskStateJSON = JSON.parse(taskState.data.toString());
    }
    else {
        return console.error("Task not found");
    }
    console.log(new PublicKey(taskStateJSON.stake_pot_account));



} 
getTaskBalance("FhEnjpDiojB7Lydk6stQ2CpVmQ4QbzyLcoX9Ec3Ab6Xn");  