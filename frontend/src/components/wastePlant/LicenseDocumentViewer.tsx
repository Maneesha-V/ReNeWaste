import { useState } from "react";
import { Modal, Button } from "antd";
import { viewLicenseDoc } from "../../services/superAdmin/wastePlantService";

const LicenseDocumentViewer = ({
  cloudinaryPublicId,
}: {
  cloudinaryPublicId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleOpenModal = async () => {
    try {
      const blob = await viewLicenseDoc(cloudinaryPublicId);

      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    setPdfUrl("");
    setIsModalOpen(false);
  };

  return (
    <div>
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
          src={pdfUrl}
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
