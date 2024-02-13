import { StatusCodes } from "http-status-codes";

import Insurance from "../models/insuranceModel.js";
import HttpError from "../errors/HttpError.js";
import errorMiddleware from "../middleware/errorMiddleware.js";

//create insurance package
const createPackage = errorMiddleware.asyncErrorHandler(async (req, res) => {
  const insurance = await Insurance.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ package: insurance._id, msg: "Insurance package created" });
});

// no update method, as new packages has to be created instead

// delete insurance package
const deletePackage = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const deletedInsurance = await Insurance.findByIdAndDelete({
      _id: req.body.insuranceID,
    });
    if (deletedInsurance) {
      res.status(StatusCodes.OK).json({ msg: "Insurance was deleted" });
    } else {
      next(
        new HttpError(
          `Insurance with ID: ${req.body.insuranceID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

// get insurance package by name
const getInsuranceByName = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const insurance = await Insurance.findOne({packageName: req.params.name})
    if (insurance) {
      res.status(StatusCodes.OK).json({ insuranceId: insurance._id });
    } else {
      next(
        new HttpError(
          `Insurance with Name: ${req.params.name} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

// get insurance package by id
const getInsuranceById = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const insurance = await Insurance.findById(req.params._id);
    if (insurance) {
      res.status(StatusCodes.OK).json({ insurance });
    } else {
      next(
        new HttpError(
          `Insurance with ID: ${req.params._id} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

export { createPackage, deletePackage, getInsuranceById,getInsuranceByName };
