const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

exports.uploadPaperwork = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Paperwork is required`, 400));
  }

  const files = req.files.docs;

  //Accept only images
  const notAccepted = files.map(function async(file) {
    if (!file.mimetype.startsWith("image")) {
      return file.name;
    } else {
      return "Accepted";
    }
  });
  console.log(notAccepted);

  const paperWork = files.map(function async(file) {
    //create custom filename
    file.name = `doc_${req.body.stationID}_${Date.now()}${
      path.parse(file.name).ext
    }`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return next(
          new ErrorResponse(`An error occured while uploading paperwork`, 500)
        );
      }
    });
    return file.name;
  });
  console.log(paperWork);
  req.body.paperwork = paperWork;
  next();
});
