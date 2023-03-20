import App from './app'

const app = new App

app.listen(6001, () => {
  console.log('app is starting at: http://localhost:6001;')
})