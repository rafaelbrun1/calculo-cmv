import { api } from "@/src/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { CSSProperties } from "styled-components";

interface GroupedOption {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface InputsProps {
  id: string;
  cod: string;
  und: "lt" | "kg" | "und";
  cost_in_cents: number;
  name: string;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    height: "50rem",
    width: "50rem",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Products() {
  const [inputs, setInputs] = useState<InputsProps[]>([]);
  const router = useRouter();

  const { status, data: inputslist } = useQuery<InputsProps[]>(
    ["inputslist"],
    async () => {
      const response = await api.get(
        `/${router.query.restaurant}/inputs/get-inputs`
      );
      setInputs(response.data);
      return response.data;
    }
  );

  const newInputListFormatt = inputs.map((input) => ({
    value: input.id,
    label: input.name,
  }));

  const groupedOptions = [
    {
      label: "Insumos",
      options: newInputListFormatt,
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    console.log(newInputListFormatt);
  }

  return (
    <>
      <h1>Lista de produtos finais</h1>
      <h1>Lista de produtos processados</h1>

      <div>
        <button onClick={openModal}>Criar produto</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <button onClick={closeModal}>close</button>
          <form>
            <select name="" id="">
              <option value="final">Prato final</option>
              <option value="processado">Produto Processado</option>
            </select>

            <input type="text" placeholder="Nome do produto" />
            <div>
              <Select options={groupedOptions} />
              <input type="number" placeholder="Quantidade" />
            </div>

            <button type="submit">Cadastrar produto</button>
          </form>
        </Modal>
      </div>
    </>
  );
}
