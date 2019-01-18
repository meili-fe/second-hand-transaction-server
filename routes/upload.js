const router = require('koa-router')();
const Tips = require('../utils/tips');
const fs = require('fs');
const path = require('path');
const asyncBusboy = require('async-busboy');
const userDTO = require('../controller/user');


//上传用户头像
router.post('/koa-api/upload/user',async (ctx,next)=>{
    const {
        files,
        fields
    } = await asyncBusboy(ctx.req);
    // 判断文件数量
    if (files.length === 0) {
        return ctx.body = Tips[1002]
    } else {
        let file = files[0];
        // 判断图片类型
        if (file.mimeType.indexOf('image') === -1) {
            return ctx.body = Tips[1002]
        }
        // 重置图片名
        let imgName = new Date().getTime() + '.' + file.filename.split('.').pop();
        let name = file.filename.split('.').shift();
        // 将图片放在upload目录下
        let savePath = path.join(__dirname, `../upload/${imgName}`);
        // console.log(data)
        let params = {
            file_name: name,
            file_path: `http://${ctx.request.host}/upload/${imgName}`,
            user_id: fields.user_id
        }
        // 存储图片
        let saveImg = function () {
            let img = fs.readFileSync(file.path);
            fs.writeFileSync(savePath, img);
            fs.unlinkSync(file.path); //清除缓存文件
            ctx.body = {
                ...Tips[0],
                data: {
                    name
                }
            };
        }
        let oUserImg = await userDTO.findUserImgCount(params.user_id);
        if (oUserImg[0]['count(*)'] === 0) {
            await userDTO.uploadUserImg(params)
            saveImg()
        }else{
            await userDTO.updateUserImg(params) 
            saveImg()
        }   
    }
})
module.exports = router;