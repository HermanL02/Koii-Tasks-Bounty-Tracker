
const fetchKoii = require('./fetchKoii');
const fetchKPL = require('./fetchKPL');
const config = require('config');
const axios = require('axios');
require('dotenv').config();
const webhookUrl = process.env.WEBHOOK_URL;
async function sendBountyOutMessage(taskdata,i){
    const msg = "Task "+ taskdata[i].data.taskName+ " Bounty out! Task public key: "+ taskdata[i].publicKey;
    const message = {
        text: msg
    };
    await axios.post(webhookUrl, message)
    .then(response => {
        console.log('Message sent: ', response.data);
    })
    .catch(error => {
        console.error('Error sending message: ', error);
    }); 
  }
  
  async function sendBountyInsufficientMessage(taskdata,i){
    const remainingRounds = Math.floor(taskdata[i].data.totalBountyAmount/taskdata[i].data.bountyAmountPerRound);
    const msg = "Task "+ taskdata[i].data.taskName+ " Bounty Less than "+ remainingRounds+ " rounds! "+ taskdata[i].publicKey;
    console.log(msg);
    const message = {
        text: msg
    };
    await axios.post(webhookUrl, message)
    .then(response => {
        console.log('Message sent: ', response.data);
    })
    .catch(error => {
        console.error('Error sending message: ', error);
    });  
  }
  
  async function main() {
      const allWarningTaskData = [];
      try{
        const KPLTaskData = await fetchKPL();
        console.log(KPLTaskData);
      const KoiiTaskData = await fetchKoii();

      const taskdata = KoiiTaskData.concat(KPLTaskData);
      if(taskdata.length==null){
        return;
      }
      console.log(taskdata);
      for (let i = 0; i < taskdata.length; i++) {
          console.log(taskdata[i].data.taskName, taskdata[i].data.totalBountyAmount, taskdata[i].data.bountyAmountPerRound);
  
          if(Number(taskdata[i].data.totalBountyAmount)<Number(taskdata[i].data.bountyAmountPerRound)){
              sendBountyOutMessage(taskdata,i);
          }else{
            
              if(Number(taskdata[i].data.totalBountyAmount)<Number((taskdata[i].data.bountyAmountPerRound))*10){
                  if (taskdata[i].data.taskName.includes("Free")){
                    
                    if(Number(taskdata[i].data.totalBountyAmount)<Number((taskdata[i].data.bountyAmountPerRound))*2){
                        allWarningTaskData.push(taskdata[i]);
                        await sendBountyInsufficientMessage(taskdata,i);
                        continue;
                    }else{
                        continue;
                    }
                  }
                  allWarningTaskData.push(taskdata[i]);
                  sendBountyInsufficientMessage(taskdata,i);
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
      return allWarningTaskData;
  }
  
  console.log("Webhook URL: ", webhookUrl);
  main();
  setInterval(main, 600000);
  

  module.exports = main;
  
  