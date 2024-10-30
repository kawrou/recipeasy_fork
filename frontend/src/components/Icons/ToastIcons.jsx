import { VscError, VscClose } from "react-icons/vsc";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";

const CloseIcon = () => <VscClose className="text-md" />;

const SuccessIcon = () => <FaCheckCircle className="text-green-500 text-2xl" />;

const FailureIcon = () => <FaTimesCircle className="text-red-500 text-2xl" />;

const WarningIcon = () => (
  <FaExclamationCircle className="text-blue-600 text-2xl" />
);

export { CloseIcon, SuccessIcon, FailureIcon, WarningIcon };
