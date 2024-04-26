import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";

import { UserContext } from "../App";
import { filterPaginationData } from "../common/FilterPaginationData";
import Loader from "../components/Loader";
import AnimationWrapper from "../common/AnimationWrapper";
import NoData from "../components/NoData";
import NotificationCard from "../components/NotificationCard";
import LoadMore from "../components/LoadMore";

const Notifications = () => {
  const {
    user,
    user: { token, newNotificationAvailable },
    setUser,
  } = useContext(UserContext);

  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(null);

  const filters = ["all", "like", "comment", "reply"];

  const fetchNotifications = async ({ page, deletedDocCount = 0 }) => {
    try {
      const {
        data: { notifications: data },
      } = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/notifications?page=${page}&filter=${filter}&deletedDocCount=${deletedDocCount}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (newNotificationAvailable)
        setUser({ ...user, newNotificationAvailable: false });

      const formatedData = await filterPaginationData({
        prevDocs: notifications,
        newDocs: data,
        page,
        countRoute: "/api/v1/notifications/get-count?filter=",
        param: filter,
        user: token,
      });

      setNotifications(formatedData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = (e) => {
    const btn = e.target;

    setFilter(btn.innerHTML);
    setNotifications(null);
  };

  useEffect(() => {
    if (token) fetchNotifications({ page: 1 });
  }, [token, filter]);

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                "py-2 " + (filter === filterName ? "btn-dark" : "btn-light")
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      {notifications === null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoData message="Nothing available" />
          )}

          <LoadMore
            state={notifications}
            fetchDataFunction={fetchNotifications}
            additionalParam={{ deletedDocCount: notifications.deletedDocCount }}
          />
        </>
      )}
    </div>
  );
};

export default Notifications;
