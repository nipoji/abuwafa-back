// subjectControllers.js
const Subject = require("./subject");

const createSubject = async (req, res) => {
  try {
    const { id_subject, subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).send({
        error: true,
        message: "Subject title and description are required",
      });
    }

    // Create a new subject
    const subjectInstance = new Subject(id_subject, subject, description);
    await subjectInstance.save();

    return res.status(201).send({
      error: false,
      message: "Subject created successfully",
      id: subjectInstance.id,
    });
  } catch (error) {
    console.error("Error creating subject:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const listSubjects = async (req, res) => {
  try {
    const subjects = await Subject.list();

    return res.send({
      error: false,
      message: "Subjects fetched successfully",
      subjects,
    });
  } catch (error) {
    console.error("Error listing subjects:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const updates = req.body;

    await Subject.update(subjectId, updates);
    return res.send({ error: false, message: "Subject updated successfully" });
  } catch (error) {
    console.error("Error updating subject:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    await Subject.delete(subjectId);
    return res.send({ error: false, message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  createSubject,
  listSubjects,
  updateSubject,
  deleteSubject,
};
