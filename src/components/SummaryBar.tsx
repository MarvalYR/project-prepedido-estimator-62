interface SummaryBarProps {
  totalValue: number;
  apartmentCount: number;
  perApartmentValue: number;
  budgetTotalValue: number;
  budgetPerApartmentValue: number;
}

const SummaryBar = ({ totalValue, apartmentCount, perApartmentValue, budgetTotalValue, budgetPerApartmentValue }: SummaryBarProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-subtle border-t border-construction-gray p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Apartamentos
            </div>
            <div className="text-xl font-semibold text-construction-success">
              {apartmentCount}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Valor por Apartamento (Prepedido)
            </div>
            <div className="text-xl font-semibold text-construction-success">
              {formatCurrency(perApartmentValue)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Valor por Apartamento (Presupuesto)
            </div>
            <div className="text-xl font-semibold text-blue-600">
              {formatCurrency(budgetPerApartmentValue)}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Valor Total (Prepedido)
            </div>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(totalValue)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Valor Total (Presupuesto)
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(budgetTotalValue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryBar;