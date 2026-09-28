const express = require('express');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Add new fee record (admin + accountant)
router.post('/', auth(['admin', 'accountant']), async (req, res) => {
  try {
    const fee = await Fee.create(req.body); // new fee entry
    res.json(fee);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all fee records (admin + accountant see everything, teacher sees only their class)
router.get('/', auth(['admin', 'accountant', 'teacher']), async (req, res) => {
  try {
    let studentFilter = {};

    if (req.user.role === 'teacher') {
      const teacher = await User.findById(req.user.id);
      if (!teacher?.department) return res.json([]);

      const deptStudents = await Student.find({ department: teacher.department }).select('_id');
      studentFilter = { student: { $in: deptStudents.map((s) => s._id) } };
    }

    const list = await Fee
      .find(studentFilter)
      .populate('student') // student detail show
      .sort({ createdAt: -1 }); // latest first
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Mark fee as paid (admin + accountant)
router.put('/:id/pay', auth(['admin', 'accountant']), async (req, res) => {
  try {
    const paidFee = await Fee.findByIdAndUpdate(
      req.params.id,
      { paid: true, paidOn: new Date() }, // paid mark
      { new: true }
    );
    res.json(paidFee);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// pehle aisa tha:
// router.get('/:id/invoice', auth(['admin','accountant','teacher']), async (...) => {

router.get('/:id/invoice', async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student');
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice_${fee.student.name}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("School Fee Invoice", { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Student Name: ${fee.student.name}`);
    doc.text(`Department: ${fee.student.department}`);
    doc.text(`Course: ${fee.student.course}`);
    doc.text(`Amount: ₹${fee.amount}`);
    doc.text(`Due Date: ${new Date(fee.dueDate).toDateString()}`);
    doc.text(`Status: ${fee.paid ? 'Paid' : 'Pending'}`);
    if (fee.paid && fee.paidOn) {
      doc.text(`Paid On: ${new Date(fee.paidOn).toDateString()}`);
    }

    doc.moveDown();
    doc.text("Thank you", { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;




