import { useState, useEffect } from "react";
import { auth, db } from "/src/Services/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye, faComment, faHeart, faNewspaper, faCalendarDays, faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// CSS
import "./Statistics.css";

const Statistics = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("months"); // "months" ou "days"
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // formato YYYY-MM
  
  const [stats, setStats] = useState({
    totalNews: 0,
    totalViews: 0,
    totalComments: 0,
    totalReactions: 0,
    monthlyData: [],
    dailyData: []
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar estatísticas do escritor
  useEffect(() => {
    if (!user) return;

    const newsRef = collection(db, "news");
    const q = query(newsRef, where("author.uid", "==", user.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        setStats({
          totalNews: 0,
          totalViews: 0,
          totalComments: 0,
          totalReactions: 0,
          monthlyData: [],
          dailyData: []
        });
        setLoading(false);
        return;
      }

      let totalViews = 0;
      let totalComments = 0;
      let totalReactions = 0;
      const monthlyViews = {};
      const monthlyComments = {};
      const monthlyReactions = {};
      const dailyViews = {};
      const dailyComments = {};
      const dailyReactions = {};

      for (const newsDoc of snapshot.docs) {
        const newsData = newsDoc.data();
        
        const views = newsData.views || 0;
        totalViews += views;

        const reactions = newsData.reactions || 0;
        totalReactions += reactions;

        const commentsRef = collection(db, "news", newsDoc.id, "comments");
        try {
          const commentsSnap = await new Promise((resolve) => {
            const unsubComments = onSnapshot(commentsRef, (snap) => {
              resolve(snap);
              unsubComments();
            }, () => {
              resolve({ size: 0, docs: [] });
            });
          });
          
          totalComments += commentsSnap.size;

          const createdAt = newsData.createdAt?.toDate?.() || new Date();
          const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
          const dayKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`;
          
          monthlyViews[monthKey] = (monthlyViews[monthKey] || 0) + views;
          monthlyComments[monthKey] = (monthlyComments[monthKey] || 0) + commentsSnap.size;
          monthlyReactions[monthKey] = (monthlyReactions[monthKey] || 0) + reactions;

          dailyViews[dayKey] = (dailyViews[dayKey] || 0) + views;
          dailyComments[dayKey] = (dailyComments[dayKey] || 0) + commentsSnap.size;
          dailyReactions[dayKey] = (dailyReactions[dayKey] || 0) + reactions;
        } catch (err) {
          console.error("Erro ao carregar comentários:", err);
        }
      }

      const monthlyData = generateMonthlyData(monthlyViews, monthlyComments, monthlyReactions);
      const dailyData = generateDailyData(dailyViews, dailyComments, dailyReactions, selectedMonth);

      setStats({
        totalNews: snapshot.size,
        totalViews,
        totalComments,
        totalReactions,
        monthlyData,
        dailyData
      });
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar estatísticas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedMonth]);

  const generateMonthlyData = (views, comments, reactions) => {
    const months = [];
    const now = new Date();
    
    // Gerar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      months.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        visualizacoes: views[monthKey] || 0,
        comentarios: comments[monthKey] || 0,
        reacoes: reactions[monthKey] || 0
      });
    }
    
    return months;
  };

  const generateDailyData = (views, comments, reactions, monthStr) => {
    const days = [];
    const [year, month] = monthStr.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push({
        day: String(day),
        visualizacoes: views[dayKey] || 0,
        comentarios: comments[dayKey] || 0,
        reacoes: reactions[dayKey] || 0
      });
    }
    
    return days;
  };

  const currentData = viewMode === "months" ? stats.monthlyData : stats.dailyData;
  const xAxisKey = viewMode === "months" ? "month" : "day";

  if (!user) {
    return (
      <div className="statistics-container">
        <div className="empty-state">
          <p>Faça login para ver suas estatísticas</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="loading-message">
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
          Voltar
        </button>
        <h1>Minhas Estatísticas</h1>
      </div>

      {/* Cards de resumo */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0f2fe" }}>
            <FontAwesomeIcon icon={faNewspaper} style={{ color: "#0284c7" }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalNews}</span>
            <span className="stat-label">Notícias Publicadas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dbeafe" }}>
            <FontAwesomeIcon icon={faEye} style={{ color: "#3b82f6" }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalViews}</span>
            <span className="stat-label">Visualizações Totais</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#d1fae5" }}>
            <FontAwesomeIcon icon={faComment} style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalComments}</span>
            <span className="stat-label">Comentários Recebidos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <FontAwesomeIcon icon={faHeart} style={{ color: "#ef4444" }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalReactions}</span>
            <span className="stat-label">Reações Recebidas</span>
          </div>
        </div>
      </div>

      {/* Filtros de período */}
      <div className="period-filters">
        <div className="filter-buttons">
          <button
            className={viewMode === "months" ? "active" : ""}
            onClick={() => setViewMode("months")}
          >
            <FontAwesomeIcon icon={faCalendarDays} />
            Por Meses
          </button>
          <button
            className={viewMode === "days" ? "active" : ""}
            onClick={() => setViewMode("days")}
          >
            <FontAwesomeIcon icon={faCalendarWeek} />
            Por Dias
          </button>
        </div>

        {viewMode === "days" && (
          <div className="month-selector">
            <label htmlFor="month-select">Selecione o mês:</label>
            <input
              id="month-select"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              max={new Date().toISOString().slice(0, 7)}
            />
          </div>
        )}
      </div>

      {/* Gráficos */}
      <div className="graphs-container">
        {/* Gráfico de Visualizações */}
        <div className="graph">
          <h3 className="graph-title">
            <FontAwesomeIcon icon={faEye} style={{ color: "#3b82f6", marginRight: "8px" }} />
            Visualizações {viewMode === "months" ? "Mensais" : "Diárias"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={xAxisKey}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [value, 'Visualizações']}
              />
              <Line 
                type="monotone" 
                dataKey="visualizacoes"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Comentários */}
        <div className="graph">
          <h3 className="graph-title">
            <FontAwesomeIcon icon={faComment} style={{ color: "#10b981", marginRight: "8px" }} />
            Comentários {viewMode === "months" ? "Mensais" : "Diários"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={xAxisKey}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [value, 'Comentários']}
              />
              <Line 
                type="monotone" 
                dataKey="comentarios"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Reações */}
        <div className="graph">
          <h3 className="graph-title">
            <FontAwesomeIcon icon={faHeart} style={{ color: "#ef4444", marginRight: "8px" }} />
            Reações {viewMode === "months" ? "Mensais" : "Diárias"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={xAxisKey}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [value, 'Reações']}
              />
              <Line 
                type="monotone" 
                dataKey="reacoes"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;