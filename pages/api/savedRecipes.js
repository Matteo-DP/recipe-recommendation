const mysql = require('mysql2/promise');

// TODO: auth?

async function sqlCreateConnection() {
    return await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        ssl: { // Required for PlanetScale
          rejectUnauthorized: true
        }
      })
}


export default async function RecipeHandler(req, res) {

    if(req.method === "POST") {
        // Save recipe id to DB
        
        try {
            var connection = await sqlCreateConnection();

            if(!req.body.recipeId || !req.body.uuid) return res.status(400).json({ status: "Bad request", message: "Missing recipeId or uuid in request body" })
            const { recipeId, uuid } = req.body
            await connection.execute(
                'INSERT INTO SavedRecipes (uuid, recipeId) VALUES (?, ?)',
                [uuid, recipeId]
            )
            return res.status(200).json({
                status: "Record inserted",
                message: "The recipe ID has been saved",
                recipeId: recipeId,
                uuid: uuid
            })

        } catch(e) {
            console.error(e)
            return res.status(500).end()
        } finally {
            if(connection) connection.end()
        }

    } else if(req.method === "GET") {
        // Return all saved recipe Ids for uuid

        try {
            var connection = await sqlCreateConnection();

            if(!req.body.uuid) return res.status(400).json({ status: "Bad request", message: "Missing UUID in query" });
            const { uuid } = req.body;
            const rows = await connection.execute(
                'SELECT recipeId FROM SavedRecipes WHERE uuid = ?',
                [uuid]
            );
            return res.status(200).json({
                uuid: uuid,
                recipeIds: rows[0]
            });

        } catch(e) {
            console.error(e)
            return res.status(500).end()
        } finally {
            if(connection) connection.end()
        }

    } else {
        return res.status(405).end() // Method not allowed
    }

}
