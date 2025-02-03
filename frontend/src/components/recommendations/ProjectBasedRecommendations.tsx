
// frontend/src/components/recommendations/ProjectBasedRecommendations.tsx
export const ProjectBasedRecommendations: React.FC<{
    projectType: string;
    projectSize?: number;
    specifications?: Record<string, any>;
  }> = ({ projectType, projectSize, specifications }) => {
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      calculateRequiredMaterials();
    }, [projectType, projectSize, specifications]);
  
    const calculateRequiredMaterials = async () => {
      try {
        setLoading(true);
        const response = await recommendationService.getProjectMaterials({
          projectType,
          projectSize,
          specifications
        });
        setMaterials(response.data);
      } catch (error) {
        toast.error('خطا در محاسبه متریال مورد نیاز');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="space-y-6">
        {/* مشخصات پروژه */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">مشخصات پروژه</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-600">نوع پروژه</label>
                <div className="font-medium">{getProjectTypeLabel(projectType)}</div>
              </div>
              {projectSize && (
                <div>
                  <label className="block text-sm text-gray-600">متراژ</label>
                  <div className="font-medium">{projectSize} متر مربع</div>
                </div>
              )}
              {/* سایر مشخصات پروژه */}
            </div>
          </div>
        </Card>
  
        {/* لیست متریال پیشنهادی */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">متریال پیشنهادی</h3>
              <Button
                variant="primary"
                onClick={() => handleAddAllToCart(materials)}
              >
                افزودن همه به سبد خرید
              </Button>
            </div>
  
            {loading ? (
              <MaterialsSkeleton />
            ) : (
              <div className="space-y-4">
                {Object.entries(groupMaterialsByCategory(materials)).map(([category, items]) => (
                  <MaterialCategory
                    key={category}
                    category={category}
                    materials={items}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
  
        {/* آمار و محاسبات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="تخمین هزینه کل"
            value={calculateTotalCost(materials)}
            format="price"
          />
          <StatCard
            title="زمان تقریبی اجرا"
            value={calculateExecutionTime(materials)}
            format="time"
          />
          <StatCard
            title="تعداد اقلام"
            value={materials.length}
            format="number"
          />
        </div>
      </div>
    );
  };
  