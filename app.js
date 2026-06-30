const express = require('express');
const axios = require('axios');                                               
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const MAPBOX_TOKEN = 'pk.eyJ1IjoiaXNsYW0yODQiLCJhIjoiY2wwamEzNmFhMGFtNTNkb3pqaXk4bXNnYSJ9.qYlrWIqo41gXgNNc4h8yIw';

app.post('/get-weather', async (req, res) => {
    const { country } = req.body;
    
    if (!country) {
        return res.status(400).json({ success: false, message: 'الرجاء إرسال اسم الدولة.' });
    }

    try {
        const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${country}.json`;
        const response = await axios.get(mapboxUrl, {
            params: {
                access_token: MAPBOX_TOKEN,
                limit: 1 
            }
        });
        
console.log(response.data);
        if (!response.data.features || response.data.features.length === 0) {
            return res.json({ success: false, message: 'لم يتم العثور على هذا المكان في Mapbox! تأكد من كتابته بالإنجليزية.' });
        }

        const feature = response.data.features[0];
        const longitude = feature.geometry.coordinates[0];
        const latitude = feature.geometry.coordinates[1];
        const placeName = feature.place_name;

        res.json({
            success: true,
            country: placeName,
            lat: latitude.toFixed(4),            
             lon: longitude.toFixed(4),
            temp: "25" 
        });
       
    } catch (error) {
        console.error("تفاصيل الخطأ في سيرفر Mapbox:", error.message);
        res.json({ 
            success: false, 
            message: 'حدث خطأ أثناء الاتصال بخوادم جلب البيانات الجغرافية.' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`app is running on  http://localhost:${PORT}`);
});