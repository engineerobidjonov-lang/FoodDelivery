function notFound(req, _res, next) {
  const error = new Error(`Route ${req.method} ${req.originalUrl} was not found.`)
  error.status = 404
  next(error)
}

export default notFound
