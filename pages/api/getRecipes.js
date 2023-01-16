import React from 'react'
import getApiKey from '../../src/services/apiKeyService';

export default async function GetRecipes(req, res) {
    try {

        // Search recipes by ingredients
        if(req.method === "GET") {
    
            const { ignorePantry, number, ranking, ingredients } = req?.query;
            if(!ignorePantry || !number || !ranking || !ingredients) return res.status(400).json({ 
                code: 400, 
                message: "Missing search options" 
            })
            const apiKey = getApiKey() // Get random API key to bypass daily limit
    
            // Get recipes by ID
            const url = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + ingredients.toString() + "&" + new URLSearchParams({
                ignorePantry: ignorePantry,
                number: number,
                ranking: ranking,
                apiKey: apiKey
              })
            const response = await fetch(url)
            const data = await response.json()
            if(data.length == 0) return res.status(404).json({ 
                code: 404, 
                message: "No recipes found. Have you correctly inputted your ingredients?" 
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
