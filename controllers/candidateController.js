const ErrorHander = require("../utils/errorhander.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken.js");
const crypto = require("crypto");
const Candidate = require("../models/candidateModel.js");
const fs = require("fs");
const csv = require("fast-csv");
const { parse } = require('fast-csv');
const path = require("path");
const Organizations = require("../models/organizationModel.js");
const moment = require("moment")
const Interview = require("../models/interviewModel.js");
exports.registerCandidate = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    department,
    contact_no,
    email,
    total_experience,
    ctc,
    ectc,
    notice_period,
    address,
    resume,
    notes,
    sourced_by,
    comments_by_hr,
    interview_schedule,
    selected,
    joining_date,
    shortlisted,
    // interviewer_name,
    // interviewer_comments,
    // ratings,
    // interview_type,
    // Proceed_for_next,
  } = req.body;
  let resFilePath1 = "";
  let fileName = "";
  let dataarray = [];
  let candidateorg = [];
  let intervieworg = []
  let imageDir = `./public/resume/`;
  let resImageDir = `/resume/`;
  if (email === "") {
    return next(new ErrorHander("Please Provide  email", 400));
  }
  if (name === "") {
    return next(new ErrorHander("Please Provide  name ", 400));
  }
  if (department === "") {
    return next(new ErrorHander("Please Provide  department ", 400));
  }
  if (contact_no === "") {
    return next(new ErrorHander("Please Provide  contact_no ", 400));
  }
  if (total_experience === "") {
    return next(new ErrorHander("Please Provide  total_experience ", 400));
  }
  if (ctc === "") {
    return next(new ErrorHander("Please Provide  ctc ", 400));
  }
  const candidate = await Candidate.findOne({ email });
  if (candidate) {
    return next(new ErrorHander("Email already exists.", 400));
  }
  const candidateobj = new Candidate({
    name: name,
    department: department,
    contact_no: contact_no,
    email: email,
    total_experience: total_experience,
    ctc: ctc,
    ectc: ectc,
    notice_period: notice_period,
    address: address,
    resume: resume,
    shortlisted: shortlisted,
    notes: notes,
    sourced_by: sourced_by,
    comments_by_hr: comments_by_hr,
    interview_schedule: interview_schedule,
    selected: selected,
    joining_date: joining_date,
    Organizationsdata: [],
  });
  let saveddata = {};
  // Saving File ie. resume
  if (req.files?.resume) {
    uploadPath = __dirname + "uploads";
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    if (
      req.files?.resume.length === undefined ||
      req.files?.resume.length == 1
    ) {
      let randstr = Math.random().toString(36).substring(2, 7);
      let multimedia = req.files.resume;
      let imageExt = path.extname(multimedia.name);
      fileName = `${randstr}${imageExt}`;
      let filePath = fileName;
      resFilePath1 = imageDir + fileName;
      dataarray.push(resImageDir + fileName);
      multimedia.mv(resFilePath1);
    } else {
      req.files?.resume.forEach(function (files, index, arr) {
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
  }
  candidateobj.resume = dataarray.toString();
  let datsSave = await candidateobj.save();

  if (datsSave) {
    let candidate_id = datsSave._id;
    let intcount = 0
    // Save Interview
    if (datsSave.selected == "yes") {
      let interviewdata = JSON.parse(req.body.Interviewer);
      if (interviewdata.length > 0) {
        interviewdata.map(async (data, index) => {
          intcount = intcount + 1;
          // maxorgcount

          let interviewer = new Interview({
            interviewer_name: data.interviewer_name,
            interviewer_comments: data.interviewer_comments,
            ratings: data.ratings,
            interview_type: data.interview_type,
            Proceed_for_next: data.Proceed_for_next,
            Candidates: candidate_id,
          });
          await interviewer.save().then((data) => {
            intervieworg.push(data._id);
          });
          saveddata = await Candidate.findByIdAndUpdate(
            { _id: datsSave._id },
            { $set: { Interviewerdata: intervieworg, maxinterviewcount: intcount } }
          );
        })
      }

    }
    // Save Organizations
    let orgdata = JSON.parse(req.body.Organization);
    let orgcount = 0
    if (orgdata.length > 0) {
      orgdata.map(async (data, indexs) => {
        orgcount = orgcount + 1;

        let obj = new Organizations({
          job_title: data.job_title,
          org_name: data.job_title,
          job_joining_date: data.job_joining_date,
          releiving_date: data.releiving_date,

          experience: data.experience ? `${data.experience} months` : "0 months",
          Candidates: candidate_id,
          org_city: data.org_city,
        });
        await obj.save().then((data) => {
          candidateorg.push(data._id);
        });
        saveddata = await Candidate.findByIdAndUpdate(
          { _id: datsSave._id },
          { $set: { Organizationsdata: candidateorg, maxorgcount: orgcount } }
        );
      });
    }
  }
  res.status(200).json({
    success: true,
    result: saveddata,
    message: "Candidate Added successful",
  });
});

exports.getAllcandidate = catchAsyncErrors(async (req, res, next) => {
  try {
    let maxorg = "";
    let maxint = "";
    let sal = await Candidate.find({}).sort({ 'maxorgcount': -1 }).skip(0).limit(1)
    if (sal.length > 0) {
      maxorg = sal[0].maxorgcount ? sal[0].maxorgcount : 0;
    }
    else {
      maxorg = 0;
    }
    //  maxorg = sal[0].maxorgcount ? sal[0].maxorgcount : 0;
    let sales = await Candidate.find({}).sort({ "maxinterviewcount": -1 }).skip(0).limit(1);
    if (sales.length > 0) {

      maxint = sales[0].maxinterviewcount ? sales[0].maxinterviewcount : 0;
    }
    else {

      maxint = 0
    }
    // let maxint = sales[0].maxinterviewcount ? sales[0].maxinterviewcount : 0;
    await Candidate.find()
      .populate("Organizationsdata Interviewerdata")
      .exec(function (err, datas) {
        if (err) {
          console.log("Errror is", err);
          res.status(400).json({
            sucess: false,
            message: "Error Occured please check server logs",

          });
        } else {
          res.status(200).json({
            sucess: true,
            result: datas,
            maxinterviewcount: maxint ? maxint : 0,
            maxorgcount: maxorg ? maxorg : 0
          });
        }
      });
  } catch (err) {
    console.log("Error in get tender", err);
  }
});

exports.deletecandidate = catchAsyncErrors(async (req, res, next) => {
  let id = req.body.candidateId;
  const tender = await Candidate.findById({ _id: id });
  if (!tender) {
    return next(new ErrorHander(" not found", 404));
  }
  await tender.remove();
  res.status(200).json({
    success: true,
    message: "Candidate Item Deletion Successfull",
  });
});

exports.getCandidateDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let candidateresponse = await Candidate.findById({
    _id: id,
  })
    .populate("Organizationsdata Interviewerdata")
    .exec();
  if (candidateresponse) {
    res.status(200).json({
      success: true,
      result: candidateresponse,
      message: "Candidate Found Sucessfull",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Candidate Not Found",
    });
  }
});
exports.uploadcsv = catchAsyncErrors(async (req, res, next) => {

  let resFilePath1 = "";
  let fileName = "";
  let dataarray = [];
  let candidateorg = [];
  let imageDir = `./public/csv/`;
  let resImageDir = `/csv/`;
  try {
    if (req.files?.csvFiles) {
      uploadPath = __dirname + "uploads";
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }

      if (req.files?.csvFiles.length === undefined || req.files?.csvFiles.length == 1) {
        let randstr = Math.random().toString(36).substring(2, 7);
        let multimedia = req.files.csvFiles;
        let imageExt = path.extname(multimedia.name);
        fileName = req.files.csvFiles.name;
        let filePath = fileName;
        resFilePath1 = imageDir + fileName;
        dataarray.push(resImageDir + fileName);

        await multimedia.mv(resFilePath1);
        let orgkeyarr = [];
        let paths = path.join(__dirname, "..", `${resFilePath1}`);
        let rows = [];
        let allData = [];

        fs.createReadStream(paths)
          .pipe(parse({ headers: true }))
          .on('error', error => {
            console.error(error);
            return;
          })
          .on('data', async (row) => {

            let name = row.Name ? row.Name : "";
            let email = row.Email ? row.Email : "";
            let department = row.Department ? row.Department : ""
            let totalexp = row['Total Experience'] ? row['Total Experience'] : ""
            let contactno = row['Contact No'] ? row['Contact No'] : "";
            let ctc = row.Ctc ? row.Ctc : "";
            let ectc = row.Ectc ? row.Ectc : "";
            let address = row.Address ? row.Address : "";
            let notes = row.Notes ? row.notes : "";
            let noticePeriod = row['Notice Period'] ? row['Notice Period'] : "";
            let sourcedby = row['Sourced By'] ? row['Sourced By'] : "";
            let commentbyhr = row['Comments By Hr'] ? row['Comments By Hr'] : "";
            let interviewschedule = row['Interview Schedule'] ? row['Interview Schedule'] : "no";
            let selected = row.Selected ? row.Selected : "";
            let joiningdate = row['Joining Date'] ? row['Joining Date'] : "";

            /**********************************/
            // For Interview
            let interviewNamecount = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Interview Name'))).forEach((key) => {
              if (key) {
                interviewNamecount++;
              }
              return interviewNamecount;
            });
            let ratingcount = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Interview Rating'))).forEach((key) => {
              if (key) {
                ratingcount++;
              }
              return ratingcount;
            });
            let interviewtypecount = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Interview Type'))).forEach((key) => {
              if (key) {
                interviewtypecount++;
              }
              return interviewtypecount;
            });
            let interviewcommentcunt = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Interview Comments'))).forEach((key) => {
              if (key) {
                interviewcommentcunt++;
              }
              return interviewcommentcunt;
            });
            let proceedcount = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Interview Proceed'))).forEach((key) => {
              if (key) {
                proceedcount++;
              }
              return proceedcount;
            });
            let countarrays = [proceedcount, interviewcommentcunt, interviewtypecount, ratingcount, interviewNamecount];
            let intArray = [];
            let intcount = Math.max(...countarrays);
            for (let i = 0; i < intcount; i++) {
              // Interview Name 0	Interview Rating 0	Interview Type 0	Interview Comments 0	Interview Proceed 0
              if (row['Interview Name ' + i] || row['Interview Rating ' + i] || row['Interview Type ' + i] || row['Interview Comments ' + i] || row['Interview Proceed ' + i]) {
                intArray.push({
                  "interviewer_name": row['Interviewer Name ' + i] ? row['Interviewer Name ' + i] : "",
                  "ratings": row['Interview Rating ' + i] ? row['Interview Rating ' + i] : 1,
                  "interview_type": row['Interview Type ' + i] ? row['Interview Type ' + i] : "",
                  "interviewer_comments": row['Interview Comments ' + i] ? row['Interview Comments ' + i] : "",
                  "Proceed_for_next": row['Interview Proceed ' + i] ? row['Interview Proceed ' + i] : "no",
                })
              }
            }
            // For Job Organization
            let job_titlecount = 0;

            const result = Object.keys(row).filter((key) => key.match(new RegExp('Organization Job Title'))).forEach((key) => {
              if (key) {
                job_titlecount++;
              }
              return job_titlecount;
            });
            let orgcount = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Organization Name '))).forEach((key) => {
              if (key) {
                orgcount++;
              }
              return orgcount;
            });

            let org_city_count = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Organization City Name'))).forEach((key) => {
              if (key) {
                org_city_count++;
              }
              return org_city_count;
            });
            let job_joining_date_count = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Organization Joining Date'))).forEach((key) => {
              if (key) {
                job_joining_date_count++;
              }
              return job_joining_date_count;
            });
            let releiving_date__count = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Organization Releaving Date'))).forEach((key) => {
              if (key) {
                releiving_date__count++;
              }
              return releiving_date__count;
            });
            let jobexpcount = 0;
            Object.keys(row).filter((key) => key.match(new RegExp('Organization Experience'))).forEach((key) => {
              if (key) {
                jobexpcount++;
              }
              return jobexpcount;
            });

            let countarray = [releiving_date__count, jobexpcount, job_joining_date_count, org_city_count, orgcount, job_titlecount];
            let count = Math.max(...countarray);
            let orgArray = [];
            for (let i = 0; i < count; i++) {

              if (row['Organization Job Title ' + i] || row['Organization Name ' + i] || row['Organization City Name ' + i] || row['Organization Joining Date ' + i] || row['Organization Releaving Date ' + i]) {
                orgArray.push({
                  "job_title": row['Organization Job Title ' + i] ? row['Organization Job Title ' + i] : "",
                  "org_name": row['Organization Name ' + i] ? row['Organization Name ' + i] : "",
                  "org_city": row['Organization City Name ' + i] ? row['Organization City Name ' + i] : "",
                  "job_joining_date": row['Organization Joining Date ' + i] ? row['Organization Joining Date ' + i] : "",
                  "releiving_date": row['Organization Releaving Date ' + i] ? row['Organization Releaving Date ' + i] : "",
                })
              }
            }
            allData.push({
              "name": name,
              "department": department, "contact_no": contactno, "email": email, "total_experience": totalexp, "ctc": ctc, "ectc": ectc, "notice_period": noticePeriod, "address": address, "notes": notes, "sourced_by": sourcedby, "comments_by_hr": commentbyhr, "interview_schedule": interviewschedule, 'selected': selected, 'joining_date': joiningdate, "Organizationsdata": [], 'Interviewerdata': "", 'createdAt': new Date(), 'updatedAt': new Date(), Organizations: orgArray, Interviewer: intArray
            });
          })
          .on('end', rowCount => {
            try {
              let saveddata = {};
              allData.map(async (item) => {

                const isCandidate = await Candidate.findOne({ email: item.email });
                if (isCandidate) {
                  return;
                }
                else {
                  if (item.name || item.department || item.contact_no || item.email || item.ctc || item.ectc || item.notice_period || item.address || item.shortlisted) {
                    const candidateobj = new Candidate({
                      name: item.name,
                      department: item.department,
                      contact_no: item.contact_no,
                      email: item.email,
                      total_experience: item.total_experience ? item.total_experience : 0,
                      ctc: item.ctc,
                      ectc: item.ectc,
                      notice_period: item.notice_period,
                      address: item.address,
                      resume: item.resume ? item.resume : "",
                      shortlisted: item.shortlisted,
                      notes: item.notes,
                      sourced_by: item.sourced_by,
                      comments_by_hr: item.comments_by_hr,
                      interview_schedule: item.interview_schedule,
                      selected: item.selected,
                      joining_date: item.joining_date,
                      Organizationsdata: [],
                    });
                    let datasave = await candidateobj.save();
                    let intdetails = [];
                    let intcount = 0
                    if (item.Interviewer.length > 0) {
                      item.Interviewer.map(async (d) => {
                        intcount = intcount + 1;
                        let intobj = new Interview({
                          interviewer_name: d.interviewer_name,
                          interviewer_comments: d.interviewer_comments,
                          ratings: d.ratings,
                          interview_type: d.interview_type,
                          Proceed_for_next: d.Proceed_for_next
                        })
                        await intobj.save().then((res) => {
                          intdetails.push(res._id);
                        })
                        await Candidate.findByIdAndUpdate(
                          { _id: datasave._id },
                          { $set: { Interviewerdata: intdetails, maxinterviewcount: intcount } }
                        );
                      })
                    }
                    let candidateorg = [];
                    let orgcount = 0
                    if (item.Organizations.length > 0) {
                      item.Organizations.map(async (data, indexes) => {
                        let dateA = moment(data.job_joining_date, ["DD-MM-YYYY", "YYYY-MM-DD"]);
                        let dateB = moment(data.releiving_date, ["DD-MM-YYYY", "YYYY-MM-DD"]);
                        let exps = ""
                        if (dateA && dateB) {
                          let exp = dateA.diff(dateB, 'months');
                          if (exp < 0) {
                            exps = -(exp);
                          }
                          else {
                            exps = exp;
                          }
                        }
                        orgcount = orgcount + 1
                        let obj = new Organizations({
                          job_title: data.job_title,
                          org_name: data.org_name,
                          job_joining_date: data.job_joining_date,
                          releiving_date: data.releiving_date,
                          experience: exps ? `${exps} months` : '0 months',
                          Candidates: datasave._id,
                          org_city: data.org_city,
                        });
                        await obj.save().then((data) => {
                          candidateorg.push(data._id);
                        });
                        saveddata = await Candidate.findByIdAndUpdate(
                          { _id: datasave._id },
                          { $set: { Organizationsdata: candidateorg, maxorgcount: orgcount } }
                        );
                      })
                    }
                  }
                }
              })
              return res.json({
                status: true,
                message: "Data imported Successfull.."
              })
            }
            catch (err) {
              return res.json({
                status: false,
                message: "Import Data failed.."
              })
            }
          });
      }
    }
  }
  catch (err) {
    console.log("err", err)
    return res.json({
      sucess: false,
      message: "Failed to insert Csv Data."
    })
  }
});

