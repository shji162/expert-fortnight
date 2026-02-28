import { useMutation } from "@tanstack/react-query";
import auth from "../../api/endpoints/auth";

export const useResetPasswordMutation = () => {
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await auth.resetPassword(email);
      return res;
    },
  });

  return mutation;
}

