import React, { useRef, useState } from 'react';
import RecipeSearchItem from '../src/components/RecipeSearchItem';
import RecipeSearchItemSkeleton from '../src/components/RecipeSearchItemSkeleton';
import Image from 'next/image';
import styles from "../styles/main.module.css"

export default function index() {

  const searchRef = useRef(undefined);
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState(undefined)
  const [error, setError] = useState("")
  const [info, setInfo] = useState(undefined)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    setRecipes(undefined)
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
          const ids = data.map((recipe) => recipe.id)
          const getInfoUrl = "https://api.spoonacular.com/recipes/informationBulk?" + new URLSearchParams({
            ids: ids,
            apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY
          })
          // https://spoonacular.com/food-api/docs
          fetch(getInfoUrl) // Get info for recipes
            .then(res => res.json())
            .then(data => {
              if(data.length !== 0) {
                setInfo(data)
              } else {
                setError("No recipes found. Have you correctly inputted your ingredients?")
              }
            })
        } else {
          setError("No recipes found. Have you correctly inputted your ingredients?")
        }
      })
      .catch(() =>
        setError("An error has occured while trying to search for recipes.") 
      )
      .finally(() => setLoading(false))
  }

  const Skeleton = () => {
    let content = []
    let i = 0
    while(i<10) {
      content.push(<RecipeSearchItemSkeleton />)
      i += 1
    }
    return content
  }

  return (
    <main className='pb-8 min-h-screen'>

      {isOpen &&
        <>
          <div className='fixed w-screen h-screen bg-black opacity-75 z-[9998]'
            onClick={() => setIsOpen(false)}
          ></div>
          <div className='fixed w-[60vw] h-[40vw] ml-auto mr-auto left-0 right-0 top-[50%] translate-y-[-50%] bg-white z-[9999] border border-black shadow-inner rounded-xl p-6'>
            <button onClick={() => setIsOpen(false)} className="fixed top-0 right-0 p-8">
              <i className="fa-solid fa-xmark fa-2xl"></i>
            </button>
            <h1 className='text-2xl mb-6 text-accent'>Advanced search options</h1>
            <form>
              <p className='text-xl mb-1 text-textlighter'>Search engine</p>
              <input defaultChecked type="radio" id="spoonacularApi" value="spoonacularApi" />
              <label htmlFor="spoonacularApi">SpoonacularApi</label> <br />

              <p className='text-xl mt-6 mb-4 text-accent'>Preferences</p>

              <p className='text-lg mb-1 text-textlighter'>Ingredient prioritization</p>
              <input defaultChecked type="radio" id="ranking1" value="ranking1" />
              <label htmlFor="ranking1">Maximize used ingredients</label> <br />
              <input type="radio" id="ranking2" value="ranking2" />
              <label htmlFor="ranking2">Minimize missing ingredients</label> <br />

              <p className='text-lg mt-4 mb-1 text-textlighter'>Pantry items</p>
              <input defaultChecked type="checkbox" id="ignorePantry" value="ignorePantry" />
              <label htmlFor="ignorePantry">Ignore typical pantry items, such as water, salt, flour, etc.</label>
            </form>
          </div>
        </>
      }

      <div className={`py-16 ${styles.parallax}`}>
        <div className='bg-white rounded-xl flex flex-row justify-between items-center h-[400px] max-w-6xl mx-auto drop-shadow-md'>
          <div className='w-max mx-auto'>
            {error && 
              <p className='px-4 py-2 absolute top-5 bg-red-500 text-white rounded-xl'>{error}</p>
            }
            <h1 className='text-4xl font-medium mb-2'>What&apos;s in your fridge?</h1>
            <p className='text-textlight mb-6'>Search through 500K+ recipes and get recommendations <br /> directly based on the ingredients in your fridge.</p>

            <form onSubmit={handleSubmit}>
              <input type="text" ref={searchRef} required className='w-96 px-6 py-3 rounded-l-xl text-black bg-bglighter' placeholder='steak potatoes onion' />
              <button type="submit" disabled={loading} className={`bg-accent px-6 py-3 rounded-r-xl text-white hover:text-accent  hover:bg-white duration-75 ease ${styles.innerShadow}`}>Search recipes</button>
            </form>

            <button className='underline text-accent mb-4 mt-1' onClick={() => setIsOpen(true)}>Advanced search</button>

            <p className='text-textlighter text-sm'>Please separate items with a space.</p>
            <p className='text-textlighter text-sm'>eg. I have eggs and milk. Appropriate search input: Eggs milk</p>
          </div>
          
          <Image 
            src="/vegetables.png"
            alt="vegetables"
            width={400}
            height={200}
            className='object-cover'
          />
        </div>
      </div>

      {loading ?

      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl mt-8 mb-4'>Recommended recipes that use &quot;{searchRef.current.value}&quot;</h1>
        <div className='flex flex-col divide-y-2'>
          <Skeleton />
        </div>
      </div>

      :

      recipes && info &&
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl mt-8 mb-4'>Recommended recipes that use &quot;{searchRef.current.value}&quot;</h1>
        <div className='flex flex-col divide-y-2'>
          {recipes.map((recipe) =>
            <RecipeSearchItem
              key={recipe.id}
              recipe={recipe}
              info={info.find((e) => e.id == recipe.id)}
            />
          )}
        </div>
      </div>}

    </main>
  )
}
