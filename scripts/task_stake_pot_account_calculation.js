const  { Connection, PublicKey }=require( '@_koi/web3.js');

async function getTaskBalance(taskId) {
    const connection = new Connection('https://mainnet.koii.network');
    const taskState = await connection.getAccountInfo(new PublicKey(taskId));
    console.log(taskState);
    const taskData = JSON.parse(taskState.data.toString());
    console.log("Task Data");
    console.log(taskData);

    let totalBalance = 0;
    for (const key in taskData.available_balances) {
        totalBalance += Number(taskData.available_balances[key]);
      }

      console.log(totalBalance);
      const sum = taskData.total_bounty_amount + taskData.total_stake_amount + totalBalance;
      console.log(sum/10**9);
} 
getTaskBalance("Ej178gDZXfL5jS8LrHLFdryF1TELKu1p1CHM1YNiQiyH");  