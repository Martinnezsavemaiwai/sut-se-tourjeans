import { Modal } from "antd";
interface CustomModalProps {
    visible: boolean;
    title: React.ReactNode; // เปลี่ยนจาก string เป็น React.ReactNode
    children: React.ReactNode;
    onCancel: () => void;
    footer?: React.ReactNode;
}
const CustomModal: React.FC<CustomModalProps> = ({ visible, title, children, onCancel, footer }) => {
    return (
        <Modal
            title={title}
            visible={visible}
            onCancel={onCancel}
            footer={footer || null} 
        >
            {children}
        </Modal>
    );
};

export default CustomModal;