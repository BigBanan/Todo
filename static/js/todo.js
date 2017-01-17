var log = function() {
    console.log.apply(console, arguments)
}

var e = (sel) => document.querySelector(sel)

var bindBlur = function() {
    var todoContainer = e('#id-div-container')
    todoContainer.addEventListener('blur', function(event){
        // log('container blur', event, event.target)
        var target = event.target
        if (target.classList.contains('todo-task')) {
            var taskContent = target.parentElement
            var todoDiv = taskContent.parentElement
            // log('todoDiv', todoDiv)
            target.setAttribute('contenteditable', 'false')
            var item = {
                task: target.innerHTML,
                id: todoDiv.dataset.id,
            }
            todo.update(item, function(res){})
        }
    }, true)
}

var bindAddButton = function() {
    // 给 add button 绑定添加 todo 事件
    var addButton = e('#id-button-add')
    addButton.addEventListener('click', function(){
        // 获得 input.value
        var todoInput = e('#id-input-todo')
        var task = todoInput.value
        // 生成 todo 对象
        var item = {
            'task': task,
        }
        todo.add(item, function(res){
            var r = JSON.parse(res)
            todo.todoList.push(r)
            insertTodo(r)
            var input = e('#id-input-todo')
            input.value = ''
            addButton.setAttribute('disabled', '')
        })
    })
}

var bindAddkeyUp = function() {
    var input = e('#id-input-todo')
    input.addEventListener('keyup', function(event){
        log('keyup')
        if (input.value.length > 0) {
            e('#id-button-add').removeAttribute('disabled')
        } else {
            e('#id-button-add').setAttribute('disabled', '')
        }
    })

}

var bindUpdateKeyEnter = function() {
    var todoContainer = e('#id-div-container')
    todoContainer.addEventListener('keydown', function(event){
        // log('container keydown', event, event.target)
        var target = event.target
        if (target.classList.contains('todo-task')) {
            if(event.key === 'Enter') {
                log('按了回车')
                target.blur()
                // 阻止默认行为的发生, 也就是不插入回车
                event.preventDefault()
                var taskContent = target.parentElement
                var todoDiv = taskContent.parentElement
                // 把元素在 todoList 中更新
                var item = {
                    task: target.innerHTML,
                    id: todoDiv.dataset.id,
                }
                target.setAttribute('contenteditable', 'false')
                todo.update(item, function(res){})
            }
        }
    })
}

var bindDoneDeleteEdit = function() {
    var todoContainer = e('#id-div-container')
    todoContainer.addEventListener('click', function(event){
        var target = event.target
        var todoDiv = target.parentElement
        var item = {
            id: todoDiv.dataset.id,
        }
        if(target.classList.contains('todo-done')) {
            log('done')
            item.finish = todoDiv.classList.contains('done') ? false : true
            log(item)
            todo.update(item, function(res){
                toggleClass(todoDiv, 'done')
            })
        } else if (target.classList.contains('todo-delete')) {
            log('delete')
            todo.dele(item, function(res){
                todoDiv.remove()
            })
        } else if(target.classList.contains('todo-edit')) {
            log('edit')
            var s = todoDiv.children[3].children[1]
            log('span is', s)
            s.setAttribute('contenteditable', 'true')
            s.focus()
        }
    })
}

var insertTodo = function(item) {
    // 添加到 container 中
    var todoContainer = e('#id-div-container')
    var t = templateTodo(item)
    // 添加元素
    todoContainer.insertAdjacentHTML('afterbegin', t);
}

var templateTodo = function(item) {
    var i = item.finish ? 'done' : ''
    var time = timeFormat(item.created_time)
    var t = `
        <div class='todo-cell ${i}' data-id=${item.id}>
            <button class='todo-done'>完成</button>
            <button class='todo-delete'>删除</button>
            <button class='todo-edit'>更新</button>
            <span class='todo-content'>
                <span class='task-time' >${time}</span>
                <span class='todo-task' contenteditable='false'>${item.task}</span>
            </span>
        </div>
    `
    return t
}

// 开关元素的某个 class
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var zfill = function(string) {
    var s = String(string)
    if (s.length == 1) {
        s = '0' + s
    }
    return s
}

var currentTime = function() {
    var d = new Date()
    var month = zfill(d.getMonth() + 1)
    var date = zfill(d.getDate())
    var hours = zfill(d.getHours())
    var minutes = zfill(d.getMinutes())
    var seconds = zfill(d.getSeconds())
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

var timeFormat = function(time) {
    var d = new Date(time * 1000)
    var month = zfill(d.getMonth() + 1)
    var date = zfill(d.getDate())
    var hours = zfill(d.getHours())
    var minutes = zfill(d.getMinutes())
    var seconds = zfill(d.getSeconds())
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

// 程序加载后, 加载 todoList 并且添加到页面中
var initBrower = function() {
    todo.all((res) => {
        // log('todo',todo)
        todo.todoList = JSON.parse(res)
        for (var i = 0; i < todo.todoList.length; i++) {
            var item = todo.todoList[i]
            insertTodo(item)
        }
    })
}

var bindEvents = function() {

    bindAddButton()

    bindUpdateKeyEnter()

    bindDoneDeleteEdit()

    bindBlur()

    bindAddkeyUp()
}


var __main = function() {
    initBrower()
    bindEvents()
}

const todo = new Todo()
__main()
