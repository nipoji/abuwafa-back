// activity.js
const dbPromise = require("../database/db.js");
const { nanoid } = require("nanoid");
const moment = require("moment-timezone");
const admin = require('firebase-admin');

class Activity {
  constructor(userId, quality, activities, duration, notes) {
    this.id = nanoid(16);
    this.userId = userId;
    this.quality = Number(quality);
    this.activities = activities;
    this.duration = Number(duration);
    this.notes = notes;
  }

  static async getServerTime() {
    const { db } = await dbPromise;
    const docRef = db.collection('server_time').doc('time');
    await docRef.set({ timestamp: admin.firestore.FieldValue.serverTimestamp() });
    const doc = await docRef.get();
    const serverTimestamp = doc.data().timestamp.toDate();
    const timeStampJakarta = moment(serverTimestamp).tz("Asia/Jakarta");
    return {
      time_stamp: timeStampJakarta.format('YYYY-MM-DD'),
      time: timeStampJakarta.format('HH:mm:ss')
    };
  }

  static async get(userId, activityId) {
    const { db } = await dbPromise;
    const doc = await db.collection("users").doc(userId).collection("activities").doc(activityId).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  }

  static async list(userId) {
    const { db } = await dbPromise;
    const snapshot = await db.collection("users").doc(userId).collection("activities")
      .orderBy("time_stamp", "desc")
      .orderBy("time", "desc")
      .get();
    return snapshot.docs.map(doc => doc.data());
  }

  async save() {
    const { db } = await dbPromise;
    const { time_stamp, time } = await Activity.getServerTime();

    await db.collection("users").doc(this.userId).collection("activities").doc(this.id).set({
      id: this.id,
      userId: this.userId,
      quality: this.quality,
      activities: this.activities,
      duration: this.duration,
      notes: this.notes,
      time_stamp: time_stamp,
      time: time
    });
    return this;
  }

  static async update(userId, activityId, updates) {
    const { db } = await dbPromise;
    if (updates.quality !== undefined) updates.quality = Number(updates.quality);
    if (updates.duration !== undefined) updates.duration = Number(updates.duration);
    await db.collection("users").doc(userId).collection("activities").doc(activityId).update(updates);
  }

  static async delete(userId, activityId) {
    const { db } = await dbPromise;
    await db.collection("users").doc(userId).collection("activities").doc(activityId).delete();
  }
}

module.exports = Activity;
