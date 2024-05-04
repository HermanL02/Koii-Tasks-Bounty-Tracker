const { PublicKey, Connection } = require('@_koi/web3.js');
const config = require('config');
const axios = require('axios');
const webhookUrl = 'https://hooks.slack.com/services/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';
const connection = new Connection("https://testnet.koii.network","confirmed");

function parseRawK2TaskData({
    rawTaskData,
    hasError = false,
  }) {
    return {
      taskName: rawTaskData.task_name,
      taskManager: new PublicKey(rawTaskData.task_manager).toBase58(),
      isWhitelisted: rawTaskData.is_allowlisted,
      isActive: rawTaskData.is_active,
      taskAuditProgram: rawTaskData.task_audit_program,
      stakePotAccount: new PublicKey(rawTaskData.stake_pot_account).toBase58(),
      totalBountyAmount: rawTaskData.total_bounty_amount,
      bountyAmountPerRound: rawTaskData.bounty_amount_per_round,
      currentRound: rawTaskData.current_round,
      availableBalances: rawTaskData.available_balances,
      stakeList: rawTaskData.stake_list,
      startingSlot: rawTaskData.starting_slot,
      isRunning: rawTaskData.is_running ?? false,
      hasError,
      metadataCID: rawTaskData.task_metadata,
      minimumStakeAmount: rawTaskData.minimum_stake_amount,
      roundTime: rawTaskData.round_time,
      submissions: rawTaskData.submissions,
      distributionsAuditTrigger: rawTaskData.distributions_audit_trigger,
      submissionsAuditTrigger: rawTaskData.submissions_audit_trigger,
      isMigrated: rawTaskData.is_migrated,
      migratedTo: rawTaskData.migrated_to,
      distributionRewardsSubmission: rawTaskData.distribution_rewards_submission,
    };
  }
// const whitelistedFilter = {
//     memcmp: {
//       offset: 0 /* offset where the whitelisted bytes start */,
//       bytes: 'aRN1MbEZhbr2W97MTP3RhQjjqHgoZN',
//     },
//   };

// const getProgramAccountFilter = () => [whitelistedFilter];
async function fetchAllTasks(){
    console.log("Fetching start time:", new Date());
    const taskAccountInfo = await connection.getProgramAccounts(
      new PublicKey("Koiitask22222222222222222222222222222222222")
      , {
        filters: [{
          memcmp: {
            offset: 0, // offset where the whitelisted bytes start
            bytes: 'aRN1MbEZhbr2W97MTP3RhQjjqHgoZN' // Your byte string needs to be base58 or hex encoded
          }
        }]
      }
    );

  const dataSize = new TextEncoder().encode(JSON.stringify(taskAccountInfo)).length;
  console.log("Data size in bytes:", dataSize);
  
  console.log("Fetching time got:", new Date());
  if (taskAccountInfo === null) {
    throw 'Error: cannot find the task contract data';
  }

  const tasks = taskAccountInfo
    .map((rawData) => {
      try {
        const rawTaskData = {
          ...(JSON.parse(rawData.account.data.toString())),
          task_id: rawData.pubkey.toBase58(),
        };
        const taskData = parseRawK2TaskData({ rawTaskData });
        const task = {
          publicKey: rawData.pubkey.toBase58(),
          data: taskData,
        };
        return task;
      } catch (e) {
        return null;
      }
    })

    .filter(
      (task) =>
        task !== null && task.data.isWhitelisted //&& task.data.isActive
    );


  return tasks;
}
async function fetchAllTasksWithTimeout() {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Task fetch timeout')), 300000); // 300,000 ms = 5 minutes
    });

    try {
        return await Promise.race([fetchAllTasks(), timeout]);
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    try{
    const taskdata = await fetchAllTasksWithTimeout();
    if(taskdata.length==null){
      return;
    }
    console.log(taskdata);
    // loop taskdata
    for (let i = 0; i < taskdata.length; i++) {
        console.log(taskdata[i].data.taskName, taskdata[i].data.totalBountyAmount, taskdata[i].data.bountyAmountPerRound);

        if(Number(taskdata[i].data.totalBountyAmount)<Number(taskdata[i].data.bountyAmountPerRound)){
            const msg = "Task "+ taskdata[i].data.taskName+ " Bounty out! Task public key: "+ taskdata[i].publicKey;
            const message = {
                text: msg
            };
            const response = await axios.post(webhookUrl, message)
            .then(response => {
                console.log('Message sent: ', response.data);
            })
            .catch(error => {
                console.error('Error sending message: ', error);
            });  
        }else{
            if(Number(taskdata[i].data.totalBountyAmount)<Number((taskdata[i].data.bountyAmountPerRound))*10){
                const remainingRounds = Math.floor(taskdata[i].data.totalBountyAmount/taskdata[i].data.bountyAmountPerRound);
                const msg = "Task "+ taskdata[i].data.taskName+ " Bounty Less than "+ remainingRounds+ " rounds! "+ taskdata[i].publicKey;
                console.log(msg);
                const message = {
                    text: msg
                };
                const response = await axios.post(webhookUrl, message)
                .then(response => {
                    console.log('Message sent: ', response.data);
                })
                .catch(error => {
                    console.error('Error sending message: ', error);
                });  
            }else{
    
                const remainingRounds = Math.floor(taskdata[i].data.totalBountyAmount/taskdata[i].data.bountyAmountPerRound);
                const msg = "Task "+ taskdata[i].data.taskName+ " Bounty Less than "+ remainingRounds+ " rounds! "+ taskdata[i].publicKey;
                console.log(msg);
            }
        }
        

        
    }
    console.log("Memory usage: ", process.memoryUsage());
    }catch(e){
        console.log(e);
        console.log("Memory usage: ", process.memoryUsage());

    }
}


main();
setInterval(main, 600000);


