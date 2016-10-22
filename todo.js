// log 函数
var log = function() {
    console.log.apply(console, arguments)
}

var bindBlur = function() {
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener('blur', function(){
        log('container blur', event, event.target)
        var target = event.target
        var index = indexOfElement(target)
        todoList[index].task = target.innerHTML
        saveTodos()
        target.setAttribute('contenteditable', 'false')
    }, true)
}

var bindAddButton = function() {
    // 给 add button 绑定添加 todo 事件
    var addButton = document.querySelector('#id-button-add')
    addButton.addEventListener('click', function(){
        // 获得 input.value
        var todoInput = document.querySelector('#id-input-todo')
        var task = todoInput.value
        // 生成 todo 对象
        var todo = {
            'task': task,
            'time': currentTime()
        }
        todoList.push(todo)
        saveTodos()
        insertTodo(todo)
    })
}

var bindKeyEnter = function() {
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener('keydown', function(event){
        log('container keydown', event, event.target)
        var target = event.target
        if(event.key === 'Enter') {
            log('按了回车')
            // 失去焦点
            target.blur()
            // 阻止默认行为的发生, 也就是不插入回车
            event.preventDefault()
            // 更新 todo
            var index = indexOfElement(target)
            log('update index',  index)
            // 把元素在 todoList 中更新
            todoList[index].task = target.innerHTML
            // todoList.splice(index, 1)
            saveTodos()

        }
    })
}

var bindDoneDeleteEdit = function() {
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener('click', function(event){
        log('container click', event, event.target)
        var target = event.target
        if(target.classList.contains('todo-done')) {
            log('done')
            // 给 todo div 开关一个状态 class
            var todoDiv = target.parentElement
            toggleClass(todoDiv, 'done')
        } else if (target.classList.contains('todo-delete')) {
            log('delete')
            var todoDiv = target.parentElement
            var index = indexOfElement(target)
            log('delete index',  index)
            todoDiv.remove()
            todoList.splice(index, 1)
            saveTodos()
        } else if(target.classList.contains('todo-edit')) {
            log('edit')
            var s = target.parentElement.children[3]
            log('span is', s)
            s.setAttribute('contenteditable', 'true')
            s.focus()
        }
    })
}

var insertTodo = function(todo) {
    // 添加到 container 中
    var todoContainer = document.querySelector('#id-div-container')
    var t = templateTodo(todo)
    // 添加元素
    todoContainer.insertAdjacentHTML('beforeend', t);
}

var templateTodo = function(todo) {
    var t = `
        <div class='todo-cell'>
            <button class='todo-done'>完成</button>
            <button class='todo-delete'>删除</button>
            <button class='todo-edit'>编辑</button>
            <span contenteditable='false'>${todo.task}</span>
            <span>${todo.time}</span>
        </div>
    `
    return t
}

// 保存 todoList
var saveTodos = function() {
    var s = JSON.stringify(todoList)
    localStorage.todoList = s
}

var loadTodos = function() {
    var s = localStorage.todoList
    return JSON.parse(s)
}

// 返回自己在父元素中的下标
var indexOfElement = function(element) {
    var parent = element.parentElement
    var parent = parent.parentElement
    for (var i = 0; i < parent.children.length; i++) {
        var e = parent.children[i]
        if (e === element.parentElement) {
            return i
        }
    }
}

// 开关元素的某个 class
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var currentTime = function() {
    var d = new Date()
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var seconds = d.getSeconds()
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

// 程序加载后, 加载 todoList 并且添加到页面中
var initBrower = function() {
    todoList = loadTodos()
    for (var i = 0; i < todoList.length; i++) {
        var todo = todoList[i]
        insertTodo(todo)
    }
}

var bindEvents = function() {
    bindAddButton()
    bindKeyEnter()
    bindDoneDeleteEdit()
    bindBlur()
}

var todoList = []

var __main = function() {
    initBrower()
    bindEvents()
}

__main()