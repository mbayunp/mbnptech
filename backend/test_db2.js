const fs = require('fs');
const db = require('./config/db');

async function test() {
  const userId = 2; 
  let output = "";
  try {
    const field = 'subuh';
    
    const [initialRows] = await db.promise().query(`SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()`, [userId]);
    output += "Initial row:\n" + JSON.stringify(initialRows, null, 2) + "\n\n";

    const query = `
      INSERT INTO ibadah_daily (user_id, log_date, ${field}) VALUES (?, CURRENT_DATE(), TRUE) 
      ON DUPLICATE KEY UPDATE ${field} = NOT ${field}
    `;
    const [result] = await db.promise().query(query, [userId]);
    output += "Query result 1:\n" + JSON.stringify(result, null, 2) + "\n\n";
    
    const [rows] = await db.promise().query(`SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()`, [userId]);
    output += "Current row step 1:\n" + JSON.stringify(rows, null, 2) + "\n\n";

    const [result2] = await db.promise().query(query, [userId]);
    output += "Query result 2:\n" + JSON.stringify(result2, null, 2) + "\n\n";
    
    const [rows2] = await db.promise().query(`SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()`, [userId]);
    output += "Current row step 2:\n" + JSON.stringify(rows2, null, 2) + "\n\n";

    fs.writeFileSync('test_output2.txt', output);
  } catch (e) {
    fs.writeFileSync('test_output2.txt', "Error: " + e.stack);
  } finally {
    process.exit(0);
  }
}

test();
