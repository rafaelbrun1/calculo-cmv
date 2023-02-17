import { api } from "@/src/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, QueryClient, useMutation } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
import Select from "react-select";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

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

interface InputsListProps extends InputsProps {
  inputslist: InputsProps[];
}

interface ProductsProps {
  id: string;
  name: string;
  sell_price_in_cents: number;
}

const createProductSchema = z.object({
  type: z.string(),
  product_name: z.string(),
  input: z
    .object({
      value: z.string(),
      label: z.string(),
      quantity: z.number(),
    })
    .array(),
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

export default function Products({ inputslist }: InputsListProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createProductData>({
    resolver: zodResolver(createProductSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "input",
    control,
  });

  const router = useRouter();
  const restaurantURL = String(router.query.restaurant);

  const newInputListFormatt = inputslist.map((input) => ({
    value: input.id,
    label: input.name,
  }));

  const groupedOptions: groupedOptionProps[] = [
    {
      label: "Insumos",
      options: newInputListFormatt,
    },
  ];

  const {
    status,
    data: final_products,
    refetch,
  } = useQuery<ProductsProps[]>(["final_products"], async () => {
    const response = await api.get(
      `/${router.query.restaurant}/products/get-final-products`
    );
    return response.data;
  });

  const { data: processed_products } = useQuery<ProductsProps[]>(
    ["processed_products"],
    async () => {
      const response = await api.get(
        `/${router.query.restaurant}/processedproducts/get-processed-products`
      );
      return response.data;
    }
  );

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const queryClient = useQueryClient();

  const onSubmit = async (data: createProductData) => {
    if (data.type === "final") {
      try {
        await api.post(`/${restaurantURL}/products/create-final-products`, {
          product_name: data.product_name,
          input: data.input,
        });
        queryClient.invalidateQueries(["final_products"]);
      } catch (error) {
        console.log(error);
      }
    } else if (data.type === "processed") {
      try {
        await api.post(
          `/${restaurantURL}/processedproducts/create-processed-products`,
          {
            product_name: data.product_name,
            input: data.input,
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function deleteFinalProduct(id: string) {
    if (confirm("Tem certeza que deseja excluir esse produto?")) {
      await api.delete(`${restaurantURL}/products/delete-final-product`, {
        data: {
          id,
        },
      });
      refetch();
    } else {
      console.log("cancelado");
    }
  }

  return (
    <>
      <h1> Lista de produtos finais</h1>
      {final_products &&
        final_products.map((product) => {
          return (
            <div>
              <span> {product.name} </span>
              <span> {product.sell_price_in_cents} </span>
              <button> Editar </button>
              <button onClick={() => deleteFinalProduct(product.id)}>
                {" "}
                Excluir{" "}
              </button>
            </div>
          );
        })}
      <h1>Lista de produtos processados</h1>

      {processed_products &&
        processed_products.map((item) => {
          return (
            <div>
              <span> {item.name} </span>
              <span> {item.sell_price_in_cents} </span>
              <button> Editar </button>
              <button> Excluir </button>
            </div>
          );
        })}

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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    {...register(`input.${index}.quantity` as const, {
                      valueAsNumber: true,
                    })}
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
                  quantity: 0,
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const restaurantURL = String(context.query.restaurant);

  console.log(restaurantURL);

  try {
    const response = await api.get(`/${restaurantURL}/inputs/get-inputs`);
    const inputslist = response.data;
    console.log(inputslist);
    return {
      props: {
        inputslist,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: JSON.stringify(error),
      },
    };
  }
};
