import Router from 'koa-router';
import fs from 'fs';
import swagger from './swagger';

const router = new Router();
swagger.wrapper(router);//为router增加了swagger/wrapper.js封装的函数

// 添加swagger的路由
router.swagger({
  title: 'App-publish Server', description: 'API DOC', version: '1.0.0',
  // [optional] default is root path. prefix : '/api', [optional] default is
  // /swagger-html
  swaggerHtmlEndpoint: '/api/swagger',
  // [optional] default is /swagger-json
  swaggerJsonEndpoint: '/api/swagger.json',

  // [optional] additional options for building swagger doc eg. add api_key as
  // shown below
  swaggerOptions: {
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey', in: 'header',
        name: 'Authorization'
      }
    }
  }
});

(function () {
  var files = fs.readdirSync('./controllers');
  var js_files = files.filter((f) => {
    return f.endsWith('.js')
  });
//处理每个js文件
  for (var f of js_files) {
    console.log(`process controller: ${f}...`);
    //导入js文件
    let mapping = require('./controllers/' + f);
    // console.log('mapping:'+mapping+'\n-----------------------------------------------------------');
    router.map(mapping)
  }
})();


// router.get('/', async (ctx, next) => {
//   ctx.redirect("/index.html")
// });

export default router
