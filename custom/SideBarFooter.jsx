import { HelpCircle, LogOut, Settings, WalletIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import { useSidebar } from "../components/ui/sidebar";

function SideBarFooter() {
  const router =useRouter()
  const { toggleSidebar } = useSidebar();
  const options = [
    { name: "Setting", icon: Settings },
    { name: "HelpCenter", icon: HelpCircle },
    { name: "MySubscription", icon: WalletIcon,
       path:'/pricing'
     },
    { name: "Sign out", icon: LogOut },
  ];

  const onOptionClick=(option)=>{
   
      router.push(option.path);
      toggleSidebar();
    
    
  }
  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button 
        onClick ={()=> onOptionClick(option)}
        variant="ghost" className="w-full flex justify-start gap-2 mt-2" key={index}>
          <option.icon className="w-5 h-5" /> {/* Adjust icon size if needed */}
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
