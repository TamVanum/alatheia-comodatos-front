import React, { useState, useEffect } from "react";
import { Button, Modal, Card, Typography, Spin, message, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Cliente as ClienteInterface } from "../../interfaces/Cliente";

const { Search } = Input;

interface ClientSelectionModalProps {
  onSelectClient: (id: number) => void;
  onAddClient?: () => void; // Optional callback for adding a new client
  showSelectedClient?: boolean; // Prop to control showing the selected client card
}

const ClientSelectionModal: React.FC<ClientSelectionModalProps> = ({
  onSelectClient,
  onAddClient,
  showSelectedClient = true, // Default to true
}) => {
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes, setClientes] = useState<ClienteInterface[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<ClienteInterface[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClienteInterface>();

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/clientes");
      setClientes(response.data);
      setFilteredClientes(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      message.error("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchClientes();
    }
  }, [isModalOpen]);

  const handleCardClick = (client: ClienteInterface) => {
    onSelectClient(client.id);
    setSelectedClient(client);
    setIsModalOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setFilteredClientes(
      clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <>
      <Button
        className="w-full"
        type="primary"
        onClick={() => setIsModalOpen(true)}
      >
        Seleccionar Cliente
      </Button>
      {showSelectedClient && selectedClient && (
        <div className="flex justify-center items-center mt-4">
          <Card className="mt-4 flex w-fit flex-col items-center px-10 bg-gray-50">
            <img
              src={
                selectedClient.logo ||
                "https://static.vecteezy.com/system/resources/previews/005/720/408/non_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg"
              }
              // https://via.placeholder.com/100
              // https://static.vecteezy.com/system/resources/previews/005/720/408/non_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg
              alt={selectedClient.nombre}
              className="w-20 h-20 object-cover rounded-3xl mb-4 bg-white"
            />

            <div className="flex flex-col">
              <Typography.Title level={5}>
                {selectedClient.nombre}
              </Typography.Title>
              <Typography.Text>RUT: {selectedClient.rut} </Typography.Text>
              <Typography.Text>
                Código Comuna: {selectedClient.codigo_comuna}
              </Typography.Text>
              <Typography.Text>
                Dirección: {selectedClient.direccion}
              </Typography.Text>
              <Typography.Text>
                Cantidad de Comodatos Activos: {selectedClient.comodatos.length}
              </Typography.Text>
            </div>
          </Card>
        </div>
      )}

      <Modal
        title="Seleccione un Cliente"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Search
            placeholder="Buscar cliente..."
            allowClear
            enterButton
            onSearch={handleSearch}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-2/3"
          />
          <Button
            type="primary"
            // onClick={onAddClient}
            onClick={() => navigate("/clientes")}
            className="w-full md:w-auto"
          >
            Nuevo Cliente
          </Button>
        </div>
        {loading ? (
          <Spin className="w-full flex justify-center items-center" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClientes.map((cliente) => (
              <Card
                key={cliente.id}
                hoverable
                className="mt-4 flex flex-col items-center p-4 bg-gray-50"
                onClick={() => handleCardClick(cliente)}
              >
                <img
                  src={cliente.logo || "https://via.placeholder.com/100"}
                  alt={cliente.nombre}
                  className="w-20 h-20 object-cover rounded-3xl mb-4 bg-white"
                />
                <div className="flex flex-col">
                  <Typography.Title level={5}>
                    {cliente.nombre}
                  </Typography.Title>
                  <Typography.Text>RUT: {cliente.rut}</Typography.Text>
                  <Typography.Text>
                    Código Comuna: {cliente.codigo_comuna}
                  </Typography.Text>
                  <Typography.Text>
                    Dirección: {cliente.direccion}
                  </Typography.Text>
                  <Typography.Text>
                    Cantidad de Comodatos Activos: {cliente.comodatos.length}
                  </Typography.Text>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ClientSelectionModal;
