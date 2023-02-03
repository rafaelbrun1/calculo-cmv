import { api } from "@/src/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import {  useForm } from "react-hook-form";
import { z } from "zod";

const createInputSchema = z.object({
  cod: z.string().nullable(),
  und: z.string(),
  cost_in_cents: z.number(),
  name: z.string(),
  groupId: z.string().nullable(),
});

type createInputData = z.infer<typeof createInputSchema>;

export default function Inputs() {
  const router = useRouter();
  const [createNewInput, setCreateNewInput] = useState<boolean>(false);

  async function handleCreateInput(data: createInputData) {
    try {
      api.post(`/inputs/${router.query.restaurant}/create-inputs`, {
        cod: data.cod,
        und: data.und,
        cost_in_cents: data.cost_in_cents,
        name: data.name,
        groupId: data.groupId
      });
    } catch (error) {
      console.log(error);
    }
    console.log(data, router)
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<createInputData>({
    resolver: zodResolver(createInputSchema),
  });

  return (
    <>
      <div>Lista de insumos</div>
      <button onClick={() => setCreateNewInput(true)}>
        Cadastrar novo insumo
      </button>
      <form onSubmit={handleSubmit(handleCreateInput)}>
        <input type="text" placeholder="nome do insumo" {...register("name")} />

        <input
          type="text"
          placeholder="custo"
          {...register("cost_in_cents", {valueAsNumber: true})}
        />
        <div>
          <label htmlFor="group">Grupo</label>
          <select {...register("groupId")} id="group">
            <option value='123'> Grupo exemplo</option>
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
