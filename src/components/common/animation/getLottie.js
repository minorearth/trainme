import success from "./lottie/success.json";
import laptop from "./lottie/laptop.json";
import digits from "./lottie/digits.json";
import circle from "./lottie/circle.json";
import condition from "./lottie/condition.json";
import python from "./lottie/python.json";
import progressdots from "./lottie/progressdots.json";
import sheep from "./lottie/sheep.json";
import logo from "./lottie/logo.json";
import ok from "./lottie/ok.json";
import coins from "./lottie/coins.json";

export const getLottie = (name) => {
  switch (true) {
    case name == "success":
      return success;
    case name == "laptop":
      return laptop;
    case name == "digits":
      return digits;
    case name == "circle":
      return circle;
    case name == "condition":
      return condition;
    case name == "python":
      return python;
    case name == "progressdots":
      return progressdots;
    case name == "sheep":
      return sheep;
    case name == "logo":
      return logo;
    case name == "ok":
      return ok;
    case name == "coins":
      return coins;
    default:
  }
};
