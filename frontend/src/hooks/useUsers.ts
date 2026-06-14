import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "@/services/auth"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: number;
      role: string;
    }) =>
      updateUserRole(userId, role as any),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}



export function useDeleteUser() {

  const qc = useQueryClient();

  return useMutation({

    mutationFn: deleteUser,

    onSuccess: () => {

      qc.invalidateQueries({

        queryKey: ["users"],

      });

    },

  });

}