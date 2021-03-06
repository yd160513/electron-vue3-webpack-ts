import { dialog, ipcMain } from 'electron'
import fs from 'fs'
import { upload } from './upload'

let golbalWindow

/**
 * 监听渲染进程向主进程的通信(invoke)
 * @param {string} eventName ipc 事件名
 * @param {function} listener 回调事件
 */
 const ipcMainHandle = async (eventName, listener) => {
  ipcMain.handle(eventName, (event, args) => {
    console.log(`ipcMainHandle 监听到了。。。${args} ${listener}`)
    return listener(event, args)
  })
}

const ipcMainOn = (eventName, listener) => {
  ipcMain.on(eventName, (event, args) => {
    return listener(event, args)
  })
}

const openSelectFileDialog = async (event, args) => {
  console.log('openSelectFileDialog =>', args)
  /**
   * 拿到选择的文件结果，内容:
   * {
   *   canceled: false,
   *   filePaths: [ '/Users/kouyidong/Documents/test/34KB 的.pdf' ]
   * }
   */
  const result = await dialog.showOpenDialog(golbalWindow.mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'All', extensions: ['*'] }]
  })
  // 通过路径获取文件信息
  const filePath = result.filePaths[0]
  const stat = fs.statSync(filePath)
  console.log('stat =>', stat)
  // 通过文件 size 来判断是直接上传还是分片上传
  const fileSize = Math.ceil(stat.size / 1024 / 1024)
  // 分片上传
  // if (fileSize > 50) {
  console.log('准备分片上传')
  const uploadRes = await upload(filePath)
  process.stdout.write('上传完成 uploadRes =>', uploadRes)
  // }
  // // 整体上传
  // else {
  //   console.log('执行整体上传')
  // }
};

export const uploadService = (windowMap) => {
  golbalWindow = windowMap
  ipcMainOn('openSelectFileDialog', openSelectFileDialog);
}