import React from 'react'
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

// TODO: PREVENT ABUSE

export default async function generateTitle(req, res) {
    try {

        // Generate recipe titles by ingredient input
        if(req.method === "GET") {

            const { ingredients } = req.query;
            if(!ingredients) return res.status(400).json({
                code: 400,
                message: "Missing ingredients in request query"
            })
            const openai = new OpenAIApi(configuration)
            const response = await openai.createCompletion({
                model: "gpt-3.5-turbo",
                prompt: 
                    `Name a tasty, simple and cheap dish a college student could make with the ingredients. \n
                    Ingredients: ${ingredients.toString()} \n
                    Dish names:`,
                max_tokens: 16,
                temperature: 0.5,
                n: 1
            })
            return res.status(200).json({
                code: 200,
                message: "OK",
                title: response.data.choices[0].text
            })
            
        }

    } catch(e) {
        if(e.response.data.error.code === "insufficient_quota") {
            console.log("code 429")
            return res.status(429).json({
                code: 429,
                message: "Rate limit exceeded. Please try again later."
            })
        }
        return res.status(500).json({
            code: 500,
            message: "An error has occured while trying to generate titles."
        })
    }
}
