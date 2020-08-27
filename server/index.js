// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
import router from './controller';//koa-route
import config from './config';
import Varify from './helper/varify';
import Helper from './helper/MiddleHelper';
import {isNull, isUndefined} from 'util';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const rest = require('./helper/rest');
const serve = require('koa-static');
const cors = require('koa-cors');//设置跨域
const koajwt = require('koa-jwt');//提供路由权限控制功能 token检验
const path = require('path');
const fs = require('fs');
const send = require('koa-send');
const mount = require('koa-mount');

//创建一个Koa对象表示web app本身
const app = new Koa();

var helper = new Helper();

app.use(cors());
app.use(bodyParser());//解析原始request请求
//path.resolve()把一个路径或路径片段的序列解析为一个绝对路径
/*
* path.resolve('/foo/bar','./baz');
* '/foo/bar/baz'
* path.resolve('/foo/bar','/tmp/file/');
* '/tmp/file'
* path.resolve('wwwroot','static_files/png','../gif/img.gif');
* 若当前工作目录  /home/myself/node
* 则返回 '/home/myself/node/static_files/gif/img.gif'
*/
app.use(serve(path.resolve(config.fileDir)));
app.use(serve(path.join(__dirname, '..', 'client/dist')));

//ctx--context对象 app.use加载匿名函数
app.use(function (ctx, next) {
    /*
      indexOf()返回值    -1---不存在
                       数字---下标
      ctx.request.path  获取用户请求路径
     */
    if (ctx.request.path.indexOf("/api") != 0) {
        // if (ctx.request.path.indexOf("/api") != 0) {
        ctx.response.type = 'html';//指定返回类型
        //读取模板文件
        /*
        readFile()异步读取文件
        readFileSync()同步读取文件
        */
        ctx.response.body = fs.readFileSync(path.join(__dirname, '..', 'client/dist/index.html'), 'utf8');
    } else {
        return next()
    }
});
// unless
// 要求对每个请求进行身份验证，除非路径是
// path:['/api/user/register','/api/user/login','/api/user/resetPassword','/api/swagger','/api/swagger.json',/\/api\/plist\/.+/,/\/api\/count\/.+/,/\/api\/app\/.+/]
var middleware = koajwt({secret: config.secret, debug: true}).unless({
    path: [
        '/api/user/register',
        '/api/user/login',
        '/api/user/resetPassword',
        '/api/swagger',
        '/api/swagger.json',
        /\/api\/plist\/.+/,
        /\/api\/count\/.+/,
        /\/api\/app\/.+/
    ]
});

app.use(helper.skip(middleware).if((ctx) => {
    var key = ctx.request.headers['apikey']
    return !isUndefined(key)
}));

app.use(async (ctx, next) => {
    var key = ctx.request.headers['apikey']
    if (!isUndefined(key)) {
        var user = await Varify.auth(key).catch(error => {
            throw error
        })
        ctx.state.user = {data: user}
        await next()
    } else {
        await next()
    }
});

app.use(rest.restify());
app.use(router.routes());

//在端口config.port监听
export default app.listen(config.port, () => {
    console.log(`App is listening on ${config.port}.`);
    // console.log(`process.NODE_ENV is ${process.env.NODE_ENV}`);
});
