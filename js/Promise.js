// 自定义Promise函数
(function () {


  function Promise (executor) {
    // executor 执行器函数
    this.status = 'pending'  // 初始状态  共三种 pending resolved rejected
    this.data = null  // 存储数据
    this.callbacks = [] // 每个元素的结构 { onResolved() {}, onRejected() {} }

    const resolve = value =>{

      // 状态只能改变一次  penging -> resolved  | penging -> rejected
      if(this.status !== 'pending') {
        return
      }
      // 状态变为 resolved
      this.status = 'resolved'
      this.data = value
      if (this.callbacks.length) {
        setTimeout(() => {  // 模拟异步
          this.callbacks.forEach(element => {
            element.onResolved(value)
          })
        })

      }

    }

    const reject = reason => {
      // 状态只能改变一次  penging -> resolved  | penging -> rejected
      if(this.status !== 'pending') {
        return
      }
      // 状态变为 rejected
      this.status = 'rejected'
      this.data = reason
      if (this.callbacks.length) {
        setTimeout(() => {  // 模拟异步
          this.callbacks.forEach(element => {
            element.onRejected(reason)
          })
        })

      }
    }
    try {
      // 同步执行 executor
      executor(resolve, reject)
      
    } catch (error) {
      reject(error)
    }
  }

  // 指定成功和失败的回调函数 并返回一个新的Promise对象
  Promise.prototype.then = function (onResolved, onRejected) {
    if (this.status === 'pending') {

    } else if (this.status === 'resolved') {

    } else if (this.status === 'rejected') {
      
    }


    this.callbacks.push({ onResolved, onRejected })
  }
  Promise.prototype.catch = function () {}
  Promise.all = function () {}
  Promise.race = function () {}
  Promise.resolve = function () {}
  Promise.reject = function () {}

  window.Promise = Promise
})(window)