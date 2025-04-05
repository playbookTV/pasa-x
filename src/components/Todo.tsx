import React, { useState } from 'react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  phase: number;
}

export const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    // Phase 1: Project Setup, UI Scaffolding
    { id: 1, text: 'Setup Vite with React + TypeScript', completed: true, phase: 1 },
    { id: 2, text: 'Configure Tailwind CSS', completed: true, phase: 1 },
    { id: 3, text: 'Create component structure', completed: true, phase: 1 },
    { id: 4, text: 'Setup Chrome extension manifest', completed: true, phase: 1 },
    { id: 5, text: 'Create background script', completed: true, phase: 1 },
    { id: 6, text: 'Create content script', completed: true, phase: 1 },
    { id: 7, text: 'Create popup entry point', completed: true, phase: 1 },
    
    // Phase 2: Resume Analyzer + Upload
    { id: 8, text: 'Implement resume upload functionality', completed: false, phase: 2 },
    { id: 9, text: 'Connect to OpenAI for resume analysis', completed: false, phase: 2 },
    { id: 10, text: 'Create resume score display', completed: false, phase: 2 },
    
    // Phase 3: Cover Letter Generator + Storage
    { id: 11, text: 'Implement cover letter generation UI', completed: false, phase: 3 },
    { id: 12, text: 'Connect to OpenAI for cover letter generation', completed: false, phase: 3 },
    { id: 13, text: 'Add cover letter storage and retrieval', completed: false, phase: 3 },
    
    // Phase 4: Autofill on Job Boards
    { id: 14, text: 'Implement form detection on job boards', completed: false, phase: 4 },
    { id: 15, text: 'Create autofill functionality', completed: false, phase: 4 },
    { id: 16, text: 'Test autofill on major job sites', completed: false, phase: 4 },
    
    // Phase 5: Stripe Integration + Tiers
    { id: 17, text: 'Setup Stripe subscription tiers', completed: false, phase: 5 },
    { id: 18, text: 'Create upgrade flow', completed: false, phase: 5 },
    { id: 19, text: 'Implement feature locking based on subscription', completed: false, phase: 5 },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = (text: string, phase: number) => {
    const newId = Math.max(...todos.map(todo => todo.id), 0) + 1;
    setTodos([...todos, { id: newId, text, completed: false, phase }]);
  };

  // Group todos by phase
  const todosByPhase = todos.reduce<Record<number, TodoItem[]>>((acc, todo) => {
    if (!acc[todo.phase]) {
      acc[todo.phase] = [];
    }
    acc[todo.phase].push(todo);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Pasa Development Todos</h2>
      
      {Object.entries(todosByPhase).map(([phase, phaseTodos]) => (
        <div key={phase} className="mb-6">
          <h3 className="font-semibold text-indigo-600 mb-2">
            Phase {phase}: {getPhaseTitle(Number(phase))}
          </h3>
          <ul className="space-y-2">
            {phaseTodos.map(todo => (
              <li key={todo.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Helper function to get phase titles
function getPhaseTitle(phase: number): string {
  switch (phase) {
    case 1: return 'Project Setup, UI Scaffolding';
    case 2: return 'Resume Analyzer + Upload';
    case 3: return 'Cover Letter Generator + Storage';
    case 4: return 'Autofill on Job Boards';
    case 5: return 'Stripe Integration + Tiers';
    default: return 'Unknown Phase';
  }
} 