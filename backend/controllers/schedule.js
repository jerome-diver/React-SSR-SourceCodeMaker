const Agenda = require('agenda')
import User from '../models/user.model'
import moment from 'moment'
require('dotenv').config('../../')

/* Jobs to do for schedule Agenda */

const remove_outdated_users = async (job) => {
    console.log('start job', job)
    const two_days_ago = moment().subtract(2, 'days')

    await User.deleteMany({created: {$lte: two_days_ago}, validated: false}, (err) => {
        if (err) { console.log("Schedule User collection removed outdated account failed: ", err) }
        else { console.log('Did removed some outdated users', job) }
    })
}

/* Connect Agenda to DB */

const url_db = `mongodb://${process.env.HOST}/${process.env.DB_NAME}`
const agenda = new Agenda().database(url_db, 'job_schedule').processEvery('1 hour')

/* Function to add jobs to agenda then start at call time */

const agenda_schedule = async (ag) => {
    ag.define('Remove outdated Users', remove_outdated_users(1))
    await ag.start()
    await ag.every('1 hour', 'Remove outdated Users')
}

export { agenda, agenda_schedule }