// frontend/src/components/project/SupplierRecommendation.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { supplierService } from '@/services/supplier.service';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';

export const SupplierRecommendation: React.FC<{
  projectId: string;
  materials: any[];
}> = ({ projectId, materials }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRecommendations();
  }, [materials]);

  const fetchRecommendations = async () => {
    const data = await supplierService.getRecommendations(projectId, materials);
    setRecommendations(data);
  };

  return (
    <div className="space-y-6">
      {/* خلاصه نیازمندی‌ها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">خلاصه نیازمندی‌ها</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MaterialSummaryCard
              title="تعداد اقلام"
              value={materials.length}
              icon="box"
            />
            <MaterialSummaryCard
              title="حجم کل"
              value={calculateTotalVolume(materials)}
              unit="متر مکعب"
              icon="cube"
            />
            <MaterialSummaryCard
              title="وزن کل"
              value={calculateTotalWeight(materials)}
              unit="کیلوگرم"
              icon="weight"
            />
            <MaterialSummaryCard
              title="تامین‌کنندگان پیشنهادی"
              value={countUniqueSuppliers(recommendations)}
              icon="users"
            />
          </div>
        </div>
      </Card>

      {/* پیشنهادات تامین‌کنندگان */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map(category => (
          <Card key={category.id}>
            <div className="p-6">
              <h4 className="font-semibold mb-4">{category.name}</h4>
              <div className="space-y-4">
                {category.suppliers.map(supplier => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    isSelected={selectedSuppliers[category.id] === supplier.id}
                    onSelect={() => handleSupplierSelect(category.id, supplier.id)}
                  />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* مقایسه قیمت‌ها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">مقایسه قیمت‌ها</h3>
          <Table
            columns={[
              { header: 'کالا', accessor: 'product' },
              { header: 'تعداد', accessor: 'quantity' },
              { header: 'واحد', accessor: 'unit' },
              ...recommendations.map(r => ({
                header: r.name,
                accessor: `prices.${r.id}`
              }))
            ]}
            data={generatePriceComparisonData(materials, recommendations)}
          />
        </div>
      </Card>
    </div>
  );
};
