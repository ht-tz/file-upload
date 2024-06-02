/*
 * @Author: htz
 * @Date: 2024-05-31 22:47:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-31 22:59:39
 * @Description: 请填写简介
 */
export function delay(interval) {
  typeof interval === 'number' ? (interval = 1000) : null
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, interval)
  })
}
