import { insertLikeQuery } from "@repository/_like_repo/LikeQueries.ts";
import { SuccessResponse } from "@response/Response.ts";
import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import { LIKE_ERROR, LIKE_SUCCESS } from "@shared/_messages/LikeMessage.ts";
import { meme_exists } from "@repository/_meme_repo/MemeRepository.ts";
import { MEME_ERROR_MESSAGES } from "@shared/_messages/Meme_Module_Messages.ts";
import { V4 } from "@V4";
import Logger from "@shared/Logger/logger.ts";
import { CustomException } from "../../_shared/ExceptionHandling/CustomException.ts";
import GlobalExceptionHandler from "@shared/ExceptionHandling/GlobalExceptionHandler.ts";

const logger = Logger.getInstance();

/**
 * Handles the process of liking a meme by a user, including validation, insertion, and updating the like count.
 * 
 * @param {Request} _req - The HTTP request object, which contains the user ID and meme ID in the parameters.
 * @param {Record<string, string>} params - The URL parameters containing the user ID and meme ID.
 * @param {function} [CheckMemeExists=meme_exists] - The function to call to check if a meme exists in the database.
 * @param {function} [likememeQuery=insertLikeQuery] - The function to call to insert a like into the database.
 * 
 * @returns {Promise<Response>} - The response object, indicating success or failure of the like operation.
 * 
 * @throws {Error} - If an error occurs during any of the following:
 *   - Invalid or missing meme ID.
 *   - Meme not found.
 *   - User has already liked the meme.
 *   - Failure to insert like or update like count.
 *   - Failure to notify the meme owner.
 */

async function likememe(_req: Request, params: Record<string, string>,CheckMemeExists = meme_exists, likememeQuery = insertLikeQuery) {
    const user_id = params.user_id;
    const meme_id = params.id;

    logger.info(`User: ${user_id}, Meme ID: ${meme_id}`);

    // Validate meme_id
    if (!meme_id || !V4.isValid(meme_id)) { 
        logger.info("Validation failed: Missing or invalid meme_id.");
        throw new CustomException(HTTP_STATUS_CODE.BAD_REQUEST, MEME_ERROR_MESSAGES.MISSING_MEMEID);
    }

    // Step 1: Check if meme exists
    const existingMeme = await CheckMemeExists(meme_id);
    if (!existingMeme) {
        logger.error(`Meme with ID ${meme_id} not found.`);
        throw new CustomException(HTTP_STATUS_CODE.NOT_FOUND, MEME_ERROR_MESSAGES.MEME_NOT_FOUND);
    }
    logger.info(`Meme with ID ${meme_id} exists.`);

    // Step 2: Insert a new like record
    const likeable_type = "meme";
    const { data: _likeMeme, error: likeError } = await likememeQuery(meme_id, user_id, likeable_type);
    if (likeError) {
        logger.error(`Failed to like meme ${meme_id} by user ${user_id}, error: ${JSON.stringify(likeError)}`);
        throw new CustomException(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, LIKE_ERROR.INSERTION_FAILED);
    }

    return SuccessResponse(HTTP_STATUS_CODE.OK, LIKE_SUCCESS.LIKED_SUCCESSFULLY);
}

export default GlobalExceptionHandler.handle(likememe);


