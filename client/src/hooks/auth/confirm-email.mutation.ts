import { useMutation } from "@tanstack/react-query";
import auth from "../../api/endpoints/auth";

export const useEmailConfirmationMutation = () => {
  const mutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await auth.confirm(token);
      return res;
    },
  });

  return mutation;
}

