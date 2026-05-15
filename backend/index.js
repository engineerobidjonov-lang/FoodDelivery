import app from './server.js'

const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`Food Dash backend listening on port ${PORT}`)
})
