// deno-lint-ignore-file
import { ErrorResponse } from "@response/Response.ts";
import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import Logger from "@shared/Logger/logger.ts";
import { CustomError } from "@shared/ExceptionHandling/CustomError.ts";

const logger = Logger.getInstance();


class ErrorHandler {
   
    static handle<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
        return (async (...args: Parameters<T>): Promise<Response> => {
            try {
                return await handler(...args);
            } catch (error) {
                if (error instanceof CustomError) {
                    return ErrorResponse(error.statusCode, error.message);
                } else {
                    logger.error(`Unhandled error: ${error}`);
                    return ErrorResponse(
                        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                        "Something went wrong. Please try again later."
                    );
                }
            }
        }) as T;
    }
}

export default ErrorHandler;
