import baseController from '../base-controller'
import puppeteer from 'puppeteer'
import fs from 'fs'

class downloadPdfController extends baseController {
  // poputeer模拟浏览器中截图生成PDF
  async createBrowser (body) {
    const { viewport = {}, headers = null, url, cookies = null, storages = null } = body
    const { width = 1366, height = 768 } = viewport
    // 跳转配置，默认为没有请求时触发
    const linkConfig = {
      timeout: 1000 * 30,
      waitUntil: 'networkidle0'
    }
    // 允许当前页面跨越
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', `--window-size=${width},${height}`]
    })
    const page = await browser.newPage()
    await page.setExtraHTTPHeaders(headers)
    await page.goto(url, linkConfig)
    // 如果需要给当前页面添加cookie
    if (cookies) {
      for (let i = 0; i < cookies.length; i++) {
        await page.setCookie(...cookies[i])
      }
    }
    // 如果有localStorage
    if (storages) {
      for (let i = 0; i < storages.length; i++) {
        const storage = storages[i]
        await page.evaluate((storage) => {
          localStorage.setItem(storage.name, storage.value)
        }, storage)
      }
    }
    // 防止默认登录跳转等情况下跳转到其他页面
    if (page.url() !== url) {
      await page.goto(url, linkConfig)
    }
    const uuid = new Date().getTime()
    await page.pdf({
      ...viewport,
      path: `${uuid}.pdf`
    });

    await browser.close();

    return `${uuid}.pdf`
  }
  // 下载页面，生成blob格式返回给浏览器，web可使用js-file-download下载文件
  async downloadPdf () {
    try {
      console.log('downloading start')
      const { body } = this.ctx.request
      const file = await this.createBrowser(body)
      const readStream = fs.createReadStream(file)
      this.ctx.set('content-type', 'application/x-msdownload')
      this.ctx.set('Access-Control-Allow-Origin', '*')
      this.ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With')
      this.ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
      this.ctx.body = readStream
      setTimeout(() => {
        fs.unlink(file, (err) => {
          if (err) {
            console.log('unlink file err' + err)
          }
        })
      }, 1000)
    } catch (e) {
      console.log('下载失败：', e)
    }
  }
}

export default downloadPdfController
