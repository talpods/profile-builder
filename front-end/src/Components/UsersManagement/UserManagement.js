import axios from "axios";
import React, { useEffect, useState } from "react";
import { GET_USERS_API } from "../../api";
import UsersTable from "./UsersTable";

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await axios.get(GET_USERS_API);
      const apiData = response.data.map((item, index) => ({
        key: index + 1,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        roles: item.roles,
        createdAt: item.createdAt,
      }));

      const sortedData = [...apiData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <UsersTable data={data} onRefresh={fetchData} isLoading={isLoading} />
    </div>
  );
};

export default UserManagement;
