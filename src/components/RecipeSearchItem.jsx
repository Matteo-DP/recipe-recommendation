import React from 'react'
import Image from 'next/image'

export default function RecipeSearchItem({ recipe, info }) {

    const tags = {
        dairyFree: "Dairy free",
        glutenFree: "Gluten free",
        ketogenic: "Ketogenic",
        sustainable: "Sustainable",
        vegan: "Vegan",
        vegetarian: "Vegetarian",
        veryHealthy: "Heatlhy"
    }
 
    return (
        <div className='flex flex-row gap-4 py-3'>
            <Image alt={recipe.title} src={recipe.image} width={300} height={300} className="rounded-l-xl object-cover" />
            <div className='flex flex-col justify-around'>
                <div>
                    <h1 className='text-2xl font-medium mb-2'>{recipe.title}</h1>
                    {/* If the spoonacular score exists, show it */}
                    {info?.spoonacularScore && <p className='text-green-500 text-xl inline mr-4'>{info.spoonacularScore}/100</p>}
                    {/* Map tags */}
                    <div className='flex flex-row justify-start gap-2 mb-2'>
                        {Object.keys(tags).map((key) =>
                            info?.[key] && <p key={key} className='text-accent border-accent border-2 px-4 py-1 inline rounded-2xl'>{tags[key]}</p>
                        )}
                    </div>
                    <div>
                    {recipe.missedIngredientCount !== 0 ?
                    <>
                        <p className='text-lg inline'>Missing ingredients:</p>
                        <p className='inline text-lg text-red-600 ml-2'>{
                            // Make sure comma doesnt get added on the last element
                            recipe.missedIngredients.map((ingredient, index) => ingredient.name + (index !== recipe.missedIngredients.length - 1 ? ", " : ""))
                        }</p>
                    </>
                    :
                        <p className='text-green-500'>All ingredients used</p>
                    }
                    </div>
                </div>
                <div>
                    <div className='inline-block mr-4 mt-6'>
                        <i className="fa-solid fa-dollar-sign text-yellow-400 fa-xl"></i>
                        {!info.cheap && <i className="fa-solid fa-dollar-sign text-yellow-400 fa-xl"></i>}
                    </div>
                    <div className='mt-6 inline-block'>
                        <i className="fa-regular fa-clock fa-xl mr-2"></i>
                        <p className='inline'>{info.readyInMinutes} mins</p>
                    </div>
                    <div className='mt-4'>
                        <a className='bg-accent text-white text-lg px-12 py-2 rounded-2xl hover:text-black ease-in-out duration-75'
                            href={recipe.sourceUrl}
                        >
                            View recipe
                            <i class="fa-solid fa-arrow-up-right-from-square ml-2 fa-sm"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
