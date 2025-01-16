import Med from '../models/medModel.js';

const medController = {};

medController.getAllMeds = async (req, res) => {
  try {
    const { userId } = req;
    const meds = await Med.find({ userId });
    res.status(200).json(meds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'faild to fetch' });
  }
};

medController.createMeds = async (req, res) => {
  try {
    const { userId } = req;
    const {
      medName,
      dosage,
      frequency,
      startDate,
      endDate,
      type,
      purpose,
      notes,
    } = req.body;
    if (!dosage || !frequency || !startDate) {
      return res
        .status(400)
        .json({ error: 'Dosage, frequency, and startDate are required' });
    }
    const newMed = new Med({
      medName,
      userId,
      dosage,
      frequency,
      startDate,
      endDate,
      type,
      purpose,
      notes,
    });
    const savedMed = await newMed.save();
    console.log('created medication ', savedMed);

    res
      .status(201)
      .json({ message: 'Medication record created', med: savedMed });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'faild to create' });
  }
};

medController.updateMeds = async (req, res) => {
  try {
    const { id } = req.params;
    const { dosage, frequency, startDate, endDate, type, purpose, notes } =
      req.body;
    const updatedMed = await Med.findByIdAndUpdate(
      id,
      { dosage, frequency, startDate, endDate, type, purpose, notes },
      { new: true, runValidators: true }
    );
    if (!updatedMed) {
      return res.status(404).json({ error: 'Medication record not found' });
    }
    res.status(200).json({
      message: 'Medication record updated successfully',
      med: updatedMed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'faild to update' });
  }
};

medController.deleteMeds = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMed = await Med.findByIdAndDelete(id);
    if (!deletedMed) {
      return res.status(404).json({ error: 'Medication record not found' });
    }
    res.status(200).json({ message: 'Medication record deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'faild to delete' });
  }
};

export default medController;
