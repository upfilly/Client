"use client";
import React, { useEffect, useState } from "react";
import Html from "./html";
import ApiClient from "@/methods/api/apiClient";
import { useRouter } from "next/navigation";
import loader from "@/methods/loader";

const AllowNotification = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  console.log(categories, "categories");
  const back = () => {
    router.back();
  };

  const getModule = (p = {}) => {
    loader(true);
    let url = "email/setting/list";
    ApiClient.get(url)
      .then((res) => {
        if (res.success) {
          const data = res.data.data.map((item) => ({
            ...item,
            isChecked: item.emailSent || false,
          }));
          setCategories(data);
          loader(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const handleToggle = async (index) => {
    loader(true);
    try {
      const updatedCategories = [...categories];
      const categoryToUpdate = updatedCategories[index];

      categoryToUpdate.isChecked = !categoryToUpdate.isChecked;
      setCategories(updatedCategories);

      const payload = {
        id: categoryToUpdate.id,
        emailSent: categoryToUpdate.isChecked,
        name: categoryToUpdate.name,
      };
      const url = "email/setting/update";
      const res = await ApiClient.put(url, payload);

      if (!res.success) {
        categoryToUpdate.isChecked = !categoryToUpdate.isChecked;
        setCategories([...updatedCategories]);
        console.error("Failed to update notification setting");
      }
    } catch (error) {
      console.error("Error updating toggle:", error);
    } finally {
      loader(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    getModule();
  }, []);

  return (
    <>
      <Html
        back={back}
        category={categories}
        handleToggle={handleToggle}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default AllowNotification;
