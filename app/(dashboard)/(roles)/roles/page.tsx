"use client";
import ArrowDown from "@/icons/arrow-down";
import React, { useEffect, useState } from "react";
import roleService from "@/services/roles";

interface Role {
  uuid: string;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permission: string[];
}
interface Permissions {
  uuid: string;
  name: string;
  guard_name: string;
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]); // State to store fetched roles
  const [activeIndex, setActiveIndex] = useState<string>("");
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editedRoleName, setEditedRoleName] = useState<string>("");
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const [rolesResponse, permissionsResponse] =
          await roleService.fetchRoles();

        if (rolesResponse) {
          setRoles(rolesResponse.data.data);
          setPermissions(permissionsResponse.data.data);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchRoles();
  }, []);

  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newRoleName, setNewRoleName] = useState(""); // New role name

  const handleAccordionToggle = (id: string) => {
    if (activeIndex === id) {
      return setActiveIndex("");
    } else {
      setActiveIndex(id);
    }
  };

  const handleAddRole = async (data: string) => {
    if (!newRoleName.trim()) return;
    // setLoading(true);
    try {
      const response = await roleService.addRole({ newRoleName });
      const newRole = response.data.role;
      setRoles((prev) => [...prev, newRole]);
      setShowModal(false);
      setNewRoleName("");
    } finally {
      // setLoading(false);
    }
  };

  const handleSaveEdit = async (data: { roleId: string }) => {
    if (!editedRoleName.trim()) return;
    try {
      await roleService.saveRole({
        roleId: data.roleId,
        editedRoleName: editedRoleName,
      });
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.uuid === data.roleId ? { ...role, name: editedRoleName } : role
        )
      );
      setEditingRoleId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchChange = async (data: {
    roleId: string;
    permission: Permissions;
  }) => {
    // setLoading(true);

    try {
      const role = roles.find((role) => role.uuid === data.roleId);

      if (!role) {
        console.error("Role not found");
        return;
      }
      const isAssigned =
        role.permission?.includes(data.permission.uuid) || false;

      const payload = {
        permission_name: data.permission.name,
        permission_status: !isAssigned,
      };
      await roleService.changePermission({
        roleId: data.roleId,
        data: payload,
      });

      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.uuid === data.roleId
            ? {
                ...role,
                permission: isAssigned
                  ? (role.permission || []).filter(
                      (id) => id !== data.permission.uuid
                    )
                  : [...(role.permission || []), data.permission.uuid],
              }
            : role
        )
      );
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-svh h-full">
      {" "}
      <div className="my-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-2xl text-primary-100 ml-2">Roles</h3>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-secondary rounded-full btn-sm mr-2"
          >
            Add Role
          </button>
        </div>
        <div className="w-full border"></div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Add New Role</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter role name"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleAddRole(newRoleName);
                    setShowModal(false);
                  }}
                  className="bg-primary text-white py-2 px-4 rounded-md"
                >
                  Add Role
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="w-full mt-10 ">
          {roles.length > 0 &&
            roles.map((role, index) => (
              <div
                key={role.uuid}
                className="w-full  rounded-xl mt-5 shadow border border-[#E9E9E9] bg-[#f8f8f8]"
              >
                <div
                  className="flex items-center justify-between p-4 gap-2 cursor-pointer rounded-t-xl"
                  onClick={() => handleAccordionToggle(role.uuid)}
                >
                  <div className="flex items-center justify-between gap-4 w-full">
                    {editingRoleId === role.uuid ? (
                      <input
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                        value={editedRoleName}
                        onChange={(e) => setEditedRoleName(e.target.value)}
                        className="p-2 border rounded w-1/2"
                      />
                    ) : (
                      <h3 className="text-base font-medium text-primary capitalize">
                        {role.name}
                      </h3>
                    )}
                    <button
                      className="btn btn-secondary btn-sm rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editingRoleId === role.uuid) {
                          handleSaveEdit({ roleId: role.uuid });
                        } else {
                          setEditingRoleId(role.uuid);
                          setEditedRoleName(role.name);
                        }
                      }}
                    >
                      {editingRoleId === role.uuid ? "Save Role" : "Edit Role"}
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`transition-transform duration-300 ${
                        activeIndex === role.uuid ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ArrowDown />
                    </span>
                  </div>
                </div>

                {activeIndex === role.uuid && (
                  <div className="border  border-[#E9E9E9] ">
                    <div className="overflow-hidden transition-all duration-300 ease-in-out rounded-b-xl p-4">
                      <div className="grid grid-cols-12  gap-y-2">
                        {permissions &&
                          permissions.map((item) => {
                            // const isAssigned = role.permission.includes(
                            //   item.uuid
                            // );

                            return (
                              <div key={item.uuid} className="col-span-4 z-0">
                                <label className="switch switch-sm">
                                  <input
                                    className="order-1"
                                    name={item.name}
                                    type="checkbox"
                                    value={item.uuid}
                                    checked={role.permission?.includes(
                                      item.uuid
                                    )}
                                    onChange={() =>
                                      handleSwitchChange({
                                        roleId: role.uuid,
                                        permission: item,
                                      })
                                    }
                                  />

                                  <div className="switch-label order-2">
                                    <span className="text-primary-100 text-sm font-medium">
                                      {item.name}
                                    </span>
                                  </div>
                                </label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Roles;
