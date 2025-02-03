// frontend/src/components/optimization/OptimizationRecommendations.tsx
export const OptimizationRecommendations: React.FC = () => {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
    return (
      <div className="space-y-6">
        {/* فیلتر توصیه‌ها */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">دسته‌بندی توصیه‌ها</h3>
            <RecommendationFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </Card>
  
        {/* لیست توصیه‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map(rec => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onImplement={handleImplementRecommendation}
              onDismiss={handleDismissRecommendation}
            />
          ))}
        </div>
      </div>
    );
  };
  
  
  