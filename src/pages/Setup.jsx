import { SetupContextProvider } from "../context/SetupContext";
import SetupComponent from "../features/Setup/SetupComponent";

const Setup = () => {
  return (
    <SetupContextProvider>
      <SetupComponent />
    </SetupContextProvider>
  );
};

export default Setup;
