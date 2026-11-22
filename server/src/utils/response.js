/**
 * Build a consistent success JSON response.
 * @param {import('express').Response} res
 * @param {object} data - payload placed under `data`
 * @param {object} [meta] - optional pagination/meta placed under `meta`
 * @param {number} [status=200]
 */
export function sendSuccess(res, data, meta = null, status = 200) {
  const body = { success: true, data }
  if (meta) body.meta = meta
  return res.status(status).json(body)
}

/**
 * Build a consistent error JSON response.
 */
export function sendError(res, message, status = 500, details = null) {
  const body = { success: false, message }
  if (details) body.details = details
  return res.status(status).json(body)
}
