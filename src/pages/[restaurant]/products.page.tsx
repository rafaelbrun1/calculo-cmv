import { api } from "@/src/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
import Select from "react-select";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

interface OptionsProps {
  value: string;
  label: string;
  input_type: "processed" | "input";
}

interface ProductsInputsProps {
  quantity: number;
  input?: {
    id: string;
    name: string;
  };
  processedProducts?: {
    id: string;
    name: string;
  };
}

interface ProcessedProductsInputsProps {
  quantity: number;
  inputs?: {
    id: string;
    name: string;
  };
  processedProductsAsInput?: {
    id: string;
    name: string;
  };
}

interface GroupedOptionProps {
  label: string;
  options: OptionsProps[];
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
      input_type: z.string(),
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

export default function Products() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalEditProductsIsOpen, setModalEditProductsIsOpen] = useState(false);
  const [activeFinalProduct, setActiveFinalProduct] =
    useState<ProductsInputsProps[]>();
  const [modalEditProcessedProduct, setModalEditProcessedProduct] =
    useState(false);
  const [activeProcessedProduct, setActiveProcessedProduct] =
    useState<ProcessedProductsInputsProps[]>();

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

  const { data: inputslist = [] } = useQuery<ProductsProps[]>(
    ["inputs_list"],
    async () => {
      const response = await api.get(
        `/${router.query.restaurant}/inputs/get-inputs`
      );
      return response.data;
    }
  );

  const { data: final_products } = useQuery<ProductsProps[]>(
    ["final_products"],
    async () => {
      const response = await api.get(
        `/${router.query.restaurant}/products/get-final-products`
      );
      return response.data;
    }
  );

  const {
    refetch,
    status,
    data: processed_products = [],
  } = useQuery<ProductsProps[]>(["processed_products"], async () => {
    const response = await api.get(
      `/${router.query.restaurant}/processedproducts/get-processed-products`
    );
    return response.data;
  });

  const groupedOptions: GroupedOptionProps[] = [
    {
      label: "Insumos",
      options: inputslist.map((input) => ({
        value: input.id,
        label: input.name,
        input_type: "input",
      })),
    },
    {
      label: "Produtos processados",
      options: processed_products.map((input) => ({
        value: input.id,
        label: input.name,
        input_type: "processed",
      })),
    },
  ];

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function openModalEditFinalProduct(id: string) {
    const response = await api.get(
      `/${router.query.restaurant}/products/get-final-products-inputs/${id}`
    );
    setActiveFinalProduct(response.data);
    setModalEditProductsIsOpen(true);
  }

  function closeModalEditProducts() {
    setModalEditProductsIsOpen(false);
  }

  async function openModalEditProcessedProduct(id: string) {
    const response = await api.get(
      `/${router.query.restaurant}/processedproducts/get-processed-products-inputs/${id}`
    );
    setActiveProcessedProduct(response.data);
    setModalEditProcessedProduct(true);
    console.log(activeProcessedProduct);
  }

  function closeModalEditProcessedProduct() {
    setModalEditProcessedProduct(false);
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
    } else if (data.type === "processado") {
      try {
        await api.post(
          `/${restaurantURL}/processedproducts/create-processed-products`,
          {
            product_name: data.product_name,
            input: data.input,
          }
        );
        queryClient.invalidateQueries(["processed_products"]);
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
      queryClient.invalidateQueries(["final_products"]);
    } else {
      console.log("cancelado");
    }
  }

  async function deleteProcessedProduct(id: string) {
    if (confirm("Tem certeza que deseja excluir esse produto?")) {
      await api.delete(
        `${restaurantURL}/processedproducts/delete-processed-products`,
        {
          data: {
            id,
          },
        }
      );
      queryClient.invalidateQueries(["processed_products"]);
    } else {
      console.log("cancelado");
    }
  }

  if (status === "loading") {
    return <h1>carregando</h1>;
  }

  return (
    <>
      <h1> Lista de produtos finais</h1>

      {final_products?.map((product) => {
        return (
          <div key={product.id}>
            <span> {product.name} </span>
            <span> {product.sell_price_in_cents} </span>
            <button onClick={() => openModalEditFinalProduct(product.id)}>
              {" "}
              Editar{" "}
            </button>
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
            <div key={item.id}>
              <span> {item.name} </span>
              <span> {item.sell_price_in_cents} </span>
              <button onClick={() => openModalEditProcessedProduct(item.id)}>
                {" "}
                Editar{" "}
              </button>
              <button onClick={() => deleteProcessedProduct(item.id)}>
                {" "}
                Excluir{" "}
              </button>
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
                            c.options.find(
                              (item) => item.value === value?.value
                            )
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
                  input_type: "",
                })
              }
            >
              APPEND
            </button>
            <button type="submit">Cadastrar produto</button>
          </form>
        </Modal>

        <Modal
          isOpen={modalEditProductsIsOpen}
          onRequestClose={closeModalEditProducts}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          {activeFinalProduct &&
          activeFinalProduct.some((item) => item.input !== null) ? (
            <>
              <h1>Insumos</h1>
              {activeFinalProduct.map((input) => {
                return <p>{input.input?.name}</p>;
              })}
            </>
          ) : null}

          {activeFinalProduct &&
          activeFinalProduct.some((item) => item.processedProducts !== null) ? (
            <>
              <h1>Produtos processados</h1>
              {activeFinalProduct.map((input) => {
                return <p>{input.processedProducts?.name}</p>;
              })}
            </>
          ) : null}
        </Modal>

        <Modal
          isOpen={modalEditProcessedProduct}
          onRequestClose={closeModalEditProcessedProduct}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          {activeProcessedProduct &&
          activeProcessedProduct.some((item) => item.inputs !== null) ? (
            <>
              <h1>Insumos</h1>
              {activeProcessedProduct.map((input) => {
                return <p>{input.inputs?.name}</p>;
              })}
            </>
          ) : null}

          {activeProcessedProduct &&
          activeProcessedProduct.some(
            (item) => item.processedProductsAsInput !== null
          ) ? (
            <>
              <h1>Produtos Processados</h1>
              {activeProcessedProduct.map((input) => {
                return <p>{input.processedProductsAsInput?.name}</p>;
              })}
            </>
          ) : null}
        </Modal>
      </div>
    </>
  );
}
