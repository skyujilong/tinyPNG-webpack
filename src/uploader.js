'use strict';
const co = require('co');
const thunkify = require('thunkify');
const _ = require('lodash');
const tinify = require('tinify');

// let tinifyBuffer = thunkify(tinify.fromBuffer(sourceData).toBuffer);

function getImgQueue(list, reg) {
    //对应分成三个队列，开启3个线程进行上传
    let queue = [
        [], [], []
    ];
    let count = 0;
    _.each(list, function(val, key) {
        if (reg.exec(key)) {
            //val RawSource 对象
            queue[count % queue.length].push({
                name:key,
                source:val
            });
            count++;
        }
    });
    return queue;
}

function deImgQueue(queue,keys) {
    let reTryCount = 3;
    return co(function * () {
        function * upload(fileInfo, reTryCount) {
            if(reTryCount < 0){
                return;
            }
            try {
                let compressImg = yield thunkify(tinify.fromBuffer(fileInfo.source.source()).toBuffer);
                fileInfo.source._value = compressImg;
                //TODO 压缩图片成功
            } catch (err) {
                if (err instanceof tinify.AccountError) {
                    // Verify your API key and account limit.
                    if(keys.length === 0){
                        //TODO 输出文件名 fileInfo.name
                        return;
                    }
                    //tinify key 更换
                    tinify.key = _.first(keys);
                    keys = _.drop(keys);
                    yield upload(fileInfo, reTryCount);
                } else {
                    // Something else went wrong, unrelated to the Tinify API.
                    yield upload(fileInfo, reTryCount - 1);
                }
            }
        }

        for (let fileInfo of queue) {
            yield upload(fileInfo, reTryCount);
        }
    });
}

/**
 * 进行图片上传主操作
 * @param  {[type]} compilation     [webpack 构建对象]
 * @param  {[type]} options         [选项]
 * @return {Promise}
 */
module.exports = (compilation, options) => {
    //过滤文件尾缀名称
    let reg = new RegExp("\.(" + options.ext.join('|') + ')$', 'i');
    let keys = options.key;

    return co(function * () {
        let imgQueue = getImgQueue(compilation.assets, reg);
        tinify.key = _.first(keys);
        keys = _.drop(keys);
        yield Promise.all([deImgQueue(imgQueue[0]),deImgQueue(imgQueue[1]),deImgQueue(imgQueue[2])]);
    });
};
