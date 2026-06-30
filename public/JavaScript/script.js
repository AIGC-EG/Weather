const button = document.getElementById('get-weather-btn');
const input = document.getElementById('country-input');
const resultsSection = document.getElementById('results-section');

button.addEventListener('click', async () => {
    const countryName = input.value.trim();
    if (!countryName) {
        alert('الرجاء إدخال اسم الدولة أولاً');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/get-weather', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ country: countryName })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('country-text').innerText = `Country: ${data.country}`;
            document.getElementById('lat-text').innerText = `Latitude: ${data.lat}`;
            document.getElementById('lon-text').innerText = `Longitude: ${data.lon}`;
            document.getElementById('temp-text').innerText = `Temperature: ${data.temp}°C`;
            
            resultsSection.style.display = 'flex'; 
        } else {
            alert(data.message || 'حدث خطأ في السيرفر');
            resultsSection.style.display = 'none';
        }
    } catch (error) {
        console.error("تفاصيل الخطأ في المتصفح:", error);
        alert('حدث خطأ أثناء الاتصال بسيرفر Express - تأكد من تشغيل السيرفر في الـ Terminal أولاً');
        resultsSection.style.display = 'none';
    }
});
