import React, { useRef, useState } from 'react';
import RecipeSearchItem from '../src/components/RecipeSearchItem';

export default function index() {

  const searchRef = useRef(undefined);
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState(undefined)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    try {
      const ingredients = searchRef.current.value.split(" ")
      ingredients.length
      console.log(ingredients)
    } catch (e) {
      setError("An error has occured while trying to search for recipes. Have you correctly inputted your ingredients?")
    }
    
    // https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients
    const url = "https://api.spoonacular.com/recipes/findByIngredients?" + new URLSearchParams({
      ingredients: searchRef.current.value,
      ignorePantry: true,
      number: 10,
      ranking: 1, // Whether to maximize used ingredients (1) or minimize missing ingredients (2) first.
      apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY
    })
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if(data.length !== 0) {
          setRecipes(data)
        } else {
          setError("No recipes found. Have you correctly inputted your ingredients?")
        }
      })
      .catch(() => setError("An error () has occured while trying to search for recipes."))
    setLoading(false)
  }

  console.log(recipes)

  return (
    <main className='m-8'>
      <div className='w-max mx-auto'>
        <h1 className='text-3xl my-16'>Recipe recommendations based on what&apos;s in your fridge</h1>

        <form onSubmit={handleSubmit} className="w-max mx-auto">

          <h2 className='text-xl mb-4'>What do you have?</h2>
          <p className='text-gray-500'>Please separate items with a space.</p>
          <p className='text-gray-500 mb-4'>eg. I have eggs and milk. Appropriate search input: Eggs milk</p>

          <input type="text" ref={searchRef} required className='w-96 px-4 py-2 rounded-l-xl text-black' />
          <button type="submit" className='bg-blue-700 px-4 py-2 rounded-r-xl'>Search recipes</button>
        </form>
      </div>

      {error && <p>{error}</p>}

      <div className='mt-16'>
        {recipes && recipes.map((recipe) => 
          <RecipeSearchItem
            key={recipe.id}
            recipe={recipe}
          />
        )}
      </div>

    </main>
  )
}
