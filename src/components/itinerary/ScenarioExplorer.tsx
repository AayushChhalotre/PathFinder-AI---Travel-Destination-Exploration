import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingDown, Calendar, Star, Compass, Check } from 'lucide-react';
import { BudgetScenario } from '../../lib/budgetUtils';
import { formatCurrency, cn } from '../../lib/utils';

interface ScenarioExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: BudgetScenario[];
  currentBudget: number;
  budgetLimit: number;
  onSelectScenario: (scenario: BudgetScenario) => void;
}

const ScenarioExplorer: React.FC<ScenarioExplorerProps> = ({
  isOpen,
  onClose,
  scenarios,
  currentBudget,
  budgetLimit,
  onSelectScenario,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-zinc-800 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Recalibrating Your Map
                </h2>
                <p className="text-zinc-400 max-w-xl">
                  Your current vision exceeds the budget ceiling by <span className="text-rose-400 font-semibold">{formatCurrency(currentBudget - budgetLimit)}</span>. 
                  We've calculated three paths to keep the magic while respecting your constraints.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scenarios Grid */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onSelect={() => onSelectScenario(scenario)}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">
                All scenarios preserve the core soul of your selected destination.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ScenarioCard = ({ 
  scenario, 
  onSelect 
}: { 
  scenario: BudgetScenario; 
  onSelect: () => void;
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'off-peak': return <Calendar className="w-6 h-6" />;
      case 'refined': return <Compass className="w-6 h-6" />;
      case 'essential': return <Star className="w-6 h-6" />;
      default: return <TrendingDown className="w-6 h-6" />;
    }
  };

  const getGradient = (id: string) => {
    switch (id) {
      case 'off-peak': return 'from-blue-500/20 to-indigo-500/10 hover:from-blue-500/30';
      case 'refined': return 'from-teal-500/20 to-emerald-500/10 hover:from-teal-500/30';
      case 'essential': return 'from-amber-500/20 to-orange-500/10 hover:from-amber-500/30';
      default: return 'from-zinc-800 to-zinc-900';
    }
  };

  const getAccentColor = (id: string) => {
    switch (id) {
      case 'off-peak': return 'text-blue-400';
      case 'refined': return 'text-teal-400';
      case 'essential': return 'text-amber-400';
      default: return 'text-white';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border border-zinc-800 transition-all duration-300 bg-gradient-to-br h-full group",
        getGradient(scenario.id)
      )}
    >
      <div className={cn("p-3 rounded-xl bg-zinc-900/50 w-fit mb-6", getAccentColor(scenario.id))}>
        {getIcon(scenario.id)}
      </div>

      <h3 className="text-xl font-display font-bold text-white mb-2">{scenario.title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
        {scenario.description}
      </p>

      <div className="space-y-4 pt-6 border-t border-zinc-800/50">
        <div className="flex justify-between items-end">
          <span className="text-zinc-500 text-xs uppercase tracking-tighter">Est. Total</span>
          <span className="text-xl font-bold text-white">{formatCurrency(scenario.total)}</span>
        </div>
        
        <div className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-lg">
          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            SAVE
          </span>
          <span className="text-emerald-400 font-bold">{formatCurrency(scenario.savings)}</span>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-3 px-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] transform transition-transform"
        >
          Adopt this Path
          <Check className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default ScenarioExplorer;
