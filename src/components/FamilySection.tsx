import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import MaterialTable from "./MaterialTable";

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

interface Material {
  id: string;
  code: string;
  name: string;
  unit: string;
  budgetQuantity: number;
  unitPrice: number;
  orderQuantity: number;
  status: "pendiente" | "aprobado" | "en_aprobacion";
  comments: Comment[];
}

interface Family {
  id: string;
  name: string;
  materials: Material[];
}

interface FamilySectionProps {
  family: Family;
  sublevelId: string;
  apartmentCount: number;
  onMaterialQuantityChange: (sublevelId: string, familyId: string, materialId: string, quantity: number) => void;
  onAddToOrder: (materialId: string) => void;
  onAddMaterial?: (sublevelId: string, familyId: string, material: Omit<Material, 'id'>) => void;
  onReplaceMaterial?: (sublevelId: string, familyId: string, materialId: string, newMaterial: Omit<Material, 'id'>) => void;
}

const FamilySection = ({
  family,
  sublevelId,
  apartmentCount,
  onMaterialQuantityChange,
  onAddToOrder,
  onAddMaterial,
  onReplaceMaterial,
}: FamilySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateFamilyTotal = () => {
    return family.materials.reduce((total, material) => {
      return total + (material.unitPrice * material.orderQuantity);
    }, 0);
  };

  const calculateFamilyBudgetTotal = () => {
    return family.materials.reduce((total, material) => {
      return total + (material.unitPrice * material.budgetQuantity);
    }, 0);
  };

  const calculatePerApartment = () => {
    const total = calculateFamilyTotal();
    return apartmentCount > 0 ? total / apartmentCount : 0;
  };

  const calculateBudgetPerApartment = () => {
    const total = calculateFamilyBudgetTotal();
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
    <div className="bg-card border border-construction-gray/50 rounded-lg overflow-hidden shadow-sm">
      <div
        className={cn(
          "p-3 cursor-pointer transition-smooth flex justify-between items-center",
          "hover:bg-secondary",
          isExpanded && "bg-secondary border-b border-construction-gray/50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold">
            FAMILIA
          </span>
          <span className="font-medium text-foreground">
            {family.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">$/Apto (Prepedido)</div>
            <div className="text-sm font-medium">{formatCurrency(calculatePerApartment())}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">$/Apto (Presupuesto)</div>
            <div className="text-sm font-medium text-blue-600">{formatCurrency(calculateBudgetPerApartment())}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Subtotal (Prepedido)</div>
            <div className="font-semibold text-primary">{formatCurrency(calculateFamilyTotal())}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Subtotal (Presupuesto)</div>
            <div className="font-semibold text-blue-600">{formatCurrency(calculateFamilyBudgetTotal())}</div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform text-muted-foreground",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-background animate-in slide-in-from-top-2 duration-200">
          <MaterialTable
            materials={family.materials}
            onQuantityChange={(materialId, quantity) =>
              onMaterialQuantityChange(sublevelId, family.id, materialId, quantity)
            }
            onAddToOrder={onAddToOrder}
            onAddMaterial={onAddMaterial ? (material) => onAddMaterial(sublevelId, family.id, material) : undefined}
            onReplaceMaterial={onReplaceMaterial ? (materialId, newMaterial) => onReplaceMaterial(sublevelId, family.id, materialId, newMaterial) : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default FamilySection;