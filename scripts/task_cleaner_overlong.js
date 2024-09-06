const { PublicKey, Connection } = require('@_koi/web3.js');
const config = require('config');
const axios = require('axios');
require('dotenv').config();
const webhookUrl = process.env.WEBHOOK_URL;
const connection = new Connection("https://testnet-rpc-1.koii.network", "confirmed");
const fs = require('fs');

async function fetchSegmentedTasks(programId, filter, segmentSize = 1000) {
  let offset = 0;
  let allAccounts = [];
  while (true) {
    const taskAccountInfo = await connection.getProgramAccounts(
      programId,
      {
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: filter,
            },
          },
          {
            dataSize: segmentSize,
          },
        ],
        encoding: 'base64',
      }
    );

    if (taskAccountInfo.length === 0) {
      break;
    }

    allAccounts = allAccounts.concat(taskAccountInfo);
    offset += taskAccountInfo.length;

    if (taskAccountInfo.length < segmentSize) {
      break;
    }
  }
  return allAccounts;
}

async function fetchAllTasks() {
  console.log("Fetching start time:", new Date());

  const programId = new PublicKey("Koiitask22222222222222222222222222222222222");
  const base64Filter = 'EtkQ6Ue';

  const taskAccountInfo = await fetchSegmentedTasks(programId, base64Filter);

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
        console.error('Error parsing task data:', e);
        return null;
      }
    })
    .filter((task) => task !== null);

  return tasks;
}

function parseRawK2TaskData({ rawTaskData, hasError = false }) {
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

async function main() {
  const alltasks = await fetchAllTasks();
  let deleteTasksnum = 0;
  for (const task of alltasks) {
    const notIPFS = task.publicKey != "E2yxYLgVmPDNXxiKsdNZsDV5vnNZDwWSssKFbn24tMu2";
    const notIPFS2 = task.publicKey != "CjYHJjhtJjXp7X4yw4Z9w3BEPLe7dgNSB3FzKDs9Qn7x";
    const notMigrated = task.data.isMigrated == false;
    const notWhitelisted = task.data.isWhitelisted == false;
    const stakePotAccount = task.data.stakePotAccount;
    const stakePotAccountBalance = await connection.getBalance(new PublicKey(stakePotAccount));
    const stakePotAccountEmpty = stakePotAccountBalance / (10**9) <= 100;

    if (notIPFS && notIPFS2 && notMigrated && notWhitelisted && stakePotAccountEmpty) {
      console.log(task.publicKey, task.data.taskName);
      deleteTasksnum++;
    }
  }
  console.log(`Number of tasks to delete: ${deleteTasksnum}`);
}

main();
