const router = require('koa-router')();
const Tips = require('../utils/tips');

const userDTO = require('../controller/user');



//查询用户
router.post('/koa-api/user/list', async (ctx, next) => {
    let params = ctx.request.body;
    let oCount = await userDTO.findUserCount(params);
    await userDTO.findUser(params).then(async res => {
        if (res && res.length > 0) {
            ctx.body = { ...Tips[0],
                data: {
                    list:res,
                    page: params.page,
                    pageSize: params.pageSize,
                    totalCount: oCount[0]['count(*)']
                }
            };
        } else {
            ctx.body = { ...Tips[0],
                data: []
            };
        }
    }).catch(e => {
        console.log(e)
        ctx.body = { ...Tips[1008],
            data: []
        };
    })
});
//修改用户数据
router.post('/koa-api/user/update', async (ctx, next) => {
    let params = ctx.request.body || {};
    await userDTO.modifyUserName(params).then(res => {
        let {
            insertId: id
        } = res;
        ctx.body = {
            ...Tips[0]
        }
    }).catch(e => {
        ctx.body = Tips[1005];
    })
});
//插入用户
router.post('/koa-api/user/add', async (ctx, next) => {
    let {
        user_name
    } = ctx.request.body || {};
    let oUser = await userDTO.findUserByName(user_name);
    if (oUser.length==0) {
         await userDTO.insertUser(ctx.request.body).then(res => {
             let {
                 insertId: id
             } = res;
             ctx.body = {
                 ...Tips[0]
             }
         }).catch(e => {
             ctx.body = Tips[1005];
         })
    } else {
        ctx.body = {
            ...Tips[2000],
            data:null
        }
    }
   
});
//删除用户
router.post('/koa-api/user/delete', async (ctx, next) => {
    let params = ctx.request.body || {};
    await userDTO.deleteUserById(params).then(res => {
        let {
            insertId: id
        } = res;
        ctx.body = {
            ...Tips[0]
        }
    }).catch(e => {
        ctx.body = Tips[1005];
    })
});


module.exports = router;