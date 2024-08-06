import { Provider } from "react-redux";
import { store } from "../State/store";
function StateProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default StateProvider;
