/* CRUD for container collection to call from server API
   at /api/containers address */

import { TAG, HOST, SERVER_PORT } from '../../Views/helpers/config'

const host = TAG + HOST + ":" + SERVER_PORT

const giveMe = (url, successCBK, failedCBK, finalCBK, isMounted) => {
    fetch(url)
        .then( response => response.json() )
        .then( response => { (isMounted) ? successCBK(response) : null } )
        .catch( error => { (isMounted) ? failedCBK( { state: true, content: error } ) : null } )
        .finally( () => { (isMounted) ? finalCBK(false) : null } )
}

const getContainer = (id, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + '/api/containers/' + id
    giveMe(url, successCBK, failedCBK, finalCBK, isMounted)
}

const getChildrenContainersOf = (id, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + '/api/containers/children_of/' + id
    giveMe(url, successCBK, failedCBK, finalCBK, isMounted)
}

const getChildrenIDof = (id, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + '/api/containers/children_ids_of/' + id
    giveMe(url, successCBK, failedCBK, finalCBK, isMounted)
}

const getContainersOfType = (type_name, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + '/api/containers/type/' + type_name
    giveMe(url, successCBK, failedCBK, finalCBK, isMounted)
}

const getContainersIDofType = (type_name, successCBK, failedCBK, finalCBK, isMounted) => {
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
        .then( response => { (isMounted) ? successCBK(response) : null } )
        .catch( error => { (isMounted) ? failedCBK( { state: true, content: error } ) : null } )
        .finally( () => { (isMounted) ? finalCBK(false) : null } )
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
        .then( response => { (isMounted) ? successCBK(response) : null }  )
        .catch( error => { (isMounted) ? failedCBK( { state: true, content: error } ) : null } )
        .finally( () => { (isMounted) ? finalCBK(false) : null } )
}

const deleteContainer = (id, successCBK, failedCBK, finalCBK, isMounted) => {
    const url = host + 'api/containers/' + id
    fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 
                       'Content-Type': 'application/json' } })
        .then( response => response.json() )
        .then( response => { (isMounted) ? successCBK(response) : null } )
        .catch( error => { (isMounted) ? failedCBK( { state: true, content: error } ) : null } )
        .finally( () => { (isMounted) ? finalCBK(false) : null } )
}

const crud_caller = {
    $getContainer: getContainer,
    $getContainersOfType: getContainersOfType,
    $getContainersIDofType: getContainersIDofType,
    $getChildrenIDof: getChildrenIDof,
    $getChildrenContainersOf: getChildrenContainersOf,
    $createContainer: createContainer,
    $updateContainer: updateContainer,
    $deleteContainer: deleteContainer 
}
const crud_list = ['getContainer', 'getChildrenContainersOf', 'getContainersOfType','getContainersIDofType' ,
                   'getChildrenIDof', 'updateContainer', 'createContainer', 'deleteContainer']

export { crud_caller, crud_list, getContainer, getContainersOfType, getChildrenContainersOf,
         createContainer, updateContainer, deleteContainer }