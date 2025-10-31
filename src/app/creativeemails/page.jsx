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

const Users = () => {
  const user = crendentialModel.getUser();
  const { role } = useParams();
  const [filters, setFilter] = useState({
    page: 0,
    count: 10,
    search: "",
    isDeleted: false,
    status: "",
  });
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("list");
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const [tableCols, setTableCols] = useState([]);
  const [form, setform] = useState(userType);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const history = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [close, setClose] = useState(false);

  console.log(params, "sgdhsgdhj");

  useEffect(() => {
    const start = params?.startDate ? new Date(params.startDate) : null;
    const end = params?.endDate ? new Date(params.endDate) : null;

    setStartDate(start);
    setEndDate(end);

    // Format dates for API call
    const formattedStart = start ? start.toISOString() : null;
    const formattedEnd = end ? end.toISOString() : null;

    getData({
      ...filters,
      startDate: formattedStart,
      endDate: formattedEnd,
      page: 1,
    });
  }, [params?.startDate]);

  const getData = (p = {}) => {
    setLoader(true);

    let filter = { ...filters, ...p };

    if (filter.startDate instanceof Date) {
      filter.startDate = filter.startDate.toISOString();
    }
    if (filter.endDate instanceof Date) {
      filter.endDate = filter.endDate.toISOString();
    }

    if (user?.role === "affiliate") {
      filter = { ...filter, affiliate_id: user?.id || user?._id };
    } else {
      filter = { ...filter, addedBy: user?.id || user?._id };
    }

    const url =
      user?.role === "affiliate"
        ? "getUserEmailTemplate"
        : "emailtemplate/getAll";

    ApiClient.get(url, filter)
      .then((res) => {
        if (res.success) {
          setData(res.data.data);
          setTotal(res.data.total_count);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoader(false);
      });
  };

  const clear = () => {
    setFilter({ ...filters, search: "", page: 1 });
    getData({ search: "", page: 1 });
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // loader(true)
        ApiClient.delete("emailtemplate", { id: id }).then((res) => {
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
    setFilter({ ...filters, ...p, page: 1 });
    getData({ ...p, page: 1 });
  };

  const ChangeRole = (e) => {
    setFilter({ ...filters, role: e, page: 1 });
    getData({ role: e, page: 1 });
  };
  const ChangeStatus = (e) => {
    setFilter({ ...filters, status: e, page: 1 });
    getData({ status: e, page: 1 });
  };

  const statusChange = (itm) => {
    let modal = "users";
    let status = "active";
    if (itm.status == "active") status = "deactive";

    Swal.fire({
      title: ``,
      text: `Do you want to ${
        status == "active" ? "Activate" : "Deactivate"
      } this E-mail`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.put(`emailtemplate`, {
          from: itm?.from,
          subject: itm?.subject,
          emailName: itm?.emailName,
          templateName: itm?.templateName,
          status,
          id: itm.id || itm?._id,
        }).then((res) => {
          if (res.success) {
            getData();
          }
          loader(false);
        });
      }
    });
  };

  // const view=(id)=>{
  //     history.push("/creativeemails/detail/"+id)
  // }

  const edit = (id) => {
    let url = `/creativeemails/edit/${id}`;
    if (role) url = `/campaign/${role}/edit/${id}`;
    history.push(url);
  };

  const add = () => {
    let url = `/creativeemails/edit/add`;
    history.push(url);
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

  const handleDateClick = () => {
    setClose(!close);
  };

  return (
    <>
      <Html
        filter={filter}
        isAllow={isAllow}
        // reset={reset}
        add={add}
        // view={view}
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
        statusChange={statusChange}
        getData={getData}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleDateClick={handleDateClick}
        setClose={setClose}
        close={close}
      />
    </>
  );
};

export default Users;
