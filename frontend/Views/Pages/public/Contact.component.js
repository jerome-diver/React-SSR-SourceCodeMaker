import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, Card, Col, Row, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointRight, faPaperPlane, faEnvelope, faPen, faEnvelopeOpen, faPhone } from '@fortawesome/free-solid-svg-icons'

const FormContact = (props) => {

  let [clientType, setClientType] = useState('individual')

  useEffect( () => {
  }, [setClientType])

  const switchClientType = () => {
    const types = document.querySelectorAll('input[name="clientType')
    for (const type of types) { if (type.checked) { setClientType(type.value); break; } }
    
  }

  return (
      <> <Form>
        <Form.Row>
          <Form.Group as={Col} controlId='formFamilyName'>
            <Form.Label>{props.fname}</Form.Label>
            <Form.Control type='text' placeholder='family name'/>
          </Form.Group>
          <Form.Group as={Col} controlId='formSecondName'>
            <Form.Label>{props.sname}</Form.Label>
            <Form.Control type='text' placeholder='second name'/>
          </Form.Group>
        </Form.Row>
        <Form.Group as={Row} controlId='formTypeClient'>
          <Form.Label as='legend' column sm={4}>Vous êtes...</Form.Label>
          <Col sm={8}>
            <Form.Check type='radio' label='un particulier' name='clientType' value="individual" id='individual' onClick={ switchClientType }/> 
            <Form.Check type='radio' label='une entreprise' name='clientType' value="enterprise" id='enterprise' onClick={ switchClientType }/> 
          </Col>
        </Form.Group>
        { (clientType === 'enterprise') &&
          <Form.Group controlId='formEnterpriseName'>
          <Form.Label>Nom d'entreprise</Form.Label>
          <Form.Control type='text' placeholder='enterpise name'/>
        </Form.Group> }
        <Form.Group controlId='formPhone'>
          <Form.Label><FontAwesomeIcon icon={faPhone}/> Numéro de téléphone</Form.Label>
          <Form.Control type='phone' placeholder='phone number'/>
        </Form.Group>
        <Form.Group controlId='formEmail'>
          <Form.Label><FontAwesomeIcon icon={faEnvelope}/> {props.email}</Form.Label>
          <Form.Control type='text' placeholder='email'/>
        </Form.Group>
        <Form.Group controlId='formMessage'>
          <Form.Label><FontAwesomeIcon icon={faPen}/> {props.message}</Form.Label>
          <Form.Control as='textarea' rows='3' placeholder='your message'/>
        </Form.Group>
      </Form> </>
  )
}

const Contact = (props) => {
  
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

export default Contact
