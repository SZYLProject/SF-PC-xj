// 只校验必填 String(value) 判定数字0
export function remarkString(rule, value, callback) {
  if (!value) {
    return callback(new Error('不能为空'))
  } else {
    callback()
  }
}

export function remarkNum(rule, value, callback) {
  if (value=="") {
    return callback(new Error('不能为空'))
  } else {
    callback()
  }
}
// 非空数组
export function remarkArr(rule, value, callback) {
  if (value.length == 0) {
    return callback(new Error('不能为空'))
  } else {
    callback()
  }
}

// 字段校验can empty
export function remarkStringEmpty(rule, value, callback) {
  const reg = /^([\u4e00-\u9fffa-zA-Z]|[0-9]|[@#\$%\^&\*\!~`'",.:+=?;\\]|[ ]|[“][，]|[。]){0,200}$/
  if (!reg.test(value)) {
    return callback(new Error('最多200字且不能输入特殊字符'))
  } else {
    callback()
  }
}

// 只校验必填
export function string200(rule, value, callback) {
  const reg = /^([\u4e00-\u9fffa-zA-Z]|[0-9]|[@#\$%\^&\*\!~`'",.:+=?;\\]|[ ]|[“]|[，]|[。]){0,200}$/
  if (!value) {
    return callback(new Error('不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('最多200字且不能输入特殊字符'))
  } else {
    callback()
  }
}

export default {
  // 必填字段
  remark_string: [{
    required: true,
    validator: remarkString,
    trigger: 'blur'
  }],
   // 必填字段
   remark_Num: [{
    required: true,
    validator: remarkNum,
    trigger: 'blur'
  }],
  
  // 非必填字段
  remark_string_empty: [{
    required: false,
    validator: remarkStringEmpty,
    trigger: 'change,blur'
  }],
  // 必填字段
  remark_Arr: [{
    required: true,
    validator: remarkArr,
    trigger: 'blur'
  }],
}
