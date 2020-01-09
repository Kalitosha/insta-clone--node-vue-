import KoaRouter from 'koa-router'
import database from '../database'

const router = new KoaRouter

// обработка get запроса по адресу /api/wall
router.get('/', async (ctx, next) => {
    const postIds = database.get('posts')
        .sort((a, b) => a.id - b.id)
        .map(x => x.id)

    ctx.body = postIds
})

export default router