import React, { useRef, useState, useEffect } from 'react';
import RecipeSearchItem from '../src/components/RecipeSearchItem';
import RecipeSearchItemSkeleton from '../src/components/RecipeSearchItemSkeleton';
import Image from 'next/image';
import styles from "../styles/main.module.css"
import SettingsMenu from '../src/components/SettingsMenu';
import { useAuth } from "../src/contexts/AuthContext"

const fetchSavedRecipes = async (currentUser, setSavedRecipes) => {
  if(!currentUser) return
  fetch("/api/savedRecipes?" + new URLSearchParams({
    uuid: currentUser.uid
  }))
    .then(res => res.json())
    .then(data => data.code == 200 && setSavedRecipes(data.recipeIds))
}

export default function Index() {

  const [title, setTitle] = useState("");
  const [popup, setPopup] = useState("");
  const [searchSettings, setSearchSettings] = useState(undefined)
  const searchRef = useRef(undefined)
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState(undefined)
  const [error, setError] = useState("")
  const [info, setInfo] = useState(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [savedRecipes, setSavedRecipes] = useState(undefined)
  const scrollToRef = useRef(null)
  const [useOtherRecipes, setuseOtherRecipes] = useState(false) // Set to true when AI generated title isn't found, get spoonacular recipes by ingredients instead
  const [useMoreRecipes, setUseMoreRecipes] = useState(false) // When the search result is limited
  const [moreRecipes, setMoreRecipes] = useState(null)
  const [moreRecipesInfo, setMoreRecipesInfo] = useState(undefined)
  const [moreRecipesLoading, setMoreRecipesLoading] = useState(false)

  const { currentUser } = useAuth();

  // Prevent no saved recipes for initial search
  useEffect(() => {
    fetchSavedRecipes(currentUser, setSavedRecipes)
  }, [currentUser])

  // Scroll to search items when searching
  useEffect(() => {
    if(loading && scrollToRef && scrollToRef.current) {
      const { offsetTop } = scrollToRef.current
      scrollTo({
        top: offsetTop - 100,
        behavior: "smooth"  
      })
    }
  }, [loading])

  const deprecatedPlaceholder = "Sorry, this feature is no longer available due to OpenAI free trial ending. :("
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    setRecipes(undefined)
    setInfo(undefined)
    setuseOtherRecipes(false)
    setError("")
    setTitle("")
    setUseMoreRecipes(false)
    setMoreRecipes(undefined)
    setMoreRecipesInfo(undefined)
    const ingredients = searchRef.current.value.split(" ")

    // Get recipe title from OpenAI
    // DEPRECATED -- OPENAI FREE TRIAL EXPIRED
    const resTitle = await fetch("/api/generateTitle?" + new URLSearchParams({
      ingredients: ingredients
    }))
    const dataTitle = await resTitle.json()
    if(dataTitle.code == 429) {
      setError("OpenAI free trial expired, no more AI generated recipes :(")
      setLoading(false)
    } else if(dataTitle.code !== 200) {
      setError(dataTitle.message)
      setLoading(false)
    }
    setTitle(dataTitle.title || deprecatedPlaceholder)

    // Search recipe by title
    if(dataTitle.title !== "placeholder") {
      const resRecipe = await fetch("/api/searchRecipe?" + new URLSearchParams({
        query: dataTitle.title
      }))
      var dataRecipe = await resRecipe.json()
    } else {
      dataRecipe = {}
      dataRecipe.code = 404
    }
    if(dataRecipe.code !== 200) {
      if(dataRecipe.code == 404) {
        // Get recipes by ingredients instead
        setuseOtherRecipes(true)
        // Get recipes by search ingredients
        const resOther = await fetch("/api/getRecipes?" + new URLSearchParams({
          ignorePantry: searchSettings?.ignorePantry === undefined && true || searchSettings.ignorePantry,
          number: 10,
          ranking: searchSettings?.ranking?.prioRanking1 && 1 || searchSettings?.ranking?.prioRanking2 && 2 || 1, // Whether to maximize used ingredients (1) or minimize missing ingredients (2) first.
          ingredients: ingredients.toString(),
        }))
        dataRecipe = await resOther.json()
        if(dataRecipe.code !== 200) {
          setError("Couldn't find recipes")
          setLoading(false)
          return
        }
      } else {
        setError(dataRecipe.message)
        setLoading(false)
      }
    }
    setRecipes(dataRecipe.data?.results || dataRecipe.data)

    // Get info by id
    const res2 = await fetch("/api/getInfo?" + new URLSearchParams({
      ids: dataRecipe.data?.results?.map((recipe) => recipe.id) || dataRecipe.data.map((recipe) => recipe.id)
    }))
    const data2 = await res2.json()
    if(data2.code !== 200) {
      setError(data2.message)
      setLoading(false)
      return
    }
    setInfo(data2.data)

    fetchSavedRecipes(currentUser, setSavedRecipes)
    setLoading(false)

    if(dataRecipe.data?.results?.length < 5 || dataRecipe.data.length < 5) {
      setUseMoreRecipes(true)
      setMoreRecipesLoading(true)
      // Get recipes by search ingredients
      const resMore = await fetch("/api/getRecipes?" + new URLSearchParams({
        ignorePantry: searchSettings?.ignorePantry === undefined && true || searchSettings.ignorePantry,
        number: 9,
        ranking: searchSettings?.ranking?.prioRanking1 && 1 || searchSettings?.ranking?.prioRanking2 && 2 || 1, // Whether to maximize used ingredients (1) or minimize missing ingredients (2) first.
        ingredients: ingredients.toString(),
      }))
      const dataMore = await resMore.json()
      if(dataMore.code !== 200) {
        setError("Couldn't find more recipes")
        setMoreRecipesLoading(false)
        return
      }
      setMoreRecipes(dataMore.data)
      // Get info by id
      const resMoreInfo = await fetch("/api/getInfo?" + new URLSearchParams({
        ids: dataMore.data.map((recipe) => recipe.id)
      }))
      const dataMoreInfo = await resMoreInfo.json()
      if(dataMoreInfo.code !== 200) {
        setError(dataMoreInfo.messsage)
        setLoading(false)
        return
      }
      setMoreRecipesInfo(dataMoreInfo.data)
      fetchSavedRecipes(currentUser, setSavedRecipes)
      setMoreRecipesLoading(false)
    }
  }

  const Skeleton = ({ n }) => {
    let content = []
    let i = 0
    while(i<n) {
      content.push(<RecipeSearchItemSkeleton key={i} />)
      i += 1
    }
    return content
  }

  console.log(popup)

  return (
    <main className='pb-8 min-h-screen'>

      <SettingsMenu 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSearchSettings={setSearchSettings}
      />

      <div className={`py-16 ${styles.parallax} h-[95vh] flex justify-center items-center px-2`}>
        <div className='px-2 py-4 sm:px-8 sm:py-8 md:p-16 bg-white rounded-xl drop-shadow-md max-w-5xl w-full'>
          {error && 
            <p className='px-4 py-2 absolute -top-10 left-0 bg-red-500 text-white rounded-xl'>{error}</p>
          }
          <h1 className='text-3xl md:text-4xl font-medium mb-2'>What&apos;s in your fridge?</h1>
          <p className='text-sm md:text-base text-textlight mb-6'>Search through 500K+ recipes and get recommendations <br /> directly based on the ingredients in your fridge.</p>

          <form onSubmit={handleSubmit}>
            <input type="text" ref={searchRef} required className='max-w-[384px] w-full px-6 py-3 mb-2 md:mb-0 rounded-xl md:rounded-r-none md:rounded-l-xl text-black bg-bglighter' placeholder='steak potatoes onion' />
            <button type="submit" disabled={loading} className={`bg-accent px-6 py-3 rounded-xl md:rounded-r-xl md:rounded-l-none text-white hover:!text-accent  hover:bg-white duration-75 ease ${styles.innerShadow}`}>Search recipes</button>
          </form>

          <button className='underline text-accent mb-4 mt-1' onClick={() => setIsOpen(true)}>Advanced search options</button>

          <p className='text-textlighter text-sm'>Please separate items with a space.</p>
          <p className='text-textlighter text-sm'>eg. I have eggs and milk. Appropriate search input: Eggs milk</p>
          <p className='text-textlighter text-sm'>For optimal results, be as specific as possible</p>
          
          <Image 
            src="/vegetables.png"
            alt="vegetables"
            width={400}
            height={200}
            className='object-cover absolute right-0 top-0 z-[-1] hidden md:block'
          />
        </div>
      </div>
      
      {searchRef && searchRef.current &&
        <div className='max-w-6xl mx-auto px-2 min-h-screen'>
          {searchRef?.current?.value &&
            <>
              <h1 ref={scrollToRef} className='text-base sm:text-xl mt-8 mb-4 text-center'>Search results for recipes that use &apos;{searchRef.current.value}&apos;</h1>
              {title ?
                <>
                  <p className='text-xl mt-4 text-textlight'>Recommended dish:</p>
                  <p className='text-2xl mt-2'>{title}</p>
                  {loading &&
                    <p className='text-base mt-2'>
                      Searching the web for recipes ...
                    </p>
                  }
                </>
                :
                <p className='text-2xl mt-4'>Asking AI for a dish ...</p>
              }
              {recipes && info && !loading &&
                useOtherRecipes && title !== deprecatedPlaceholder &&
                  <h1 className='text-base text-textlighter mt-2'>Sorry, we couldn&apos;t find that recipe. Here are some other recipes we found:</h1>
              }
              {!loading && (!recipes || !info) && title !== deprecatedPlaceholder &&
                <h1 className='text-base text-textlight mt-2 text-red-800'>Sorry, we didn&apos;t find any recipes for this dish, but you can always look it up on Google!</h1>
              }
              {title === deprecatedPlaceholder &&
                <h1 className="mt-2">Still, here are some recipes we found without AI:</h1>
              }
            </>
          } 
          <div className='flex flex-col divide-y-2'>
            {loading ?
              <Skeleton 
                n={10}
              />
            :
              recipes && info &&
                recipes.map((recipe) =>
                  <RecipeSearchItem
                    key={recipe.id}
                    recipe={recipe}
                    info={info.find((e) => e.id == recipe.id)}
                    uuid={currentUser?.uid}
                    setPopup={setPopup}
                    saved={savedRecipes ? savedRecipes.find(e => e == recipe.id) ? true : false : false}
                    refresRecipes={() => fetchSavedRecipes(currentUser, setSavedRecipes)}
                  />
            )}
          </div>
          {useMoreRecipes &&
              (moreRecipesLoading ?
                <>
                  <p className='text-base mt-2 text-xl'>
                    Searching the web for more recipes ...
                  </p>
                  <Skeleton 
                    n={9}
                  />
                </>
              :
                <>
                  <h1 className='text-textbase mt-2 text-xl'>Here are some more recipes we found on the web:</h1>
                  <div className='flex flex-col divide-y-2'>
                    {moreRecipes && moreRecipesInfo &&
                      moreRecipes.map((recipe) =>
                        <RecipeSearchItem
                        key={recipe.id}
                        recipe={recipe}
                        info={moreRecipesInfo.find((e) => e.id == recipe.id)}
                        uuid={currentUser?.uid}
                        setPopup={setPopup}
                        saved={savedRecipes ? savedRecipes.find(e => e == recipe.id) ? true : false : false}
                        refresRecipes={() => fetchSavedRecipes(currentUser, setSavedRecipes)}
                      />
                      )
                    }
                  </div>
                </>
              )
          }
        </div>
      }

    </main>
  )
}
