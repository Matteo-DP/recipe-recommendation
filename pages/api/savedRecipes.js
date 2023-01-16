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

            if(!req.body.recipeId || !req.body.uuid) return res.status(400).json({ code: 400, status: "Bad request", message: "Missing recipeId or uuid in request body" })
            const { recipeId, uuid } = req.body
            await connection.execute(
                'INSERT INTO SavedRecipes (uuid, recipeId) VALUES (?, ?)',
                [uuid, recipeId]
            )
            return res.status(200).json({
                code: 200,
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

            if(!req.query.uuid) return res.status(400).json({ code:400, status: "Bad request", message: "Missing UUID in query" });
            const { uuid } = req.query;
            const rows = await connection.execute(
                'SELECT recipeId FROM SavedRecipes WHERE uuid = ?',
                [uuid]
            );
            const idList = rows[0].map((e) => e.recipeId)
            return res.status(200).json({
                code: 200,
                uuid: uuid,
                recipeIds: idList
            });

        } catch(e) {
            console.error(e)
            return res.status(500).end()
        } finally {
            if(connection) connection.end()
        }

    } else if(req.method === "DELETE") {
        // Delete saved recipeId from db by uuid

        try {
            var connection = await sqlCreateConnection();

            if(!req.body.uuid || !req.body.recipeId) return res.status(400).json({ code:400, status: "Bad request", message: "Missing recipeId or UUID in request body" });
            const { uuid, recipeId } = req.body;
            await connection.execute(
                'DELETE FROM SavedRecipes WHERE uuid = ? AND recipeId = ?',
                [uuid, recipeId]
            );
            return res.status(200).json({
                code: 200,
                message: "Successfully deleted record",
                uuid: uuid,
                recipeId: recipeId
            })

        } catch(e) {
            console.error(e)
            return res.status(500).json({
                code: 500,
                message: "Internal server error"
            })
        } finally {
            if(connection) connection.end()
        }

    } else {
        return res.status(405).json({
            code: 405,
            message: "Method not allowed"
        }) // Method not allowed
    }

}
