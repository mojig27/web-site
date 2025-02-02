
// frontend/src/components/ui/Modal.tsx
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }
  
  export const Modal = ({
    open,
    onClose,
    title,
    children
  }: ModalProps) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />
  
          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-right align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-right w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </h3>
                  <div className="mt-4">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };