const jwt = require('jsonwebtoken');
const expiration = "2h"

const protect = 
  function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
console.log("token", token)
    if (!token) {
      return req;
    }

    try {

      const { userId } = jwt.verify(token, process.env.JWT_SECRET, { maxAge: expiration });
      console.log("data", userId)
      req.user = userId;
    } catch {
      console.log('Invalid token');
    }

    return req;
  }


module.exports = protect;
