import React, { useState } from 'react'
import Image from 'next/image'
import Button from './ButtonLarge'

export default function RecipeSearchItem({ recipe, info, uuid, setPopup, saved, refreshRecipes, dontRefreshRecipes = false }) {

    const [loading, setLoading] = useState(false)
    const [visuallySaved, setVisuallySaved] = useState(saved) // Actual saving to DB is still loading

    const tags = { // Tags capitalization map
        dairyFree: "Dairy free",
        glutenFree: "Gluten free",
        ketogenic: "Ketogenic",
        sustainable: "Sustainable",
        vegan: "Vegan",
        vegetarian: "Vegetarian",
        veryHealthy: "Heatlhy"
    };

    const handleSave = () => {
        setLoading(true);
        setVisuallySaved(!visuallySaved);
        fetch("/api/savedRecipes",
        {
            method: saved ? "DELETE" : "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                uuid: uuid,
                recipeId: info.id
            })
        })
            .then(data => data.json())
            .then(res => {
                if(res?.code == 200) {
                    setPopup(`Recipe '${info.title}' ${saved ? "deleted" : "saved"}`)
                    !dontRefreshRecipes && refreshRecipes()
                } else {
                    setPopup(`Failed to ${saved ? "delete" : "save"} recipe`)
                }
            })
            .finally(() => setLoading(false));
    }
 
    return (
        <li className='flex flex-col sm:flex-row gap-4 py-10'>
            <Image alt={info.title} src={info.image} width={300} height={300} className="rounded-xl sm:rounded-l-xl sm:rounded-r-none object-cover mx-auto sm:m-0" />
            <div className='flex flex-col justify-around'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-medium mb-2'>{info.title}</h1>
                    {/* Map tags */}
                    <div className='flex flex-row justify-start flex-wrap gap-2 mb-2'>
                        {Object.keys(tags).map((key) =>
                            info?.[key] && <p key={key} className='text-accent border-accent border-2 px-2 sm:px-4 py-1 inline rounded-2xl text-sm'>{tags[key]}</p>
                        )}
                    </div>
                    <div>
                    {recipe?.missedIngredientCount && (recipe.missedIngredientCount !== 0 ?
                    <>
                        <p className='text-sm sm:text-base inline'>Missing ingredients:</p>
                        <p className='text-base sm:text-lg inline text-red-600 ml-2'>{
                            // Make sure comma doesnt get added on the last element
                            recipe.missedIngredients.map((ingredient, index) => ingredient.name.toLowerCase() + (index !== recipe.missedIngredients.length - 1 ? ", " : ""))
                        }</p>
                    </>
                    :
                        <p className='text-green-500'>All ingredients used</p>
                    )}
                    </div>
                </div>
                <div className='flex flex-row-reverse justify-end sm:justify-start sm:flex-col mt-6 flex-wrap'>
                    <div>
                        <div className='inline-block mr-4 mt-6'>
                            <i className="fa-solid fa-dollar-sign text-yellow-400 sm:fa-xl"></i>
                            {!info.cheap && <i className="fa-solid fa-dollar-sign text-yellow-400 sm:fa-xl"></i>}
                        </div>
                        <div className='mt-6 inline-block'>
                            <i className="fa-regular fa-clock sm:fa-xl mr-2"></i>
                            <p className='inline'>{info.readyInMinutes} mins</p>
                        </div>
                    </div>
                    <div className='mt-4 mb-2 sm:mb-0'>
                        <Button
                            text={"View recipe"}
                            href={info?.sourceUrl || "/notfound"}
                        >
                            <i className="fa-solid fa-arrow-up-right-from-square ml-2 fa-sm"></i> 
                        </Button>
                        {uuid && 
                            <button onClick={() => handleSave()} disabled={loading} className="text-blue-700">
                                {visuallySaved ?
                                    <i class="fa-solid fa-bookmark fa-2xl ml-4 mr-4"></i>
                                    :
                                    <i class="fa-regular fa-bookmark fa-2xl ml-4 mr-4"></i>
                                }
                            </button>
                        }
                    </div>
                </div>
            </div>
        </li>
    )
}
