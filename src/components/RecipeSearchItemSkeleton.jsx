import React from 'react'

export default function RecipeSearchItem() {
 
    return (
        <div className='flex flex-row gap-4 py-3'>
            <div className='h-[300px] w-[300px] bg-bglight animate-pulse rounded-xl'></div>
            <div className='flex flex-col justify-between'>
                <div>
                    <div className='w-64 h-6 rounded-xl bg-bglight animate-pulse mb-2'></div>
                    <div className='w-12 h-4 bg-bglight animate-pulse rounded-xl inline-block mr-2'></div>
                    <div className='w-12 h-4 bg-bglight animate-pulse rounded-xl inline-block'></div>
                    <div className='w-72 bg-bglight animate-pulse rounded-xl h-2 mt-8'></div>
                </div>
                <div className='w-32 h-8 rounded-xl bg-bglight animate-pulse'></div>
            </div>
        </div>
    )
}
