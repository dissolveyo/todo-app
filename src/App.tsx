import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ToggleAll } from './components/ToggleAll/ToggleAll';
import { useLocalStorage } from './customHooks/useLocalStorage';
import { Todo } from './types/Todo';
import { filterByStatus } from './utils/helper';

export const App: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [query, setQuery] = useState('');
  const { filter = '' } = useParams();

  const handleToggleAll = (isTodosCompleted: boolean) => {
    setTodos(todos.map(todo => {
      return {
        ...todo,
        completed: !isTodosCompleted,
      };
    }));
  };

  const handleTodoUpdate = (todo: Todo, newValue: Partial<Todo>) => {
    const copyOfTodos = [...todos];
    const updatedTodoIndex = todos.findIndex(({ id }) => id === todo.id);

    copyOfTodos[updatedTodoIndex] = { ...todo, ...newValue };

    setTodos(copyOfTodos);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleTodoAdd = (todo: Todo) => {
    setTodos([...todos, todo]);
    setQuery('');
  };

  const handleTodoDelete = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(({ completed }) => !completed));
  };

  const completedTodosLength = todos
    .filter(({ completed }) => completed).length;
  const isTodosEmpty = !todos.length;
  const isTodosCompleted = completedTodosLength === todos.length;
  const notCompletedTodosLength = todos.length - completedTodosLength;
  const visibleArray = filterByStatus(filter, todos);

  return (
    <div className="todoapp">
      <Header
        inputValue={query}
        onInputChange={handleQueryChange}
        onFormSubmit={handleTodoAdd}
      />

      <section className="main">
        {!isTodosEmpty && (
          <ToggleAll
            isActive={isTodosCompleted}
            onToggle={handleToggleAll}
          />
        )}

        <TodoList
          todos={visibleArray}
          onTodoDelete={handleTodoDelete}
          onTodoUpdate={handleTodoUpdate}
        />
      </section>

      {!isTodosEmpty && (
        <Footer
          notCompletedTodos={notCompletedTodosLength}
          completedTodos={completedTodosLength}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};
