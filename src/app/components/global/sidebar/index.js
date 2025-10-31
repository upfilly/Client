import React, { useState } from "react";
import "./style.scss";
import crendentialModel from "@/models/credential.model";
import Html from "./Html";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import CustomTooltip from "../../common/Tooltip/CustomTooltip";

const Sidebar = ({ activeSidebar, setActiveSidebar }) => {
  const user = crendentialModel.getUser();
  const [tab, setTab] = useState();
  const history = useRouter();
  const pathname = usePathname();
  const [stab, setstab] = useState(false);
  const menus = {
    user: ["roles", "users"],
    dashboard: ["dashboard"],
    partnermanagement: ["campaignmanagement", "invitations"],
    marketplace: ["requests", "offers"],
    communication: ["emailmessages", "notifications", "chat"],
    accountSettings: ["addAccount", "users", "allownotifications"],
    commissionspayments: ["payments", "salestracking"],
    performancereports: ["reports", "performance", "reports"],
    campaignsrequests: ["campaign", "requestCampaigns"],
    commisions: ["commisionplan", "manualCommission", "trackingdata","salestracking"],
    catalogue: ["types", "categories", "category/"],
    affiliates: [
      "affiliate",
      "group",
      "marketplace",
      "emailtemplate",
      "appliedjobs",
      "makeLink",
      "requests",
    ],
    creativeasset: [
      "creativeasset",
      "productfeeds",
      "creativeemails",
      "banners",
      "textlinks",
      "coupons",
      "generatelink",
    ],
    api: ["bookingSystem", "pos", "reviews", "accounting-system"],
    geo: ["continents", "countries", "regions", "cities"],
    dynamicPricing: ["dynamicprice"],
    customer: ["customer"],
  };

  const ListItemLink = ({
    to,
    type = "link",
    title,
    disabled = false,
    ...rest
  }) => {
    let url = pathname;
    return (
      <>
        {type == "link" ? (
          <div
            className={`nav-item ${url.includes(to) ? "active" : ""} ${
              disabled ? "disabled" : ""
            }`}
          >
            <CustomTooltip text={title}>
              <Link href={to} {...rest} className="nav-link hoverclass" />
            </CustomTooltip>
          </div>
        ) : (
          <CustomTooltip text={title}>
            <div
              className={`nav-item main ${url.includes(to) ? "active" : ""}`}
              {...rest}
            ></div>
          </CustomTooltip>
        )}
      </>
    );
  };

  const tabclass = (tab) => {
    let url = pathname;
    let value = false;
    menus[tab].map((itm) => {
      if (url.includes(itm)) value = true;
    });
    return value;
  };

  const urlAllow = (url) => {
    return true;
  };

  const route = (p) => {
    history.push(p);
  };

  const tabChange = (e) => {
    let value = "";
    if (tab != e) value = e;
    setTab(value);
  };

  return (
    <>
      <Html
        setActiveSidebar={setActiveSidebar}
        activeSidebar={activeSidebar}
        tabChange={tabChange}
        tab={tab}
        route={route}
        tabclass={tabclass}
        urlAllow={urlAllow}
        ListItemLink={ListItemLink}
        user={user}
        stab={stab}
        setstab={setstab}
      />
    </>
  );
};

export default Sidebar;
