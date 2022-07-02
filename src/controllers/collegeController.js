const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validUrl=require("valid-url")

// ==========================================================================================================================================>

// globally function for validate user entry

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "number") return false;
    return true;
  };
  
  // globally function for validate request body
  
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };
  
  
// ==========================================================================================================================================>


const createCollege = async function (req, res) {
    try {

        // mandatory  validation  >

        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            
        }

        if (!isValid(requestBody.name)) {
           return  res.status(400).send({ status: false, message: 'college name is required' })
            
        }
        if (!isValid(requestBody.fullName)) {
           return  res.status(400).send({ status: false, message: 'college full name is required' })
            
        }
        if (!isValid(requestBody.logoLink)) {
            return res.status(400).send({ status: false, message: 'logo link is required' })
            
        }
        if(!validUrl.isUri(requestBody.logoLink)){
         return res.status(400).send({status:false,message:"not a valid logo "})
        }
        let checkLogo=/\.(gif|jpe?g|tiff?|png|webp|bmp)$/.test(requestBody.logoLink)
        if(!checkLogo){
          return res.status(400).send({status:false.valueOf,message:"not a valid logo"})
        }

        let uniqueNameCheck = await collegeModel.findOne({name:requestBody.name})
        if(uniqueNameCheck){
        return res.status(400).send({status:false,msg:"this name already exist"})
        }

        

      // after validation create college

        let createCollege = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, data: createCollege })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }

}
// ==========================================================================================================================================>

const getAllIntern = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let collegeName = req.query.collegeName;
   
    // request query params  validation

    if (!collegeName) {
      return res.status(400).send({ status: false, msg: "give inputs" });
    }

    // college validation

    let collegeDetail = await collegeModel.findOne({
      name: collegeName,
      isDeleted: false,
    });
    if (!collegeDetail) {
    return  res
        .status(404)
        .send({
          status: false,
          message: "college not found please provide valid college name",
        });
    }

    // that is one method fo response structure data in data base

    let collegeDetail1 = await collegeModel
      .findOne({ name: collegeName, isDeleted: false })
      .select({ name: 1, fullName: 1, logoLink: 1, _id: 0 });
    let internDetail = await internModel
      .find({ collegeId: collegeDetail._id, isDeleted: false })
      .select({ _id: 1, name: 1, email: 1, mobile: 1 });
      
    if (internDetail.length === 0) {
      return res
        .status(200)
        .send({
          status: true,
          data: {
            ...collegeDetail1.toObject(),
            interns: "intern Details not present",
          },
        });
    }
    let result = { ...collegeDetail1.toObject(), interns: internDetail };

    res.status(200).send({ status: true, data: result });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ================================================================================================================================================>

module.exports.createCollege = createCollege;
module.exports.getAllIntern = getAllIntern;
