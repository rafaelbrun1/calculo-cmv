import { api } from "@/src/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface InputsProps {
  id: string;
  cod: "lt" | "kg" | "und";
  cost_in_cents: number;
  groupsId: string | null;
  name: string;
}

const createInputSchema = z.object({
  cod: z.string().nullable(),
  und: z.string(),
  cost_in_cents: z.number(),
  name: z.string(),
  groupsId: z.string().nullable(),
});

type createInputData = z.infer<typeof createInputSchema>;

export default function Inputs() {
  const [inputs, setInputs] = useState<InputsProps[]>([]);
  const router = useRouter();
  const [createNewInput, setCreateNewInput] = useState<boolean>(false);

  async function handleCreateInput(data: createInputData) {
    try {
      api
        .post(`/inputs/${router.query.restaurant}/create-inputs`, {
          cod: data.cod,
          und: data.und,
          cost_in_cents: data.cost_in_cents,
          name: data.name,
          groupId: data.groupsId,
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
        `inputs/${router.query.restaurant}/get-inputs`
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
      <div>Lista de insumos</div>
      <div>
        {inputs &&
          inputs.map((input) => {
            return <h1 key={input.id}>{input.name}</h1>;
          })}
      </div>
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
          <label htmlFor="group">Grupo</label>
          <select {...register("groupsId")} id="group">
            <option value="123"> Grupo exemplo</option>
          </select>
          <button> Criar grupo </button>
        </div>
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
    </>
  );
}
