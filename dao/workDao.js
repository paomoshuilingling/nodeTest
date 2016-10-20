// dao/workDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./workSqlMapping');

//使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

//向前台返回JSON方法的简单封装
var jsonWrite = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
    return;
};

var workMethod = {
    add: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            //获取前台页面传过来的参数
            var param = req.body;
            if (param.type == null || param.title == null || param.content == null || param.id == null) {
                jsonWrite(res, undefined);
                return;
            }
            //建立连接，向表中插入值
            connection.query($sql.insert, [param.id, param.type, param.title, param.content], function(err, result) {
                if (result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: '插入成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);

                // 释放连接 
                connection.release();
            });
        });
    },
    delete: function(req, res, next) {
        // delete by Id
        pool.getConnection(function(err, connection) {
            var param = req.body;
            if (param.id == null) {
                jsonWrite(res, undefined);
                return;
            }
            connection.query($sql.delete, param.id, function(err, result) {
                if (result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: '删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update: function(req, res, next) {
        // update by id
        // 为了简单，要求同时传type、title和content三个个参数
        var param = req.body;
        if (param.type == null || param.title == null || param.content == null || param.id == null) {
            jsonWrite(res, undefined);
            return;
        }

        pool.getConnection(function(err, connection) {
            connection.query($sql.update, [param.type, param.title, param.content, +param.id], function(err, result) {
                // 使用页面进行跳转提示
                if (result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: '更新成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);

                connection.release();
            });
        });

    },
    queryById: function(req, res, next) {
        var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryById, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    queryByType: function(req, res, next) {
        var type = req.query.type; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryByType, type, function(err, result) {
                if (result.length > 0) {
                    res.render('work', {
                        result: result
                    }); // 第二个参数可以直接在jade中使用
                } else {
                    res.render('workNull', {
                        result: result
                    });
                }

                //jsonWrite(res, result);
                connection.release();

            });
        });
    },
    queryAll: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                if (result.length > 0) {
                    res.render('work', {
                        result: result
                    }); // 第二个参数可以直接在jade中使用
                } else {
                    res.render('fail', {
                        result: result
                    });
                }

                connection.release();
            });
        });
    }
};

module.exports = workMethod;
