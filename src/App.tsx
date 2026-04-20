import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import './App.css'

type TerminalLine = {
  id: number
  content: string
}

const WELCOME_TEXT =
  'Booting jan-ghijsens-portfolio...\nType "help" to list available commands.'

const COMMAND_RESPONSES: Record<string, string[]> = {
  whoami: [
    'Jan Ghijsens',
    'Student Toegepaste Informatica at PXL with a strong interest in modern web and backend development.',
  ],
  skills: ['React', 'TypeScript', '.NET Core'],
  education: [
    'PXL Hogeschool',
    'Bachelor Toegepaste Informatica',
    'Focus: software engineering, problem solving, and practical project work.',
  ],
  experience: [
    'International internship at FrostBit Software Lab, Rovaniemi, Finland.',
    'Hands-on collaboration in an international software environment.',
  ],
  activities: [
    'DDD innovatieroute',
    'Hack The Future hackathon',
    'International internship in Finland',
  ],
  help: [
    'Available commands:',
    'whoami',
    'skills',
    'education',
    'experience',
    'activities',
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
        <p>GitHub: github.com/JanGhijsensPXL</p>
        <p className="muted">Use terminal commands to explore.</p>
      </aside>
    </main>
  )
}

export default App
