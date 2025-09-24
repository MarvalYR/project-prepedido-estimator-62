import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSectionProps {
  selectedProject: string;
  selectedWork: string;
  selectedActivity: string;
  onProjectChange: (value: string) => void;
  onWorkChange: (value: string) => void;
  onActivityChange: (value: string) => void;
}

const FilterSection = ({
  selectedProject,
  selectedWork,
  selectedActivity,
  onProjectChange,
  onWorkChange,
  onActivityChange,
}: FilterSectionProps) => {
  const projects = [
    { id: "1", name: "Torre Residencial Norte" },
    { id: "2", name: "Centro Comercial Plaza Sur" },
    { id: "3", name: "Edificio Corporativo ABC" },
  ];

  const works = [
    { id: "1", name: "Estructura Principal", projectId: "1" },
    { id: "2", name: "Acabados Interiores", projectId: "1" },
    { id: "3", name: "Instalaciones", projectId: "2" },
    { id: "4", name: "Fachada", projectId: "3" },
  ];

  const activities = [
    { id: "1", name: "Cimentación", workId: "1" },
    { id: "2", name: "Columnas y Vigas", workId: "1" },
    { id: "3", name: "Losas", workId: "1" },
    { id: "4", name: "Pisos y Revestimientos", workId: "2" },
  ];

  const filteredWorks = works.filter(work => work.projectId === selectedProject);
  const filteredActivities = activities.filter(activity => activity.workId === selectedWork);

  return (
    <div className="bg-gradient-subtle p-6 border-b border-construction-gray">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-construction-dark uppercase tracking-wider">
            Proyecto
          </label>
          <Select value={selectedProject} onValueChange={onProjectChange}>
            <SelectTrigger className="bg-background border-construction-gray hover:border-primary transition-smooth">
              <SelectValue placeholder="Seleccionar proyecto..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-construction-dark uppercase tracking-wider">
            Trabajo
          </label>
          <Select 
            value={selectedWork} 
            onValueChange={onWorkChange}
            disabled={!selectedProject}
          >
            <SelectTrigger className="bg-background border-construction-gray hover:border-primary transition-smooth disabled:opacity-50">
              <SelectValue placeholder="Seleccionar trabajo..." />
            </SelectTrigger>
            <SelectContent>
              {filteredWorks.map((work) => (
                <SelectItem key={work.id} value={work.id}>
                  {work.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-construction-dark uppercase tracking-wider">
            Actividad Nivel 4
          </label>
          <Select 
            value={selectedActivity} 
            onValueChange={onActivityChange}
            disabled={!selectedWork}
          >
            <SelectTrigger className="bg-background border-construction-gray hover:border-primary transition-smooth disabled:opacity-50">
              <SelectValue placeholder="Seleccionar actividad..." />
            </SelectTrigger>
            <SelectContent>
              {filteredActivities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id}>
                  {activity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;