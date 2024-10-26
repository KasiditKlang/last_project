const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // ดึง MongoClient มาใช้งาน

const app = express();
const PORT = 3000;

// กำหนด URI สำหรับเชื่อมต่อ MongoDB Atlas
const uri = `mongodb+srv://Admin:124816@cluster0.jmlk7.mongodb.net/`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // กำหนด client

let db;

// ฟังก์ชันเชื่อมต่อกับ MongoDB Atlas
async function connectDB() {
    try {
        await client.connect();
        db = client.db('your-database-name'); // ใช้ชื่อ database ของคุณ
        console.log('Connected to MongoDB Atlas!');
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas:', error);
    }
}

// เรียกใช้งานฟังก์ชันเชื่อมต่อกับฐานข้อมูล
connectDB();

// เปิดใช้งาน CORS และ JSON Payload
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// เสิร์ฟไฟล์ static จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// API เพื่อดึงข้อมูลเมนูทั้งหมดจาก MongoDB
app.get('/api/meals', async (req, res) => {
    try {
        const meals = await db.collection('meals').find().toArray();
        res.json(meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).send('Error fetching meals');
    }
});

// API เพื่อเพิ่มเมนูใหม่ลงใน MongoDB
app.post('/api/meals', async (req, res) => {
    try {
        const newMeal = req.body;
        if (!newMeal.name || !newMeal.image || !newMeal.probability) {
            return res.status(400).send('Invalid meal data');
        }
        await db.collection('meals').insertOne(newMeal);
        res.status(201).send('Meal added successfully');
    } catch (error) {
        console.error('Error adding meal:', error);
        res.status(500).send('Error adding meal');
    }
});

// เสิร์ฟ HTML หน้าแรก
app.get('*', (req, res) => {
    res.sendFile('loginResponsive.html', { root: 'public' });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});