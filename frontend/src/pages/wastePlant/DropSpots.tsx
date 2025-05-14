import React, { useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import { fetchDropSpots } from '../../redux/slices/wastePlant/wastePlantDropSpotSlice';


const DropSpots: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dropSpots } = useSelector((state: RootState) => state.wastePlantDropSpot);

  useEffect(() => {
    dispatch(fetchDropSpots());
  }, [dispatch]);
  console.log("dropSpots",dropSpots);
  
  const handleDelete = async (id: string) => {
    // try {
    //   await dispatch(deleteDropSpot(id)).unwrap();
    //   message.success("Drop spot deleted");
    //   dispatch(fetchDropSpots()); 
    // } catch (err) {
    //   message.error("Failed to delete");
    // }
  };

  const columns = [
    {
      title: 'Drop Spot Name',
      dataIndex: 'dropSpotName',
      key: 'dropSpotName',
    },
     {
      title: 'Address',
      key: 'address',
      render: (_: any, record: any) =>
        `${record.addressLine}, ${record.location}`,
    },
    {
      title: 'Pincode',
      dataIndex: 'pincode',
      key: 'pincode',
    },
    {
      title: 'District',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    // Implement or open edit modal/form
    console.log("Edit record:", record);
  };

  return (
    <Table
      rowKey="_id"
      dataSource={dropSpots}
      columns={columns}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default DropSpots;
