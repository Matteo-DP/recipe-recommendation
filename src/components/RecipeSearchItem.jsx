import React from 'react'
import Image from 'next/image'

export default function RecipeSearchItem({ recipe }) {

    return (
        <div className='bg-bglight m-4 rounded-xl flex flex-row gap-4'>
            <Image alt={recipe.title} src={recipe.image + "?w=100&h=100"} width={100} height={100} className="rounded-l-xl" />
            <div className='my-4'>
                <h1>{recipe.title}</h1>
            </div>
        </div>
    )
}
