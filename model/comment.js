const login = require('./login')

const fs = require('fs')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

const Path = './db/comment.json'

const ModelComment = function(form) {
    this.content = form.content || ''
    this.created_time = form.created_time || Math.floor(new Date() / 1000)
    this.todo_id = Number(form.todo_id) || null
    this.author = form.key
}

const loadFile = function(path) {
    var content = fs.readFileSync(path, 'utf8')
    var data = content ? JSON.parse(content) : []
    return data
}

var c = {
    data: loadFile(Path)
}

c.all = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }

    var comments = this.data
    return comments
}

c.new = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }
    var m = new ModelComment(form)
    var last = this.data[0]
    if (last == undefined) {
        m.id = 1
    } else {
        m.id = last.id + 1
    }
    this.data.unshift(m)
    this.save()
    return m
}

c.save = function() {
    var s = JSON.stringify(this.data, '', 4)
    fs.writeFile(Path, s, (err) => {
        err ? console.log(err) : console.log('comment 保存成功');
    })
}

c.indexOfComments = function(id) {
    id = Number(id)
    for (var i = 0; i < this.data.length; i++) {
        if(this.data[i].id == id) {
            return  i
        }
    }
    console.log('id is no found in Comments!');
    return false
}

c.run = function(server) {
    io = require('socket.io').listen(server);
    let userList = []
    let that = this
    io.on('connection', function(socket) {
        //console.log(io.sockets)
        console.log('新用户连接成功');
        socket.emit('whoAreYou')
        socket.on('name', function(name) {
            console.log(name);
            userList.push(name)
            socket.name = name
            socket.emit('loginMsg', '你登录了')
            socket.emit('whereAreYou')
        })
        socket.on('iAmAt', function(tId) {
            // console.log('find by tId', tId);
            let data = that.commentsByTodoId(tId)
            socket.emit('commentsAll', data)
        })
        socket.on('message', function(msg) {
            console.log(`收到了：${msg.key}: ${msg.content}`);
            var user = socket.name
            let d = that.new(msg)
            io.sockets.emit('chat', d)
            // socket.broadcast.emit('chat', d)
        })
        socket.on('disconnect', () => {
            console.log('有人离开了');
            userList.splice(userList.indexOf(socket.name), 1);
            socket.broadcast.emit('message', `${socket.name} 已经离开`)
        })
    })
}

// TODO:
c.dele = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }
    if (!form.id) {
        console.log('delete id is no defined in Comments!');
        return false
    } else {
        var index = this.indexOfComments(form.id)
        if (index !== false) {
            var item = this.data[index]
            this.data.splice(index, 1)
            this.save()
            return  item
        }
    }
}

// TODO:
c.update = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }
    if (!form.id) {
        console.log('update id is no defined in comments!');
        return false
    } else {
        var index = this.indexOfComments(form.id)
        if (index !== false) {
            // this.data[index].task = form.task || this.data[index].task
            // this.save()
            // return this.data[index]
        }
    }
}

c.deleCommentsByTodoId = function(form) {
    /*
        form:
           key: key,
           'todo_id': todo_id,
    */
    for (let i = 0; i < this.data.length; i++) {
        let t = this.data[i]
        if (t.todo_id == form.todo_id) {
            this.data.splice(i, 1)
            i--
        }
    }
    this.save()
}

c.commentsByTodoId = function(todo_id) {
    let ts = []
    for (let i = 0; i < this.data.length; i++) {
        let t = this.data[i]
        // console.log(project_id, t.project_id, i);
        if(todo_id == t.todo_id) {
            ts.push(t)
        }
    }
    // console.log('todos', ts);
    return ts
}

module.exports = c
