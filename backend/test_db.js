const db = require('./config/db');

async function test() {
  const userId = 2; 

  try {
    const field = 'subuh';
    
    // First let's check current data
    const [initialRows] = await db.promise().query(`SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()`, [userId]);
    console.log("Initial row:", initialRows);

    const query = `
      INSERT INTO ibadah_daily (user_id, log_date, ${field}) VALUES (?, CURRENT_DATE(), TRUE) 
      ON DUPLICATE KEY UPDATE ${field} = NOT ${field}
    `;
    console.log("Running query:", query);
    const [result] = await db.promise().query(query, [userId]);
    console.log("Query result:", result);
    
    const [rows] = await db.promise().query(`SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()`, [userId]);
    console.log("Current row step 1:", rows);

    // Toggle again
    const [result2] = await db.promise().query(query, [userId]);
    console.log("Query result 2:", result2);
    
    const [rows2] = await db.promise().query(`SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()`, [userId]);
    console.log("Current row step 2:", rows2);

  } catch (e) {
    console.error("Error:", e);
  } finally {
    process.exit(0);
  }
}

test();
