interface WeatherRequest {
  city?: string;
  lat?: number;
  lon?: number;
  lang?: string;
}

interface WeatherResponse {
  success: boolean;
  data?: {
    location: string;
    country: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    sunrise: string;
    sunset: string;
    timezone: number;
  };
  error?: string;
}

export const onRequestGet = async ({ request }: { request: Request }): Promise<Response> => {
  try {
    // 处理 EdgeOne Pages 开发环境中的 URL
    let url: URL;
    try {
      url = new URL(request.url);
    } catch {
      // 如果 request.url 只是路径，构造完整 URL
      url = new URL(request.url, 'http://localhost:8088');
    }
    
    const city = url.searchParams.get('city');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const lang = url.searchParams.get('lang') || 'zh_cn';

    // OpenWeatherMap API Key (需要用户自己申请)
    const API_KEY = process.env.OPENWEATHER_API_KEY || '7fdd49cce580fb348ba84f8e4efaac17';
    
    if (API_KEY === 'YOUR_API_KEY_HERE') {
      return new Response(JSON.stringify({
        success: false,
        error: '请设置 OPENWEATHER_API_KEY 环境变量。请访问 https://openweathermap.org/api 申请免费 API Key'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      });
    }

    let apiUrl = '';
    
    // 构建 API URL
    if (city) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=${lang}`;
    } else if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: '请提供城市名称 (city) 或经纬度 (lat, lon) 参数'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      });
    }

    console.log('正在请求天气数据:', apiUrl.replace(API_KEY, '***'));

    // 调用 OpenWeatherMap API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({
        success: false,
        error: `天气 API 错误: ${errorData.message || response.statusText}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      });
    }

    const weatherData = await response.json();

    // 格式化响应数据
    const formattedResponse: WeatherResponse = {
      success: true,
      data: {
        location: weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 0,
        windSpeed: weatherData.wind?.speed || 0,
        windDirection: weatherData.wind?.deg || 0,
        weather: {
          main: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        },
        sunrise: new Date(weatherData.sys.sunrise * 1000).toISOString(),
        sunset: new Date(weatherData.sys.sunset * 1000).toISOString(),
        timezone: weatherData.timezone,
      }
    };

    return new Response(JSON.stringify(formattedResponse), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('天气 API 错误:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
  }
};

export const onRequestPost = async ({ request }: { request: Request }): Promise<Response> => {
  try {
    const body: WeatherRequest = await request.json();
    const { city, lat, lon, lang = 'zh_cn' } = body;

    // OpenWeatherMap API Key
    const API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
    
    if (API_KEY === 'YOUR_API_KEY_HERE') {
      return new Response(JSON.stringify({
        success: false,
        error: '请设置 OPENWEATHER_API_KEY 环境变量'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      });
    }

    let apiUrl = '';
    
    if (city) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=${lang}`;
    } else if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: '请在请求体中提供城市名称 (city) 或经纬度 (lat, lon)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      });
    }

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({
        success: false,
        error: `天气 API 错误: ${errorData.message || response.statusText}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      });
    }

    const weatherData = await response.json();

    const formattedResponse: WeatherResponse = {
      success: true,
      data: {
        location: weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 0,
        windSpeed: weatherData.wind?.speed || 0,
        windDirection: weatherData.wind?.deg || 0,
        weather: {
          main: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        },
        sunrise: new Date(weatherData.sys.sunrise * 1000).toISOString(),
        sunset: new Date(weatherData.sys.sunset * 1000).toISOString(),
        timezone: weatherData.timezone,
      }
    };

    return new Response(JSON.stringify(formattedResponse), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('天气 API 错误:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
  }
};