/* CRUD for container collection to call from server API
   at /api/containers address */

import { TAG, HOST, SERVER_PORT } from '../../Views/helpers/config'

const host = TAG + HOST + ":" + SERVER_PORT

const giveMe = (url, successCBK, failedCBK, finalCBK, isMounted) => {
    fetch(url)
        .then( response => response.json() )
        .then( response => { if (isMounted) { successCBK(response) } } )
        .catch( error => { if (isMounted) { failedCBK( { state: true, content: error } ) } } )
        .finally( () => { if (isMounted) { finalCBK(false) } } )
}

const getContainer = (id, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + '/api/containers' + id
    giveMe(url, successCBK, failedCBK, finalCBK, isMounted)
}

const getChildrenContainersOf = (id, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + '/api/containers/children_of/' + id
    giveMe(url, successCBK, failedCBK, finalCBK, isMounted)
}

const getContainersOfType = (type_name, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + '/api/containers/type/' + type_name
    giveMe(url, successCBK, failedCBK, finalCBK, isMounted)
}

const createContainer = (data, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + 'api/containers/'
    fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 
                       'Content-Type': 'application/json' },
            body: JSON.stringify( { data } ) })
        .then( response => response.json() )
        .then( response => { if (isMounted) { successCBK(response) } } )
        .catch( error => { if (isMounted) { failedCBK( { state: true, content: error } ) } } )
        .finally( () => { if (isMounted) { finalCBK(false) } } )
}

const updateContainer = (data, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + 'api/containers/' + data.id
    fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 
                       'Content-Type': 'application/json' },
            body: JSON.stringify( data.body ) })
        .then( response => response.json() )
        .then( response => { if (isMounted) { successCBK(response) } } )
        .catch( error => { if (isMounted) { failedCBK( { state: true, content: error } ) }} )
        .finally( () => { if (isMounted) { finalCBK(false) } } )
}

const deleteContainer = (id, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + 'api/containers/' + id
    fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 
                       'Content-Type': 'application/json' } })
        .then( response => response.json() )
        .then( response => { if (isMounted) { successCBK(response) } } )
        .catch( error => { if (isMounted) { failedCBK( { state: true, content: error } ) } } )
        .finally( () => { if (isMounted) { finalCBK(false) } } )
}

const crud_caller = {
    $getContainer: getContainer,
    $getContainersOfType: getContainersOfType,
    $getChildrenContainersOf: getChildrenContainersOf,
    $createContainer: createContainer,
    $updateContainer: updateContainer,
    $deleteContainer: deleteContainer 
}
const crud_list = ['getContainer', 'getChildrenContainersOf', 'getContainersOfType', 
                   'updateContainer', 'createContainer', 'deleteContainer']

export { crud_caller, crud_list, getContainer, getContainersOfType, getChildrenContainersOf,
         createContainer, updateContainer, deleteContainer }