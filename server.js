const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Set up Cloudinary
cloudinary.config({
  cloud_name: 'difgb8jth',
  api_key: '413451151295274',
  api_secret: 'kVU2izc3JVVm6rrjs9eMsGZC0pE',
});

// Set up MongoDB
mongoose.connect('mongodb+srv://amitdwivedi0205:amit123@cluster0.pw76lpo.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a data model (Mongoose schema) for the first collection
const dataSchema = new mongoose.Schema({
  name: String,
  message: String,
  imageUrl: String,
});

const Data = mongoose.model('Data', dataSchema);

// Define a data model (Mongoose schema) for the second collection
const Data2 = mongoose.model('Data2', dataSchema);

// Set up Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes and controllers
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Upload the image to Cloudinary
    // const result = await cloudinary.uploader.upload(req.body.image);
    // const imageUrl = result.secure_url;
    const newData1 = new Data({
      name: req.body.name,
      // message: req.body.message,
      // imageUrl,
    });
    await newData1.save();

    // Save data in the second collection
    const newData2 = new Data2({
      name: req.body.name,
      // message: req.body.message,
    });
    await newData2.save();

    res.status(200).json({ message: 'Data uploaded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading data.' });
  }
});

app.get('/data', async (req, res) => {
  try {
    // Retrieve the latest document from the second collection
    const latestData = await Data2.findOne().sort({ _id: -1 });

    if (!latestData) {
      return res.json({ message: 'No data available.' });
    }

    // Delete the retrieved document from the second collection
    await Data2.deleteOne({ _id: latestData._id });

    res.json(latestData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving data.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
