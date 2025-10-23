
export interface WeatherInfo {
    status: string;
    count: string;
    info: string;
    infocode: string;
    lives: Array<{
        province: string;
        city: string;
        adcode: string;
        weather: string;
        temperature: string;
        winddirection: string;
        windpower: string;
        humidity: string;
        reporttime: string;
        temperature_float: string;
        humidity_float: string;
    }>;
}

export async function getWeatherByCity(city: string): Promise<string> {
    const cityMapping: Record<string, number> = {
        "北京": 110101,
        "深圳": 440300
    }
    const cityId = cityMapping[city];

    if (!cityId) {
        throw new Error(`❌ City ${city} not found`);
    }

    const baseUrl = "https://restapi.amap.com";
    // see here 👉 https://console.amap.com/dev/key/app
    const apiKey = 'your_api_key';
    const url = `${baseUrl}/v3/weather/weatherInfo?key=${apiKey}&city=${cityId}&extensions=base`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    const weather = data?.lives?.[0]?.weather || 'N/A';
    return weather;
}

// getWeatherByCity('深圳').then(res => {
//     console.log('getWeatherByCity success, ', res);
// });