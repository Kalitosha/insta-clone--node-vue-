import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import serve from 'koa-static'
import config from 'config'
import Koa from 'koa'

import passport from './passport'
import router from './router'

const app = new Koa

app.keys = ['secret']

// через .use регистрируются middleweare-ы, т.е. прослойки, через которые будет проходить запрос
// тут реализуется паттерн "цепочка обязанностей", сапрос поочередно проходит через список сервисов
app
    .use(serve('./static')) // serve - предоставляет доступ к статическим данным (запрос на загрузку картинки, аудио, видео)
    .use(bodyParser()) // распарсиваютс яоыщт данные из запросов и преобразовываются в js объекты
    .use(session({}, app)) // позволяет работать с сессиями
    .use(passport.initialize()) // passport - нужен для аутентификации и инициализации пользователей
    .use(passport.session())
    .use(router.routes()) // маршрутизатор
    .use(router.allowedMethods())
    .listen(config.get('port'), () => { // запускаем прослушку порта // запуск сервера
        console.log(`Server started (port: ${config.get('port')})`, new Date)
        console.log('process.env.NODE_ENV =', process.env.NODE_ENV)
    })

export default app