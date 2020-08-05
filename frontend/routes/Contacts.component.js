import React, { Component } from 'react';
var parse = require('html-react-parser');

class Contacts extends Component {
  state = { content: "" }

  componentDidMount() {
    console.log("did Mount contacts component");
    fetch('http://localhost:3000/template/contacts')
      .then(res => res.text())
      .then(html => { this.setState( {content: html}); } );
  }

  componentDidUpdate() {
    console.log("did Update contacts component");
    const callMessage = document.getElementById('send_message');
    callMessage.addEventListener("click", 
      () => {
        const contactForm = document.getElementById('message_contact');
        const displayStyle = contactForm.style.display;
        if (displayStyle === "none") {
          contactForm.setAttribute("style", "display: block;");
          callMessage.innerHTML = "Annulez l'envoi de message";
        } else {
          contactForm.setAttribute("style", "display: none;");
          callMessage.innerHTML = "Envoyez moi un message";
        }
    });
  }

  render() {
    return (
      <> 
          { 
          parse(this.state.content, 
            { htmlparser2: {
                xmlMode: true,
                lowerCaseAttributeNames: false,
                lowerCaseTags: false
              } 
            } ) 
        } 
      </>
    );
  }
}
export default Contacts;

