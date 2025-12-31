import dbConnect from '../../middleware/mongoose';
import MainCourse from '../../models/MainCourse';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') {
    const { id, totalArmyStrength, axI,aI,bi,totalStrengthA, axR, totalStrengthAX, popupRemarks } = req.body;

    try {
      const updatedMainCourse = await MainCourse.findByIdAndUpdate(
        id,
        {
          totalArmyStrength,
          axI,
          aI,
          bi,
          totalStrengthA,
          axR,
          totalStrengthAX,
          popupRemarks,
        },
        { new: true } // Return the updated document
      );

      if (!updatedMainCourse) {
        return res.status(404).json({ success: false, message: 'MainCourse not found' });
      }

      return res.status(200).json({ success: true, data: updatedMainCourse });
    } catch (error) {
      console.error('Error updating MainCourse:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
