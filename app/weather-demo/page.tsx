"use client"

import { useState } from "react"

export default function WeatherDemo() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [city, setCity] = useState("Beijing")

  // 城市名称映射表
  const cityMap = {
    "北京": "Beijing",
    "上海": "Shanghai", 
    "广州": "Guangzhou",
    "深圳": "Shenzhen",
    "杭州": "Hangzhou",
    "成都": "Chengdu",
    "西安": "Xi'an",
    "武汉": "Wuhan"
  }

  const fetchWeather = async (cityName) => {
    setLoading(true)
    setError(null)
    
    try {
      const queryCity = cityName || city
      // 如果是中文城市名，转换为英文
      const englishCity = cityMap[queryCity] || queryCity
      
      console.log('查询城市:', queryCity, '-> 英文名:', englishCity)
      
      const response = await fetch(`/weather?city=${encodeURIComponent(englishCity)}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setWeather(data.data)
      } else {
        setError(data.error || "获取天气信息失败")
      }
    } catch (err) {
      setError("网络请求失败: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-500 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          🌤️ 天气查询演示
        </h1>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
          <div className="flex gap-4 items-center mb-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="输入城市名称 (中文或英文)"
              className="flex-1 px-4 py-2 rounded border bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
            />
            <button
              onClick={() => fetchWeather()}
              disabled={loading}
              className="px-6 py-2 bg-white bg-opacity-30 text-white rounded hover:bg-opacity-40 disabled:opacity-50"
            >
              {loading ? "查询中..." : "查询天气"}
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {["北京", "上海", "广州", "深圳"].map((cityName) => (
              <button
                key={cityName}
                onClick={() => fetchWeather(cityName)}
                disabled={loading}
                className="px-3 py-1 bg-white bg-opacity-20 text-white rounded text-sm hover:bg-opacity-30 disabled:opacity-50"
              >
                {cityName}
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-white text-opacity-70 text-sm">
            💡 提示：支持中文城市名（如：北京、上海）和英文城市名（如：Beijing、London）
          </div>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-100">❌ {error}</p>
          </div>
        )}

        {weather && (
          <div className="bg-white bg-opacity-20 rounded-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {weather.location}, {weather.country}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather.icon}@2x.png`}
                  alt={weather.weather.description}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-4xl font-bold text-white">
                    {weather.temperature}°C
                  </div>
                  <div className="text-white text-opacity-80">
                    {weather.weather.description}
                  </div>
                </div>
              </div>
              <div className="text-white text-opacity-70 mt-2">
                体感温度: {weather.feelsLike}°C
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-10 rounded p-3 text-center">
                <div className="text-white text-opacity-70 text-sm">湿度</div>
                <div className="text-white text-lg font-semibold">{weather.humidity}%</div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded p-3 text-center">
                <div className="text-white text-opacity-70 text-sm">气压</div>
                <div className="text-white text-lg font-semibold">{weather.pressure} hPa</div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded p-3 text-center">
                <div className="text-white text-opacity-70 text-sm">能见度</div>
                <div className="text-white text-lg font-semibold">{weather.visibility} km</div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded p-3 text-center">
                <div className="text-white text-opacity-70 text-sm">风速</div>
                <div className="text-white text-lg font-semibold">{weather.windSpeed} m/s</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white bg-opacity-20 rounded-lg p-6 mt-6">
          <h3 className="text-white text-lg font-semibold mb-4">📡 API 使用示例</h3>
          <div className="space-y-2 text-sm">
            <div className="bg-black bg-opacity-20 rounded p-3">
              <div className="text-white text-opacity-70 mb-1">通过城市名称查询:</div>
              <code className="text-green-300">GET /weather?city=北京</code>
            </div>
            <div className="bg-black bg-opacity-20 rounded p-3">
              <div className="text-white text-opacity-70 mb-1">通过经纬度查询:</div>
              <code className="text-green-300">GET /weather?lat=39.9042&lon=116.4074</code>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-lg p-4 mt-6">
          <p className="text-yellow-100 text-sm">
            ⚠️ <strong>注意:</strong> 请确保已设置 <code>OPENWEATHER_API_KEY</code> 环境变量。
            如果还没有 API Key，请访问 OpenWeatherMap 申请免费账户。
          </p>
        </div>
      </div>
    </div>
  )
}