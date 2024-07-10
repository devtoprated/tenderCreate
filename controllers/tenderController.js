const ErrorHander = require("../utils/errorhander.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken.js");
const crypto = require("crypto");
const fs = require("fs");
const mongoose = require("mongoose");
const Tender = require("../models/tenderModel.js");
const path = require("path");

exports.createTender = catchAsyncErrors(async (req, res, next) => {
  try {
    let {
      state,
      submittedOn,
      openingDate,
      client_name,
      job_work,
      emd,
      bid_amount,
      submissionDate,
      status,
      l1_amount,
      l1_companyName,
      anviam_position,
      emd_position,
      notes,
    } = req.body;
    let resFilePath1 = "";
    let fileName = "";
    let dataarray = [];
    submittedOn = submittedOn.trim();
    client_name = client_name.trim();
    state = state.trim();
    if (client_name === "") {
      return next(
        new ErrorHander("Please Provide valid Client Name field value", 400)
      );
    }
    if (state === "") {
      return next(new ErrorHander("Please Provide valid state  value", 400));
    }

    if ((submittedOn = "")) {
      return next(
        new ErrorHander("Please Provide valid submittedOn field value", 400)
      );
    } else {
      const tenderobj = new Tender({
        state: state,
        client_name: client_name,
        job_work: job_work,
        emd: emd,
        openingDate: openingDate,
        bid_amount: bid_amount,
        status: status,
        l1_amount: l1_amount,
        submittedOn: submittedOn,
        submissionDate: submissionDate,
        l1_companyName: l1_companyName,
        anviam_position: anviam_position,
        emd_position: emd_position,
        notes: notes,
      });
      const imageDir = `./public/productImage/`;
      const resImageDir = `/productImage/`;

      if (req.files?.attachments) {
        uploadPath = __dirname + "uploads";
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        if (
          req.files?.attachments.length === undefined ||
          req.files?.attachments.length == 1
        ) {
          let randstr = Math.random().toString(36).substring(2, 7);
          let multimedia = req.files.attachments;
          let imageExt = path.extname(multimedia.name);
          fileName = `${randstr}${imageExt}`;
          let filePath = fileName;
          resFilePath1 = imageDir + fileName;
          dataarray.push(resImageDir + fileName);

          multimedia.mv(resFilePath1);
        } else {
          req.files?.attachments.forEach(function (files, index, arr) {
            let randstr = Math.random().toString(36).substring(2, 7);
            let multimedia = files;

            let imageExt = path.extname(multimedia.name);
            fileName = `${randstr}${imageExt}`;
            let filePath = fileName;
            resFilePath1 = imageDir + fileName;
            dataarray.push(resImageDir + fileName);

            multimedia.mv(resFilePath1);
          });
        }

        tenderobj.attachments = dataarray.toString();
      }
      let dats = await tenderobj.save();
      res.status(200).json({
        sucess: true,
        result: dats,
      });
    }
  } catch (e) {
    console.log("error", e);
    return next(new ErrorHander(e, 400));
  }
});

exports.getTender = catchAsyncErrors(async (req, res, next) => {
  try {
    const tenderlist = await Tender.find();

    res.status(200).json({
      sucess: true,
      result: tenderlist,
    });
  } catch (err) {
    console.log("Error in get tender", err);
  }
});

exports.deletetender = catchAsyncErrors(async (req, res, next) => {
  let id = req.params.id;
  const tender = await Tender.findById({ _id: id });

  if (!tender) {
    return next(new ErrorHander("Item not found", 404));
  }

  await tender.remove();

  res.status(200).json({
    success: true,
    message: "Tender Item Delete Successfully",
  });
});

exports.updateTender = catchAsyncErrors(async (req, res, next) => {
  try {
    const data = req.body;
    const {
      state,
      client_name,
      job_work,
      emd,
      submissionDate,
      submittedOn,
      openingDate,
      bid_amount,
      status,
      l1_amount,
      l1_companyName,
      anviam_position,
      emd_position,
      notes,
      id,
    } = req.body;

    let tender = await Tender.findById({ _id: id });
    if (!tender) {
      return next(new ErrorHander("Item not found", 404));
    }
    if (state || "") {
      tender.state = state;
    }
    if (l1_companyName || "") {
      tender.l1_companyName = l1_companyName;
    }
    if (client_name || "") {
      tender.client_name = client_name;
    }
    if (job_work || "") {
      tender.job_work = job_work;
    }
    if (submissionDate || "") {
      tender.submissionDate = submissionDate;
    }

    if (emd || "") {
      tender.emd = emd;
    }
    if (submittedOn || "") {
      tender.submittedOn = submittedOn;
    }
    if (openingDate || "") {
      tender.openingDate = openingDate;
    }
    if (status || "") {
      tender.status = status;
    }
    if (notes || "") {
      tender.notes = notes;
    }
    if (bid_amount || "") {
      tender.bid_amount = bid_amount;
    }
    if (anviam_position || "") {
      tender.anviam_position = anviam_position;
    }
    if (emd_position || "") {
      tender.emd_position = emd_position;
    }
    if (l1_amount || "") {
      tender.l1_amount = l1_amount;
    }

    const ans = await tender.save();
    res.json({
      sucess: true,
      result: ans,
    });
  } catch (err) {
    console.log("Error", err);
  }
});

exports.getTenderDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  try {
    const tender = await Tender.findById({ _id: id });
    if (!tender) {
      return next(new ErrorHander("Item not found", 404));
    }

    res.status(200).json({
      success: true,
      result: tender,
      message: "Tender Found",
    });
  } catch (errr) {
    console.log("eerrrr", errr);
  }
});
