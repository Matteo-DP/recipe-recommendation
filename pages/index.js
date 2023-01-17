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

  const [popup, setPopup] = useState("");
  const [searchSettings, setSearchSettings] = useState(undefined)
  const searchRef = useRef(undefined)
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState(undefined)
  const [error, setError] = useState("")
  const [info, setInfo] = useState(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [savedRecipes, setSavedRecipes] = useState(undefined)

  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setRecipes(undefined)
    setError("")
    const ingredients = searchRef.current.value.split(" ")

    // Get recipes by search ingredients
    const res = await fetch("/api/getRecipes?" + new URLSearchParams({
      ignorePantry: searchSettings?.ignorePantry === undefined && true || searchSettings.ignorePantry,
      number: 10,
      ranking: searchSettings?.ranking?.prioRanking1 && 1 || searchSettings?.ranking?.prioRanking2 && 2 || 1, // Whether to maximize used ingredients (1) or minimize missing ingredients (2) first.
      ingredients: ingredients.toString(),
    }))
    const data = await res.json()
    if(data.code !== 200) {
      setError(data.message)
      setLoading(false)
      return
    }
    setRecipes(data.data)

    // Get recipes by id
    const res2 = await fetch("/api/getInfo?" + new URLSearchParams({
      ids: data.data.map((recipe) => recipe.id)
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
  }

  const Skeleton = () => {
    let content = []
    let i = 0
    while(i<10) {
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

      {loading ?

      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl mt-8 mb-4'>Recommended recipes that use &quot;{searchRef.current.value}&quot;</h1>
        <div className='flex flex-col divide-y-2'>
          <Skeleton />
        </div>
      </div>

      :

      recipes && info &&
      <div className='max-w-6xl mx-auto p-2'>
        <h1 className='text-2xl mt-8 mb-4'>Recommended recipes that use &quot;{searchRef.current.value}&quot;</h1>
        <ul className='flex flex-col divide-y-2'>
          {recipes.map((recipe) =>
            <RecipeSearchItem
              key={recipe.id}
              recipe={recipe}
              info={info.find((e) => e.id == recipe.id)}
              uuid={currentUser?.uid}
              setPopup={setPopup}
              saved={savedRecipes ? savedRecipes.find(e => e == recipe.id) ? true : false : false}
              refreshRecipes={() => fetchSavedRecipes(currentUser, setSavedRecipes)}
            />
          )}
        </ul>
      </div>}

    </main>
  )
}
