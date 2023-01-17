import React from 'react'
import styles from "../../styles/main.module.css"

export default function Button({ text, href }) {

    return (
        <a className={`bg-accent text-white px-16 py-2 rounded-2xl hover:text-accent hover:bg-white ease-in-out duration-75 ${styles.innerShadow}`}
        href={href} target="_blank" rel="noreferrer"
        >
            { text }
        </a>
    )
}
