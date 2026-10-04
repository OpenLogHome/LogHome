const middleware = {}

middleware['device-detect'] = require('..\\middleware\\device-detect.js')
middleware['device-detect'] = middleware['device-detect'].default || middleware['device-detect']

export default middleware
