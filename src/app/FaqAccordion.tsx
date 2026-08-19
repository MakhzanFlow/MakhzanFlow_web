'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './FaqAccordion.module.css'

type FaqItem = {
  q: string
  a: string
}

type FaqAccordionProps = {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0)

  function toggleItem(index: number) {
    setOpenIndex((current) => (current === index ? -1 : index))
  }

  return (
    <div className={`${styles.faqWrap} reveal`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const answerId = `faq-answer-${index}`

        return (
          <article key={item.q} className={`${styles.faqItem} ${isOpen ? styles.open : ''} reveal`} style={{ '--d': `${index * 0.06}s` } as CSSProperties}>
            <button
              type="button"
              className={styles.faqQ}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggleItem(index)}
            >
              {item.q}
              <span className={styles.ic}>
                <svg><use href="#i-chev" /></svg>
              </span>
            </button>
            <div id={answerId} className={styles.faqA}>
              <div className={styles.faqAInner}>
                <p>{item.a}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
