import { FormMeta } from "@/components/formGoal/FormGoal";
import type { Meta } from "@/types";

interface CreateMetaProps {
  onSubmit: (meta: Meta) => void;
}

export function CreateGoal({
  onSubmit,
}: CreateMetaProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-4">
            <i
              className="ti ti-target text-[24px] text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
          </div>

          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Configure sua meta
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Defina quanto quer ganhar e em quantos dias para começar o acompanhamento
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <FormMeta onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}