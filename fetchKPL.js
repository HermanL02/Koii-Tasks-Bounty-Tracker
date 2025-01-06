const { Connection, PublicKey } = require('@_koii/web3.js');
const base58 = require('bs58');
const rpcUrl = 'https://mainnet.koii.network';
const connection = new Connection(rpcUrl, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: true,
  });
function parseRawK2TaskData({
    rawTaskData,
    hasError = false,
  }) {
    // console.log(rawTaskData.task_manager);
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
const { borsh_bpf_js_deserialize, } = require('./webasm_bincode_deserializer/bincode_js');

  async function deserializeTaskState(taskPublicKey) {
    console.log(taskPublicKey);
    const rpcUrl = process.env.K2_NODE_URL || 'https://mainnet.koii.network';
    const connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      disableRetryOnRateLimit: true,
    });
    console.log('Connection to cluster established:', rpcUrl);
  
    const accountInfo = await connection.getAccountInfo(
      new PublicKey(taskPublicKey),
    );
    if (!accountInfo) {
      throw new Error('Failed to find the account');
    }
  
    // Deserialize the data
    try {
      let buffer = accountInfo.data;
      let taskState = borsh_bpf_js_deserialize(buffer);
      taskState = parseTaskState(taskState);
      return taskState;
    } catch (error) {
      console.error('Failed to deserialize data with:', error);
      return null;
    }
  }
  
  function parseTaskState(taskState) {
    taskState.stake_list = objectify(taskState.stake_list, true);
    taskState.ip_address_list = objectify(taskState.ip_address_list, true);
    taskState.distributions_audit_record = objectify(
      taskState.distributions_audit_record,
      true,
    );
    taskState.distributions_audit_trigger = objectify(
      taskState.distributions_audit_trigger,
      true,
    );
    taskState.submissions = objectify(taskState.submissions, true);
    taskState.submissions_audit_trigger = objectify(
      taskState.submissions_audit_trigger,
      true,
    );
    taskState.distribution_rewards_submission = objectify(
      taskState.distribution_rewards_submission,
      true,
    );
    taskState.available_balances = objectify(taskState.available_balances, true);
    return taskState;
  }
  
  function objectify(data, recursive = false) {
    if (data instanceof Map) {
      let obj = Object.fromEntries(data);
      if (recursive) {
        for (let key in obj) {
          if (obj[key] instanceof Map) {
            obj[key] = objectify(obj[key], true);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            obj[key] = objectify(obj[key], true);
          }
        }
      }
      return obj;
    }
    return data;
  }

  
async function fetchKPLTasks() {
    const buffer = Buffer.from([0x01, 0x01]);
    
    let z = base58.encode(buffer)
    // console.log(z);
    // return
        let taskKPLAccounts = await connection.getProgramAccounts(
            new PublicKey("KPLTRVs6jA7QTthuJH2cEmyCEskFbSV2xpZw46cganN"),
            {
            filters: [{
                memcmp: {
                offset: 0 /* offset where the whitelisted bytes start */,
                bytes: '5S',
                },
            }],
            }
        );

        console.log(taskKPLAccounts);
        const tasks = await Promise.all(
            taskKPLAccounts
            .map(async (rawData) => {
                try {
                    const deserializedData = await deserializeTaskState(rawData.pubkey.toBase58());
                    // console.log(Object.keys(deserializedData));
                    // console.log("Calling parseRawK2TaskData with x:", x);
      
                    if (deserializedData != null){
                        const rawTaskData = {
                            ...deserializedData,
                            task_id: rawData.pubkey.toBase58(),
                          };
                       
                          const taskData = parseRawK2TaskData({ rawTaskData });
                          const task = {
                            publicKey: rawData.pubkey.toBase58(),
                            data: taskData,
                          };
             
                        return task;
                    }
                    return null;
                } catch (e) {
                    console.error('Error parsing task data:', e);
                    return null;
                }
            })
        );

        const filteredTasks = tasks.filter(
            (task) => task !== null && task.data.isWhitelisted //&& task.data.isActive
        );
        return filteredTasks;
}
async function fetchAllTasksWithTimeout() {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Task fetch timeout')), 500000); // 300,000 ms = 5 minutes
    });

    try {
        return await Promise.race([fetchKPLTasks(), timeout]);
    } catch (error) {
        console.error(error);
    }
}
// fetchKPLTasks();
module.exports = fetchAllTasksWithTimeout;