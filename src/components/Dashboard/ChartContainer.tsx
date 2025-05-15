import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ProjectData } from '@/services/api';

interface ChartContainerProps {
  projects: ProjectData[];
}

// Color palette for charts - expanded with more distinct colors
const COLORS = ['#1A97D7', '#FF6B6B', '#4CAF50', '#9C27B0', '#FF9800', '#E91E63', '#2196F3', '#FFEB3B', '#009688', '#673AB7', '#FF5722', '#3F51B5'];

const ChartContainer: React.FC<ChartContainerProps> = ({ projects }) => {
  // Prepare data for Country chart
  const countryData = projects.reduce((acc, project) => {
    // Handle multiple countries per project
    const countries = project.CountriesArray || (project.Countries ? project.Countries.split('; ') : []);
    countries.forEach(country => {
      const countryName = country || 'Unknown';
      if (!acc[countryName]) {
        acc[countryName] = { name: countryName, count: 0, budget: 0 };
      }
      // Distribute budget equally among countries (or use another logic if needed)
      const budgetPerCountry = (project.PAGValue || 0) / (countries.length || 1);
      acc[countryName].count += 1;
      acc[countryName].budget += budgetPerCountry;
    });
    return acc;
  }, {} as Record<string, { name: string, count: number, budget: number }>);
  
  const countryChartData = Object.values(countryData)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Prepare data for Org Unit chart
  const orgUnitData = projects.reduce((acc, project) => {
    const unit = project.LeadOrgUnit || 'Unknown';
    if (!acc[unit]) {
      acc[unit] = { name: unit, count: 0 };
    }
    acc[unit].count += 1;
    return acc;
  }, {} as Record<string, { name: string, count: number }>);
  
  const orgUnitChartData = Object.values(orgUnitData)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Prepare data for Theme chart
  const themeData = projects.reduce((acc, project) => {
    // Use the first theme or 'Unknown'
    const theme = project.ThemesArray?.[0] || project.Themes?.split('; ')[0] || 'Unknown';
    if (!acc[theme]) {
      acc[theme] = { name: theme, value: 0 };
    }
    acc[theme].value += 1;
    return acc;
  }, {} as Record<string, { name: string, value: number }>);
  
  const themeChartData = Object.values(themeData)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
      <Card className="col-span-1">
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Projects by Country (Top 10)</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] sm:h-[450px] md:h-[550px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={countryChartData}
              margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => [`${value} Projects`, 'Count']} />
              <Legend wrapperStyle={{ paddingTop: 5, fontSize: 12 }} />
              <Bar dataKey="count" name="Projects" fill="#1A97D7" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Projects by Theme</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] sm:h-[450px] md:h-[550px] flex flex-col items-center">
          <div className="w-full max-w-md mx-auto h-[200px] sm:h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={themeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    // Only show labels on larger screens
                    if (window.innerWidth < 640) return null;
                    
                    // Show first few words with full percentage
                    const words = name.split(' ');
                    let displayName = words.length > 1 
                      ? `${words[0]} ${words[1]}` 
                      : words[0];
                    
                    // Truncate if still too long
                    displayName = displayName.length > 10 
                      ? displayName.substring(0, 8) + '..' 
                      : displayName;
                      
                    return `${displayName}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={window.innerWidth < 768 ? 70 : 100}
                  innerRadius={window.innerWidth < 768 ? 30 : 40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {themeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Projects`, 'Count']} contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 sm:mt-6 w-full px-1 sm:px-2">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {themeChartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-md shadow-sm">
                  <div 
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-xs sm:text-sm font-medium truncate max-w-[120px]" title={`${entry.name} (${entry.value})`}>
                    {entry.name.length > 15 ? entry.name.substring(0, 12) + '...' : entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Projects by Organization Unit (Top 5)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[350px] md:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={orgUnitChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  // Truncate long organization unit names based on screen size
                  const maxLength = window.innerWidth < 640 ? 15 : window.innerWidth < 1024 ? 20 : 25;
                  return value.length > maxLength ? value.substring(0, maxLength - 3) + '...' : value;
                }}
              />
              <Tooltip formatter={(value) => [`${value} Projects`, 'Count']} />
              <Legend wrapperStyle={{ paddingTop: 5, fontSize: 12 }} />
              <Bar dataKey="count" name="Projects" fill="#0967AA" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartContainer;
