/**
 * Set Cache-Control headers for performance optimization.
 * @param {number} duration - Cache duration in seconds
 */
const setCacheControl = (duration) => {
  return (req, res, next) => {
    // Only cache GET responses
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${duration}, s-maxage=${duration}, stale-while-revalidate=${duration * 2}`);
    } else {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
    next();
  };
};

module.exports = setCacheControl;
