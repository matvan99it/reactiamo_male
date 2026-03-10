import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Lista di files
const projectsFiles = import.meta.glob('./projects/*.tsx', {eager: true})

// Array di objects
const projects = Object.keys(projectsFiles).map((path) => {
  const name = path.split('/').pop()?.replace('.tsx', '') || 'Unknown'
  const Component = (projectsFiles[path] as any).default

  return {
    name, 
    path: `/${name.toLowerCase()}`,
    Component
  }
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>{projects.map((proj) => (
      <h3>{proj.name} - {proj.path} - {proj.Component}</h3>
    ))}</div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Router>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', padding: '10px' }}>
        <Link style={{ margin: '10px' }} to="/">Home</Link>
        {projects.map((proj) => (
            <Link to={proj.path} style={{ margin: '10px'}}>
              {proj.name}
            </Link>
          )
        )}
      </nav>

      <Routes>
        <Route path="/" element={
          <div>
            <h1>Dashboard Progetti React</h1>
            <p>Seleziona un test dal menu sopra.</p>
          </div>
        } />
        {projects.map((proj) => (
        <Route 
            key={proj.path} 
            path={proj.path} 
            element={<proj.Component />} 
          />
        ))}
      </Routes>
    </Router>
    </>
    
  )
}

export default App
