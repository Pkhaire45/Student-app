const HomeWork = require("../models/HomeWork");
const Batch = require("../models/Batch");
const Student = require("../models/Student");

/* ======================================================
   CREATE HOMEWORK (ADMIN / TEACHER)
====================================================== */
exports.createHomeWork = async (req, res) => {
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
                fileUrl: `/uploads/homework/${file.filename}`
            }));
        }

        // 4. Create HomeWork
        const homeWork = await HomeWork.create({
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
            message: "Homework created successfully",
            homeWork
        });

    } catch (error) {
        console.error("Create homework error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET ALL HOMEWORK
   - ADMIN / TEACHER: All institute homework
   - STUDENT: Only their active batch's homework
====================================================== */
exports.getAllHomeWork = async (req, res) => {
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

        const homeWorks = await HomeWork.find(filter)
            .populate("batchId", "batchName standard")
            .populate("createdBy", "name email") // Optional: show who created it
            .sort({ startDate: -1 }); // Newest first

        return res.status(200).json({ homeWorks });

    } catch (error) {
        console.error("Get all homework error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET HOMEWORK BY BATCH
====================================================== */
exports.getHomeWorkByBatch = async (req, res) => {
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

        // 3. Fetch Homework
        const homeWorks = await HomeWork.find({
            instituteId: req.instituteId,
            batchId
        })
            .populate("createdBy", "name")
            .sort({ startDate: -1 });

        return res.status(200).json({ homeWorks });

    } catch (error) {
        console.error("Get homework by batch error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET SINGLE HOMEWORK
====================================================== */
exports.getHomeWorkById = async (req, res) => {
    try {
        const homeWork = await HomeWork.findOne({
            _id: req.params.id,
            instituteId: req.instituteId
        }).populate("batchId", "batchName standard");

        if (!homeWork) {
            return res.status(404).json({ message: "Homework not found" });
        }

        // Student Access Check
        if (req.user.role === "STUDENT") {
            const student = await Student.findById(req.user.userId);
            // Ensure the student belongs to the batch of this homework
            if (!student.batchIds.includes(homeWork.batchId._id.toString())) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        return res.status(200).json({ homeWork });

    } catch (error) {
        console.error("Get single homework error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   UPDATE HOMEWORK (ADMIN / TEACHER)
====================================================== */
exports.updateHomeWork = async (req, res) => {
    try {
        const homeWork = await HomeWork.findOne({
            _id: req.params.id,
            instituteId: req.instituteId
        });

        if (!homeWork) {
            return res.status(404).json({ message: "Homework not found" });
        }

        // Handle Attachments: Add new files to existing ones
        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map(file => ({
                fileUrl: `/uploads/homework/${file.filename}`
            }));
            homeWork.attachments.push(...newFiles);
        }

        // Optional: Remove attachments if requested via body (e.g., removeAttachmentIds)
        // This is a common requirement "to implement"
        if (req.body.removeAttachmentIds) {
            let removeIds = req.body.removeAttachmentIds;
            if (!Array.isArray(removeIds)) removeIds = [removeIds];

            homeWork.attachments = homeWork.attachments.filter(
                att => !removeIds.includes(att._id.toString())
            );
        }

        // Update other fields
        // We iterate over the body to allow partial updates, but protect sensitive fields if needed
        const { batchId, startDate, endDate, description, workDate } = req.body;

        if (batchId) homeWork.batchId = batchId;
        if (startDate) homeWork.startDate = startDate;
        if (endDate) homeWork.endDate = endDate;
        if (description) homeWork.description = description;
        if (workDate) homeWork.workDate = workDate;

        await homeWork.save();

        return res.status(200).json({
            message: "Homework updated successfully",
            homeWork
        });

    } catch (error) {
        console.error("Update homework error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   DELETE HOMEWORK (ADMIN / TEACHER)
====================================================== */
exports.deleteHomeWork = async (req, res) => {
    try {
        const deleted = await HomeWork.findOneAndDelete({
            _id: req.params.id,
            instituteId: req.instituteId
        });

        if (!deleted) {
            return res.status(404).json({ message: "Homework not found" });
        }

        return res.status(200).json({
            message: "Homework deleted successfully"
        });

    } catch (error) {
        console.error("Delete homework error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
