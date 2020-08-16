import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, Card, Col, Row, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointRight, faPaperPlane, faEnvelope, faPen, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'

const FormContact = (props) => {
  const family_name = props.fname
  const second_name = props.sname
  const email = props.email
  const message = props.message

  return (
      <> <Form>
        <Form.Row>
          <Form.Group as={Col} controlId='formFamilyName'>
            <Form.Label>{family_name}</Form.Label>
            <Form.Control type='text' placeholder='family name'/>
          </Form.Group>
          <Form.Group as={Col} controlId='formSecondName'>
            <Form.Label>{second_name}</Form.Label>
            <Form.Control type='text' placeholder='second name'/>
          </Form.Group>
        </Form.Row>
        <Form.Group as={Row} controlId='formTypeClient'>
          <Form.Label as='legend' column sm={4}>Vous êtes...</Form.Label>
          <Col sm={8}>
            <Form.Check type='radio' label='un particulier' name='clientType' id='particulier'/> 
            <Form.Check type='radio' label='une entreprise' name='clientType' id='entreprise'/> 
          </Col>
        </Form.Group>
        <Form.Group controlId='formEmail'>
          <Form.Label><FontAwesomeIcon icon={faEnvelope}/> {email}</Form.Label>
          <Form.Control type='text' placeholder='email'/>
        </Form.Group>
        <Form.Group controlId='formMessage'>
          <Form.Label><FontAwesomeIcon icon={faPen}/> {message}</Form.Label>
          <Form.Control as='textarea' rows='3' placeholder='your message'/>
        </Form.Group>
      </Form> </>
  )
}

const Contacts = (props) => {
  
  let [show, setShow] = useState(false)   // show modal dialog form to send message
  let [data, setData] = useState({})      // get server JSON content of in charge user's coordinates
  let [load, setLoad] = useState(false)   // load spinner to wait page get data

  useEffect( () =>{   // get HTML content from Pug contacts template
    console.log("did Mount contacts component")
    fetch('http://localhost:3000/template/contact')
      .then(res => res.json())
      .then(data => { setData( data ); setLoad(true); } )
  }, [] )

  const handleClose = () => { setShow( false ) }
  const openForm = () => { setShow( true ) }

  if (load) {
    return (
      <>
        <Card id='contact'>
          <Card.Body>
            <Card.Title>Contact</Card.Title>
            <Card.Text>{data.fname} {data.sname}</Card.Text>
            <Card.Text>{data.address_road}</Card.Text>
            <Card.Text>{data.address_CP} {data.address_city}, {data.address_country}</Card.Text>
            <Card.Text>SIRET: {data.enterprise_SIRET}</Card.Text>
            <Card.Link>
                <Button onClick={openForm}><FontAwesomeIcon icon={ faEnvelopeOpen } /> {data.caption}</Button>
            </Card.Link>
          </Card.Body>
        </Card>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon={faHandPointRight}/> Contact me by anyway...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormContact fname={data.f_fname} 
                        sname={data.f_sname} 
                        email={data.f_email} 
                        message={data.f_message}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleClose}>Cancel</Button>
            <Button type='submit'><FontAwesomeIcon icon={faPaperPlane}/>{data.f_submit}</Button>
          </Modal.Footer>
        </Modal> 
      </> 
    )
  } else {
      return (
          <>
            <Alert variant='info'>
                <Spinner animation='border' role='status'/>
                <p>Loading...</p>
            </Alert>
          </>
      )
  }
}

export default Contacts
