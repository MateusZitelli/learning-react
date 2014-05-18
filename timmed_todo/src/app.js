/**
* @jsx React.DOM
*/

var todos = [
  {name: "Programar", duration:5},
  {name: "Fazer funfar", duration:90}
];

var Todo = React.createClass({
  getInitialState: function() {
    return {remainTime: this.props.duration, paused: true, ended: false};
  },
  resetTimer: function() {
    this.setState({remainTime: this.props.duration});
  },
  pause: function(){
    if(this.interval){
      clearInterval(this.interval);
      this.interval = null;
      this.setState({paused: true});
    }
  },
  onClick: function() {
    var _this = this;
    this.props.pauseTodos();
    if(!this.state.paused) {
      this.pause();
    } else {
      this.interval = setInterval(function(){
        var remainTime = _this.state.remainTime;
        _this.setState({remainTime: remainTime - 1});
        if(_this.state.remainTime === 0) {
          clearInterval(_this.interval);
          setTimeout(_this.resetTimer, 1000);
          _this.setState({paused: true});
        }
      }, 1000);
    }
    this.setState({paused: !this.state.paused});
  },

  render: function() {
    var timeStampToString = function(stamp) {
      var hours = Math.floor(stamp / 3600);
      var minutes = Math.floor(stamp % 3600 / 60);
      var secounds = stamp % 60;
      return hours + ":" + minutes + ":" + secounds;
    };

    var buttonText = this.state.paused ? 'Play': 'Pause';

    return(
      <div className="todo">
        <h2>{this.props.name}</h2>
        <p>{timeStampToString(this.state.remainTime)}</p>
        <button ref="playPause" onClick={this.onClick}>{buttonText}</button>
      </div>
    );
  }
});

var TodoList = React.createClass({
  pauseTodos: function(){
    for(var i=0;i < this.props.todos.length; i++) {
      this.refs['todo'+i].pause();
    }
  },
  render: function() {
    var _this = this;
    this.todos = this.props.todos.map(function(item, i){
      return(
        <Todo ref={'todo'+i} name={item.name} pauseTodos={_this.pauseTodos} duration={item.duration}/>
      );
    });

    return(
      <div className="todoList">
        {this.todos}
      </div>
    );
  }
});

var TodoForm = React.createClass({
  onSubmit: function(e) {
    e.preventDefault();
    var name = this.refs.name.getDOMNode().value;
    var timeInput = this.refs.timepicker.getDOMNode().value.split(':');
    var hours = parseInt(timeInput[0]);
    var minutes = parseInt(timeInput[1]);
    var timeInSecounds = hours * 3600 + minutes * 60;
    var newTodo = {name: name, duration: timeInSecounds};
    this.refs.name.getDOMNode().value = '';
    this.refs.timepicker.getDOMNode().value = '';
    this.props.createTodo(newTodo);
  },
  componentDidMount: function(){
    $(this.refs.timepicker.getDOMNode()).clockpicker({
      donetext: "Pronto",
      default: "0:50"
    });
  },
  render: function() {
    return(
      <form className="todoForm" onSubmit={this.onSubmit}>
        <input type="text" ref="name" placeholder="Atividade"></input>
        <input type="text" ref="timepicker" placeholder="Duração"></input>
        <input value="Criar" type="submit"></input>
      </form>
    );
  }
});

var TodoBox = React.createClass({
  getInitialState: function(){
    return {todos: todos};
  },
  createTodo: function(todo){
    var todos = this.state.todos;
    todos.push(todo);
    this.setState({todos: todos});
  },
  render: function() {
    return(
      <div className="todoList">
        <h1>Meus TODOs</h1>
        <TodoList todos={this.state.todos}/>
        <TodoForm createTodo={this.createTodo}/>
      </div>
    );
  }
});

React.renderComponent(
  <TodoBox todos={todos}/>,
  document.getElementById('content')
);
