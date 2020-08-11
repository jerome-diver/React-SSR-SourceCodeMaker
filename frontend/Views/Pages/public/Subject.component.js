import React, { Component } from 'react';

class Subject extends Component {
  state = {}
  render() {
    return ( 
      <div>Subject content page {this.props.match.params.index}</div>
    );
  }
}
export default Subject;
