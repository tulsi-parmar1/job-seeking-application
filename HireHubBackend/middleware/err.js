class ErrorHandler extends Error{
    constructor(msg,statuscode)
    {
        super(msg);
        this.statuscode=statuscode;
    }
}
export const errormiddleware=(err,req,res,next)=>{
    err.msg=err.msg || 'internal server error';
    err.statuscode=err.statuscode || 500;
    if(err.name==='CaseError')
    {
        const msg=`resourse not found .Invalid ${err.path}`;
        err=new ErrorHandler(msg,400);
    }
    if(err.code===11000)
        {
            const msg=`resourse not found .Invalid ${err.path}`;
            err=new ErrorHandler(msg,400);
        }
}