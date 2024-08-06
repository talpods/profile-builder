import { Avatar, Flex, Tooltip } from "antd";
import { useSelector } from "react-redux";
function UserInfo() {
  const { user } = useSelector((state) => state.auth);
  const userData = user?.user;

  return (
    <Flex align="center" justify="center" gap={10} vertical={false}>
      <Tooltip
        placement="bottom"
        title={userData?.firstName + userData?.lastName}
      >
        {" "}
        <Avatar
          style={{
            backgroundColor: "#ff5f00",
            color: "white",
            cursor: "pointer",
          }}
          size={40}
        >
          {userData?.firstName.charAt(0) + userData?.lastName.charAt(0)}
        </Avatar>
      </Tooltip>
      <Flex style={{ color: "white" }} align="center" justify="center" gap={10}>
        {userData?.roles.recruiter && <h4>Recruiter</h4>}
        {userData?.roles.techReviewer && <h4>Tech Reviewer</h4>}
        {userData?.roles.buisnessReviewer && <h4>Business Reviewer</h4>}
      </Flex>
    </Flex>
  );
}
export default UserInfo;
