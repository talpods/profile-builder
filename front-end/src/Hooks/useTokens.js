import { useSelector } from "react-redux";

const useTokens = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  return { accessToken, refreshToken };
};

export default useTokens;
