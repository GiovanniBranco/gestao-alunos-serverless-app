const { getDataCsvFile, executeUploadBucket } = require("./serverS3");
const { convertCsvData } = require("../convertCsvData");
const { registerOnBD } = require("../registerOnBD");

module.exports.uploadCsvSimulated = async (event) => {
  try {
    await executeUploadBucket();
    console.log("simule aqui o upload do arquivo");

    return {
      statusCode: 200,
      body: JSON.stringify({
        mensagem: "Simulando upload de arquivo...",
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports.registerStudents = async (event) => {
  try {
    const s3Event = event.Records[0].s3;

    const bucket = s3Event.bucket.name;
    const fileKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, ""));

    const fileData = await getDataCsvFile(bucket, fileKey);

    const students = await convertCsvData(fileData);

    await registerOnBD(students);

    console.log("Register successfully completed");
  } catch (error) {
    console.log(error);
  }
};
