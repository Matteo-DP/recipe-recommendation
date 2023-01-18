import React, {useRef, useState} from 'react'
import styles from "../../styles/main.module.css"

export default function SettingsMenu({ isOpen, setIsOpen, setSearchSettings }) {
  
    const searchSpoonacularRef = useRef()
    const prioRanking1Ref = useRef()
    const prioRanking2Ref = useRef()
    const ignorePantryRef = useRef()
    const [response, setResponse] = useState("")
    const [settings, setSettings] = useState(undefined)

    const handleSubmit = (e) => {
        e.preventDefault()

        setResponse("")
        const config = {
            engine: {
                Spoonacular: searchSpoonacularRef.current.checked
            },
            ranking: {
                prioRanking1: prioRanking1Ref.current.checked,
                prioRanking2: prioRanking2Ref.current.checked
            },
            ignorePantry: ignorePantryRef.current.checked
        }
        setSettings(config) // Settings for this component
        setSearchSettings(config) // Settings passed to index page
        setResponse("Settings saved")
    }

    function check(condition, defaultValue) {
        if(condition === undefined) return defaultValue
        return condition
    }

    if(isOpen) return (
    <>
        <div className='fixed w-screen h-screen bg-black opacity-75 z-[9998]'
        onClick={() => setIsOpen(false)}
        ></div>
        <div className='fixed w-full min-h-[550px] h-[40vw] max-w-2xl lg:w-[60vw] ml-auto mr-auto left-0 right-0 top-[50%] translate-y-[-50%] bg-white z-[9999] border border-black shadow-inner rounded-xl p-6'>
        <button onClick={() => { setResponse(""); setIsOpen(false)}} className="fixed top-0 right-0 p-8">
            <i className="fa-solid fa-xmark fa-2xl"></i>
        </button>
        <h1 className='text-2xl mb-6 text-accent'>Advanced search options</h1>
        <form>
            <p className='text-xl mb-1 text-textlighter'>Search engine</p>
            <input className='mr-2' defaultChecked={check(settings?.engine.Spoonacular, true)} type="radio" id="spoonacularApi" value="spoonacularApi" ref={searchSpoonacularRef} name="engine" />
            <label htmlFor="spoonacularApi">Spoonacular API</label> <br />

            <p className='text-xl mt-6 mb-4 text-accent'>Preferences</p>

            <p className='text-lg mb-1 text-textlighter'>Ingredient prioritization</p>
            <input className='mr-2' defaultChecked={check(settings?.ranking.prioRanking1, true)} type="radio" id="ranking1" value="ranking1" ref={prioRanking1Ref} name="ranking" />
            <label htmlFor="ranking1">Maximize used ingredients first</label> <br />
            <input className='mr-2' defaultChecked={check(settings?.ranking.prioRanking2, false)} type="radio" id="ranking2" value="ranking2" ref={prioRanking2Ref} name="ranking" />
            <label htmlFor="ranking2">Minimize missing ingredients first</label> <br />

            <p className='text-lg mt-4 mb-1 text-textlighter'>Pantry items</p>
            <input className='mr-2' defaultChecked={check(settings?.ignorePantry, true)} type="checkbox" id="ignorePantry" value="ignorePantry" ref={ignorePantryRef} name="pantry" />
            <label htmlFor="ignorePantry">Ignore typical pantry items, such as water, salt, flour, etc.</label>
        </form>
        <button type='submit'
            className={`px-8 py-2 fixed bottom-3 left-4 bg-accent hover:bg-white hover:text-accent duration-75 ease-in text-white ${styles.innerShadow} rounded-xl`}
            onClick={(e) => handleSubmit(e)}
        >
            Save
        </button>
        {response && 
            <p className='px-8 py-1 text-white bg-green-500 fixed bottom-4 left-[125px] rounded-xl'>{response}</p>
        }
        </div>
    </>
    )
}
