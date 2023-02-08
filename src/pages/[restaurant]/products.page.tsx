import { api } from "@/src/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
import Select from "react-select";
import { z } from "zod";

interface optionsProps {
  value: string;
  label: string;
}
interface groupedOptionProps {
  label: string;
  options: optionsProps[];
}

interface InputsProps {
  id: string;
  cod: string;
  und: "lt" | "kg" | "und";
  cost_in_cents: number;
  name: string;
}

const createProductSchema = z.object({
  type: z.string(),
  product_name: z.string(),
  input: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .array(),
  quantity: z.number().array(),
});

type createProductData = z.infer<typeof createProductSchema>;

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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<createProductData>({
    resolver: zodResolver(createProductSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "input",
    control,
  });

  const [inputs, setInputs] = useState<InputsProps[]>([]);
  const router = useRouter();
  const restaurantURL = String(router.query.restaurant);

  const { status, data: inputslist } = useQuery<InputsProps[]>(
    ["inputslist"],
    async () => {
      const response = await api.get(`/${restaurantURL}/inputs/get-inputs`);
      setInputs(response.data);
      return response.data;
    }
  );

  const newInputListFormatt = inputs.map((input) => ({
    value: input.id,
    label: input.name,
  }));

  const groupedOptions: groupedOptionProps[] = [
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
  }

  function test(data: createProductData) {
    if (errors) { 
      console.log(errors)
    }

    console.log(data)
  }
  return (
    <>
      {status === "loading" && <h1>Loading</h1>}

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
          <form onSubmit={handleSubmit(test)}>
            <select {...register("type" as const)}>
              <option value="final">Prato final</option>
              <option value="processado">Produto Processado</option>
            </select>

            <input
              type="text"
              placeholder="Nome do produto"
              {...register("product_name")}
            />
            {fields.map((input, index) => {
              return (
                <div key={input.id}>
                  <Controller
                    control={control}
                    name={`input.${index}` as const}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        options={groupedOptions}
                        value={groupedOptions.find(
                          (c) =>
                            value ===
                            c.options.find((item) => item.value === value.value)
                        )}
                        onChange={onChange}
                      />
                    )}
                  />

                  <input
                    type="number"
                    {...register(`quantity.${index}` as const, { valueAsNumber: true})}
                    placeholder="Quantidade"
                  />
                  <button type="button" onClick={() => remove(index)}>
                    REMOVER
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                append({
                  value: "",
                  label: "",
                })
              }
            >
              APPEND
            </button>
            <button type="submit">Cadastrar produto</button>
          </form>
        </Modal>
      </div>
    </>
  );
}
