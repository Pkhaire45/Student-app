const ClassWork = require("../models/ClassWork");
const Batch = require("../models/Batch");
const Student = require("../models/Student");

/* ======================================================
   CREATE CLASSWORK (ADMIN / TEACHER)
====================================================== */
exports.createClassWork = async (req, res) => {
    try {
        const {
            batchId,
            startDate,
            endDate,
            description,
            workDate
        } = req.body;

        // 1. Basic Validation
        if (!batchId || !startDate || !endDate || !description) {
            return res.status(400).json({ message: "Required fields missing: batchId, startDate, endDate, description" });
        }

        // 2. Validate Batch (Ensure it belongs to the institute)
        const batch = await Batch.findOne({
            _id: batchId,
            instituteId: req.instituteId
        });

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // 3. Handle Attachments
        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map(file => ({
                fileUrl: `/uploads/classworks/${file.filename}`
            }));
        }

        // 4. Create ClassWork
        const classWork = await ClassWork.create({
            instituteId: req.instituteId,
            batchId,
            startDate,
            endDate,
            workDate, // Optional
            description,
            createdBy: req.user.userId,
            attachments
        });

        return res.status(201).json({
            message: "Classwork created successfully",
            classWork
        });

    } catch (error) {
        console.error("Create classwork error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET ALL CLASSWORK
   - ADMIN / TEACHER: All institute classwork
   - STUDENT: Only their active batch's classwork
====================================================== */
exports.getAllClassWork = async (req, res) => {
    try {
        let filter = { instituteId: req.instituteId };

        // Student Role: Filter by their assigned batches
        if (req.user.role === "STUDENT") {
            const student = await Student.findOne({
                _id: req.user.userId,
                instituteId: req.instituteId
            });

            if (!student || !student.batchIds?.length) {
                return res.status(404).json({ message: "No batch assigned to student" });
            }

            filter.batchId = { $in: student.batchIds };
        }

        const classWorks = await ClassWork.find(filter)
            .populate("batchId", "batchName standard")
            .populate("createdBy", "name email")
            .sort({ startDate: -1 });

        return res.status(200).json({ classWorks });

    } catch (error) {
        console.error("Get all classwork error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET CLASSWORK BY BATCH
====================================================== */
exports.getClassWorkByBatch = async (req, res) => {
    const { batchId } = req.params;

    try {
        // 1. Check Batch Existence
        const batch = await Batch.findOne({
            _id: batchId,
            instituteId: req.instituteId
        });

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // 2. Student Access Check
        if (req.user.role === "STUDENT") {
            const student = await Student.findById(req.user.userId);
            if (!student.batchIds.includes(batchId)) {
                return res.status(403).json({ message: "Access denied: You are not in this batch" });
            }
        }

        // 3. Fetch ClassWork
        const classWorks = await ClassWork.find({
            instituteId: req.instituteId,
            batchId
        })
            .populate("createdBy", "name")
            .sort({ startDate: -1 });

        return res.status(200).json({ classWorks });

    } catch (error) {
        console.error("Get classwork by batch error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET SINGLE CLASSWORK
====================================================== */
exports.getClassWorkById = async (req, res) => {
    try {
        const classWork = await ClassWork.findOne({
            _id: req.params.id,
            instituteId: req.instituteId
        }).populate("batchId", "batchName standard");

        if (!classWork) {
            return res.status(404).json({ message: "Classwork not found" });
        }

        // Student Access Check
        if (req.user.role === "STUDENT") {
            const student = await Student.findById(req.user.userId);
            if (!student.batchIds.includes(classWork.batchId._id.toString())) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        return res.status(200).json({ classWork });

    } catch (error) {
        console.error("Get single classwork error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   UPDATE CLASSWORK (ADMIN / TEACHER)
====================================================== */
exports.updateClassWork = async (req, res) => {
    try {
        const classWork = await ClassWork.findOne({
            _id: req.params.id,
            instituteId: req.instituteId
        });

        if (!classWork) {
            return res.status(404).json({ message: "Classwork not found" });
        }

        // Append new attachments
        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map(file => ({
                fileUrl: `/uploads/classworks/${file.filename}`
            }));
            classWork.attachments.push(...newFiles);
        }

        // Optional: Remove attachments if requested
        if (req.body.removeAttachmentIds) {
            let removeIds = req.body.removeAttachmentIds;
            if (!Array.isArray(removeIds)) removeIds = [removeIds];

            classWork.attachments = classWork.attachments.filter(
                att => !removeIds.includes(att._id.toString())
            );
        }

        const { batchId, startDate, endDate, description, workDate } = req.body;

        if (batchId) classWork.batchId = batchId;
        if (startDate) classWork.startDate = startDate;
        if (endDate) classWork.endDate = endDate;
        if (description) classWork.description = description;
        if (workDate) classWork.workDate = workDate;

        await classWork.save();

        return res.status(200).json({
            message: "Classwork updated successfully",
            classWork
        });

    } catch (error) {
        console.error("Update classwork error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   DELETE CLASSWORK (ADMIN / TEACHER)
====================================================== */
exports.deleteClassWork = async (req, res) => {
    try {
        const deleted = await ClassWork.findOneAndDelete({
            _id: req.params.id,
            instituteId: req.instituteId
        });

        if (!deleted) {
            return res.status(404).json({ message: "Classwork not found" });
        }

        return res.status(200).json({
            message: "Classwork deleted successfully"
        });

    } catch (error) {
        console.error("Delete classwork error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
