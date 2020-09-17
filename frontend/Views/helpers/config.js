const accountEnabled = (valid) => (valid) 
                                ? {color: 'success', status: 'enable'}
                                : {color: 'danger', status: 'disable'}

const unlock_email_text = "<p>You can edit email, but you will have to click to the link receipt on the new email box within 2 days to apply the new email changed</p><p>An email will be sent to the old email to signal the edition with a link to cancel the change.</p>"
const html_new_user = "<div class='alert alert-info'><p>A new user has been created, but need a validation to be ready to use.</p>"

export { accountEnabled, unlock_email_text, html_new_user }
