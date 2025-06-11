/* This code snippet is a higher-order function that acts as a middleware wrapper for asynchronous
functions in Node.js. */
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}
