import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { Button, Accordion, Card, OverlayTrigger, Popover } from 'react-bootstrap'
import { useAuthenticate, itsMine, canModify } from '../../../Controllers/context/authenticate'
import { Loading, Error } from '../public/Printers.component'
import { useTranslation } from 'react-i18next'
import AccountsManager from '../public/Accounts.component'

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
        <style type='text/css'>{`
          .accordion-header {
            background-color: rgb(25,25,25);
          }
          .accordion-button {
            color: rgb(200,55,26);
            background-color: rgb(35,35,35);
          }
        `}</style>
        <h1><FontAwesomeIcon icon={faCogs}
                             size="xs"
                             color="blue"
                             className='mr-2'/>{t('admin.main.title')}</h1>
        <hr />
        <div id='accounts' class="bg-dark p-5 rounded-lg m-3">
          <h1>{t('admin.system.title')}</h1>
          <hr/>
          <Accordion flush>
            <Accordion.Item eventKey="0" arrow>
              <Accordion.Header>{t('nav_bar.user.list')}</Accordion.Header>
              <Accordion.Body>
                  <AccountsManager/>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Role Maybe ?</Accordion.Header>
              <Accordion.Body>
                  Hello! I'm another body
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
    </>)
}

export default Admin
