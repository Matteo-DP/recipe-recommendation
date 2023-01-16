import React from 'react'
import getApiKey from '../../src/services/apiKeyService';

export default async function GetInfo(req, res) {
    try {

        // Get recipe info by ids
        if(req.method === "GET") {

            const apiKey = getApiKey()
            const { ids } = req.query
            if(!ids) return res.status(400).json({
                code: 400,
                message: "Missing search options"
            })

            const url = "https://api.spoonacular.com/recipes/informationBulk?" + new URLSearchParams({
              ids: ids,
              apiKey: apiKey
            })
            const response = await fetch(url)
            const data = await response.json()
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
