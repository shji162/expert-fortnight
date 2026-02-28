import { useMutation } from "@tanstack/react-query";
import auth from "../../api/endpoints/auth";

interface NewPasswordPayload {
  password: string;
  token: string;
}

export const useNewPasswordMutation = () => {
  const mutation = useMutation({
    mutationFn: async ({ password, token }: NewPasswordPayload) => {
      const res = await auth.newPassword(password, token);
      return res;
    },
  });

  return mutation;
}

