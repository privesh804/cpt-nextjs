import AddIcon from "@/icons/add-icon";
import React from "react";
import addTaskImage from "@/public/media/images/add_task_blur.png";
import profileImage2 from "@/public/media/images/sidebarImage.png";
import Image from "next/image";

const AddTask = () => {
  return (
    <div className="rounded-2xl bg-primary p-5 relative">
      <div className="flex flex-row gap-5">
        <div className="flex flex-col gap-5 pt-8">
          <button className="w-11 h-11 rounded-full bg-tertiary flex justify-center items-center">
            <AddIcon />
          </button>
          <h3 className="font-normal text-xl text-tertiary">Add Task</h3>
        </div>

        <Image
          src={profileImage2}
          alt="add_task"
          className="absolute left-[6rem]"
          width={100}
          height={100}
        />
        <Image
          className="absolute right-0 top-0"
          src={addTaskImage}
          alt="add_task"
        />
      </div>
    </div>
  );
};

export default AddTask;
