'use client';

import { useState } from 'react';

export default function WeatherTestPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('北京');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryCity = cityName || city;
      const response = await fetch(`/weather?city=${encodeURIComponent(queryCity)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setWeather(data.data);
      } else {
        setError(data.error || '获取天气信息失败');
      }
    } catch (err) {
      setError('网络请求失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`/weather?lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            if (data.success && data.data) {
              setWeather(data.data);
            } else {
              setError(data.error || '获取天气信息失败');
            }
          } catch (err) {
            setError('获取位置天气失败: ' + err.message);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('获取位置失败: ' + err.message);
          setLoading(false);
        }
      );
    } else {
      setError('浏览器不支持地理位置功能');
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWindDirection = (degree) => {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
      padding: '20px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '2rem' 
        }}>
          🌤️ 天气查询测试
        </h1>
        
        {/* 控制面板 */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: '24px', 
          marginBottom: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="输入城市名称"
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              onClick={() => fetchWeather()}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {loading ? '查询中...' : '查询天气'}
            </button>
            <button
              onClick={fetchLocationWeather}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              📍 当前位置
            </button>
          </div>
        </div>

        {/* 快速查询按钮 */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: '24px', 
          marginBottom: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
            快速查询热门城市
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '12px' 
          }}>
            {['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '武汉'].map((cityName) => (
              <button
                key={cityName}
                onClick={() => fetchWeather(cityName)}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: loading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.2)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px', 
            padding: '16px', 
            marginBottom: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ color: 'rgba(254, 226, 226, 1)', margin: 0 }}>❌ {error}</p>
          </div>
        )}

        {/* 天气信息 */}
        {weather && (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '16px', 
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                {weather.location}, {weather.country}
              </h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather.icon}@2x.png`}
                  alt={weather.weather.description}
                  style={{ width: '64px', height: '64px' }}
                />
                <div>
                  <div style={{ 
                    fontSize: '3rem', 
                    fontWeight: 'bold', 
                    color: 'white' 
                  }}>
                    {weather.temperature}°C
                  </div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '1.125rem' 
                  }}>
                    {weather.weather.description}
                  </div>
                </div>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                体感温度: {weather.feelsLike}°C
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '4px' }}>湿度</div>
                <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>{weather.humidity}%</div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '4px' }}>气压</div>
                <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>{weather.pressure} hPa</div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '4px' }}>能见度</div>
                <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>{weather.visibility} km</div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '4px' }}>风速</div>
                <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>{weather.windSpeed} m/s</div>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '16px' 
            }}>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '4px' }}>风向</div>
                <div style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600' }}>
                  {getWindDirection(weather.windDirection)} ({weather.windDirection}°)
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '4px' }}>日出</div>
                <div style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600' }}>
                  🌅 {formatTime(weather.sunrise)}
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '4px' }}>日落</div>
                <div style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600' }}>
                  🌇 {formatTime(weather.sunset)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API 使用说明 */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: '24px', 
          marginTop: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
            📡 API 使用示例
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
            <div style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: '8px', 
              padding: '12px' 
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>通过城市名称查询:</div>
              <code style={{ color: '#10b981' }}>GET /weather?city=北京</code>
            </div>
            <div style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: '8px', 
              padding: '12px' 
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>通过经纬度查询:</div>
              <code style={{ color: '#10b981' }}>GET /weather?lat=39.9042&lon=116.4074</code>
            </div>
            <div style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: '8px', 
              padding: '12px' 
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>指定语言:</div>
              <code style={{ color: '#10b981' }}>GET /weather?city=Beijing&lang=en</code>
            </div>
          </div>
        </div>

        {/* 注意事项 */}
        <div style={{ 
          backgroundColor: 'rgba(245, 158, 11, 0.2)', 
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px', 
          padding: '16px', 
          marginTop: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ color: 'rgba(254, 240, 138, 1)', fontSize: '0.875rem', margin: 0 }}>
            ⚠️ <strong>注意:</strong> 请确保已设置 <code>OPENWEATHER_API_KEY</code> 环境变量。
            如果还没有 API Key，请访问 <a 
              href="https://openweathermap.org/api" 
              target="_blank" 
              style={{ textDecoration: 'underline', color: 'inherit' }}
            >
              OpenWeatherMap
            </a> 申请免费账户。
          </p>
        </div>
      </div>
    </div>
  );
}