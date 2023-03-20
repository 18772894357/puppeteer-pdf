## DEMO运行

npm i xquant-puppeteer-pdf
cd node_modules/xquant-puppeteer-pdf && npm run start
运行 http://localhost:6001/demo.html

---

## 参数

请求地址： /download/pdf

|参数|说明|默认|
|----|----|----|
|url|需要打开的网站URL| 无|
|viewport|PDF设置|viewport|
|headers|请求头设置|无|
|cookies|cookies设置|无|
|storages|localStorage设置|无|

### viewport

|参数|说明|默认|
|----|----|----|
|width|打印pdf的宽度|1366|
|height|打印pdf的高度|768|
|scale|页面的缩放|1|
|displayHeaderFooter|是否展示头尾|false|
|headerTemplate|自定义头部|无|
|footerTemplate|自定义尾部|无|
|margin|四周编剧设置|无|
|format|pdf保存格式| 无|
|printBackground|背景|无|

详细文档见https://puppeteer.bootcss.com/api