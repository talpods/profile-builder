import { Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const { user } = useSelector((state) => state.auth);
  const userData = user?.user;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-profile");
  };
  return (
    <>
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "7px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>
            Welcome Back {userData?.firstName}!
          </h1>
          <h3 style={{ fontSize: "18px" }}>
            Ready to create some cool profiles?
          </h3>
        </div>
        <Button size="large" type="primary" onClick={handleClick}>
          Create profile
        </Button>
      </div>
    </>
  );
}

export default Welcome;
