import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { Button, Jumbotron, Accordion, Card, OverlayTrigger, Popover } from 'react-bootstrap'
import { useAuthenticate, itsMine, canModify } from '../../../Controllers/context/authenticate'
import { Loading, Error } from '../public/Printers.component'
import { useTranslation } from 'react-i18next'
import Accounts from '../public/Accounts.component'

const Admin = (props) => {
    const { t } = useTranslation()
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({})

    useEffect( () => {
        console.log("--- Admin component useEffect entry point")
        setLoading(false)
    }, [] )

    if (loading) { return <Loading /> }
    if (error.name) return (
         <Error title={t('error:admin.main.failed')} 
                name={error.name} 
                message={error.message} /> )
    return (<>
        <h1><FontAwesomeIcon icon={faCogs}
                             size="xs"
                             color="blue"
                             className='mr-2'/>{t('admin.main.title')}</h1>
        <hr />
        <Jumbotron fluid id="accounts" fluid>
          <h2>{t('admin.system.title')}</h2>
          <hr/>
          <Accordion>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  {t('nav_bar.user.list')}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body><Accounts/></Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                  Role maybe ?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>Hello! I'm another body</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Jumbotron>
    </>)
}

export default Admin
