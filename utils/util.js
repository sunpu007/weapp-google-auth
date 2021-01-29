const base32 = require('./base32');
const jssha = require('./sha');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 数字转字节字符串
 * @param {*} number 数字
 */
const number2ByteText = number => {
  /* eslint-disable */
  const text = new Array(8);
  for (let i = text.length - 1; i >= 0; i--) {
    text[i] = String.fromCharCode(number & 0xFF);
    number >>= 8;
  }
  return text.join('');
};

/**
 * 根据密钥获取验证码
 * 返回字符串是因为验证码有可能以 0 开头
 * @param {*} secretKey 密钥
 * @param {*} time 第几个 30 秒 Date.now() / 1000 / 30
 */
const getTOTP = (secretKey, time) => {
  const T = Math.floor(time);
  const hmacSha = new jssha('SHA-1', 'BYTES');
  hmacSha.setHMACKey(base32.decode(secretKey).toString(), 'BYTES');
  const factorByte = number2ByteText(T);
  hmacSha.update(factorByte);
  const hmac_result = hmacSha.getHMAC('BYTES');

  const offset = hmac_result[19].charCodeAt() & 0xf;
  const bin_code = (hmac_result[offset].charCodeAt() & 0x7f) << 24
     | (hmac_result[offset + 1].charCodeAt() & 0xff) << 16
     | (hmac_result[offset + 2].charCodeAt() & 0xff) << 8
     | (hmac_result[offset + 3].charCodeAt() & 0xff);
  let otp = (bin_code % 10 ** 6).toString();
  while (otp.length < 6) {
    otp = '0' + otp;
  }
  return otp;
};

const generateGoogleCode = secretKey => {
  return getTOTP(secretKey, Date.now() / 1000 / 30);
}

const getQueryObjectByUrl = url => {
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

const arrayIsExistKeyValue = (arr, key, value) => {
  if (arr.length > 0) {
    return arr.some(item => item[key] === value);
  }
  return false;
}

module.exports = {
  formatTime,
  generateGoogleCode,
  getQueryObjectByUrl,
  arrayIsExistKeyValue
}

// const arr = [{"issuer":"Jumpserer","secret":"GAXGS4T2MJYXO5ZT","code":"977 441"},{"secret":"PG2C7BYZOCFB77VU","issuer":"HUOBI (2021-01-29)","code":"506 765"}]

// console.log(arrayIsExistKeyValue(arr, 'secret', 'GAXGS4T2MJYXO5Z'))

// 0.irzbqww3
// 0.irzbqww3
// console.log(base32.decode('GAXGS4T2MJYXO5ZT').toString('utf-8'))
