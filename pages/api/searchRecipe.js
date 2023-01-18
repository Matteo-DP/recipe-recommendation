import React from 'react'
import getApiKey from '../../src/services/apiKeyService';

export default async function generateTitle(req, res) {
    try {

        // Generate recipe titles by ingredient input
        if(req.method === "GET") {

            const { query } = req.query;
            if(!query) return res.status(400).json({
                code: 400,
                message: "Missing 'query' query parameter"
            })
            const apiKey = getApiKey()
            const response = await fetch("https://api.spoonacular.com/recipes/complexSearch?" + new URLSearchParams({
                query: query,
                apiKey: apiKey,
                number: 10
            }))
            const data = await response.json()
            if(data.results.length == 0) return res.status(404).json({
                code: 404,
                message: "No recipes found",
            })
            return res.status(200).json({
                code: 200,
                message: "OK",
                data: data
            })

        }

    } catch(e) {
        console.error(e)
        return res.status(500).json({
            code: 500,
            message: "An error has occured while trying to search for recipes."
        })
    }
}
