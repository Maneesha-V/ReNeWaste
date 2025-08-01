import { useState } from "react";
import { Modal, Button } from "antd";

const LicenseDocumentViewer = ({
  apiBaseUrl,
  cloudinaryPublicId
}: {
  apiBaseUrl: string;
  cloudinaryPublicId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* <label className="block text-gray-700 mb-2">License Document</label> */}
      <Button type="link" onClick={handleOpenModal}>
        View Document
      </Button>

      <Modal
        title="License Document"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="80%"
        style={{ top: 50 }}
      >
        <iframe
          src={`${
            apiBaseUrl
          }/view-license/${encodeURIComponent(cloudinaryPublicId)}`}
          // src={`https://docs.google.com/gview?url=${encodeURIComponent(licenseDocumentPath)}&embedded=true`}
          width="100%"
          height="600px"
          title="License Document"
          className="border rounded"
        />
      </Modal>
    </div>
  );
};

export default LicenseDocumentViewer;
