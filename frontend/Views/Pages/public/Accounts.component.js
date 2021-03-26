import React, { useState, useEffect } from 'react'
import { list } from '../../../Controllers/user/action-CRUD'
import { Jumbotron, ListGroup, Badge } from 'react-bootstrap'
import { colorType } from '../../helpers/config'
import { useTranslation } from 'react-i18next'
import { Loading, Error } from './Printers.component'
import '../../../stylesheet/users.sass'
import { ChevronDoubleRight } from 'react-bootstrap-icons'

const Account = ({ account }) => {
    const { t } = useTranslation()
  //  const promote = user.role.color
    return (
        <ListGroup.Item id={account.user.id}>
          <h4>{account.user.username} <Badge pill variant={account.role.color}>{account.role.name}</Badge></h4>
          <hr/>
          <table cellPadding='5' cellSpacing='5'>
            <tbody>
              <tr>
                  <td>{t('profile.email.label')}:</td>
                  <td>{account.user.email}</td>
              </tr>
              <tr>
                  <td>{t('profile.first_name.label')}:</td>
                  <td>{account.user.first_name}</td>
              </tr>
              <tr>
                  <td>{t('profile.second_name.label')}:</td>
                  <td>{account.user.second_name}</td>
              </tr>
            </tbody>
          </table>
        </ListGroup.Item>
    )
}

const Accounts = () => {
    const { t } = useTranslation()
    const [accounts, setAccounts] = useState([])       // list data from mongodb accounts server collection
    const [loading, setLoading] = useState(true) // false: not loading (finished or not started), true: loading
    const [error, setError] = useState('')       // error loading accounts report text
  
    useEffect( () => {
        const abort = new AbortController()     // stop to fetch a request if we cancel this page
        list(abort.signal)
            .then(data =>   { setAccounts(data) })
            .catch(error => { setError(error) })
            .finally(() =>  { setLoading(false) })
        return function cleanup() { abort.abort() }
    }, [] )
  
    if (loading) { return <><Loading /></> }
    else if (error != '') {
        return ( <Error title={t('error:accounts.list.failed')} 
                        name={error.name} 
                        message={error.message} /> )
    } else {
        return (
            <Jumbotron fluid id="accounts">
                <h1>{t('nav_bar.user.list')}</h1>    
                <ListGroup>
                    {accounts.map( (account, index) => { return ( <Account account={account} key={index}/> ) } ) }
                </ListGroup>
            </Jumbotron>
        )
    }
}

export default Accounts