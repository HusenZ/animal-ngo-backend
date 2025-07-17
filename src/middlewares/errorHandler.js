const errorHandling = (err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).json({
        message:"something went wrong",
        error: err.message,
    })
}

export default errorHandling;