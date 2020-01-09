// уникальная система авторизации для данного проекта
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'

import database from './database'

passport.use(new LocalStrategy((username, password, done) => {
    const user = database.get('users').find(user => user.login === username)

    if (user.password === password) {
        return done(null, user)
    }

    return done(null, false)
}))

passport.serializeUser((user, done) => { // упаковка // данные минифицируем и делаем абсолютными для сохранения состояния
    done(null, user.id)
})

passport.deserializeUser((id, done) => { // из минифицированных данных вооссоздаем исходные // в данном случае нам нужен только ID 
    id = parseInt(id)
    
    const user = database.get('users').find(user => user.id === id)

    if (user) {
        done(null, user)
    }

    else {
        done(`User (with id=${id}) don't fined.`)
    }
})

export default passport