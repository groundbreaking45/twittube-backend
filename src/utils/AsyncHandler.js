export const AsyncHandler = (requestHandler) => ((request, response, next) => {
    Promise.resolve(requestHandler(request, response, next)).catch(err => next(err));
} )