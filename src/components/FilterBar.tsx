
import { Filter, Check, X, Grid } from "lucide-react";

interface FilterBarProps {
  currentFilter: 'all' | 'owned' | 'missing';
  onFilterChange: (filter: 'all' | 'owned' | 'missing') => void;
  ownedCount: number;
  missingCount: number;
}

const FilterBar = ({ currentFilter, onFilterChange, ownedCount, missingCount }: FilterBarProps) => {
  const filters = [
    {
      id: 'all' as const,
      label: 'Todos',
      icon: Grid,
      count: ownedCount + missingCount,
      color: 'text-white'
    },
    {
      id: 'owned' as const,
      label: 'Possuo',
      icon: Check,
      count: ownedCount,
      color: 'text-neon-green'
    },
    {
      id: 'missing' as const,
      label: 'Faltando',
      icon: X,
      count: missingCount,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-effect rounded-xl border border-white/20">
      <div className="flex items-center gap-2 text-gray-300">
        <Filter className="w-5 h-5 text-neon-blue" />
        <span className="font-medium">Filtros:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(({ id, label, icon: Icon, count, color }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentFilter === id
                ? 'bg-white/20 text-white shadow-lg scale-105'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 ${currentFilter === id ? color : ''}`} />
            <span>{label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              currentFilter === id 
                ? 'bg-white/20' 
                : 'bg-white/10'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
