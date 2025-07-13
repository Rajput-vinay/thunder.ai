import { HelpCircle, LogOut, Settings, WalletIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import { useSidebar } from "../components/ui/sidebar";

// ✅ Example signOut function (replace this with your actual sign-out logic)
function signOut() {
  // For example, remove token/localStorage or call an auth service
  localStorage.removeItem("token");
  window.location.href = "/"; // redirect to home page
}

function SideBarFooter() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const options = [
    { name: "Setting", icon: Settings },
    { name: "HelpCenter", icon: HelpCircle },
    { name: "MySubscription", icon: WalletIcon, path: "/pricing" },
    { name: "Sign out", icon: LogOut },
  ];

  const onOptionClick = (option) => {
    toggleSidebar();
    if (option.name === "Sign out") {
      signOut();
    } else if (option.path) {
      router.push(option.path);
    }
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          onClick={() => onOptionClick(option)}
          variant="ghost"
          className="w-full flex justify-start gap-2 mt-2"
          key={index}
        >
          <option.icon className="w-5 h-5" />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
