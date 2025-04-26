type ResponseType = [string, boolean, any?];

function buildResponse(message: string, success: boolean, data?: any): ResponseType {
    return [message, success, data];
}

export {ResponseType,buildResponse}