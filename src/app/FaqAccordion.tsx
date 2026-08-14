'use client'

import { useState } from 'react'
import styles from './FaqAccordion.module.css'

type FaqItem = {
  q: string
  a: string
}

type FaqAccordionProps = {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set())

  function toggleItem(index: number) {
    setOpenItems((current) => {
      const next = new Set(current)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className={`${styles.faqList} reveal-child`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index)
        const answerId = `faq-answer-${index}`

        return (
          <div key={item.q} className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
            <button
              type="button"
              className={styles.faqQuestion}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggleItem(index)}
            >
              {item.q}
            </button>
            <div id={answerId} className={styles.faqAnswer}>
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
