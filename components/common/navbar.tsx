import { useAuthContext } from "@/context/auth/auth-context";
import { toAbsoluteUrl } from "@/utils/assets";
import React, { useState, useEffect, useRef } from "react";
import ProjectService from "@/services/projects";

import { secureStorage } from "@/utils/crypto"; // Assuming it's for local storage
import FileUpload from "../ui/file-uploadModal";
import { useDispatch } from "react-redux";
import { useTaskContext } from "@/context/task/task-context";

import { setProjectId } from "@/redux/features/project.slice";
import { FaBell, FaCheckCircle } from "react-icons/fa"; // Importing FaCheckCircle for the check mark
import Image from "next/image";

const Navbar = ({ pageTitle }: { pageTitle: string }) => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationPage, setNotificationPage] = useState(1);
  const [role, setRole] = useState("");
  const [projectDetails, setProjectDetails] = useState([]);
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Start with modal closed
  const dropdownRef = useRef<HTMLDivElement>(null);

  const staticNotifications = [
    { id: 1, title: "Notification 1", description: "Description for notification 1", isRead: false },
    { id: 2, title: "Notification 2", description: "Description for notification 2", isRead: false },
    { id: 3, title: "Notification 3", description: "Description for notification 3", isRead: false },
    { id: 4, title: "Notification 4", description: "Description for notification 4", isRead: false },
    { id: 5, title: "Notification 5", description: "Description for notification 5", isRead: false },
    { id: 6, title: "Notification 6", description: "Description for notification 6", isRead: false },
    { id: 7, title: "Notification 7", description: "Description for notification 7", isRead: false },
    { id: 8, title: "Notification 8", description: "Description for notification 8", isRead: false },
    { id: 9, title: "Notification 9", description: "Description for notification 9", isRead: false },
    { id: 10, title: "Notification 10", description: "Description for notification 10", isRead: false },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleNotifications = () => setIsNotificationOpen((prev) => !prev);

  const loadNotifications = async () => {
    if (loadingNotifications) return;
    setLoadingNotifications(true);

    try {
      const startIndex = (notificationPage - 1) * 5;
      const newNotifications = staticNotifications.slice(
        startIndex,
        startIndex + 5
      );

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...newNotifications,
      ]);
      setNotificationPage(notificationPage + 1);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Function to get user role
  const getRole = async () => {
    const roles = await secureStorage.getItem("role");
    if (roles) setRole(roles);
  };

  // Show projects (static mockup for now)
  const showProjects = async () => {
    setLoading(true);
    const response = await ProjectService.getProjectName();
    if (response && response.status === 200) {
      setProjectDetails(response.data.data.list);
      const storedProjectId = await secureStorage.getItem("projectId");
      setId(storedProjectId ? storedProjectId : response.data.data.default);
      dispatch(
        setProjectId(
          storedProjectId ? storedProjectId : response.data.data.default
        )
      );
      setLoading(false);
    }
  };


  const handleChange = async (e: any) => {
    const newId = e.target.value;
    setId(newId);
    secureStorage.setItem("projectId", newId);
    dispatch(setProjectId(newId));
  };

  // Mark notification as read
  const markAsRead = (notificationId: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  useEffect(() => {
    if (role === "tenant") {
      showProjects();
    }
  }, [role, id]);

  useEffect(() => {
    getRole();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isNotificationOpen) {
      loadNotifications();
    }
  }, [isNotificationOpen]);

  // Handle modal opening and closing manually
  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Updated handle scroll to avoid TypeScript error
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement; // Type assertion to HTMLElement
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom) {
      loadNotifications();
    }
  };

  return (
    <div className="relative flex items-center mb-3">
      <h1 className="text-primary-100 text-3xl font-bold w-full">{pageTitle}</h1>
      <div className="w-full items-center justify-end flex gap-4">
        {role === "tenant" && projectDetails.length > 0 ? (
          <div className="min-w-16 h-7 text-ellipsis whitespace-nowrap">
            <select
              className="select select-sm"
              value={id}
              onChange={(e) => handleChange(e)}
            >
              {projectDetails.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.title || "---"}
                </option>
              ))}
            </select>
          </div>
        ) : role === "tenant" && !loading && projectDetails.length === 0 ? (
          <FileUpload
            isOpen={isModalOpen}
            onClose={closeModal}
            details={projectDetails}
          />
        ) : null}

        {/* Profile Dropdown */}
        <div className="relative flex items-center" ref={dropdownRef}>
          <Image
            onClick={toggleDropdown}
            src={toAbsoluteUrl("/media/images/profile.jpeg")}
            alt="profile"
            height={40}
            width={40}
            className="cursor-pointer rounded-full"
          />
          <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap block ml-2">
            James Smith
          </span>

          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-40 z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Notification Bell Icon */}
        <div className="relative" onClick={toggleNotifications}>
          <FaBell className="cursor-pointer text-lg" />
          {notifications.length > 0 && (
            <span className="absolute top-[-8px] right-0 left-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.filter((notif) => !notif.isRead).length}
            </span>
          )}

          {isNotificationOpen && (
            <div
              className="absolute top-12 right-0 w-80 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-scroll"
              onScroll={handleScroll}
            >
              <div className="px-4 py-2 flex justify-between items-center">
                <h4 className="font-bold">Notifications</h4>
                <button
                  className="text-sm text-blue-500 hover:text-blue-600"
                  onClick={markAllAsRead}
                >
                  Mark All as Read
                </button>
              </div>


              <ul className="py-2">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${notif.isRead ? "bg-gray-100" : ""
                      }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h6 className="font-semibold text-sm">{notif.title}</h6>
                      {!notif.isRead && (
                        <FaCheckCircle
                          className="text-green-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{notif.description}</p>
                  </li>
                ))}
                {loadingNotifications && (
                  <div className="px-4 py-2 text-center">Loading...</div>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
