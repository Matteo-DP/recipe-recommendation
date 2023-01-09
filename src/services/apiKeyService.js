const spoonacularApiKeys = [
    process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_1,
    process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_2,
    process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_3,
    process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_4,
    process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_5
]

function getRandom(min, max) {
    const floatRandom = Math.random()
    const difference = max - min
    const random = Math.round(difference * floatRandom)
    const randomWithinRange = random + min
    return randomWithinRange
}

export default function getApiKey() {
    const i = getRandom(0, 4)
    return spoonacularApiKeys[i]
}