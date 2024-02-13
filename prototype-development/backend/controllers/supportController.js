import { StatusCodes } from 'http-status-codes';
import errorMiddleware from "../middleware/errorMiddleware.js";
import emailMiddleware from '../middleware/emailMiddleware.js';
import supportRequestModel from '../models/supportRequestModel.js';
import HttpError from "../errors/HttpError.js";
import dotenv from "dotenv";

dotenv.config();


//contact support and send email to admin and user
const contactSupport = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
    const request = await supportRequestModel.create(req.body);
    if(request){
        await emailMiddleware.handleMail(
            //email to admin,
            process.env.EMAIL_ADMIN,    
            `New Support Request - ${request._id}`,
            `<p>Dear Carus Team,<br><br>
            ${request.firstName} ${request.lastName} has submitted a new request...<br><br>
            Request:<br><br>
            ${request.message}<br><br>
            Email: ${request.email},<br><br>
            Please answer quickly!
            Best regards,<br>
            Your Carus Team Bot</p>`
        );
        await emailMiddleware.handleMail(
            //email to admin,
            request.email,    
            `New Support Request received`,
            `<p>Dear ${request.firstName},<br><br>
            Our Team has received your request. We will get back to you as soon as possible<br><br>
            Thank you for your patience!<br><br>
            Cheers, Team Carus</p>`
        );
        res.status(StatusCodes.CREATED).json({ msg: 'Support request created'});
    }
    else{ 
        next(new HttpError( `Support request could not be created`, StatusCodes.NOT_FOUND));
    }
});


export { contactSupport };