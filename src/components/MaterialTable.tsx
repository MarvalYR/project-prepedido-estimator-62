import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageCircle } from "lucide-react";

interface Material {
  id: string;
  code: string;
  name: string;
  unit: string;
  budgetQuantity: number;
  unitPrice: number;
  orderQuantity: number;
  status: "pendiente" | "aprobado" | "en_aprobacion";
  comments?: string;
}

interface MaterialTableProps {
  materials: Material[];
  onQuantityChange: (materialId: string, quantity: number) => void;
  onAddToOrder: (materialId: string) => void;
  onAddMaterial?: (material: Omit<Material, 'id'>) => void;
  onReplaceMaterial?: (materialId: string, newMaterial: Omit<Material, 'id'>) => void;
}

const AVAILABLE_MATERIALS = [
  { code: "MAT-001", name: "Cemento Portland Tipo I", unit: "Sacos", unitPrice: 35000 },
  { code: "MAT-002", name: "Varilla Corrugada 1/2\"", unit: "Unidades", unitPrice: 18500 },
  { code: "MAT-003", name: "Arena Gruesa", unit: "m³", unitPrice: 85000 },
  { code: "MAT-004", name: "Malla Electrosoldada 6x6", unit: "m²", unitPrice: 12500 },
  { code: "MAT-005", name: "Grava Triturada", unit: "m³", unitPrice: 95000 },
  { code: "MAT-006", name: "Ladrillo Común", unit: "Unidades", unitPrice: 800 },
  { code: "MAT-007", name: "Bloque de Concreto", unit: "Unidades", unitPrice: 1200 },
  { code: "MAT-008", name: "Cal Hidratada", unit: "Sacos", unitPrice: 8500 },
];

const MaterialTable = ({ materials, onQuantityChange, onAddToOrder, onAddMaterial, onReplaceMaterial }: MaterialTableProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMaterialCode, setSelectedMaterialCode] = useState<string>("");
  const [replacingMaterial, setReplacingMaterial] = useState<string | null>(null);
  const [replaceWithCode, setReplaceWithCode] = useState<string>("");
  const [materialComments, setMaterialComments] = useState<Record<string, string>>({});
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotal = (material: Material) => {
    return material.unitPrice * material.orderQuantity;
  };

  const handleAddMaterial = () => {
    if (!selectedMaterialCode || !onAddMaterial) return;
    
    const selectedMaterial = AVAILABLE_MATERIALS.find(m => m.code === selectedMaterialCode);
    if (!selectedMaterial) return;

    const newMaterial: Omit<Material, 'id'> = {
      code: selectedMaterial.code,
      name: selectedMaterial.name,
      unit: selectedMaterial.unit,
      budgetQuantity: 0,
      unitPrice: selectedMaterial.unitPrice,
      orderQuantity: 0,
      status: "pendiente" as const,
    };

    onAddMaterial(newMaterial);
    setSelectedMaterialCode("");
    setShowAddForm(false);
  };

  const handleReplaceMaterial = (materialId: string) => {
    if (!replaceWithCode || !onReplaceMaterial) return;
    
    const selectedMaterial = AVAILABLE_MATERIALS.find(m => m.code === replaceWithCode);
    if (!selectedMaterial) return;

    const currentMaterial = materials.find(m => m.id === materialId);
    if (!currentMaterial) return;

    const replacementMaterial: Omit<Material, 'id'> = {
      code: selectedMaterial.code,
      name: selectedMaterial.name,
      unit: selectedMaterial.unit,
      budgetQuantity: currentMaterial.budgetQuantity,
      unitPrice: selectedMaterial.unitPrice,
      orderQuantity: currentMaterial.orderQuantity,
      status: "pendiente" as const,
    };

    onReplaceMaterial(materialId, replacementMaterial);
    setReplacingMaterial(null);
    setReplaceWithCode("");
  };

  const handleCommentChange = (materialId: string, comment: string) => {
    setMaterialComments(prev => ({
      ...prev,
      [materialId]: comment
    }));
  };

  return (
    <div className="space-y-4">
      {onAddMaterial && (
        <div className="flex items-center gap-3">
          {!showAddForm ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Material
            </Button>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
              <Select value={selectedMaterialCode} onValueChange={setSelectedMaterialCode}>
                <SelectTrigger className="w-80 bg-background">
                  <SelectValue placeholder="Seleccionar material..." />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {AVAILABLE_MATERIALS.filter(
                    am => !materials.some(m => m.code === am.code)
                  ).map((material) => (
                    <SelectItem key={material.code} value={material.code}>
                      {material.code} - {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleAddMaterial}
                disabled={!selectedMaterialCode}
              >
                Agregar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedMaterialCode("");
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-subtle">
            <th className="text-left p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Material
            </th>
            <th className="text-left p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Unidad
            </th>
            <th className="text-right p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Cant. Presup.
            </th>
            <th className="text-right p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Valor Unit.
            </th>
            <th className="text-right p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Cant. a Pedir
            </th>
            <th className="text-right p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Total
            </th>
            <th className="text-left p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Estado
            </th>
            <th className="text-left p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Acciones
            </th>
            <th className="text-left p-3 text-xs font-semibold text-construction-dark uppercase tracking-wider border-b-2 border-construction-gray">
              Comentarios
            </th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr 
              key={material.id} 
              className="hover:bg-gradient-subtle transition-smooth border-b border-construction-gray/50"
            >
              <td className="p-3 font-medium text-foreground text-sm">
                <span className="bg-secondary px-2 py-1 rounded text-xs font-mono text-construction-dark mr-2">
                  {material.code}
                </span>
                - {material.name}
              </td>
              <td className="p-3 text-sm">
                <Badge variant="secondary" className="text-xs">
                  {material.unit}
                </Badge>
              </td>
              <td className="p-3 text-right font-medium text-sm">
                {material.budgetQuantity.toLocaleString()}
              </td>
              <td className="p-3 text-right font-medium text-sm">
                {formatCurrency(material.unitPrice)}
              </td>
              <td className="p-3 text-right text-sm">
                <Input
                  type="number"
                  value={material.orderQuantity}
                  onChange={(e) => onQuantityChange(material.id, parseInt(e.target.value) || 0)}
                  min={0}
                  max={material.budgetQuantity}
                  className="w-20 text-center text-sm border-construction-gray focus:border-primary"
                />
              </td>
              <td className="p-3 text-right font-semibold text-primary text-sm">
                {formatCurrency(calculateTotal(material))}
              </td>
              <td className="p-3">
                <Badge 
                  className={
                    material.status === "aprobado" 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : material.status === "en_aprobacion"
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }
                >
                  {material.status === "aprobado" ? "Aprobado" : 
                   material.status === "en_aprobacion" ? "En aprobación" : "Pendiente"}
                </Badge>
              </td>
              <td className="p-3">
                {replacingMaterial === material.id ? (
                  <div className="flex items-center gap-2">
                    <Select value={replaceWithCode} onValueChange={setReplaceWithCode}>
                      <SelectTrigger className="w-48 bg-background">
                        <SelectValue placeholder="Seleccionar sustituto..." />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {AVAILABLE_MATERIALS.filter(
                          am => am.code !== material.code && !materials.some(m => m.code === am.code)
                        ).map((availableMaterial) => (
                          <SelectItem key={availableMaterial.code} value={availableMaterial.code}>
                            {availableMaterial.code} - {availableMaterial.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={() => handleReplaceMaterial(material.id)}
                      disabled={!replaceWithCode}
                    >
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplacingMaterial(null);
                        setReplaceWithCode("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAddToOrder(material.id)}
                      className="bg-gradient-primary hover:shadow-construction transition-smooth"
                    >
                      Guardar
                    </Button>
                    {onReplaceMaterial && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplacingMaterial(material.id)}
                        className="border-construction-gray hover:bg-secondary"
                      >
                        Sustituir
                      </Button>
                    )}
                  </div>
                )}
              </td>
              <td className="p-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-2 border-construction-gray hover:bg-secondary"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 bg-background border shadow-lg" 
                    side="right"
                    align="start"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Comentarios - {material.code}</h4>
                      <Textarea
                        placeholder="Escribe un comentario..."
                        value={materialComments[material.id] || material.comments || ""}
                        onChange={(e) => handleCommentChange(material.id, e.target.value)}
                        rows={3}
                        className="text-sm border-construction-gray focus:border-primary"
                      />
                      <Button
                        size="sm"
                        className="w-full bg-gradient-primary hover:shadow-construction transition-smooth"
                      >
                        Guardar Comentario
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default MaterialTable;