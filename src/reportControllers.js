// reportControllers.js
const Report = require("./report");
const moment = require('moment-timezone');

const createReport = async (req, res) => {
  try {
    const {
      time_stamp,
      dating,
      eating,
      entertainment,
      selfCare,
      sleep,
      study,
      traveling,
      work,
      workout,
      predictedDayCondition,
      predictedDayLabel,
      positif,
      negatif,
      netral,
      dateTips,
      eatTips,
      entertainmentTips,
      selfCareTips,
      sleepTips,
      studyTips,
      travelingTips,
      workTips,
      workoutTips,
    } = req.body;
    const userId = req.user.id; // Get userId from the token
    const date = moment().tz("Asia/Jakarta").format('YYYY-MM-DD');

    if (
      !time_stamp ||
      dating === undefined ||
      eating === undefined ||
      entertainment === undefined ||
      selfCare === undefined ||
      sleep === undefined ||
      study === undefined ||
      traveling === undefined ||
      work === undefined ||
      workout === undefined ||
      predictedDayCondition === undefined ||
      predictedDayLabel === undefined ||
      positif === undefined ||
      negatif === undefined ||
      netral === undefined ||
      dateTips === undefined ||
      eatTips === undefined ||
      entertainmentTips === undefined ||
      selfCareTips === undefined ||
      sleepTips === undefined ||
      studyTips === undefined ||
      travelingTips === undefined ||
      workTips === undefined ||
      workoutTips === undefined
    ) {
      return res.status(400).send({
        error: true,
        message: "All fields are required",
      });
    }

    // Check if a report already exists with the same timeStamp
    const existingReport = await Report.findByDate(userId, date);
    if (existingReport) {
      return res.status(400).send({
        error: true,
        message: "A report already exists for this date",
      });
    }

    const report = new Report(
      userId,
      time_stamp,
      Number(dating),
      Number(eating),
      Number(entertainment),
      Number(selfCare),
      Number(sleep),
      Number(study),
      Number(traveling),
      Number(work),
      Number(workout),
      predictedDayCondition,
      predictedDayLabel,
      Number(positif),
      Number(negatif),
      Number(netral),
      dateTips,
      eatTips,
      entertainmentTips,
      selfCareTips,
      sleepTips,
      studyTips,
      travelingTips,
      workTips,
      workoutTips
    );
    await report.save();

    return res.status(201).send({
      error: false,
      message: "Report created successfully",
      id: report.id, // Return only the id
    });
  } catch (error) {
    console.error("Error creating report:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id; // Get userId from the token
    const report = await Report.get(userId, reportId);
    if (!report) {
      return res.status(404).send({
        error: true,
        message: "Report not found",
      });
    }
    const {
      date,
      time_stamp,
      dating,
      eating,
      entertainment,
      selfCare,
      sleep,
      study,
      traveling,
      work,
      workout,
      predictedDayCondition,
      predictedDayLabel,
      positif,
      negatif,
      netral,
      dateTips,
      eatTips,
      entertainmentTips,
      selfCareTips,
      sleepTips,
      studyTips,
      travelingTips,
      workTips,
      workoutTips
    } = report;
    return res.send({
      error: false,
      message: "Report fetched successfully",
      report: {
        date,
        time,
        time_stamp,
        dating,
        eating,
        entertainment,
        selfCare,
        sleep,
        study,
        traveling,
        work,
        workout,
        predictedDayCondition,
        predictedDayLabel,
        positif,
        negatif,
        netral,
        dateTips,
        eatTips,
        entertainmentTips,
        selfCareTips,
        sleepTips,
        studyTips,
        travelingTips,
        workTips,
        workoutTips
      },
    });
  } catch (error) {
    console.error("Error fetching report:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

const listReports = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from the token
    const reports = await Report.list(userId);
    return res.send({
      error: false,
      message: "Reports fetched successfully",
      reports: reports.map((report) => ({
        id: report.id,
        date: report.date,
        time: report.time,
        time_stamp: report.time_stamp,
        dating: report.dating,
        eating: report.eating,
        entertainment: report.entertainment,
        selfCare: report.selfCare,
        sleep: report.sleep,
        study: report.study,
        traveling: report.traveling,
        work: report.work,
        workout: report.workout,
        predictedDayCondition: report.predictedDayCondition,
        predictedDayLabel: report.predictedDayLabel,
        positif: report.positif,
        negatif: report.negatif,
        netral: report.netral,
        dateTips: report.dateTips,
        eatTips: report.eatTips,
        entertainmentTips: report.entertainmentTips,
        selfCareTips: report.selfCareTips,
        sleepTips: report.sleepTips,
        studyTips: report.studyTips,
        travelingTips: report.travelingTips,
        workTips: report.workTips,
        workoutTips: report.workoutTips
      })),
    });
  } catch (error) {
    console.error("Error listing reports:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createReport,
  getReport,
  listReports,
};
