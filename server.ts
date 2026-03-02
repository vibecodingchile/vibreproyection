import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data & Logic
  const MOCK_PRODUCTS = [
    { id: "MLC001", name: "Vestido Boho Verano", stock: 45, sales_speed: 5, category: "Vestidos" },
    { id: "MLC002", name: "Jeans Slim Fit", stock: 120, sales_speed: 10, category: "Pantalones" },
    { id: "MLC003", name: "Polera Algodón Pima", stock: 15, sales_speed: 8, category: "Poleras" },
    { id: "MLC004", name: "Chaqueta de Cuero", stock: 30, sales_speed: 2, category: "Abrigos" },
    { id: "MLC005", name: "Zapatillas Urbanas", stock: 8, sales_speed: 4, category: "Calzado" },
  ];

  // API Routes
  app.get("/api/trends", async (req, res) => {
    try {
      // Local Chile Trends
      const localTrends = [
        { keyword: "vestidos de fiesta", url: "#", region: "CL" },
        { keyword: "sandalias mujer", url: "#", region: "CL" },
        { keyword: "trajes de baño", url: "#", region: "CL" },
      ];

      // Global Winter Trends (Asia/Europe) projected for CL Autumn/Winter
      const globalTrends = [
        { keyword: "oversized puffer jackets", url: "#", region: "EU/AS", projection: "High", socialSource: "Instagram" },
        { keyword: "balaclavas knit", url: "#", region: "EU", projection: "Medium", socialSource: "Pinterest" },
        { keyword: "techwear cargo pants", url: "#", region: "AS", projection: "High", socialSource: "TikTok" },
        { keyword: "faux fur boots", url: "#", region: "EU", projection: "High", socialSource: "Instagram" },
      ];

      const socialBigData = {
        topInfluencers: [
          { name: "@fashion_asia_vibe", platform: "Instagram", impact: "High" },
          { name: "@euro_winter_style", platform: "Pinterest", impact: "Medium" },
        ],
        hotSpots: [
          { id: "tokyo", x: 85, y: 35, trend: "Cyberpunk Techwear" },
          { id: "paris", x: 48, y: 30, trend: "Minimalist Wool" },
          { id: "seoul", x: 82, y: 38, trend: "Streetwear Oversize" },
          { id: "milan", x: 50, y: 35, trend: "Luxury Fur" },
        ]
      };

      res.json({ local: localTrends, global: globalTrends, social: socialBigData });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  app.get("/api/dashboard", async (req, res) => {
    // Fetching real weather from Open-Meteo (Santiago, CL)
    let weather = { temp: 28, humidity: 45, windSpeed: 12, city: "Santiago, CL" };
    try {
      const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-33.4569&longitude=-70.6483&current=temperature_2m,relative_humidity_2m,wind_speed_10m");
      const weatherData = await weatherRes.json();
      if (weatherData.current) {
        weather = {
          temp: Math.round(weatherData.current.temperature_2m),
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: Math.round(weatherData.current.wind_speed_10m),
          city: "Santiago, CL"
        };
      }
    } catch (e) {
      console.error("Weather fetch failed, using fallback", e);
    }

    const trends = ["vestidos", "sandalias", "trajes de baño"];
    
    const productsWithRisk = MOCK_PRODUCTS.map(p => {
      const daysLeft = Math.floor(p.stock / p.sales_speed);
      let risk = "low";
      let alert = "";

      // Predictive Logic: If trend is high and temp is high
      const isTrending = trends.some(t => p.name.toLowerCase().includes(t));
      
      if (isTrending && weather.temp > 25 && daysLeft < 15) {
        risk = "high";
        alert = "ALTO RIESGO DE QUIEBRE: Tendencia + Clima Cálido";
      } else if (daysLeft < 7) {
        risk = "high";
        alert = "STOCK CRÍTICO";
      } else if (daysLeft < 20) {
        risk = "medium";
        alert = "Revisar reposición";
      }

      return { ...p, daysLeft, risk, alert };
    });

    res.json({
      weather,
      products: productsWithRisk,
      lastSync: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VibePredict running at http://localhost:${PORT}`);
  });
}

startServer();
