/* 
 Storage的二次封装
*/
import config from "./../config"
export default {
  setItem(key, val) {
    /* val需要转为对象存储
       const obj = {[key]: val}
    */
    let storage = this.getStroage()
    storage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getStroage() {
    // 需要将字符串转为对象，便于setItem存储对象类型的val
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
  },
  getItem(key) {
    return this.getStroage()[key]
  },
  clearItem(key) {
    const storage = this.getStroage()
    delete storage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  clearAll() {
    window.localStorage.clear()
  },
}
