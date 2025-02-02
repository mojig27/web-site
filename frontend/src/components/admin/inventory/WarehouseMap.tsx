

// frontend/src/components/admin/inventory/WarehouseMap.tsx
import { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ShelfItem } from './ShelfItem';
import { ProductItem } from './ProductItem';

interface WarehouseMapProps {
  data: any;
  warehouseId: string | null;
  onLocationUpdate: () => void;
}

export const WarehouseMap: React.FC<WarehouseMapProps> = ({
  data,
  warehouseId,
  onLocationUpdate
}) => {
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  const handleDrop = async (itemId: string, shelfId: string) => {
    try {
      await inventoryService.updateProductLocation({
        productId: itemId,
        shelfId,
        warehouseId
      });
      onLocationUpdate();
    } catch (error) {
      console.error('Error updating product location:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            نقشه انبار {data.warehouse?.name}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              -
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        <div className="relative border rounded-lg overflow-auto h-[600px]">
          <div
            ref={mapRef}
            className="relative"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {data.shelves?.map((shelf: any) => (
              <ShelfItem
                key={shelf.id}
                shelf={shelf}
                isSelected={selectedShelf === shelf.id}
                onClick={() => setSelectedShelf(shelf.id)}
                onDrop={(itemId) => handleDrop(itemId, shelf.id)}
              />
            ))}

            {data.products?.map((product: any) => (
              <ProductItem
                key={product.id}
                product={product}
                onLocationChange={(shelfId) => handleDrop(product.id, shelfId)}
              />
            ))}
          </div>
        </div>

        {selectedShelf && (
          <div className="mt-4 p-4 border rounded-lg">
            <h4 className="font-medium mb-2">اطلاعات قفسه</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ظرفیت:</span>
                <span className="mr-2">
                  {data.shelves.find((s: any) => s.id === selectedShelf)?.capacity}
                </span>
              </div>
              <div>
                <span className="text-gray-500">موجودی فعلی:</span>
                <span className="mr-2">
                  {data.shelves.find((s: any) => s.id === selectedShelf)?.currentStock}
                </span>
              </div>
              <div>
                <span className="text-gray-500">محصولات:</span>
                <span className="mr-2">
                  {data.shelves.find((s: any) => s.id === selectedShelf)?.productCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};