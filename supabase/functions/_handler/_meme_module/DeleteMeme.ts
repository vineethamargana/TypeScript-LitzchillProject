import { deleteMemeQuery } from "@repository/_meme_repo/MemeRepository.ts";
import { ErrorResponse, SuccessResponse } from "@response/Response.ts";
import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import { COMMON_ERROR_MESSAGES } from "@shared/_messages/ErrorMessages.ts";
import { V4 } from "@V4";
import { MEME_ERROR_MESSAGES, MEME_SUCCESS_MESSAGES } from "@shared/_messages/Meme_Module_Messages.ts";
import Logger from "@shared/Logger/logger.ts";

export default async function DeletememebyID(_req: Request, params: Record<string, string>) {
    const logger = Logger.getInstance();  // Get the logger instance
    try {
        logger.log("Processing deleteMeme handler");
        const meme_id = params.id;
        const user_id = params.user_id;
        const user_type = params.user_type;

        logger.info(`Received delete request for meme_id: ${meme_id}, user_id: ${user_id}, user_type: ${user_type}`);

        // Validate meme_id
        if (!meme_id || !V4.isValid(meme_id)) { 
            logger.warn("Validation failed: Missing or invalid meme_id.");
            return await ErrorResponse(
                HTTP_STATUS_CODE.BAD_REQUEST,
                MEME_ERROR_MESSAGES.MISSING_MEMEID
            );
        }

        // Delete the meme 
        const { data, error } = await deleteMemeQuery(meme_id, user_id, user_type);
        logger.info(`Delete query response: data=${JSON.stringify(data)}, error=${error}`);

        if (error) {
            logger.error(`Delete failed for meme_id: ${meme_id}. Error: ${error}`);
            return await ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                MEME_ERROR_MESSAGES.FAILED_TO_DELETE
            );
        }

        logger.info(`Meme deleted successfully: meme_id=${meme_id}`);
        return await SuccessResponse(
            HTTP_STATUS_CODE.OK,
            MEME_SUCCESS_MESSAGES.MEME_DELETED_SUCCESSFULLY
        );

    } catch (error) {
        logger.error(`Internal Server Error while deleting meme. Details: ${error}`);
        return await ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
}
