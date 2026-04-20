import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import './App.css'

type TerminalLine = {
  id: number
  content: string
}

const WELCOME_TEXT =
  'Booting jan-ghijsens-portfolio...\nType "help" to list available commands. Try "portfolio" for a full overview.'

const COMMAND_RESPONSES: Record<string, string[]> = {
  whoami: [
    'Jan Ghijsens - Student Toegepaste Informatica at PXL.',
    'Interests: software, games, systems thinking, and practical problem solving.',
    'Strong collaboration style with a pragmatic, solution-driven mindset.',
  ],
  skills: [
    'Core technologies: React, TypeScript, .NET Core',
    'Also practiced: Node.js, API testing (Postman), data concepts, DDD patterns.',
  ],
  education: [
    'PXL Hogeschool',
    'Bachelor Toegepaste Informatica',
    'Focus: software engineering, team projects, and practical implementation.',
  ],
  experience: [
    'International internship at FrostBit Software Lab, Rovaniemi, Finland.',
    'Project: Towards a Paperless Reindeer Husbandry application.',
    'Frontend development in React + TypeScript with a .NET Core backend context.',
  ],
  activities: [
    'Selected activities:',
    '- Innovatieroute Domain Driven Design (Oct 2025)',
    '- Hack The Future hackathon - Aquatopia challenge (Nov 2025)',
    '- International internship in Finland (Feb-May 2026)',
    'Use: ddd | hackathon | internship | reflection for details.',
  ],
  portfolio: [
    'Portfolio structure loaded:',
    '1) Voorstelling',
    '2) Overzicht activiteiten (seminaries, innovatie, POP, internationalisering)',
    '3) Selectie: DDD route, Hack The Future, internationale stage',
    '4) Eindreflectie',
    'Use: seminaries | ddd | hackathon | internship | reflection | xfactor',
  ],
  seminaries: [
    'Seminaries followed (selection):',
    '- Rendering 3D in Web',
    '- CQRS with MediatR',
    '- Code Katas',
    '- AI Wizards',
    '- The Challenge of Open Source',
    '- BDD & ATDD',
    '- Postman AI',
    '- Datawarehousing in Microsoft Fabric',
    '- De wereld van (Enterprise) UX',
    '- Cegeka Open Source',
  ],
  ddd: [
    'Innovatieroute: Domain Driven Design (3 sessions, Oct 2025).',
    'Topics: Event Storming, Domain Events, Aggregates, Value Objects.',
    'Architecture concepts: Onion, Hexagonal, bounded communication.',
    'Main learning: better domain analysis before coding saves time later.',
  ],
  hackathon: [
    'Hack The Future - Challenge 111: "Duiken in een nieuwe dimensie".',
    'Location: Flanders Meeting & Convention Center, Antwerp Zoo.',
    'Built: prototype web app around an aquatopia/fish monitoring concept.',
    'Reflection: technically solid result, but creativity can be pushed further.',
  ],
  internship: [
    'International internship at FrostBit Software Lab (Lapland UAS).',
    'Period: 23 Feb 2026 - 29 May 2026 (about 532h).',
    'Work: frontend features, reporting, data visualisation, reliability of user input.',
    'Bachelor thesis context: compare validation strategies to reduce input errors.',
  ],
  reflection: [
    'End reflection highlights:',
    '- Significant personal growth after earlier study setbacks.',
    '- Better balance between quick implementation and prior analysis.',
    '- Stronger confidence from working independently in an international setting.',
    '- Career direction: software developer, building practical solutions with impact.',
  ],
  xfactor: [
    'PXL X-factor alignment (self-reflection):',
    '- International collaboration: strong (Finland internship).',
    '- Disciplinary + multidisciplinary: strong (development + research blend).',
    '- Entrepreneurial/innovative: visible in extra activities and challenges.',
    '- Passion/empathy: present in project motivation and team contribution.',
  ],
  help: [
    'Available commands:',
    'whoami',
    'skills',
    'education',
    'experience',
    'activities',
    'portfolio',
    'seminaries',
    'ddd',
    'hackathon',
    'internship',
    'reflection',
    'xfactor',
    'github',
    'help',
    'clear',
  ],
  github: ['https://github.com/JanGhijsensPXL'],
}

function App() {
  const [typedWelcome, setTypedWelcome] = useState('')
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])

  const commandHistory = useRef<string[]>([])
  const nextLineId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const availableCommands = useMemo(() => Object.keys(COMMAND_RESPONSES), [])

  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTypedWelcome(WELCOME_TEXT.slice(0, index))
      if (index >= WELCOME_TEXT.length) {
        window.clearInterval(timer)
      }
    }, 22)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [terminalLines, typedWelcome])

  const appendOutput = (lines: string[]) => {
    setTerminalLines((currentLines) => {
      const newLines = lines.map((line) => ({
        id: nextLineId.current++,
        content: line,
      }))
      return [...currentLines, ...newLines]
    })
  }

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase()

    if (!command) {
      return
    }

    appendOutput([`guest@portfolio:~$ ${command}`])

    if (command === 'clear') {
      setTerminalLines([])
      return
    }

    const response = COMMAND_RESPONSES[command]
    if (response) {
      appendOutput(response)
      return
    }

    appendOutput([
      `Command not found: ${command}`,
      'Type "help" to list available commands.',
    ])
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const command = input.trim()

    if (!command) {
      return
    }

    commandHistory.current.push(command)
    runCommand(command)
    setInput('')
    setHistoryIndex(null)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (commandHistory.current.length === 0) {
        return
      }

      const nextIndex =
        historyIndex === null
          ? commandHistory.current.length - 1
          : Math.max(0, historyIndex - 1)

      setHistoryIndex(nextIndex)
      setInput(commandHistory.current[nextIndex])
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (commandHistory.current.length === 0 || historyIndex === null) {
        return
      }

      if (historyIndex >= commandHistory.current.length - 1) {
        setHistoryIndex(null)
        setInput('')
        return
      }

      const nextIndex = historyIndex + 1
      setHistoryIndex(nextIndex)
      setInput(commandHistory.current[nextIndex])
    }
  }

  return (
    <main className="terminal-page">
      <section className="terminal-window" onClick={() => inputRef.current?.focus()}>
        <header className="terminal-header">
          <div className="dots" aria-hidden="true">
            <span className="dot red"></span>
            <span className="dot amber"></span>
            <span className="dot green"></span>
          </div>
          <p className="title">jan@portfolio-terminal</p>
        </header>

        <div className="terminal-body" role="log" aria-live="polite">
          <p className="line welcome">{typedWelcome || ' '}</p>

          {terminalLines.map((line) => (
            <p key={line.id} className="line">
              {line.content}
            </p>
          ))}

          <form className="prompt" onSubmit={onSubmit}>
            <label htmlFor="command" className="line">
              guest@portfolio:~$
            </label>
            <input
              ref={inputRef}
              id="command"
              className="terminal-input"
              autoComplete="off"
              spellCheck={false}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal command input"
            />
          </form>

          <p className="line hint">Try: {availableCommands.join(' | ')}</p>
          <div ref={bottomRef}></div>
        </div>
      </section>

      <aside className="info-panel">
        <h1>Jan Ghijsens</h1>
        <p>Student Toegepaste Informatica at PXL</p>
        <p>International internship at FrostBit Software Lab, Rovaniemi Finland</p>
        <p>Focus: software engineering, collaboration, and practical impact</p>
        <p>GitHub: github.com/JanGhijsensPXL</p>
        <p className="muted">Start with: portfolio, activities, or reflection.</p>
      </aside>
    </main>
  )
}

export default App
