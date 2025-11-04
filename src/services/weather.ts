
import { logger } from "../utils/logger";
import weatherData from "./weather-data";

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
    const argv = process.argv;
    const apiKey = argv.find(arg => arg.startsWith('API_KEY='))?.split('=')[1];

    console.log(`getWeatherByCity, city=${city}, apiKey=${apiKey?.slice(0,4) + '****'}`);
    let cityId = 0;
    for (const cityKey in weatherData) {
        if (cityKey?.includes(city)) {
            cityId = Number(weatherData[cityKey]);
            break;
        }
    }

    logger.info(`getWeatherByCity, ${city} => ${cityId}`)
    if (!cityId) {
        // throw new Error(`❌ City ${city} not found`);
        return `N/A, 天气信息获取失败. city=${city}`;
    }

    const baseUrl = "https://restapi.amap.com";
    // see here 👉 https://console.amap.com/dev/key/app
    const url = `${baseUrl}/v3/weather/weatherInfo?key=${apiKey}&city=${cityId}&extensions=base`;
    const response = await fetch(url);
    if (!response.ok) {
        // throw new Error(`Request failed with status ${response.status}`);
        return `N/A, 天气信息获取失败. status=${response.status}`;
    }
    const data = await response.json();

    console.log(`getWeatherByCity success}, ${JSON.stringify(data)}`);
    const live = data?.lives?.[0];
    if (!live) return `N/A, 天气信息获取失败. json_size=${Object.keys(data || {}).length}`;    

    return `${live.city} ${live.weather} ${live.temperature}℃ ${live.winddirection}风${live.windpower} 湿度${live.humidity}% 报告时间:${live.reporttime}`;
}