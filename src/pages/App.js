import React, { Component } from 'react';
import "../css/App.css"
import "../css/zettagame.css"

class App extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default App;