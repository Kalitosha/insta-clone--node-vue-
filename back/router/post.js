import KoaRouter from 'koa-router'
import database from '../database'
import { imageUpload } from '../upload'
import { exec } from 'child_process'
import path from 'path'

const router = new KoaRouter

router.get('/:postId', async (ctx, next) => {
    const users = database.get('users')
    const posts = database.get('posts')
    const comments = database.get('comments')

    const postId = parseInt(ctx.params.postId)
    const post = posts.find(x => x.id === postId)

    const { login, password, ...author } = users.find(x => x.id === post.authorId)
    post.user = author
    
    const ownComments = comments.filter(x => x.postId === post.id)
    ownComments.forEach(x => {
        const { login, password, ...author } = users.find(y => y.id === x.authorId)
        x.user = author
    })
    post.comments = ownComments

    ctx.body = post
})


router.post('/create', imageUpload.single('image'), async (ctx, next) => {
    if (!ctx.isAuthenticated()) {
        return ctx.body = { //ответ на запрос пользователя
            error: 'Не авторизованы'
        }
    }

    const mimeType = path.extname(ctx.file.originalname)
    await exec(`mv ${ctx.file.path} ${ctx.file.destination}${ctx.file.filename}${mimeType}`)

    const data = database.download()
    const post = {
        id: data.postIdCounter,
        authorId: ctx.state.user.id,
        tags: [],
        description: ctx.request.body.description,
        image: `/images/${ctx.file.filename}${mimeType}`
    }

    data.posts.push(post)
    data.postIdCounter++
    database.upload(data)

    ctx.body = { post }
})

export default router