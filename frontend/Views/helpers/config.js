
export const variant = (role) => {
    switch (role) {
        case 'Reader':
            return 'success'
            break
        case 'Writer':
            return 'warning'
            break
        case 'Admin':
            return 'danger'
            break
    }
}

export const accountEnabled = (valid) => (valid) 
                                ? {color: 'success', status: 'enable'}
                                : {color: 'danger', status: 'disable'}
