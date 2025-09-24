import { useState, useEffect } from "react";
import { toast } from "sonner";
import FilterSection from "@/components/FilterSection";
import LevelSection from "@/components/LevelSection";
import SummaryBar from "@/components/SummaryBar";

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

interface Level {
  id: string;
  name: string;
  level: number;
  sublevels: Sublevel[];
}

// Mock data structure
const mockData = {
  levels: [
    {
      id: "nivel5-1",
      name: "Estructura de Concreto",
      level: 5,
      sublevels: [
        {
          id: "nivel8-1",
          name: "Columnas y Vigas",
          level: 8,
          families: [
            {
              id: "familia-1",
              name: "Concretos",
              materials: [
                {
                  id: "MAT-001",
                  code: "MAT-001",
                  name: "Cemento Portland Tipo I",
                  unit: "Sacos",
                  budgetQuantity: 500,
                  unitPrice: 35000,
                  orderQuantity: 450,
                  status: "aprobado" as const,
                },
                {
                  id: "MAT-003",
                  code: "MAT-003",
                  name: "Arena Gruesa",
                  unit: "m³",
                  budgetQuantity: 50,
                  unitPrice: 85000,
                  orderQuantity: 45,
                  status: "en_aprobacion" as const,
                },
              ],
            },
            {
              id: "familia-2",
              name: "Acero de Refuerzo",
              materials: [
                {
                  id: "MAT-002",
                  code: "MAT-002",
                  name: "Varilla Corrugada 1/2\"",
                  unit: "Unidades",
                  budgetQuantity: 200,
                  unitPrice: 18500,
                  orderQuantity: 180,
                  status: "pendiente" as const,
                },
              ],
            },
          ],
        },
        {
          id: "nivel8-2",
          name: "Losas y Entrepisos",
          level: 8,
          families: [
            {
              id: "familia-3",
              name: "Mallas y Refuerzos",
              materials: [
                {
                  id: "MAT-004",
                  code: "MAT-004",
                  name: "Malla Electrosoldada 6x6",
                  unit: "m²",
                  budgetQuantity: 300,
                  unitPrice: 12500,
                  orderQuantity: 280,
                  status: "en_aprobacion" as const,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "nivel5-2",
      name: "Mampostería y Acabados",
      level: 5,
      sublevels: [
        {
          id: "nivel8-3",
          name: "Muros y Divisiones",
          level: 8,
          families: [
            {
              id: "familia-4",
              name: "Mampostería",
              materials: [
                {
                  id: "MAT-005",
                  code: "MAT-005",
                  name: "Bloque de Concreto 15x20x40",
                  unit: "Unidades",
                  budgetQuantity: 800,
                  unitPrice: 2500,
                  orderQuantity: 750,
                  status: "aprobado" as const,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const Index = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedWork, setSelectedWork] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [levels, setLevels] = useState<Level[]>(mockData.levels);
  const [showContent, setShowContent] = useState(false);

  const apartmentCount = 80;

  useEffect(() => {
    if (selectedProject && selectedWork && selectedActivity) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [selectedProject, selectedWork, selectedActivity]);

  const handleMaterialQuantityChange = (sublevelId: string, familyId: string, materialId: string, quantity: number) => {
    setLevels(prevLevels =>
      prevLevels.map(level => ({
        ...level,
        sublevels: level.sublevels.map(sublevel =>
          sublevel.id === sublevelId
            ? {
                ...sublevel,
                families: sublevel.families.map(family =>
                  family.id === familyId
                    ? {
                        ...family,
                        materials: family.materials.map(material =>
                          material.id === materialId
                            ? { ...material, orderQuantity: quantity }
                            : material
                        ),
                      }
                    : family
                ),
              }
            : sublevel
        ),
      }))
    );
  };

  const handleAddMaterial = (sublevelId: string, familyId: string, newMaterial: Omit<Material, 'id'>) => {
    const materialId = `MAT-${Date.now()}`;
    setLevels(prevLevels =>
      prevLevels.map(level => ({
        ...level,
        sublevels: level.sublevels.map(sublevel =>
          sublevel.id === sublevelId
            ? {
                ...sublevel,
                families: sublevel.families.map(family =>
                  family.id === familyId
                    ? {
                        ...family,
                        materials: [...family.materials, { ...newMaterial, id: materialId }],
                      }
                    : family
                ),
              }
            : sublevel
        ),
      }))
    );
    toast.success("Material agregado", {
      description: `${newMaterial.name} ha sido agregado exitosamente.`,
    });
  };

  const handleReplaceMaterial = (sublevelId: string, familyId: string, materialId: string, newMaterial: Omit<Material, 'id'>) => {
    setLevels(prevLevels =>
      prevLevels.map(level => ({
        ...level,
        sublevels: level.sublevels.map(sublevel =>
          sublevel.id === sublevelId
            ? {
                ...sublevel,
                families: sublevel.families.map(family =>
                  family.id === familyId
                    ? {
                        ...family,
                        materials: family.materials.map(material =>
                          material.id === materialId
                            ? { ...newMaterial, id: materialId }
                            : material
                        ),
                      }
                    : family
                ),
              }
            : sublevel
        ),
      }))
    );
    toast.success("Material sustituido", {
      description: `Material reemplazado por ${newMaterial.name}.`,
    });
  };

  const handleAddToOrder = (materialId: string) => {
    toast.success("Material agregado al pedido", {
      description: `Material ${materialId} ha sido agregado exitosamente.`,
    });
  };

  const calculateTotals = () => {
    let totalMaterials = 0;
    let totalValue = 0;
    let budgetTotalValue = 0;

    levels.forEach(level => {
      level.sublevels.forEach(sublevel => {
        sublevel.families.forEach(family => {
          family.materials.forEach(material => {
            totalMaterials += material.orderQuantity;
            totalValue += material.unitPrice * material.orderQuantity;
            budgetTotalValue += material.unitPrice * material.budgetQuantity;
          });
        });
      });
    });

    return { totalMaterials, totalValue, budgetTotalValue };
  };

  const { totalMaterials, totalValue, budgetTotalValue } = calculateTotals();
  const perApartmentValue = apartmentCount > 0 ? totalValue / apartmentCount : 0;
  const budgetPerApartmentValue = apartmentCount > 0 ? budgetTotalValue / apartmentCount : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-construction text-primary-foreground p-6 shadow-construction">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">
            📋 Prepedido - Estimación de Materiales
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <FilterSection
          selectedProject={selectedProject}
          selectedWork={selectedWork}
          selectedActivity={selectedActivity}
          onProjectChange={setSelectedProject}
          onWorkChange={setSelectedWork}
          onActivityChange={setSelectedActivity}
        />

        {/* Content */}
        {showContent ? (
          <div className="p-6">
            <div className="space-y-6">
              {levels.map(level => (
                <LevelSection
                  key={level.id}
                  id={level.id}
                  name={level.name}
                  level={level.level}
                  sublevels={level.sublevels}
                  apartmentCount={apartmentCount}
                  onMaterialQuantityChange={handleMaterialQuantityChange}
                  onAddToOrder={handleAddToOrder}
                  onAddMaterial={handleAddMaterial}
                  onReplaceMaterial={handleReplaceMaterial}
                />
              ))}
            </div>

            <SummaryBar
              totalValue={totalValue}
              apartmentCount={apartmentCount}
              perApartmentValue={perApartmentValue}
              budgetTotalValue={budgetTotalValue}
              budgetPerApartmentValue={budgetPerApartmentValue}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                🏗️
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Selecciona los filtros para comenzar
              </h3>
              <p className="text-muted-foreground">
                Elige un proyecto, trabajo y actividad para ver los materiales disponibles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
