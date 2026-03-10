import { useState } from 'react';

function TodoList() {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState<string[]>([])

  const addTask = () => {
    if (task.trim() !==  "") {
      setTodos([...todos, task]);
      setTask(""); // Pulizia input
    }
  }
  return (
    <div style={{ padding: '20px' }}>
      <h2>Progettini secondari</h2>
      <input 
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder='Chi é?'/>
      
      <button onClick={addTask}>Aggiungi</button>
      <ul>
        {todos.map((item, index) => (
          <li key={index}>{item}</li>
        )
      )}
      </ul>
    </div>
  );
}

export default TodoList