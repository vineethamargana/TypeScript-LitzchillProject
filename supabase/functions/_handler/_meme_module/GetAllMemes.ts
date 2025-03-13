// deno-lint-ignore-file
import * as MemeRepository from "@repository/_meme_repo/MemeRepository.ts";
import { SuccessResponse } from "@response/Response.ts";
import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import { MEME_ERROR_MESSAGES, MEME_SUCCESS_MESSAGES } from "@shared/_messages/Meme_Module_Messages.ts";
import Logger from "@shared/Logger/logger.ts";
import { CustomException } from "@shared/ExceptionHandling/CustomException.ts";
import GlobalExceptionHandler from "@shared/ExceptionHandling/GlobalExceptionHandler.ts";


/**
 * Handler function to fetch all memes with pagination, sorting, and optional tag filtering.
 * 
 * This function:
 * - Extracts query parameters (`page`, `limit`, `sort`, and `tag`) from the URL.
 * - Calls the repository function to fetch memes based on the provided parameters.
 * - Returns a success response with a list of memes or an error response if no memes are found or there is an issue.
 * 
 * @param {Request} req - The HTTP request object containing the query parameters:
 *   - `page` (optional): The page number for pagination (default is 1).
 *   - `limit` (optional): The number of memes per page (default is 50).
 *   - `sort` (optional): The sorting method ("popular" or "created_at", default is "popular").
 *   - `tag` (optional): The tags filter for the memes (default is null).
 * 
 * @returns {Promise<Response>} - The response containing:
 *   - If successful, a success response with a list of memes.
 *   - If no memes are found or an error occurs, an error response with the appropriate status code and message.
 * 
 * @throws {Error} Throws an error if there is an unexpected failure while fetching memes.
 */
 async function getAllMemes(req: Request,params:Record<string, string>, getAllMemes = MemeRepository.fetchMemes): Promise<Response> { 
     const logger = Logger.getInstance();  // Get the logger instance
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const limit = Number(url.searchParams.get('limit')) || 50;
        const sort = url.searchParams.get('sort') || "popular";
        const tag = url.searchParams.get('tags') || null;

        logger.info(`Fetching memes with params: page=${page}, limit=${limit}, sort=${sort}, tag=${tag}`);

        // Fetch memes from the repository using the provided parameters
        const { data: allmemes, error } = await getAllMemes(page, limit, sort, tag);
 
        // Handle errors and return appropriate responses
        if (error || !allmemes || allmemes.length === 0) {
            logger.warn(`No memes found or fetching failed ${error}`);
            throw new CustomException(HTTP_STATUS_CODE.NOT_FOUND, MEME_ERROR_MESSAGES.NO_MEMES);
        }

        logger.info(`Successfully fetched ${allmemes.length} memes.`);
        return SuccessResponse(HTTP_STATUS_CODE.OK, MEME_SUCCESS_MESSAGES.MEMES_FETCHED_SUCCESSFULLY, allmemes);
}

export default GlobalExceptionHandler.handle(getAllMemes)

