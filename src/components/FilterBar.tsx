
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
      color: 'text-crimson-red'
    },
    {
      id: 'missing' as const,
      label: 'Faltando',
      icon: X,
      count: missingCount,
      color: 'text-fire-red'
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-effect rounded-xl border border-crimson-red/30">
      <div className="flex items-center gap-2 text-gray-300">
        <Filter className="w-5 h-5 text-crimson-red" />
        <span className="font-medium">Filtros:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(({ id, label, icon: Icon, count, color }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentFilter === id
                ? 'bg-crimson-red/20 text-white shadow-lg shadow-crimson-red/30 scale-105 border border-crimson-red/50'
                : 'bg-coal-black/50 text-gray-300 hover:bg-crimson-red/10 hover:text-white border border-gray-600'
            }`}
          >
            <Icon className={`w-4 h-4 ${currentFilter === id ? color : ''}`} />
            <span>{label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              currentFilter === id 
                ? 'bg-crimson-red/30 text-white' 
                : 'bg-gray-700 text-gray-300'
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
