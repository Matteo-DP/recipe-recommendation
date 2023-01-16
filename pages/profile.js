import React, { useState, useEffect } from 'react'
import PrivateRoute from '../src/components/PrivateRoute'
import { useAuth } from '../src/contexts/AuthContext'
import getApiKey from '../src/services/apiKeyService';
import RecipeSearchItem from '../src/components/RecipeSearchItem';
import RecipeSearchItemSkeleton from '../src/components/RecipeSearchItemSkeleton';

const fetchSavedRecipes = (currentUser, setSavedRecipes, setError, setPopup, setLoading) => {
    setError("")
    setPopup("")
    setLoading(true);
    const apiKey = getApiKey();
    fetch("/api/savedRecipes?" + new URLSearchParams({
        uuid: currentUser.uid
    }))
        .then(res => res.json())
        .then(data => {
            if(data.code == 200 && data.recipeIds.length !==0) {
                fetch("https://api.spoonacular.com/recipes/informationBulk?" + new URLSearchParams({
                    ids: data.recipeIds,
                    apiKey: apiKey
                }))
                    .then(res => res.json())
                    .then(data => setSavedRecipes(data))
                }
            })
    .finally(() => setLoading(false))
    .catch(() => setError("Failed to retrieve saved recipes."))
}


export default function Profile() {

    const { currentUser } = useAuth();
    const [popup, setPopup] = useState("")
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSavedRecipes(currentUser, setSavedRecipes, setError, setPopup, setLoading)
    }, [currentUser])

    const Skeleton = () => {
        let content = []
        let i = 0
        while(i<10) {
          content.push(<RecipeSearchItemSkeleton key={i} />)
          i += 1
        }
        return content
    }

    return (
        <PrivateRoute>
            <main className='min-h-screen p-2 sm:p-4 md: p-8'>
                <h1 className='text-3xl'>My saved recipes</h1>
                <p className='mb-2 text-textlighter'>Click on the bookmark icon next to a search result to save it</p>
                {error && 
                    <>
                        <p className='mt-4 text-red-600'>{error}</p>
                        <button className='mt-4' onClick={() => window.location.reload(false)}>Click here to try again</button>
                    </>
                }
                {loading && <Skeleton /> }
                {!loading && savedRecipes.length == 0 &&
                    <>
                        <p className='mt-4 text-red-600'>No recipes saved yet!</p>
                        <p>Save your first recipe by clicking the bookmark icon next to a search result</p>
                    </>
                }
                <ul className='flex flex-col divide-y-2'>
                    {savedRecipes.map(recipe => 
                        <RecipeSearchItem 
                            key={recipe.id}
                            recipe={recipe}
                            info={recipe}
                            uuid={currentUser.uid}
                            setPopup={setPopup}
                            saved={savedRecipes ? savedRecipes.find(e => e.id == recipe.id) ? true : false : false}
                            dontRefreshRecipes
                        />
                    )}
                </ul>
            </main>
        </PrivateRoute>
    )
}