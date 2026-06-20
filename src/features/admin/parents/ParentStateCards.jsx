import { FiSearch, FiUsers } from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function ParentStateCards({ parents, searchedParents }) {
  return (
    <StateCards
      cards={[
        {
          label: "Total Parents",
          value: parents.length,
          bg: "bg-blue-50",
          text: "text-blue-500",
          icon: <FiUsers />,
        },
        {
          label: "Search Results",
          value: searchedParents.length,
          bg: "bg-green-50",
          text: "text-green-500",
          icon: <FiSearch />,
        },
      ]}
    />
  );
}

export default ParentStateCards;
