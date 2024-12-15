import NavbarRoutes from "@/components/NavbarRoutes";
import Mobilesidebar from "./Mobilesidebar";

const Navbar = () => {
    return (
        <div className=" P-4 border-b h-full flex items-center bg-white shadow-sm">
            <Mobilesidebar />
            <NavbarRoutes />
        </div>
      );
}
 
export default Navbar;