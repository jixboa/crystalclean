import { Button } from "@material-tailwind/react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export function AddButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      /*   onClick={handleAddCategory} */
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      {pending ? "Adding" : "Add Category"}
    </Button>
  );
}
