
const mysql = require('../config/polarbirdDB');
const logger = require('../utils/logger');
// const format = require('date-format');


exports.message = (req, res) => {
  const connection = mysql();
  const dateParam = req.query.date;

  let date;
  if (dateParam) {
    date = new Date(dateParam);
  } else {
    date = new Date();
    date.setDate(date.getDate() - 1); // Subtract 1 day for the default date
  }

  const reportdate = date.toISOString().split("T")[0];

  // Query ทีมภาคกลาง BKK
  const QueryTeam1 = `
  WITH all_sales AS (
    SELECT
        emp_code,
        DATE(order_date) AS order_date,
        SUM(grand_total) AS grand_total,
        'cashsales' AS source
    FROM cashsales
    WHERE status IN ('approve', 'paid', 'pending', 'complete')
    GROUP BY emp_code, DATE(order_date)

    UNION ALL

    SELECT
        emp_code,
        DATE(order_date) AS order_date,
        SUM(grand_total) AS grand_total,
        'salesorder' AS source
    FROM salesorder
    WHERE status IN ('approve', 'paid', 'pending', 'complete')
    GROUP BY emp_code, DATE(order_date)
)

SELECT
    mm.myteam_id,
    mm.team_leader,
    mm.empcode,
    mm.name,
    DATE_FORMAT(a.order_date, '%d-%m-%Y') AS sales_date,
    COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) AS cashsales_grand_total,
    COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0) AS salesorder_grand_total,
    (COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) +
     COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0)) AS total_grand_total
FROM
    myteam_members mm
LEFT JOIN all_sales a ON mm.empcode = a.emp_code
WHERE 
    mm.myteam_id = 2
    AND mm.company_id = 1
GROUP BY
    mm.myteam_id,
    mm.team_leader,
    mm.empcode,
    mm.name,
    a.order_date
HAVING
    cashsales_grand_total IS NOT NULL OR salesorder_grand_total IS NOT NULL
ORDER BY
    a.order_date ASC;
   
    `;

//  Query ทีมภาคกลาง CENTRAL
    const QueryTeam2 = `
    WITH all_sales AS (
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'cashsales' AS source
        FROM cashsales
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    
        UNION ALL
    
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'salesorder' AS source
        FROM salesorder
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    )
    
    SELECT
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        DATE_FORMAT(a.order_date, '%d-%m-%Y') AS sales_date,
        COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) AS cashsales_grand_total,
        COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0) AS salesorder_grand_total,
        (COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) +
         COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0)) AS total_grand_total
    FROM
        myteam_members mm
    LEFT JOIN all_sales a ON mm.empcode = a.emp_code
    WHERE 
        mm.myteam_id = 3
        AND mm.company_id = 1
    GROUP BY
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        a.order_date
    HAVING
        cashsales_grand_total IS NOT NULL OR salesorder_grand_total IS NOT NULL
    ORDER BY
        a.order_date ASC;
    `;


    //  Query ทีมภาคเหนือ
    const QueryTeam3 = `
    WITH all_sales AS (
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'cashsales' AS source
        FROM cashsales
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    
        UNION ALL
    
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'salesorder' AS source
        FROM salesorder
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    )
    
    SELECT
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        DATE_FORMAT(a.order_date, '%d-%m-%Y') AS sales_date,
        COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) AS cashsales_grand_total,
        COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0) AS salesorder_grand_total,
        (COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) +
         COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0)) AS total_grand_total
    FROM
        myteam_members mm
    LEFT JOIN all_sales a ON mm.empcode = a.emp_code
    WHERE 
        mm.myteam_id = 4
        AND mm.company_id = 1
    GROUP BY
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        a.order_date
    HAVING
        cashsales_grand_total IS NOT NULL OR salesorder_grand_total IS NOT NULL
    ORDER BY
        a.order_date ASC;
       
       
    `;


    //  Query ทีมภาคอีสาน
    const QueryTeam4 = `
    WITH all_sales AS (
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'cashsales' AS source
        FROM cashsales
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    
        UNION ALL
    
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'salesorder' AS source
        FROM salesorder
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    )
    
    SELECT
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        DATE_FORMAT(a.order_date, '%d-%m-%Y') AS sales_date,
        COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) AS cashsales_grand_total,
        COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0) AS salesorder_grand_total,
        (COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) +
         COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0)) AS total_grand_total
    FROM
        myteam_members mm
    LEFT JOIN all_sales a ON mm.empcode = a.emp_code
    WHERE 
        mm.myteam_id = 5
        AND mm.company_id = 1
    GROUP BY
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        a.order_date
    HAVING
        cashsales_grand_total IS NOT NULL OR salesorder_grand_total IS NOT NULL
    ORDER BY
        a.order_date ASC;
       
    `;


    //  Query ทีมภาคใต้
    const QueryTeam5 = `
    WITH all_sales AS (
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'cashsales' AS source
        FROM cashsales
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    
        UNION ALL
    
        SELECT
            emp_code,
            DATE(order_date) AS order_date,
            SUM(grand_total) AS grand_total,
            'salesorder' AS source
        FROM salesorder
        WHERE status IN ('approve', 'paid', 'pending', 'complete')
        GROUP BY emp_code, DATE(order_date)
    )
    
    SELECT
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        DATE_FORMAT(a.order_date, '%d-%m-%Y') AS sales_date,
        COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) AS cashsales_grand_total,
        COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0) AS salesorder_grand_total,
        (COALESCE(MAX(CASE WHEN a.source = 'cashsales' THEN a.grand_total END), 0) +
         COALESCE(MAX(CASE WHEN a.source = 'salesorder' THEN a.grand_total END), 0)) AS total_grand_total
    FROM
        myteam_members mm
    LEFT JOIN all_sales a ON mm.empcode = a.emp_code
    WHERE 
        mm.myteam_id = 6
        AND mm.company_id = 1
    GROUP BY
        mm.myteam_id,
        mm.team_leader,
        mm.empcode,
        mm.name,
        a.order_date
    HAVING
        cashsales_grand_total IS NOT NULL OR salesorder_grand_total IS NOT NULL
    ORDER BY
        a.order_date ASC;
    `;



  // Perform the First MySQL query
  connection.query(QueryTeam1, (err, results1) => {
    if (err) {
      logger.error("Error executing query:", err.message);
      return res.status(500).json({ error: "An error occurred" });
    }

    // Store results from the First query in a variable

    // Perform the Second MySQL query2
    connection.query(QueryTeam2, (err2, results2) => {
      if (err2) {
        logger.error("Error executing query:", err2.message);
        return res.status(500).json({ error: "An error occurred" });
      }

      connection.query(QueryTeam3, (err2, results3) => {
        if (err2) {
          logger.error("Error executing query:", err2.message);
          return res.status(500).json({ error: "An error occurred" });
        }

        connection.query(QueryTeam4, (err2, results4) => {
          if (err2) {
            logger.error("Error executing query:", err2.message);
            return res.status(500).json({ error: "An error occurred" });
          }

          connection.query(QueryTeam5, (err2, results5) => {
            if (err2) {
              logger.error("Error executing query:", err2.message);
              return res.status(500).json({ error: "An error occurred" });
            }




      // Send the results of both queries as a JSON response
      res.status(200).json({
        success: true,
        data: {
          team1: results1,
          team2: results2,
          team3: results3,
          team4: results4,
          team5: results5,

         // productData: results2,
        },
      });
    });
    });
    });
   });
  });
};
