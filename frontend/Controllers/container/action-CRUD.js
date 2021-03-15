/* CRUD for container collection to call from server API
   at /api/containers address */

import { TAG, HOST, SERVER_PORT } from '../../Views/helpers/config'
const host = TAG + HOST + ":" + SERVER_PORT

const giveMe = (url, successCBK, failedCBK, finalCBK) => {
    fetch(url)
        .then( response => response.json() )
        .then( response => successCBK(response) )
        .catch( error => failedCBK( { state: true, content: error } ) )
        .finally( () => finalCBK(false) )
}

const getContainer = (id, successCBK, failedCBK, finalCBK) => {
    const url = host + '/api/containers' + id
    giveMe(url, successCBK, failedCBK, finalCBK)
}

const getChildrenContainersOf = (id, successCBK, failedCBK, finalCBK) => {
    const url = host + '/api/containers/children_of/' + id
    giveMe(url, successCBK, failedCBK, finalCBK)
}

const getContainersOfType = (type_name, successCBK, failedCBK, finalCBK) => {
    const url = host + '/api/containers/type/' + type_name
    giveMe(url, successCBK, failedCBK, finalCBK)
}

const createContainer = (data, successCBK, failedCBK, finalCBK) => {
    const url = host + 'api/containers/'
    fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 
                       'Content-Type': 'application/json' },
            body: JSON.stringify( { data } ) })
        .then( response => response.json() )
        .then( response => successCBK(response) )
        .catch( error => failedCBK( { state: true, content: error } ) )
        .finally( () => finalCBK(false) )
}

const updateContainer = (data, successCBK, failedCBK, finalCBK) => {
    const url = host + 'api/containers/' + data.id
    fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 
                       'Content-Type': 'application/json' },
            body: JSON.stringify( data.body ) })
        .then( response => response.json() )
        .then( response => successCBK(response) )
        .catch( error => failedCBK( { state: true, content: error } ) )
        .finally( () => finalCBK(false) )
}

const deleteContainer = (id, successCBK, failedCBK, finalCBK) => {
    const url = host + 'api/containers/' + id
    fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 
                       'Content-Type': 'application/json' } })
        .then( response => response.json() )
        .then( response => successCBK(response) )
        .catch( error => failedCBK( { state: true, content: error } ) )
        .finally( () => finalCBK(false) )
}

export { getContainer, getContainersOfType, getChildrenContainersOf,
         createContainer, updateContainer, deleteContainer }