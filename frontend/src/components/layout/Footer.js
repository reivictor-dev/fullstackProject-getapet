import React from 'react'

import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>
                <span className='bold'>Get a Pet</span> &copy; 2023
            </p>
        </footer>
    )
}
