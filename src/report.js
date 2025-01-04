// report.js
const dbPromise = require("../database/db.js");
const { nanoid } = require("nanoid");
const moment = require("moment-timezone");

class Report {
  constructor(
    userId,
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
  ) {
    this.id = nanoid(16);
    this.userId = userId;
    this.date = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    this.time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    this.time_stamp = time_stamp;
    this.dating = Number(dating);
    this.eating = Number(eating);
    this.entertainment = Number(entertainment);
    this.selfCare = Number(selfCare);
    this.sleep = Number(sleep);
    this.study = Number(study);
    this.traveling = Number(traveling);
    this.work = Number(work);
    this.workout = Number(workout);
    this.predictedDayCondition = predictedDayCondition;
    this.predictedDayLabel = predictedDayLabel;
    this.positif = Number(positif);
    this.negatif = Number(negatif);
    this.netral = Number(netral);
    this.dateTips = dateTips;
    this.eatTips = eatTips;
    this.entertainmentTips = entertainmentTips;
    this.selfCareTips = selfCareTips;
    this.sleepTips = sleepTips;
    this.studyTips = studyTips;
    this.travelingTips = travelingTips;
    this.workTips = workTips;
    this.workoutTips = workoutTips;
  }

  static async get(userId, reportId) {
    const { db } = await dbPromise;
    const doc = await db
      .collection("users")
      .doc(userId)
      .collection("reports")
      .doc(reportId)
      .get();
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  }

  static async list(userId) {
    const { db } = await dbPromise;
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("reports")
      .get();
    return snapshot.docs.map((doc) => doc.data());
  }

  static async findByDate(userId, date) {
    const { db } = await dbPromise;
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("reports")
      .where("date", "==", date)
      .get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data();
  }

  async save() {
    const { db } = await dbPromise;
    await db
      .collection("users")
      .doc(this.userId)
      .collection("reports")
      .doc(this.id)
      .set({
        id: this.id,
        userId: this.userId,
        date: this.date,
        time: this.time,
        time_stamp: this.time_stamp,
        dating: this.dating,
        eating: this.eating,
        entertainment: this.entertainment,
        selfCare: this.selfCare,
        sleep: this.sleep,
        study: this.study,
        traveling: this.traveling,
        work: this.work,
        workout: this.workout,
        predictedDayCondition: this.predictedDayCondition,
        predictedDayLabel: this.predictedDayLabel,
        positif: this.positif,
        negatif: this.negatif,
        netral: this.netral,
        dateTips: this.dateTips,
        eatTips: this.eatTips,
        entertainmentTips: this.entertainmentTips,
        selfCareTips: this.selfCareTips,
        sleepTips: this.sleepTips,
        studyTips: this.studyTips,
        travelingTips: this.travelingTips,
        workTips: this.workTips,
        workoutTips: this.workoutTips,
      });
    return this;
  }
}

module.exports = Report;
