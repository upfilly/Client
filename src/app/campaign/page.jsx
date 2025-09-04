"use client";

import React, { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import "./style.scss";
import loader from "../../methods/loader";
import Html from "./html";
import { userType } from "../../models/type.model";
import axios from "axios";
import environment from "../../environment";
import crendentialModel from "@/models/credential.model";
import { toast } from "react-toastify";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import methodModel from "../../methods/methods";

const Users = () => {
  const user = crendentialModel.getUser();
  const { role } = useParams();
  const [filters, setFilter] = useState({
    page: 0,
    count: 10,
    search: "",
    role: role || "",
    isDeleted: false,
    status: "",
    brand_id: user?.id,
  });
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("list");
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [form, setform] = useState(userType);
  const history = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    if (user) {
      setFilter({ ...filters, page: 1, ...params });
      getData({ role, page: 1, isArchive: false, ...params });
    }
  }, [role]);

  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p };
    let url = "campaign/brand/all";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        const updatedData = res.data.data.map((item) => {
          if (item.isArchive) {
            return { ...item, status: "deactive" };
          }
          return item;
        });
        setData(updatedData);
        setTotal(res.data.total_count);
      }
      setLoader(false);
    });
  };

  const clear = () => {
    setFilter({ ...filters, search: "", page: 1 });
    getData({ search: "", page: 1, isArchive: false });
    setActiveTab("active");
  };

  const deleteItem = (id, itm) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // loader(true)
        ApiClient.put("campaign", {
          id: id,
          name: itm?.name,
          isArchive: itm?.isArchive ? false : true,
          status: "deactive",
        }).then((res) => {
          if (res.success) {
            toast.success(res.message);
            clear();
          }
          // loader(false)
        });
      }
    });
  };

  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected });
    getData({ page: e.selected + 1 });
  };

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p });
    getData({ ...p, page: 1 });
  };

  const ChangeRole = (e) => {
    setFilter({ ...filters, role: e, page: 1 });
    getData({ role: e, page: 1 });
  };
  const ChangeStatus = (e) => {
    console.log(e, "klklkl");
    setFilter({ ...filters, status: e, page: 1 });
    getData({ status: e, page: 1 });
  };

  const statusChange = (itm) => {
    if (itm.isArchive) {
      toast.info("Cannot change status of an archived campaign");
      return;
    }

    let status = "active";
    if (itm.status == "active") status = "deactive";

    Swal.fire({
      title: ``,
      text: `Do you want to ${
        status == "active" ? "Activate" : "Deactivate"
      } this Campaign`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.put(`campaign`, {
          name: itm.name,
          status,
          id: itm.id || itm?._id,
        }).then((res) => {
          if (res.success) {
            getData({ page: 1 });
          }
          loader(false);
        });
      }
    });
  };

  const view = (id) => {
    const filterParams = {
      ...filters,
      page: 1,
    };

    const queryString = new URLSearchParams(filterParams).toString();

    history.push(`/campaign/detail/${id}?${queryString}`);
    // history.push("/campaign/detail/"+id)
  };

  const edit = (id) => {
    const item = data.find((item) => item.id === id || item._id === id);
    if (item && item.isArchive) {
      toast.info("Cannot edit an archived campaign");
      return;
    }

    let url = `/campaign/edit/${id}`;
    if (role) url = `/campaign/${role}/edit/${id}`;
    history.push(url);
  };

  const add = () => {
    let url = `/campaign/add`;
    if (role) url = `/campaign/${role}/add`;
    history.push(url);
  };

  const reset = () => {
    let filter = {
      status: "",
      role: "",
      search: "",
      page: 1,
      count: 10,
    };
    setFilter({ ...filters, ...filter });
    getData({ ...filter });
    history.push("/campaign");
    // dispatch(search_success(''))
  };

  const sorting = (key) => {
    let sorder = "asc";
    if (filters.key == key) {
      if (filters?.sorder == "asc") {
        sorder = "desc";
      } else {
        sorder = "asc";
      }
    }

    let sortBy = `${key} ${sorder}`;
    filter({ sortBy, key, sorder });
  };

  const isAllow = (key = "") => {
    return true;
  };

  return (
    <>
      <Html
        filter={filter}
        isAllow={isAllow}
        reset={reset}
        add={add}
        view={view}
        edit={edit}
        role={role}
        ChangeRole={ChangeRole}
        ChangeStatus={ChangeStatus}
        pageChange={pageChange}
        deleteItem={deleteItem}
        filters={filters}
        loaging={loaging}
        data={data}
        total={total}
        sorting={sorting}
        setFilter={setFilter}
        user={user}
        getData={getData}
        statusChange={statusChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
};

export default Users;
