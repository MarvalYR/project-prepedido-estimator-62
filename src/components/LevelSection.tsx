import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import FamilySection from "./FamilySection";

interface Material {
  id: string;
  code: string;
  name: string;
  unit: string;
  budgetQuantity: number;
  unitPrice: number;
  orderQuantity: number;
  status: "pendiente" | "aprobado" | "en_aprobacion";
}

interface Family {
  id: string;
  name: string;
  materials: Material[];
}

interface Sublevel {
  id: string;
  name: string;
  level: number;
  families: Family[];
}

interface LevelSectionProps {
  id: string;
  name: string;
  level: number;
  sublevels: Sublevel[];
  apartmentCount: number;
  onMaterialQuantityChange: (sublevelId: string, familyId: string, materialId: string, quantity: number) => void;
  onAddToOrder: (materialId: string) => void;
  onAddMaterial?: (sublevelId: string, familyId: string, material: Omit<Material, 'id'>) => void;
  onReplaceMaterial?: (sublevelId: string, familyId: string, materialId: string, newMaterial: Omit<Material, 'id'>) => void;
}

const LevelSection = ({
  id,
  name,
  level,
  sublevels,
  apartmentCount,
  onMaterialQuantityChange,
  onAddToOrder,
  onAddMaterial,
  onReplaceMaterial,
}: LevelSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSublevels, setExpandedSublevels] = useState<Set<string>>(new Set());

  const toggleSublevel = (sublevelId: string) => {
    const newExpanded = new Set(expandedSublevels);
    if (newExpanded.has(sublevelId)) {
      newExpanded.delete(sublevelId);
    } else {
      newExpanded.add(sublevelId);
    }
    setExpandedSublevels(newExpanded);
  };

  const calculateLevelTotal = () => {
    return sublevels.reduce((total, sublevel) => {
      return total + sublevel.families.reduce((familyTotal, family) => {
        return familyTotal + family.materials.reduce((materialTotal, material) => {
          return materialTotal + (material.unitPrice * material.orderQuantity);
        }, 0);
      }, 0);
    }, 0);
  };

  const calculateLevelBudgetTotal = () => {
    return sublevels.reduce((total, sublevel) => {
      return total + sublevel.families.reduce((familyTotal, family) => {
        return familyTotal + family.materials.reduce((materialTotal, material) => {
          return materialTotal + (material.unitPrice * material.budgetQuantity);
        }, 0);
      }, 0);
    }, 0);
  };

  const calculatePerApartment = () => {
    const total = calculateLevelTotal();
    return apartmentCount > 0 ? total / apartmentCount : 0;
  };

  const calculateBudgetPerApartment = () => {
    const total = calculateLevelBudgetTotal();
    return apartmentCount > 0 ? total / apartmentCount : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border border-construction-gray rounded-lg overflow-hidden bg-card shadow-construction">
      <div
        className={cn(
          "p-4 cursor-pointer transition-smooth flex justify-between items-center",
          "bg-gradient-subtle hover:bg-secondary",
          isExpanded && "bg-secondary border-b-2 border-primary"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            NIVEL {level}
          </span>
          <span className="font-semibold text-foreground text-lg">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-primary/10 px-3 py-1 rounded-lg">
            <span className="text-xs text-primary font-medium">APTOS:</span>
            <span className="text-sm font-bold text-primary ml-1">{apartmentCount}</span>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-muted-foreground">$/Apto (Prepedido)</div>
            <div className="font-semibold">{formatCurrency(calculatePerApartment())}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">$/Apto (Presupuesto)</div>
            <div className="font-semibold text-blue-600">{formatCurrency(calculateBudgetPerApartment())}</div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total (Prepedido)</div>
            <div className="font-bold text-primary text-lg">{formatCurrency(calculateLevelTotal())}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total (Presupuesto)</div>
            <div className="font-bold text-blue-600 text-lg">{formatCurrency(calculateLevelBudgetTotal())}</div>
          </div>

          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform text-muted-foreground",
              isExpanded && "rotate-180 text-primary"
            )}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gradient-subtle space-y-4 animate-in slide-in-from-top-2 duration-300">
          {sublevels.map((sublevel) => {
            const sublevelTotal = sublevel.families.reduce((total, family) => {
              return total + family.materials.reduce((materialTotal, material) => {
                return materialTotal + (material.unitPrice * material.orderQuantity);
              }, 0);
            }, 0);
            const sublevelBudgetTotal = sublevel.families.reduce((total, family) => {
              return total + family.materials.reduce((materialTotal, material) => {
                return materialTotal + (material.unitPrice * material.budgetQuantity);
              }, 0);
            }, 0);
            const sublevelPerApt = apartmentCount > 0 ? sublevelTotal / apartmentCount : 0;
            const sublevelBudgetPerApt = apartmentCount > 0 ? sublevelBudgetTotal / apartmentCount : 0;
            const isSubExpanded = expandedSublevels.has(sublevel.id);

            return (
              <div
                key={sublevel.id}
                className="bg-card border border-construction-gray rounded-lg overflow-hidden shadow-sm"
              >
                <div
                  className={cn(
                    "p-4 cursor-pointer transition-smooth flex justify-between items-center",
                    "hover:bg-secondary",
                    isSubExpanded && "bg-secondary border-b border-construction-gray"
                  )}
                  onClick={() => toggleSublevel(sublevel.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-semibold">
                      NIVEL {sublevel.level}
                    </span>
                    <span className="font-medium text-foreground">
                      {sublevel.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">$/Apto (Prepedido)</div>
                      <div className="text-sm font-medium">{formatCurrency(sublevelPerApt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">$/Apto (Presupuesto)</div>
                      <div className="text-sm font-medium text-blue-600">{formatCurrency(sublevelBudgetPerApt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Subtotal (Prepedido)</div>
                      <div className="font-semibold text-primary">{formatCurrency(sublevelTotal)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Subtotal (Presupuesto)</div>
                      <div className="font-semibold text-blue-600">{formatCurrency(sublevelBudgetTotal)}</div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform text-muted-foreground",
                        isSubExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </div>

                {isSubExpanded && (
                  <div className="p-4 bg-background space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {sublevel.families.map((family) => (
                      <FamilySection
                        key={family.id}
                        family={family}
                        sublevelId={sublevel.id}
                        apartmentCount={apartmentCount}
                        onMaterialQuantityChange={onMaterialQuantityChange}
                        onAddToOrder={onAddToOrder}
                        onAddMaterial={onAddMaterial}
                        onReplaceMaterial={onReplaceMaterial}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LevelSection;