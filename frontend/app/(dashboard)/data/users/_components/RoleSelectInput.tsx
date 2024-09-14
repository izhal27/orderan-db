"use client";

import { COMMON_ERROR_MESSAGE, showToast } from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { Label, Select } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface Role {
  id: number;
  name: string;
}

interface props {
  onSelectHandler(id: number): void;
  selectedUserRoleId?: number | null;
}

export function RoleSelectInput({
  onSelectHandler,
  selectedUserRoleId,
}: props) {
  const { data: session } = useSession();
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoleId, setUserRoleId] = useState<number | null>(null);
  const { request } = useApiClient();

  const fetchRoles = useCallback(async () => {
    if (selectedUserRoleId) {
      setUserRoleId(selectedUserRoleId);
    }
    try {
      const roles = await request("/roles");
      setRoles(roles);
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
  }, [request, selectedUserRoleId, setUserRoleId]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchRoles();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, selectedUserRoleId]);

  const changeHandler = useCallback(
    (event: React.FormEvent<HTMLSelectElement>) => {
      onSelectHandler(+event.currentTarget.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="roles" value="Role" />
      </div>
      <Select
        value={userRoleId?.toString()}
        defaultValue={0}
        onChange={changeHandler}
        id="roles"
      >
        <option value={undefined} label=""></option>
        {roles.map((item) => {
          return (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          );
        })}
      </Select>
    </div>
  );
}
