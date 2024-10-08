const adminAuth = (req, res, next) => {
  const token = "xyz";
  console.log("Admin Tested");
  isAuthenticated = token === "xyz";
  if (!isAuthenticated) res.status(401).send("Not an Authorised Admin!!");
  else next();
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  console.log("User Tested!!");
  isAuthenticated = token === "xyz";
  if (!isAuthenticated) res.status(401).send("Not Authorised User!!!");
  else next();
};

module.exports = { adminAuth, userAuth };
