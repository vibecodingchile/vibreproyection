import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  RefreshCw, 
  ThermometerSun, 
  ChevronRight,
  Search,
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Droplets,
  Wind,
  Globe,
  Snowflake,
  Instagram,
  Camera,
  Map as MapIcon,
  Users,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  stock: number;
  sales_speed: number;
  daysLeft: number;
  risk: 'low' | 'medium' | 'high';
  alert: string;
}

interface Trend {
  keyword: string;
  url: string;
  region?: string;
  projection?: string;
  socialSource?: string;
}

interface SocialHotSpot {
  id: string;
  x: number;
  y: number;
  trend: string;
}

interface DashboardData {
  weather: { temp: number; humidity: number; windSpeed: number; city: string };
  products: Product[];
  lastSync: string;
}

interface SocialData {
  topInfluencers: { name: string; platform: string; impact: string }[];
  hotSpots: SocialHotSpot[];
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [localTrends, setLocalTrends] = useState<Trend[]>([]);
  const [globalTrends, setGlobalTrends] = useState<Trend[]>([]);
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    try {
      const [dashRes, trendsRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/trends')
      ]);
      const dashData = await dashRes.json();
      const trendsData = await trendsRes.json();
      setData(dashData);
      setLocalTrends(trendsData.local);
      setGlobalTrends(trendsData.global);
      setSocialData(trendsData.social);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await fetchData();
    setSyncing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ml-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-ml-blue/20 border-t-ml-blue rounded-full animate-spin" />
          <p className="text-ml-black font-bold tracking-tight">Cargando VibePredict...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ml-bg text-ml-black font-sans selection:bg-ml-yellow/50">
      {/* Sidebar - Mercado Libre Style */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-300 bg-white hidden lg:flex flex-col p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-ml-yellow rounded-full flex items-center justify-center shadow-sm border border-zinc-200">
            <ShoppingBag className="w-6 h-6 text-ml-blue" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-ml-blue">VibePredict</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<ShoppingBag size={20} />} label="Ventas" />
          <NavItem icon={<BarChart3 size={20} />} label="Métricas" />
          <NavItem icon={<Globe size={20} />} label="Global Trends" />
          <NavItem icon={<Users size={20} />} label="Influencers" />
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-ml-yellow/10 border border-ml-yellow/30">
            <div className="w-8 h-8 rounded-full bg-ml-blue flex items-center justify-center text-white text-xs font-bold">ML</div>
            <div>
              <p className="text-xs font-bold">Vendedor Chile</p>
              <p className="text-[10px] text-ml-blue font-bold uppercase">MercadoLíder Platinum</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-ml-yellow p-6 rounded-3xl border border-zinc-300 shadow-sm">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-ml-blue mb-1 uppercase">VibePredict <span className="text-ml-black">Fashion Edition</span></h2>
            <p className="text-ml-black/70 text-sm font-medium">Análisis de Big Data & Tendencias Sociales</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-white border border-zinc-300 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <ThermometerSun className="text-orange-500" size={20} />
                <span className="text-sm font-bold font-mono">{data?.weather.temp}°C</span>
              </div>
              <div className="w-px h-6 bg-zinc-200" />
              <div className="flex items-center gap-2">
                <Droplets className="text-ml-blue" size={18} />
                <span className="text-sm font-bold font-mono">{data?.weather.humidity}%</span>
              </div>
            </div>
            
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-6 py-3 bg-ml-blue hover:bg-blue-600 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizando...' : 'Sincronizar'}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Chile Trends" 
            value={localTrends.length.toString()} 
            sub="Mercado Libre MLC"
            icon={<TrendingUp className="text-ml-blue" />}
          />
          <StatCard 
            title="Riesgo Stock" 
            value={data?.products.filter(p => p.risk === 'high').length.toString() || '0'} 
            sub="Alertas críticas"
            icon={<AlertTriangle className="text-red-500" />}
            alert={true}
          />
          <StatCard 
            title="Social Buzz" 
            value="98.2%" 
            sub="Instagram/Pinterest"
            icon={<Zap className="text-ml-yellow" />}
            dark
          />
          <StatCard 
            title="Influencers" 
            value={socialData?.topInfluencers.length.toString() || '0'} 
            sub="Impacto Global"
            icon={<Users className="text-ml-blue" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Product Table */}
          <section className="xl:col-span-2 space-y-8">
            <div className="bg-white border border-zinc-300 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
                <h3 className="font-bold text-lg text-ml-black">Inventario & Riesgo Predictivo</h3>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">MLC - Chile</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100">
                      <th className="p-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Producto</th>
                      <th className="p-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Stock</th>
                      <th className="p-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-center">Días</th>
                      <th className="p-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Riesgo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {data?.products.map((product) => (
                      <tr key={product.id} className="hover:bg-ml-yellow/5 transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-ml-blue">{product.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{product.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{product.stock}</span>
                            <span className="text-[10px] text-zinc-500">Vel: {product.sales_speed}/d</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-sm font-bold ${product.daysLeft < 10 ? 'text-red-500' : 'text-ml-black'}`}>
                            {product.daysLeft}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            product.risk === 'high' ? 'bg-red-100 text-red-600' : 
                            product.risk === 'medium' ? 'bg-orange-100 text-orange-600' : 
                            'bg-emerald-100 text-emerald-600'
                          }`}>
                            {product.risk === 'high' ? 'Crítico' : product.risk === 'medium' ? 'Alerta' : 'OK'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Social Big Data Map Section */}
            <div className="bg-ml-black text-white border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <Globe className="text-ml-yellow" size={24} />
                  <h3 className="font-bold text-lg">Social Big Data Map</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-[10px] font-bold">
                    <Instagram size={12} className="text-pink-400" /> Instagram
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-[10px] font-bold">
                    <Camera size={12} className="text-red-400" /> Pinterest
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Mini World Map SVG */}
                <div className="relative aspect-video bg-white/5 rounded-2xl border border-white/10 p-4">
                  <svg viewBox="0 0 100 50" className="w-full h-full opacity-40 fill-white">
                    <path d="M10,15 Q15,10 20,15 T30,15 T40,20 T50,15 T60,20 T70,15 T80,20 T90,15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
                    {/* Simplified World Map Shapes */}
                    <rect x="15" y="10" width="15" height="15" rx="2" opacity="0.3" />
                    <rect x="45" y="8" width="10" height="12" rx="2" opacity="0.3" />
                    <rect x="75" y="12" width="12" height="15" rx="2" opacity="0.3" />
                    <rect x="25" y="30" width="10" height="12" rx="2" opacity="0.3" />
                  </svg>
                  
                  {/* Hotspots */}
                  {socialData?.hotSpots.map((spot) => (
                    <motion.div
                      key={spot.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute group"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    >
                      <div className="w-3 h-3 bg-ml-yellow rounded-full animate-ping absolute -inset-1" />
                      <div className="w-3 h-3 bg-ml-yellow rounded-full relative z-10 border border-ml-black" />
                      
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                        <div className="bg-white text-ml-black text-[9px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap border border-zinc-200">
                          {spot.trend}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-ml-yellow uppercase tracking-widest">Top Influencer Trends</h4>
                  {socialData?.topInfluencers.map((inf, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ml-yellow to-ml-blue flex items-center justify-center text-[10px] font-bold">
                          {inf.name[1].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{inf.name}</p>
                          <p className="text-[9px] text-zinc-500">{inf.platform}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-ml-yellow text-ml-black rounded-full uppercase">Impact: {inf.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-ml-blue/10 blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-ml-yellow/10 blur-[100px] -ml-32 -mb-32" />
            </div>
          </section>

          {/* Trends Sidebar */}
          <section className="space-y-6">
            <div className="bg-white border border-zinc-300 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-ml-blue">Hot en Chile</h3>
                <div className="px-2 py-1 bg-ml-yellow text-ml-black text-[10px] font-black rounded uppercase tracking-tighter">
                  Real Time
                </div>
              </div>
              
              <div className="space-y-3">
                {localTrends.map((trend, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-2xl hover:border-ml-blue transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="text-ml-blue font-black text-xs">#{idx + 1}</span>
                      <span className="text-sm font-bold text-ml-black group-hover:text-ml-blue transition-colors">{trend.keyword}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-ml-blue" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ml-blue text-white border border-blue-700 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Snowflake size={20} className="text-ml-yellow" />
                  <h3 className="font-bold text-lg">Proyección Invierno</h3>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3 mb-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Región</span>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Asia', 'Europe'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRegionFilter(r)}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          regionFilter === r 
                            ? 'bg-ml-yellow text-ml-black' 
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Fuente Social</span>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Instagram', 'Pinterest', 'TikTok'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSourceFilter(s)}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          sourceFilter === s 
                            ? 'bg-ml-yellow text-ml-black' 
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {globalTrends
                  .filter(trend => {
                    const regionMatch = regionFilter === 'All' || 
                      (regionFilter === 'Asia' && trend.region?.includes('AS')) ||
                      (regionFilter === 'Europe' && trend.region?.includes('EU'));
                    const sourceMatch = sourceFilter === 'All' || trend.socialSource === sourceFilter;
                    return regionMatch && sourceMatch;
                  })
                  .map((trend, idx) => (
                    <div key={idx} className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold">{trend.keyword}</span>
                        <span className="text-[9px] bg-ml-yellow text-ml-black px-1.5 py-0.5 rounded font-black uppercase">{trend.projection}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-white/60 font-mono">{trend.region}</span>
                        <span className="text-[9px] text-ml-yellow font-bold uppercase tracking-widest flex items-center gap-1">
                          {trend.socialSource === 'Instagram' ? <Instagram size={10} /> : 
                           trend.socialSource === 'Pinterest' ? <Camera size={10} /> : 
                           <Zap size={10} />} {trend.socialSource}
                        </span>
                      </div>
                    </div>
                  ))}
                {globalTrends.filter(trend => {
                    const regionMatch = regionFilter === 'All' || 
                      (regionFilter === 'Asia' && trend.region?.includes('AS')) ||
                      (regionFilter === 'Europe' && trend.region?.includes('EU'));
                    const sourceMatch = sourceFilter === 'All' || trend.socialSource === sourceFilter;
                    return regionMatch && sourceMatch;
                  }).length === 0 && (
                  <div className="text-center py-8 opacity-50 italic text-xs">
                    No hay tendencias para estos filtros
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-ml-yellow text-ml-black font-bold border border-ml-yellow shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 hover:text-ml-blue'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function StatCard({ title, value, sub, icon, alert = false, dark = false }: { title: string, value: string, sub: string, icon: React.ReactNode, alert?: boolean, dark?: boolean }) {
  return (
    <div className={`border rounded-3xl p-6 transition-all shadow-sm ${
      dark ? 'bg-ml-black text-white border-zinc-800' : 
      alert ? 'bg-red-50 border-red-200' : 
      'bg-white border-zinc-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-ml-yellow' : 'text-zinc-400'}`}>{title}</span>
        <div className={`p-2 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`text-3xl font-black tracking-tighter mb-1 ${alert ? 'text-red-600' : ''}`}>{value}</span>
        <span className={`text-[10px] font-bold ${dark ? 'text-white/50' : 'text-zinc-500'}`}>{sub}</span>
      </div>
    </div>
  );
}
