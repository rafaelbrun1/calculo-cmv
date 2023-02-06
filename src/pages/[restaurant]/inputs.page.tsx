import { api } from "@/src/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface InputsProps {
  id: string;
  cod: string;
  und: "lt" | "kg" | "und";
  cost_in_cents: number;
  name: string;
}

const createInputSchema = z.object({
  cod: z.string().nullable(),
  und: z.string(),
  cost_in_cents: z.number(),
  name: z.string(),
});

type createInputData = z.infer<typeof createInputSchema>;

export default function Inputs() {
  const [inputs, setInputs] = useState<InputsProps[]>([]);
  const router = useRouter();
  const [createNewInput, setCreateNewInput] = useState<boolean>(false);

  async function handleCreateInput(data: createInputData) {
    try {
      api
        .post(`/${router.query.restaurant}/inputs/create-inputs`, {
          cod: data.cod,
          und: data.und,
          cost_in_cents: data.cost_in_cents,
          name: data.name,
        })
        .then((res) => setInputs((prev) => [res.data, ...prev]));
    } catch (error) {
      console.log(error);
    }
    console.log(data, router);
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<createInputData>({
    resolver: zodResolver(createInputSchema),
  });

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

  if (status === "loading") {
    return <h1>loading</h1>;
  }

  return (
    <>
      <button onClick={() => setCreateNewInput(true)}>
        Cadastrar novo insumo
      </button>
      <form onSubmit={handleSubmit(handleCreateInput)}>
        <input type="text" placeholder="nome do insumo" {...register("name")} />

        <input
          type="text"
          placeholder="custo"
          {...register("cost_in_cents", { valueAsNumber: true })}
        />
        <div>
          <label htmlFor="cod">Código</label>
          <input type="text" {...register("cod")} id="cod" />
        </div>
        <div>
          <label htmlFor="und">unidade</label>
          <select {...register("und", { required: true })} id="und">
            <option value="und">und.</option>
            <option value="kg">kg</option>
            <option value="lt">lt</option>
          </select>
        </div>
        <button type="submit"> criar novo insumo</button>
      </form>

      <div>Lista de insumos</div>
      <div>
        {inputs &&
          inputs.map((input) => {
            return (
              <div key={input.id}>
                <span>Código: {input.cod} </span>
                <span>Nome: {input.name} </span>
                <span>Custo: {input.cost_in_cents} </span>
                <span>Unidade: {input.und} </span>
              </div>
            );
          })}
      </div>
    </>
  );
}
