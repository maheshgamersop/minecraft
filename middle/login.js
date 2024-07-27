const { check } = require('../auth/login');

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  const user = check(token);
  if (user) {
    req.user = user;
    next();
  } else {
    res.redirect('/lock/login');
  }
};
const loginauth = (req, res, next)=>{
  const token = req.headers.authorization;
  const user = check(token);
  if (user) {
    res.status(200).send({ message: 'TOKEN IS CORRECT'})
  }
  if(!user){
    res.status(404).send({ message: 'TOKEN IS INCORRECT'})
  }
}
module.exports = {
  loginauth,
  isAuthenticated
};
