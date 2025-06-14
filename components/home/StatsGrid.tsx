export function StatsGrid() {
  const stats = [
    { value: '10k+', label: 'Ideas created' },
    { value: '95%', label: 'Satisfaction' },
    { value: '24/7', label: 'Available' }
  ];

  return (
    <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          <div className="text-sm text-slate-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}