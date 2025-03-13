import { unlikememe } from "@repository/_like_repo/LikeQueries.ts";
import { meme_exists } from "@repository/_meme_repo/MemeRepository.ts";
import { V4 } from "@V4";
import { MEME_ERROR_MESSAGES } from '@shared/_messages/Meme_Module_Messages.ts';
import { LIKE_ERROR } from "@shared/_messages/LikeMessage.ts";
import { HTTP_STATUS_CODE } from '@shared/_constants/HttpStatusCodes.ts';
import { LIKE_SUCCESS } from '@shared/_messages/LikeMessage.ts';
import Logger from "@shared/Logger/logger.ts";
import { CustomException } from "@shared/ExceptionHandling/CustomException.ts";
import GlobalExceptionHandler from "@shared/ExceptionHandling/GlobalExceptionHandler.ts";
import {  SuccessResponse } from "@response/Response.ts";



/**
 * Removes a like from a meme by a user and updates the like count.
 * 
 * @param {Request} req - The HTTP request object containing the user and meme data.
 * @param {Record<string, string>} params - The URL parameters, including the user ID and meme ID.
 * @returns {Promise<Response>} - The response indicating the success or failure of the operation.
 * 
 * @throws {Error} - If the meme is not found, the user has not liked the meme, or there is an issue removing the like or updating the like count.
 */
async function unlikememes(_req: Request, params: Record<string, string>,CheckMemeExists=meme_exists):Promise<Response> {
   const logger = Logger.getInstance();
   const user_id = params.user_id;
   const meme_id = params.id;
   logger.info(`Processing unlikeMeme handler for user_id: ${user_id} and meme_id: ${meme_id}`);

   // Validate the meme_id parameter
   if (!meme_id || !V4.isValid(meme_id)) { 
      logger.error ("Validation failed: Missing parameters.");
        throw new CustomException(HTTP_STATUS_CODE.BAD_REQUEST, MEME_ERROR_MESSAGES.MISSING_MEMEID);
   }
   
   //Check if the meme exists in the database
   const existingMeme = await CheckMemeExists(meme_id);
   if (!existingMeme) {
       logger.error("meme not found");
       throw new CustomException(HTTP_STATUS_CODE.NOT_FOUND, MEME_ERROR_MESSAGES.MEME_NOT_FOUND);
   }
   
   // unlike the meme from the database
   const unlikedmeme = await unlikememe(meme_id, user_id);
   if (!unlikedmeme) {
       logger.error("failed to unlike meme");
       throw new CustomException(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, LIKE_ERROR.UNLIKE_FAILED);
   }


   logger.info(`Unliked meme ${meme_id} for user ${user_id}`);
   return SuccessResponse(HTTP_STATUS_CODE.OK, LIKE_SUCCESS.UNLIKED_SUCCESSFULLY);
}
export default GlobalExceptionHandler.handle(unlikememes);
