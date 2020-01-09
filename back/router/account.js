import KoaRouter from 'koa-router'
import database from '../database'

const router = new KoaRouter

// этот обработчик будет вызва, если запрос пришел с адресом /api/account/signin
router.post("/signin", async (ctx, next) => {
    const { login = "", password = "" } = ctx.request.body // достаем логин и пароль из request.body
    // в request.body ин-фу закинул bodyParser 
    const user = database.get('users').find(user => user.login === login) // в бд ищем пользователя с нужным логином 

    if (user && user.password === password) { // проверяем совпадение пароля
        await ctx.login(user) // если да, то авторизируем пользователя
        // тут же запоминается сессия для данного пользователя, чтобы он мог свободно пользоваться системой

        ctx.body = { // отправка ответа пользователю // "урашечки теперь вы в системе"
            isAuthenticated: true,
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname
            }
        }
    }

    else { // если нет пользователя или пароль не подходит
        ctx.body = {
            isAuthenticated: false // то возвращаем печальку
        }
    }
})

// ф-ция продолжения сессии
router.post("/continue", async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        const user = ctx.state.user

        ctx.body = {
            isAuthenticated: true,
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname
            }
        }
    }

    else {
        ctx.body = {
            isAuthenticated: false
        }
    }
})

// тут ф-ция выхода из системы
router.post("/signout", async (ctx, next) => {
	if (ctx.isAuthenticated()) {
		ctx.logout()
    }
    
    ctx.body = {
        isAuthenticated: false
    }
})

export default router