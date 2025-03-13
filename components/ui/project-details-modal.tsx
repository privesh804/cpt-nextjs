import React, { useCallback, useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "../modal";
import { FaPlus } from "react-icons/fa6";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { GoKebabHorizontal } from "react-icons/go";
import clsx from "clsx";
import AddProject from "@/icons/add-project";
import apiClient from "@/lib/client";

const options = ["Per Square", "Per Centimeter", "Per Inch"];
const ProjectDetailsModal = ({
  open,
  setOpen,
  projectId,
  sectionId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  sectionId: string;
}) => {
  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  const [newRow, setNewRow] = useState<ProductDetails | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([
    {
      id: "1",
      itemCode: 12,
      description: "This is a dummy product",
      quantity: 3,
      unit: "Per Centimeter",
      rate: 10,
      amount: 500,
    },
    {
      id: "2",
      itemCode: 2,
      description: "This is a Demo product",
      quantity: 3,
      unit: "Per Inch",
      rate: 10,
      amount: 500,
    },
    {
      id: "3",
      itemCode: 12,
      description: "This is a Test product",
      quantity: 3,
      unit: "Per Square",
      rate: 10,
      amount: 500,
    },
  ]);
  const [showPopup, setShowPopup] = useState("");

  const fetchDetails = useCallback(async () => {
    const response = await apiClient.get(
      `/task-management/project/${projectId}/section/${sectionId}/detail`
    );

    if (response.data && response.data.project_section) {
      setProductDetails(response.data.project_section.data);
    }
  }, [projectId, sectionId]);

  useEffect(() => {
    if (projectId && sectionId) {
      fetchDetails();
    }
  }, [fetchDetails]);

  const [selectedActions, setSelectedActions] = useState<any>({});
  const [showbtn, setShowBtn] = useState(true);

  const handleAdd = () => {
    setShowBtn(false);

    setNewRow({
      id: `${productDetails.length + 1}`,
      itemCode: 0,
      description: "",
      quantity: 0,
      unit: "Per Square",
      rate: 0,
      amount: 0,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!newRow) return;
    const { name, value } = e.target;

    setNewRow({
      ...newRow,
      [name]:
        name === "quantity" ||
        name === "rate" ||
        name === "amount" ||
        name === "itemCode"
          ? Number(value)
          : value,
    });
  };

  const handleSave = () => {
    if (newRow) {
      setProductDetails([...productDetails, newRow]);
      setNewRow(null);
      setShowBtn(true);
    }
  };

  return (
    <Modal open={open} className="!w-3/4" ref={ref}>
      <ModalHeader>
        <ModalTitle>Project Details</ModalTitle>
        <div
          className="cursor-pointer glyph fs1"
          onClick={() => setOpen(false)}
        >
          <FaPlus className="rotate-45" />
        </div>
      </ModalHeader>
      <ModalBody>
        <table className="table">
          <thead className="table-header-group">
            <tr>
              <th>Item Code</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {productDetails &&
              productDetails.map((item, id) => (
                <tr key={id}>
                  <td className="table-cell">{item.itemCode}</td>
                  <td className="table-cell">{item.description}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="table-cell">{item.unit}</td>
                  <td className="table-cell">{item.rate}</td>
                  <td className="table-cell">{item.amount}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setShowPopup((prev) =>
                            prev === item.id ? "" : item.id
                          )
                        }
                      >
                        {selectedActions[item.id] === "accept" ? (
                          <span className="text-green-600 font-semibold">
                            Accepted
                          </span>
                        ) : selectedActions[item.id] === "reject" ? (
                          <span className="text-red-600 font-semibold">
                            Rejected
                          </span>
                        ) : (
                          <GoKebabHorizontal />
                        )}
                      </button>
                      <div
                        className={clsx("popover absolute top-17 right-4", {
                          show: showPopup === item.id,
                        })}
                      >
                        <div
                          className="popover-body flex items-center gap-2 text-green-600 cursor-pointer"
                          onClick={() => {
                            setSelectedActions((prev: any) => ({
                              ...prev,
                              [item.id]: "accept",
                            }));
                            setShowPopup("");
                          }}
                        >
                          Accept
                        </div>
                        <div
                          className="popover-body flex items-center gap-2 text-red-600 cursor-pointer"
                          onClick={() => {
                            setSelectedActions((prev: any) => ({
                              ...prev,
                              [item.id]: "reject",
                            }));
                            setShowPopup("");
                          }}
                        >
                          Reject
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            {newRow && (
              <tr>
                <td className="table-cell">
                  <input
                    type="text"
                    onKeyDown={(event) => {
                      if (
                        !/^\d$/.test(event.key) &&
                        event.key !== "Backspace"
                      ) {
                        event.preventDefault();
                      }
                    }}
                    name="itemCode"
                    value={newRow.itemCode}
                    onChange={handleChange}
                    className="input input-sm"
                  />
                </td>
                <td className="table-cell">
                  <input
                    placeholder="Enter Description"
                    name="description"
                    value={newRow.description}
                    onChange={handleChange}
                    className="input input-sm"
                  />
                </td>
                <td className="table-cell">
                  <input
                    type="text"
                    onKeyDown={(event) => {
                      if (
                        !/^\d$/.test(event.key) &&
                        event.key !== "Backspace"
                      ) {
                        event.preventDefault();
                      }
                    }}
                    name="quantity"
                    value={newRow.quantity}
                    onChange={handleChange}
                    className="input input-sm"
                  />
                </td>
                <td className="table-cell">
                  <select
                    name="unit"
                    className="select select-sm rounded-[41px]"
                    value={newRow.unit}
                    onChange={handleChange}
                  >
                    {options.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="table-cell">
                  <input
                    type="text"
                    onKeyDown={(event) => {
                      if (
                        !/^\d$/.test(event.key) &&
                        event.key !== "Backspace"
                      ) {
                        event.preventDefault();
                      }
                    }}
                    name="rate"
                    value={newRow.rate}
                    onChange={handleChange}
                    className="input input-sm"
                  />
                </td>
                <td className="table-cell">
                  <input
                    type="text"
                    onKeyDown={(event) => {
                      if (
                        !/^\d$/.test(event.key) &&
                        event.key !== "Backspace"
                      ) {
                        event.preventDefault();
                      }
                    }}
                    name="amount"
                    value={newRow.amount}
                    onChange={handleChange}
                    className="input input-sm"
                  />
                </td>

                <td className="table-cell">
                  <button
                    className="btn btn-warning btn-sm "
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center mt-5 cursor-pointer">
          <button onClick={showbtn ? handleAdd : undefined}>
            <AddProject
              className={clsx("text-green-600", {
                "text-opacity-20": !showbtn,
              })}
            />
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ProjectDetailsModal;
