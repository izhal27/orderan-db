"use client";

import { Label, Select } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchData = async () => {
      if (selectedUserRoleId) {
        setUserRoleId(selectedUserRoleId);
      }
      const res = await fetch("http://localhost:3002/api/roles", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "force-cache",
      });
      if (res.ok) {
        const result = await res.json();
        setRoles(result);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session, selectedUserRoleId]);

  const changeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    onSelectHandler(+event.currentTarget.value);
  };

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
