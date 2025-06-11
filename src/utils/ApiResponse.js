class ApiResponse {
    constructor (Message = " Done", data = null, statuscode) {
        this.success = statuscode < 400;
        this.Message = Message;
        this.statuscode = statuscode;
        this.data = data;

    }
}

export {ApiResponse};