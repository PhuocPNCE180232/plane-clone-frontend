import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";

type LayoutProps = {
    children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <MainContent>
                    {children}
                </MainContent>
            </div>
        </div>
    );
};