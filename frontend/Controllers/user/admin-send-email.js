

/* POST request to send email to validate new account */
const emailContact = async (data, locale) => {
    console.log("Start to send email with account validation action to", data.id)
    try {
        let response = await fetch(`/api/mailer/account/validate`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify( {id: data.id,
                                   subject: data.subject,
                                   content: data.content,
                                   locale} ) } )
        return response.json() 
    } catch(error) { return{error} }
}

const emailAlert = async (data, locale) => {
    console.log("Start to send email with account validation action to", data.id)
    try {
        let response = await fetch(`/api/mailer/account/validate`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify( {id: data.id,
                                   subject: data.subject,
                                   content: data.content,
                                   mode: data.mode,
                                   locale} ) } )
        return response.json() 
    } catch(error) { return{error} }
}

export { emailContact, emailAlert }
