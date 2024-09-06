"use client";

import { useEffect, useRef, useState } from "react";
import PageContainer from "../components/main/PageContainer";
import Header from "../components/global/header";
import "./style.scss";
import { useRouter } from "next/navigation";
import ApiClient from "../../methods/api/apiClient";
import crendentialModel from "../../models/credential.model";
import methodModel from "@/methods/methods";
import axios from "axios";
import { ConnectSocket, SocketURL } from "./socket";
import moment from "moment";
import environment from "@/environment";
import { Navbar, Dropdown, Button, Modal } from "react-bootstrap";
import ImageView from "react-single-image-viewer";
import "react-single-image-viewer/dist/index.css";
import loader from "@/methods/loader";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function Chat() {
  const user = crendentialModel.getUser();
  const router = useRouter();
  const [chat, setChat] = useState([]);
  const [picLoader, setPicLoader] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [id, setId] = useState("")
  const [chatMsg, setChatMsg] = useState("");
  const [roomId, setRoomId] = useState("");
  const [chatWith, setChatWith] = useState("");
  const [filters, setFilter] = useState({ search: "" });
  const [isImage, setImage] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [status, setStatus] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [affiliate, setAffiliate] = useState([]);
  const [activeData, setActiveData] = useState([])
  const [show, setShow] = useState(false);
  const [addMembers, setAddMembers] = useState()
  const [addMembershow, setAddMemberShow] = useState(false);
  const [chatMembers, setChatMembers] = useState([])
  const [nextpage, setnextPage] = useState(false)
  const [group, setGroup] = useState({
    image: '',
    group_name: '',
    users: [{
      "user_id": user?.id,
      "role": "admin"
    }]
  });
  const [onlineUserId, setOnlineUserId] = useState(null);
  const [offlineUserId, setOfflineUserId] = useState(null);
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const [submitGroup, setSummitGroup] = useState(false)
  const [filteredArray, setFilteredArray] = useState([]);
  const [searchText, setSearchText] = useState('');
  ConnectSocket.on('user-online', (data) => {
    console.log(data,"daataaOnline")
    setOnlineUserId(data?.data?.user_id);
  });
  ConnectSocket.on('user-offline', (data) => {
    console.log(data,"daataaOffline")
    setOfflineUserId(data?.data?.user_id);
  });

  const filteredChatList = chatList?.filter(itm => {
    if (!itm?.isGroupChat) {
      return itm?.room_members[0]?.user_name.toLowerCase().includes(searchText.toLowerCase());
    } else {
      return itm?.room_name.toLowerCase().includes(searchText.toLowerCase());
    }
  });

  useEffect(() => {
    ConnectSocket.connect()
  }, [])

  useEffect(() => {
    filterArrays();
  }, [affiliate, chatMembers]);

  const filterArrays = () => {
    const secondArrayIds = chatMembers.map(item => item.user_id);

    const filtered = affiliate.filter(item => !secondArrayIds.includes(item.id));

    setFilteredArray(filtered);
  };

  const activeUser = activeData?.room_members?.flatMap((data) => {
    return (
      {
        "user_id": data?.user_id,
        "user_image": data?.user_image,
        "user_name": data?.user_name,
        "room_name": activeData?.room_name,
        "room_id": activeData?.room_id,
        "isOnline": data?.isOnline
      })
  })

  console.log(activeUser, "activeData----------------")

  const uploadGroupImage = (e) => {
    // setForm({ ...form, baseImg: e.target.value })
    let files = e.target.files
    let file = files.item(0)
    // loader(true)
    setPicLoader(true)
    ApiClient.postFormData('upload/image?modelName=users', { file: file, modelName: 'users' }).then(res => {
      if (res.data) {
        let image = res?.data?.fullpath
        setGroup({ ...group, image: `images/users/${image}` })
      }
      setPicLoader(false)
    })
  }

  useEffect(() => {
    const id = localStorage.getItem("chatId")
    setId(id)
  }, [])


  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'group_name') {
      setGroup({
        ...group,
        [name]: value
      });
    } else {
      let updatedUsers;
      if (checked) {
        updatedUsers = [...group.users, { user_id: value }];
      } else {
        updatedUsers = group.users.filter((user) => user.user_id !== value);
      }

      setGroup({
        ...group,
        users: updatedUsers
      });
    }
  };

  const handleAddMemberInputChange = (e) => {
    const { name, value, checked } = e.target;

    let updatedUsers;

    if (checked) {
      updatedUsers = addMembers?.updatedUsers ? [...addMembers.updatedUsers, value] : [value];
    } else {
      updatedUsers = addMembers?.updatedUsers?.filter((id) => id !== value);
    }

    setAddMembers({
      ...addMembers,
      updatedUsers: updatedUsers,
    });
  };

  const getAffiliate = (p = {}) => {
    ApiClient.get(`users/list?role=affiliate&createBybrand_id=${user?.id}&isDeleted=false`).then(res => {
      if (res.success) {
        setAffiliate(res?.data?.data)
      }
    })
  };

  useEffect(() => {
    getAffiliate()
  }, [id])

  const bootemel = useRef();
  const scrollToBottom = () => {
    bootemel?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom()
  }, [chat]);

  // useEffect(() => {
  //   let proposaldataa = JSON.parse(localStorage.getItem("proposal"));

  //   setProposalData(proposaldataa);
  // }, []);

  const deleteChatEveryone = (msgId) => {
    let payload = {
      type: "delete_for_everyone",
      message_id: msgId,
    };

    ConnectSocket.emit("delete-message", payload);
    const updatedMessages = chat.filter(message => message._id !== msgId);
    setChat(updatedMessages);
  };

  const deleteChatForme = (msgId) => {
    let payload = {
      type: "delete_for_me",
      message_id: msgId,
    };

    ConnectSocket.emit("delete-message", payload);
    const updatedMessages = chat.filter(message => message._id !== msgId);
    setChat(updatedMessages);
  };

  const TypingStatus = () => {
    let payload = {
      "typing": true
    };

    ConnectSocket.emit("typing", payload);
  };

  const profileData = () => {
    if (id) {
      ApiClient.get(`user/detail`, { id: id }).then((res) => {
        if (res.success) {

          console.log({ details: res.data });
          setChatWith({ ...res.data });
        }
      });
    }
  };

  useEffect(() => {
    profileData();
  }, [chat, id]);

  const getChatList = (p = {}) => {
    let url = `${SocketURL}chat/user/recent-chats/all?user_id=${user?.id}&login_user_id=${user?.id}&search=${!p?.search ? "" : p?.search}`
    axios.get(url, filters).then((res) => {
      if (res.data.success) {
        setChatList(res?.data?.data?.data)
      }
    });
  };

  const getGroupListMember = (id) => {
    if (id) {
      let url = `${SocketURL}chat/user/room-members/all?room_id=${id}&isGroupChat=true`
      axios.get(url).then((res) => {
        if (res.data.success) {
          setChatMembers(res?.data?.data?.data)
        }
      })
    }
  };

  const deleteGroup = () => {
    let url = `${SocketURL}chat/user/group?room_id=${roomId}`
    axios.delete(url).then((res) => {
      if (res.data.success) {
        toast.success('Leaved Group Successfully')
        getChatList()
        handleAddMemberClose()
        setRoomId("")
      }
    })
  }

  useEffect(() => {
    getGroupListMember()
  }, [])

  // const getChatGroupList = (p = {}) => {
  //   let url = `${SocketURL}chat/user/recent-chats/all?user_id=${user?.id}&login_user_id=${user?.id}&isGroupChat=true&search=${filters?.search}`
  //   axios.get(url, filter).then((res) => {
  //     if (res.data.success) {
  //       setChatGroupList(res?.data?.data?.data);
  //     }
  //   });
  // };

  const deleteMember = (userId, roomId) => {
    const payload = {
      "user_id": userId,
      "room_id": roomId
    }
    let url = `${SocketURL}chat/user/group/remove-member`
    axios.put(url, payload).then((res) => {
      if (res?.data?.success) {
        toast.success('Delete Group Successfully')
        getGroupListMember(roomId)
        getChatList()
      }
    });
  };

  const remove = () => {

    let url = 'chat/user/group/remove-member'

    const payload = {
      "user_id": user?.id,
      "room_id": roomId
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Leave this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Leave it!'
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true)
        axios.put(SocketURL + url, payload).then((res) => {
          console.log(res?.data?.success, "]]]]]]]")
          if (res?.data?.success) {
            toast.success('Leaved Group Successfully')
            loader(false)
            getChatList()
            handleAddMemberClose()
            setRoomId("")
          }
        })
      }
    })

  }

  useEffect(() => {
    if (!activeUser) {
      setActiveData(chatWith)
    };
  }, [chat]);

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p })
    getChatList({ ...p });
  };

  useEffect(() => {
    if (!user?.access_token) {
      router.push("/login");
    }
  }, []);

  const getDay = (time) => {
    let today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let todayform = moment(today).format("DD-MM-YYYY");
    let Yesterdayform = moment(yesterday).format("DD-MM-YYYY");
    let dateform = moment(time).format("DD-MM-YYYY");

    let date =
      todayform == dateform
        ? "Today"
        : Yesterdayform == dateform
          ? "Yesterday"
          : dateform;

    return date;
  };

  const isURL = (text) => {
    const containsDocuments = text?.includes("documents/");
    return containsDocuments;
  };

  useEffect(() => {
    const handleReceiveMessage = (newdata) => {
      const data = newdata.data;
      const payload = {
        sender_name: data?.sender_name,
        sender_image: data?.image,
        chat_file: data?._doc?.chat_file,
        content: data?._doc?.content,
        createdAt: data?._doc?.createdAt,
        invitation_id: data?._doc?.invitation_id,
        media: data?._doc?.media,
        room_id: data?._doc?.room_id,
        sender: data?._doc?.sender,
        type: data?._doc?.type,
        updatedAt: data?._doc?.updatedAt,
        _id: data?._doc?._id,
      }
      // if(user?.id == data?._doc?.sender){
      //   setChat(prevChat => [...prevChat, payload]);
      // }
      if (localStorage.getItem("roomId") == data?._doc?.room_id) {
        setChat(prevChat => [...prevChat, payload]);
      }
    };

    ConnectSocket.on('receive-message', handleReceiveMessage);
  }, []);


  useEffect(() => {
    ConnectSocket.on(`delete-message`, (data) => {
      userMessage(data?.data?.room_id,data?.data?.user_id)
      getChatList()
    });
  }, [])

  useEffect(() => {
    ConnectSocket.emit("user-online", { user_id: user?.id });
    ConnectSocket.on(`user-online`, (data) => {
      const newdata = data?.data?.user_id;
      setIsOnline(true);
      setStatus(newdata);
    });
  }, []);

  const joinRoom = (jId) => {
    const payload = {
      room_id: jId,
      user_id: user.id,
    };
    ConnectSocket.emit("join-room", payload);
  };

  const uploadImage = (e) => {
    let files = e.target.files;
    let file = files.item(0);
    const fileExtension = file?.name?.split(".").pop().toLowerCase();
    let isTrue = imageExtensions.includes(fileExtension);


    let url = isTrue
      ? "upload/image?modelName=users"
      : "upload/document?modelName=documents";

    setImage(true);
    ApiClient.postFormData(url, { file: file }).then((res) => {
      if (res.success) {
        let image = res.data.fullpath;
        // setFileName(file?.name)
        const payload = {
          room_id: roomId,
          type: "TEXT",
          // sender: user.id,
          content: isTrue ? `images/users/${image}` : `documents/${res?.data?.imagePath}`,
          // proposal_id: proposaldata?._id,
          // campaign_id: proposaldata?.campaign_id,
          // chat_file:fileName
        };
        ConnectSocket.emit(`send-message`, payload);
        setChatMsg("");
      }
      setImage(false);
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    if (!chatMsg) {
      return
    }

    const payload = {
      room_id: roomId,
      type: "TEXT",
      sender: user.id,
      content: chatMsg,
      // proposal_id: proposaldata?._id,
      // campaign_id: proposaldata?.campaign_id,
      // chat_file:fileName
    };
    ConnectSocket.emit(`send-message`, payload)
    setChatMsg("");
  };

  const userMessage = (roomuid,u_id) => {
    axios
      .get(
        `${SocketURL}chat/user/message/all?room_id=${roomuid}&user_id=${u_id || id}&login_user_id=${user?.id}`
      )
      .then((res) => {
        if (res?.data.success) {
          setChat(res.data.data.data);
          // chatRef.current = res.data.data.data;
        }
      });
  };

  const getData = () => {
    if (id) {
      const payload = {
        chat_by: user?.id,
        chat_with: id,
      };
      // loader(true);

      axios.post(`${SocketURL}chat/user/join-group`, payload).then((res) => {
        if (res?.data?.success) {
          const data = res.data;
          // console.log(res?.data,"=----------")
          setRoomId(res.data.data.room_id);
          userMessage(data.data.room_id,data?.room_members?.[0]?.user_id);
          joinRoom(data.data.room_id);
          localStorage.setItem("roomId", data.data.room_id)
          // loader(false);
        }
      });
    }
  };

  useEffect(() => {
    getChatList();
    // getChatGroupList()
  }, [chatMsg, id]);

  useEffect(() => {
    getData()
  }, [id]);

  // modal

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleGroup = () => {
    loader(true)
    if (!group?.group_name) {
      setSummitGroup(true)
      return;
    }
    axios.post(`${SocketURL}chat/user/group/create`, group).then((res) => {
      if (res?.data?.success) {
        //  getData()
        // getChatGroupList()
        getChatList()
        setGroup([])
        setnextPage(false)
        loader(false)
      }
    });
    loader(false)
    handleClose()
  }


  const addMember = () => {
    const payload = {
      "group_id": activeData?.room_id || roomId,
      "admin_id": activeData?.user_id || activeData?._id || activeData?.id,
      "users": addMembers?.updatedUsers
    }

    axios.post(`${SocketURL}chat/user/group/add-member`, payload).then((res) => {
      if (res?.data?.success) {
        //  getData()
        getChatList()
        // getChatGroupList()
        setAddMembers({})
        setnextPage(false)
      }
    });
    handleAddMemberClose()
  }

  const handleAddMemberClose = () => {
    setAddMemberShow(false)
  }

  const handleAddMemberGroup = () => {
    setAddMemberShow(true)
    getGroupListMember()
  }

  const handleUserId = (id) => {
    localStorage.setItem("chatId", id)
  }

  return (
    <>
      <Header />
      <PageContainer title="Chat" description="Chat">

        <div className="container chat-bg-main">
          <div className="chat-bg">
            <div className="row">
              <div className="col-lg-4">
                <div className="conversations mb-4">
                  <div className="card p-0">
                    <div className="card-header pl-0 pr-0 p-0" id="headingOne">
                      <div  className="pointer">
                          <h3 class="about_head" > <i onClick={() => router.push('/requests')} className="fa  fa-angle-left mr-1"></i> All Chats{" "} </h3>
                      </div>
                      <div className="msg_info person-chat hide_icon_Group b-none">
                        {user?.role == "brand" && <button className=" btn-group btn-sm" onClick={handleShow}>Create a Group</button>}

                      </div>
                    </div>

                    <div className="card-body p-0">
                      <div className="search_chat">
                        {/* <form method="get"> */}
                        <div className="form-group position-relative">
                          <input
                            type="text"
                            // value={filters?.search}
                            placeholder="Search"
                            className="from-control search_design"
                            id="searchright"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            // onChange={(e) =>
                            //   filter({ search: e.target.value })
                            // }
                          />
                          <span className="mglass">
                            {" "}
                            <img src="../../../assets/img/search.svg" />
                          </span>
                        </div>
                        {/* </form> */}
                      </div>



                      <div className="card-body p-0">
                        <ul className="persons-list">
                          {
                            filteredChatList?.length > 0
                              ?
                              filteredChatList?.map((itm, indx) => {
                                console.log(itm,"itmmmmmm=====")
                                return (<>
                                 
                                  <li
                                    className={itm?.room_id == roomId ? "person-list-inner chat_active" : "person-list-inner"}
                                    key={indx}
                                    onClick={isImage ? "" : () => {
                                    
                                      setActiveData(itm)
                                      localStorage.setItem("roomId", itm?.room_id)
                                      handleUserId(itm?.user_id)
                                      userMessage(itm?.room_id,itm?.room_members[0]?.user_id);
                                      setRoomId(itm?.room_id)
                                      joinRoom(itm?.room_id);
                                      getGroupListMember(itm?.room_id)
                                  
                                    }}
                                  >

                                    <div className="d-flex gap-3 flex-wrap align-items-center">
                                      <div className="profile-img">
                                        {!itm?.isGroupChat ?
                                          itm && itm?.room_members && itm?.room_members[0]?.user_image ?
                                            <img
                                              src={`${environment.api}${itm?.room_members[0]?.user_image}`}
                                              height={50}
                                              width={50}
                                            />
                                            :
                                            <img
                                              src="../../../assets/img/person.jpg"
                                              height={50}
                                              width={50}
                                            />
                                          : itm?.image ?
                                            <img
                                              src={`${environment.api}${itm?.image}`}
                                              height={50}
                                              width={50}
                                            /> :
                                            <img
                                              src="../../../assets/img/person.jpg"
                                              height={50}
                                              width={50}
                                            />}
                                        {!itm?.room_name && itm && itm?.room_members && itm?.room_members[0]?.isOnline == 'true' || itm?.room_members[0]?.user_id == onlineUserId ? <i
                                          className="fa fa-circle circle_icon"
                                          aria-hidden="true"
                                        /> : ""}
                                      </div>
                                      <div className="conversation-list-content">
                                        {!itm?.isGroupChat ? <h4>
                                          {methodModel?.capitalizeFirstLetter(
                                            itm && itm?.room_members && itm?.room_members[0]?.user_name
                                          )
                                          }
                                        </h4> : <h4>
                                          {methodModel?.capitalizeFirstLetter(
                                            itm?.room_name
                                          )
                                          }
                                        </h4>}
                                        {!itm?.isGroupChat && <span>{itm?.last_message?.content.includes('images/users') || itm?.last_message?.content.includes('documents/') ? "images" : itm?.last_message?.content}</span>}
                                        {itm?.isGroupChat && itm?.room_members?.length >= 1 && <span>{itm?.room_members?.length + 1} members</span>}
                                      </div>
                                    </div>

                                  </li>
                                  
                                </>);
                              })
                              : <div className="text-center">
                                <p>No chat found</p>
                              </div>
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {roomId ? <div className="col-lg-8">
                <div className="chat-section">
                  <div className="person-chat d-flex bgwhitedata">
                    <div className="person-chat-head d-flex w-100 justify-content-between align-items-center">

                      {activeUser ? <div className="d-flex">
                        <div className="open-chat-img">
                          {/* <img src={"../../../assets/img/girl.png"} />   */}
                          <img
                            // onClick={()=>router.push(`${`chat/userDetail/${activeUser[0]?.user_id}`}`)}
                            src={
                              !activeUser[0]?.room_name
                                ? activeUser[0]?.user_image ? `${environment.api}${activeUser[0]?.user_image}` :
                                  "../../../assets/img/person.jpg"
                                : activeData?.image ? `${environment.api}${activeData?.image}` :
                                  "../../../assets/img/person.jpg"
                            }
                            height={45}
                            width={55}
                          />
                        </div>
                        <div className="open-chat-detail">
                          <h5>
                            {" "}
                            {activeData?.room_name ? methodModel?.capitalizeFirstLetter(activeData?.room_name) : methodModel?.capitalizeFirstLetter(activeUser?.[0]?.user_name)}
                          </h5>
                          {!activeData?.room_name ? <span>{activeUser?.[0]?.isOnline == 'true' || activeUser?.[0]?.user_id == onlineUserId  ? "online" : "offline"}</span> :
                            <>{chatMembers?.length >= 2 && <span>{chatMembers?.length} members</span>}</>
                          }
                        </div>

                      </div> : <div className="d-flex">
                        <div className="open-chat-img">
                          {/* <img src={"../../../assets/img/girl.png"} />   */}
                          <img
                            src={
                              chatWith?.image
                                ? `${environment.api}${chatWith?.image}`
                                : "../../../assets/img/person.jpg"
                            }
                            height={45}
                            width={55}
                          />
                        </div>
                        <div className="open-chat-detail">
                          <h5>
                            {" "}
                            {methodModel?.capitalizeFirstLetter(chatWith?.fullName)}
                          </h5>
                          {!activeData?.room_name && <span>{activeUser?.[0]?.isOnline ? "online" : "offline"}</span>}
                        </div>
                      </div>}
                      {activeData?.room_name ? <div className="rightmembers">
                        <button className="btn btn-primary btn-sm" onClick={() => handleAddMemberGroup()}> Group Info</button></div> : <></>}
                    </div>
                  </div>
                  <div className="chat-body">
                    <ul className="chat-body-detail ">
                      {chat?.length > 0 ? (
                        chat.map((itm, indx) => {
                          let isTrue = user?.id == itm?.sender;
                          const fileExtension = itm?.content?.split(".").pop().toLowerCase()
                          let isImage = imageExtensions.includes(fileExtension);
                          const date = new Date(itm.updatedAt);
                          const timeWithoutSeconds = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <li
                              className={`b-bottom ${isTrue ? "text_right" : " text_left"
                                }`}
                              key={indx}

                            >
                              <div
                                className="chat-body-inner d-flex justify-content-between flex-wrap"
                                ref={bootemel}
                              >
                                <div className="img_profile_u d-flex ">
                                  <img
                                    src={itm?.sender_image ? `${environment.api}${itm?.sender_image}` : '../../../assets/img/person.jpg'}
                                    onClick={() => router.push(`${`chat/userDetail/${itm?.sender}`}`)}
                                  />
                                  <div className="inner_chat_msg">
                                    <div className="d-flex">
                                      <h4>
                                        {methodModel?.capitalizeFirstLetter(
                                          itm?.sender_name
                                        )
                                        }
                                        <span>{getDay(itm.updatedAt)} {timeWithoutSeconds}</span>
                                      </h4>
                                    </div>

                                    <div className="msg_showing ml-2">
                                      <div className="mt-2">
                                        <span className="ellipschat">
                                          {isImage ? (
                                            <ImageView width={"50px"} height={"50px"} src={`${environment?.api}${itm?.content}`} />
                                          ) : isURL(itm.content) ? (
                                            <div className="pdf_btn">
                                              <div className="pdf_inner_layout ">
                                                <span className="pdficon">
                                                  <i class="fa fa-file-text-o" aria-hidden="true"></i>
                                                </span>
                                              </div>

                                              <div className="hoverdonload ">
                                                {isURL(itm.content) ? (
                                                  <a
                                                    href={`${environment?.api}${itm.content}`}
                                                    download="document.pdf"
                                                  >
                                                    {" "}
                                                    <i className="fa fa-download"></i>{" "}

                                                  </a>
                                                ) : null}
                                              </div>

                                            </div>
                                          ) : (
                                            itm.content
                                          )}
                                        </span>
                                      </div>


                                    </div>
                                  </div>
                                </div>
<div className=" addbx">
<div className="msg_info person-chat hide_icon_delete b-none">
                                  <Dropdown className="p-0">
                                    <Dropdown.Toggle className="p-0 btnremove" variant="" id="">
                                      <i class="fa fa-ellipsis-v" aria-hidden="true"></i>

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="chat_dropdwon">
                                      <Dropdown.Item onClick={() => deleteChatForme(itm._id)}><i className="fa fa-trash fs12"></i> Delete For Me</Dropdown.Item>
                                      <Dropdown.Item onClick={() => deleteChatEveryone(itm._id)}><i className="fa fa-trash fs12"></i> Delete For Everyone</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>

                                </div>
</div>
                                
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <p className="no-data-chat">No Message</p>
                      )}
                    </ul>

                    {isImage && <div className="image_loader">
                      <div class="loader"></div>
                    </div>}
                  </div>
                  <div className="chat-footer">
                    <div className=" position-relative w-100 set_message">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message..."
                        value={chatMsg}
                        onChange={(e) => setChatMsg(e.target.value)}

                        onKeyDown={(e) => {
                          e.key === 'Enter' && handelSubmit(e)
                          // e.key === 'Enter' && setChangeCategory('')
                        }}
                        disabled={chat?.length > 0 && chat[0]?.rooms_details?.blocked_admin ? true : false}
                      />
                      <label className="pointer-upload">
                        <input
                          id="bannerImage"
                          type="file"
                          className="d-none"
                          accept="file/*"
                          onChange={(e) => {
                            uploadImage(e);
                          }}
                          disabled={chat?.length > 0 && chat[0]?.rooms_details?.blocked_admin ? true : false}
                        />
                        <i class="fa fa-paperclip" aria-hidden="true"></i>

                      </label>
                    </div>
                    <button
                      className="ml-3"
                      type="submit"
                      onClick={(e) => handelSubmit(e)}
                      disabled={chat?.length > 0 && chat[0]?.rooms_details?.blocked_admin ? true : false}
                    >
                      <i className="fa send_msg fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div> : <div className="col-lg-8">
                <div className="h600 text-center d-flex justify-content-center align-items-center">

                  <i className="fa fa-comments mr-2"></i>
                  No chat Active
                </div>

              </div>}
            </div>
          </div>
        </div>
        {/* group modal open */}
        <Modal show={show} onHide={handleClose} className="shadowboxmodal">

          <Modal.Body>

            <div className="d-flex justify-content-between bb1">
              <p className="fw600">Create a Group</p>
              <p onClick={handleClose} className=""><i className="fa fa-times"></i></p>
            </div>


            <div className="mt-4 mb-2">

              <div className='col-12 col-sm-12 col-md-12'>
                <div className='profile-edit-sec '>
                  <div className='user-profile-edit '>
                    <div className='text-center mb-3'>
                      <label className="">
                        <img src={methodModel.userImg(group && group.image)} className="profileuserimg rounded" />
                      </label>

                      <div className='samebtn_width'>

                        {picLoader ?
                          <div className="text-success text-center top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div>
                          : <div>
                            <label className="btn btn-primary">
                              <input
                                id="bannerImage"
                                type="file"
                                className="d-none"
                                accept="image/*"
                                // value={form.baseImg ? form.baseImg : ''}
                                onChange={(e) => { uploadGroupImage(e) }}
                              /> <i class="fa fa-pencil-square-o mr-2" aria-hidden="true"></i>
                              {group.image ? 'Change' : 'Upload'} Image</label>
                          </div>}
                        <div>
                          {group.image ? <label className="btn btn-secondary" onClick={e => setGroup({ ...group, image: "" })}>Remove Image</label> : <></>}
                        </div>
                        {/* <input type="hidden" name='image' required value={form.image} /> */}
                        {submitted && getError('image')?.invalid ? <div className="invalid-feedback d-block">Image is required</div> : <></>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="groupnameadd ">
                <input
                  placeholder="Add group name"
                  type="text"
                  className="form-control"
                  id="group_name"
                  name="group_name"
                  value={group.group_name}
                  onChange={handleInputChange}
                />
                {submitGroup && !group?.group_name ? <div className="invalid-feedback d-block">Group name is required</div> : <></>}
              </div>


              <div className="mt-3 gorupinner">
                <div>

                  {affiliate.map((data, index) => {
                    return <div className="w-100 mb-3 d-flex pointer bb1_grey pb-2 align-items-center">
                      <label for={index}>
                        <input
                          id={index}
                          className="mr-3"
                          type="checkbox"
                          name="users"
                          value={data?.id}
                          checked={group?.users?.some(user => user.user_id === data?.id)}
                          onChange={handleInputChange}
                        />
                        <img className="mr-2" width="40" src="../../../assets/img/person.jpg" />

                        {data?.fullName}
                      </label>
                    </div>
                  })}
                </div>
              </div>

              <div className="buttons_close addmnebers d-flex justify-content-center align-items-center mt-4">
                <button className="btn btn-primary widthsame closebg mr-3" onClick={handleClose}>  Close</button>

                <Button variant="primary" className=" widthsame" onClick={handleGroup}>
                  Create Group
                </Button>
              </div>


            </div>


          </Modal.Body>

        </Modal>

        {/* add member modal open */}
        <Modal show={addMembershow} onHide={handleAddMemberClose} className="shadowboxmodal">

          <Modal.Body>
            <div>
              <div className="d-flex justify-content-between align-items-center bb1 pb-3">
                <p className="fw600 mb-0">{chatMembers && chatMembers[0]?.room_name}</p>
                {user?.role == "brand" ? <button onClick={() => deleteGroup()} className="deletebtn btn-sm p-2">  Delete group</button> :
                  <button onClick={() => remove()} className="deletebtn btn-sm p-2">Leave Group</button>
                }
                {/* <p onClick={handleAddMemberClose} className=""><i className="fa fa-times"></i></p> */}
              </div>

              {!nextpage ? <div>


                <div className="my-4">{chatMembers.map((data) => {
                  return <><div className="d-flex align-items-center justify-content-between mb-3 pb-3  bb1">
                    <div className="d-flex align-items-center">
                      <img className="mr-2" width="50" src="../../../assets/img/person.jpg" />
                      <h6 className="m-0"> {data?.user_name}</h6>
                    </div>
                    <p className="m-0">{data?.role && <span>{`-${methodModel.capitalizeFirstLetter(data?.role)}`}</span>}</p>
                    {data?.role != "admin" && user?.role == "brand" && <a onClick={() => deleteMember(data?.user_id, data?.room_id)}>
                      <i title="delete member" class="fa fa-trash"></i>
                    </a>}
                  </div></>
                })

                }</div>
                {user?.role == "brand" && <div className="buttons_close addmnebers d-flex justify-content-center align-items-center mt-4">
                  <button className="btn btn-primary widthsame closebg mr-3" onClick={handleAddMemberClose}>  Close</button>

                  <Button variant="primary" className=" widthsame" onClick={() => setnextPage(true)}>
                    Add member
                  </Button>
                </div>}
              </div>
                :
                <div className="mt-4 gorupinner">
                  <div>

                    <div className="hedingmains mb-4">
                      <h6>Add Members</h6>
                    </div>

                    {filteredArray.length > 0 ? filteredArray.map((data, index) => {
                      return <div className="w-100 mb-3 d-flex pointer bb1_grey pb-2 align-items-center">
                        <label for={index}>
                          <input
                            id={index}
                            className="mr-3"
                            type="checkbox"
                            name="users"
                            value={data?.id}
                            checked={addMembers?.updatedUsers?.some(id => id === data?.id)}
                            onChange={handleAddMemberInputChange}
                          />
                          <img className="mr-2" width="40" src="../../../assets/img/person.jpg" />

                          {data?.fullName}
                        </label>
                      </div>
                    }) : <><div className="text-center">No Members</div></>}
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <button className="btn btn-primary widthsame closebg mr-3" onClick={() => setnextPage(false)}>Back</button>

                    <Button variant="primary" disabled={addMembers?.updatedUsers?.length > 0 ? false : true} className=" widthsame" onClick={addMember}>
                      Add member
                    </Button>
                  </div>
                </div>}

            </div>


          </Modal.Body>

        </Modal>




      </PageContainer>
    </>
  );
}
