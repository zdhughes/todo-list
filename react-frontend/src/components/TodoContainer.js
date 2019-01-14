import React, { Component } from 'react';
import axios from 'axios';
import update from 'immutability-helper';

class TodoContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      inputTodo: ''
    }
  }

  getTodos() {
    axios.get('/api/v1/todos')
    .then(response => {
      this.setState({todos: response.data})
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getTodos()
  }

  createTodo = (e) => {
    if (e.key === 'Enter') {
      axios.post('/api/v1/todos', {todo: {title: e.target.value}})
      .then(response => {
        console.log(response.data)
        const todos = update(this.state.todos, {
          $splice: [[0, 0, response.data]]
        })
        this.setState({
          todos: todos,
          inputTodo: ''
        })
      })
      .catch(error => console.log(error))
    }
  }

  handleTodoInputChange = (e) => {
    this.setState({inputTodo: e.target.value});
  }

  updateTodo = (e, id) => {
    axios.put(`/api/v1/todos/${id}`, {todo: {done: e.target.checked}})
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === response.data.id)
      const todos = update(this.state.todos, {
        [todoIndex]: {$set: response.data}
      })
      this.setState({
        todos: todos
      })
    })
    .catch(error => console.log(error))
  }

  deleteTodo = (id) => {
    axios.delete(`/api/v1/todos/${id}`)
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === id)
      const todos = update(this.state.todos, {
        $splice: [[todoIndex, 1]]
      })
      this.setState({
        todos: todos
      })
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        <div className="inputContainer">
          <input className="taskInput" type="text"
            placeholder="Add a task" maxLength="50"
            onKeyPress={this.createTodo}
            value={this.state.inputTodo}
            onChange={this.handleTodoInputChange} />
        </div>
	      <div className="listWrapper">
	       <ul className="taskList">
		       {this.state.todos.map((todo) => {
             return(
               <li className="task" todo={todo} key={todo.id}>
			            <input className="taskCheckbox"
                    type="checkbox"
                    checked={todo.done}
                    onChange={(e) => this.updateTodo(e, todo.id)} />
			            <label className="taskLabel">{todo.title}</label>
			            <span className="deleteTaskBtn" onClick={(e) => this.deleteTodo(todo.id)}>Delete</span>
		           </li>
		           )
		           })}
	             </ul>
	      </div>
        </div>
    )
  }
}

export default TodoContainer
