module.exports = (req,res,next) => {
    const memberId = req.params.id;
    const user = req.user;
  
    if(!user || (user._id !== memberId && user.role !== "ADMIN" )){
        return res.sendStatus(403);
    }

    next();
}