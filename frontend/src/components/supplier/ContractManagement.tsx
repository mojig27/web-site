// frontend/src/components/supplier/ContractManagement.tsx
export const ContractManagement: React.FC<{
    projectId: string;
    suppliers: any[];
  }> = ({ projectId, suppliers }) => {
    const [contracts, setContracts] = useState<any[]>([]);
    const [activeContract, setActiveContract] = useState<any>(null);
  
    const handleCreateContract = async (supplierId: string) => {
      const contract = await contractService.createContract({
        projectId,
        supplierId,
        terms: buildContractTerms(),
        deliverables: getDeliverables(supplierId)
      });
      setContracts([...contracts, contract]);
    };
  
    return (
      <div className="space-y-6">
        {/* قراردادهای فعال */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">قراردادهای فعال</h3>
            <div className="space-y-4">
              {contracts.map(contract => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onView={() => setActiveContract(contract)}
                  onUpdate={handleContractUpdate}
                />
              ))}
            </div>
          </div>
        </Card>
  
        {/* جزئیات قرارداد */}
        {activeContract && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">جزئیات قرارداد</h3>
              <ContractDetails
                contract={activeContract}
                onTermUpdate={handleTermUpdate}
                onDeliverableUpdate={handleDeliverableUpdate}
              />
            </div>
          </Card>
        )}
      </div>
    );
  };
  