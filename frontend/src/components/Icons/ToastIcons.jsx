import { VscError, VscClose } from "react-icons/vsc";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";

const CloseIcon = () => <VscClose />;

const SuccessIcon = () => <FaCheckCircle className="text-green-500 text-lg" />;

const FailureIcon = () => <FaTimesCircle className="text-red-500 text-lg" />;

const WarningIcon = () => (
  <FaExclamationCircle className="text-blue-600 text-lg" />
);

export { CloseIcon, SuccessIcon, FailureIcon, WarningIcon };
