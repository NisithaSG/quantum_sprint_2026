import { useMemo, useState } from 'react'
import './index.css'

const majors = [
  'Computer Science (BS)',
  'Information and Decision Sciences (BS)',
  'Bioengineering (BS)',
  'Architecture (BArch)',
  'Psychology (BA)',
]

export default function App() {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const normalizedQuery = query.trim().toLowerCase()

  const matches = useMemo(() => {
    if (!normalizedQuery) return []
    const filtered = majors.filter((major) =>
      major.toLowerCase().includes(normalizedQuery)
    )
    return filtered.sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()
      const aPrefix = aLower.startsWith(normalizedQuery)
      const bPrefix = bLower.startsWith(normalizedQuery)
      if (aPrefix !== bPrefix) return aPrefix ? -1 : 1
      return aLower.localeCompare(bLower)
    })
  }, [normalizedQuery])

  const highlightMatch = (text: string, term: string) => {
    const lowerText = text.toLowerCase()
    const lowerTerm = term.toLowerCase()
    const index = lowerText.indexOf(lowerTerm)
    if (index === -1 || !term) return text
    const before = text.slice(0, index)
    const match = text.slice(index, index + term.length)
    const after = text.slice(index + term.length)
    return (
      <>
        {before}
        <mark>{match}</mark>
        {after}
      </>
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % matches.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length)
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      setQuery(matches[activeIndex])
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setQuery('')
    }
  }

  return (
    <main className="page">
      <section className="hero" id="top">
        <div className="band band--top" aria-hidden="true" />
        <div className="hero__inner">
          <h1>UIC Flame Map</h1>
          <p className="lead">
            An organized visual for your degree at UIC. Explore every course and
            see prerequisites.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#flowchart">
              Create my Flowchart
            </a>
            <a className="btn btn--ghost" href="#learn">
              Learn More
            </a>
          </div>
        </div>
        <div className="band band--bottom" aria-hidden="true" />
      </section>

      <section className="section section--flow" id="flowchart">
        <div className="section__inner">
          <div className="section__header">
            <p className="eyebrow">Start Here</p>
            <h2>Choose Your Major</h2>
            <p className="section__lead">
              We'll load the courses and build your visual flowchart instantly.
            </p>
          </div>

          <div className="flow-card">
            <label htmlFor="major-search" className="field__label">
              Major or Program
            </label>
            <div className="field__row">
              <div className="search">
                <input
                  id="major-search"
                  name="major-search"
                  type="text"
                  placeholder="Search for a major"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {normalizedQuery.length > 0 && (
                  <div className="search__results">
                    {matches.length === 0 ? (
                      <span className="search__empty">
                        No matches yet. Try another keyword.
                      </span>
                    ) : (
                      matches.map((major, index) => (
                        <button
                          key={major}
                          className={`search__item${
                            index === activeIndex ? ' is-active' : ''
                          }`}
                          type="button"
                          onClick={() => setQuery(major)}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          {highlightMatch(major, query)}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <button className="btn btn--primary" type="button">
                Build My Map
              </button>
            </div>
            <p className="hint">
              Start typing to see suggested majors.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--learn" id="learn">
        <div className="section__inner">
          <div className="section__header">
            <p className="eyebrow">How It Works</p>
            <h2>From Catalog to Flowchart</h2>
            <p className="section__lead">
              We pull official UIC catalog data and map out prerequisites so you
              can plan semester by semester.
            </p>
          </div>

          <div className="steps">
            <article className="step">
              <h3>1. Pick Your Program</h3>
              <p>
                Select your degree or concentration.
              </p>
            </article>
            <article className="step">
              <h3>2. See the Graph</h3>
              <p>
                An interactive map that shows which courses unlock the next
                ones.
              </p>
            </article>
            <article className="step">
              <h3>3. Plan Your Path</h3>
              <p>
                Mark completed courses to highlight what is available next.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
