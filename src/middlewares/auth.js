const adminAuth = (req, res, next) => {
    const token="abc";

    const isAuthenticated = token === "abc";
    if(!isAuthenticated){
        res.status(401).send("Not authorized!!");
    } else {
        next();
    }
};

module.exports = {adminAuth};