// 引入文件系统模块
const fs = require('fs');

// 读取JSON文件
fs.readFile('rawTaskData.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // 解析JSON数据
    const jsonObject = JSON.parse(data);

    // 获取第一层项的名称
    const firstLevelKeys = Object.keys(jsonObject);

    // 输出结果
    console.log(firstLevelKeys);
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
