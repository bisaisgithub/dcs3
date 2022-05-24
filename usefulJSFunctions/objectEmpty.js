let obj = {}

if (obj // null and undefined check
    && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype) {
        console.log('empty true')
    } else {
        console.log('empty false')
    }