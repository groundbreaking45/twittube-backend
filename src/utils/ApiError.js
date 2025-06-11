class ApiError extends Error {

    constructor(statuscode,Message = "Something went Wrong", errors , stack ){
        super(Message);
        this.statuscode = statuscode;
        this.data = null;
        this.errors = errors || [];
        this.success = false;


        if(stack) {
            this.stack = stack;
        } 
        else {
            Error.captureStackTrace(this,this.constructor);
        }

    }
}

export {ApiError};